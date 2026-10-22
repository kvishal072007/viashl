import request from 'supertest';
import app from '../src/server';

describe('EnviroTrack Infrastructure API Integration Suite', () => {
  let authToken: string;

  beforeAll(async () => {
    const authRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@envirotrack.io' });
    
    expect(authRes.status).toBe(200);
    expect(authRes.body.token).toBeDefined();
    authToken = authRes.body.token;
  });

  it('GET /api/v1/health - should return healthy status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toContain('EnviroTrack');
  });

  it('GET /api/v1/projects - should list all infrastructure projects', async () => {
    const res = await request(app)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/approvals - should fetch statutory clearance records', async () => {
    const res = await request(app)
      .get('/api/v1/approvals')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/mitigations - should fetch EMP mitigation tasks', async () => {
    const res = await request(app)
      .get('/api/v1/mitigations')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/v1/sensors/telemetry - should fetch live environmental telemetry', async () => {
    const res = await request(app)
      .get('/api/v1/sensors/telemetry')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].pm25).toBeDefined();
  });

  it('GET /api/v1/analytics/dashboard - should return aggregate executive KPIs', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/dashboard')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalProjects).toBeGreaterThan(0);
    expect(res.body.data.overallComplianceRate).toBeDefined();
    expect(Array.isArray(res.body.data.sectorDistribution)).toBe(true);
  });
});
