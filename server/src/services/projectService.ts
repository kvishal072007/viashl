import { Project } from '../types';
import { mockProjects } from '../data/mockData';
import { getCache, setCache, deleteCache } from '../config/redis';
import { ProjectModel } from '../models';
import { checkDbConnection } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

let projectsStore: Project[] = [...mockProjects];

export class ProjectService {
  private static CACHE_KEY_ALL = 'projects:all';
  private static CACHE_KEY_PREFIX = 'projects:id:';

  static async getAllProjects(filters?: { sector?: string; phase?: string; search?: string }): Promise<Project[]> {
    const cacheKey = `${this.CACHE_KEY_ALL}:${JSON.stringify(filters || {})}`;
    const cached = await getCache<Project[]>(cacheKey);
    if (cached) return cached;

    const isDbConnected = await checkDbConnection();
    let result: Project[] = [];

    if (isDbConnected) {
      try {
        const query: any = {};
        if (filters?.sector) query.sector = new RegExp(`^${filters.sector}$`, 'i');
        if (filters?.phase) query.phase = new RegExp(`^${filters.phase}$`, 'i');
        if (filters?.search) {
          query.$or = [
            { name: new RegExp(filters.search, 'i') },
            { code: new RegExp(filters.search, 'i') },
            { 'location.state': new RegExp(filters.search, 'i') },
            { description: new RegExp(filters.search, 'i') },
          ];
        }
        const docs = await ProjectModel.find(query).lean();
        if (docs && docs.length > 0) {
          result = docs as unknown as Project[];
        }
      } catch (err) {
        result = [];
      }
    }

    if (result.length === 0) {
      result = [...projectsStore];
      if (filters?.sector) {
        result = result.filter((p) => p.sector.toLowerCase() === filters.sector?.toLowerCase());
      }
      if (filters?.phase) {
        result = result.filter((p) => p.phase.toLowerCase() === filters.phase?.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.code.toLowerCase().includes(q) ||
            p.location.state.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
    }

    await setCache(cacheKey, result, 180);
    return result;
  }

  static async getProjectById(id: string): Promise<Project | null> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${id}`;
    const cached = await getCache<Project>(cacheKey);
    if (cached) return cached;

    const isDbConnected = await checkDbConnection();
    let project: Project | null = null;

    if (isDbConnected) {
      try {
        const doc = await ProjectModel.findOne({ id }).lean();
        if (doc) project = doc as unknown as Project;
      } catch (err) {}
    }

    if (!project) {
      project = projectsStore.find((p) => p.id === id) || null;
    }

    if (project) {
      await setCache(cacheKey, project, 300);
    }
    return project;
  }

  static async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const newProject: Project = {
      ...data,
      id: `proj-${uuidv4().substring(0, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      try {
        await ProjectModel.create(newProject);
      } catch (err) {}
    }

    projectsStore.unshift(newProject);
    await deleteCache(this.CACHE_KEY_ALL);
    return newProject;
  }

  static async updateProject(id: string, data: Partial<Project>): Promise<Project | null> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      try {
        await ProjectModel.findOneAndUpdate({ id }, { ...data, updatedAt: new Date().toISOString() });
      } catch (err) {}
    }

    const idx = projectsStore.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const updated: Project = {
      ...projectsStore[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    projectsStore[idx] = updated;

    await deleteCache(`${this.CACHE_KEY_PREFIX}${id}`);
    await deleteCache(this.CACHE_KEY_ALL);
    return updated;
  }

  static async deleteProject(id: string): Promise<boolean> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      try {
        await ProjectModel.findOneAndDelete({ id });
      } catch (err) {}
    }

    const idx = projectsStore.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    projectsStore.splice(idx, 1);
    await deleteCache(`${this.CACHE_KEY_PREFIX}${id}`);
    await deleteCache(this.CACHE_KEY_ALL);
    return true;
  }
}
