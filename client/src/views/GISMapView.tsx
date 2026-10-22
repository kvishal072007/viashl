import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  MapPin,
  Trees,
  Layers,
  Shield,
  Navigation,
  Compass,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';

export const GISMapView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [layer, setLayer] = useState<'all' | 'eco_zones' | 'clearance'>('all');

  useEffect(() => {
    const load = async () => {
      const list = await api.getProjects();
      setProjects(list);
      if (list.length > 0) setSelectedProject(list[0]);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="GIS Geospatial Corridor & Eco-Zone Mapping"
        subtitle="Interactive spatial overlay of linear infrastructure corridors, eco-sensitive buffer zones (ESZ), reserve forests, and real-time station coordinates."
        badge="WGS84 Coordinate System"
      />

      {/* Layer Control Bar */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-semibold">GIS Map Layers:</span>
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => setLayer('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                layer === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setLayer('eco_zones')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                layer === 'eco_zones'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              🌲 Eco-Sensitive Zones (ESZ)
            </button>
            <button
              onClick={() => setLayer('clearance')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                layer === 'clearance'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              🛡️ High Risk (Category A)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Compliant (&gt;90%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Advisory (&lt;90%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Sensitive ESZ (&lt;2km)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Stylized GIS Map Canvas Area */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 relative overflow-hidden min-h-[480px] flex flex-col justify-between bg-slate-950/80 border border-slate-800">
          {/* SVG Map Projection with Coordinates */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Tamil Nadu State Infrastructure & Eco-Corridor Geospatial Grid</span>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
              TN Bounding: 8.08°N (Kanyakumari) - 13.5°N (Tiruvallur), 76.2°E - 80.35°E
            </span>
          </div>

          {/* Map Vector Pins */}
          <div className="relative z-10 my-10 flex flex-wrap justify-around items-center gap-6 p-4">
            {projects.map((p, idx) => {
              const isSelected = selectedProject?.id === p.id;
              const isEszClose = (p.location.ecoSensitiveZoneProximityKm || 10) < 2;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 backdrop-blur-md ${
                    isSelected
                      ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-xl shadow-emerald-950/60 scale-105'
                      : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:scale-102'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isEszClose
                        ? 'bg-rose-500/20 text-rose-400'
                        : isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-emerald-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{p.name.split('(')[0]}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {p.location.lat}°N, {p.location.lng}°E • {p.location.state}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compass Rose Bottom */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80 font-mono">
            <span>Spatial Engine: EPSG:4326</span>
            <span>Eco-Corridor Buffer Algorithm: Active</span>
          </div>
        </div>

        {/* Selected Project Geospatial Card */}
        {selectedProject && (
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  {selectedProject.code}
                </span>
                <StatusBadge status={selectedProject.phase} />
              </div>

              <h3 className="text-base font-bold text-slate-100 mt-2">{selectedProject.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-3">{selectedProject.description}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <p>
                  📍 <strong className="text-slate-400">Address:</strong> {selectedProject.location.address}
                </p>
                <p>
                  🌐 <strong className="text-slate-400">GPS Coordinates:</strong> {selectedProject.location.lat}° N, {selectedProject.location.lng}° E
                </p>
                <p>
                  🌲 <strong className="text-slate-400">Eco-Sensitive Zone (ESZ):</strong>{' '}
                  <span className="text-amber-400 font-bold">{selectedProject.location.ecoSensitiveZoneProximityKm ?? 'N/A'} km</span>
                </p>
                <p>
                  🦌 <strong className="text-slate-400">Protected Reserve Forest:</strong>{' '}
                  <span className="text-emerald-400 font-bold">{selectedProject.location.protectedForestDistanceKm ?? 'N/A'} km</span>
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-500 font-mono text-[10px]">RISK TIER</p>
                  <p className="font-bold text-slate-200 mt-0.5">{selectedProject.riskTier}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-slate-500 font-mono text-[10px]">COMPLIANCE SCORE</p>
                  <p className="font-bold text-emerald-400 font-mono mt-0.5">
                    {selectedProject.overallComplianceScore}%
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              Compliance Officer:{' '}
              <strong className="text-emerald-400">{selectedProject.complianceOfficer}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
