import { DashboardMetrics } from '../types';
import { ProjectService } from './projectService';
import { ApprovalService } from './approvalService';
import { MitigationService } from './mitigationService';
import { ComplianceService } from './complianceService';
import { SensorService } from './sensorService';
import { getCache, setCache } from '../config/redis';

export class AnalyticsService {
  private static CACHE_KEY = 'analytics:dashboard:metrics';

  static async getExecutiveDashboard(): Promise<DashboardMetrics> {
    const cached = await getCache<DashboardMetrics>(this.CACHE_KEY);
    if (cached) return cached;

    const [projects, approvals, mitigations, ncrs, sensors] = await Promise.all([
      ProjectService.getAllProjects(),
      ApprovalService.getAll(),
      MitigationService.getAll(),
      ComplianceService.getNCRs(),
      SensorService.getLiveTelemetry(),
    ]);

    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.phase === 'Active Construction' || p.phase === 'Pre-Construction & Clearances').length;
    const overallComplianceRate =
      projects.reduce((acc, p) => acc + p.overallComplianceScore, 0) / (totalProjects || 1);

    const pendingClearances = approvals.filter(
      (a) => a.status === 'Submitted' || a.status === 'Under Review' || a.status === 'Queries Raised'
    );
    const urgentClearancesSlaRisk = pendingClearances.filter((a) => {
      const daysLeft = (new Date(a.slaDeadline).getTime() - Date.now()) / (1000 * 3600 * 24);
      return daysLeft < 45;
    }).length;

    const activeMitigationTasks = mitigations.filter((m) => m.status === 'In Progress' || m.status === 'Pending').length;
    const totalEmpBudgetUsdMillion = projects.reduce((acc, p) => acc + p.allocatedEmpBudgetUsdMillion, 0);
    const spentEmpBudgetUsdMillion = projects.reduce((acc, p) => acc + p.spentEmpBudgetUsdMillion, 0);

    const openNcrCount = ncrs.filter((n) => n.status === 'Open' || n.status === 'CAP Submitted').length;
    const criticalSensorAlerts = sensors.filter((s) => s.status !== 'Normal').length;

    // Sector breakdown
    const sectorMap: Record<string, number> = {};
    for (const p of projects) {
      sectorMap[p.sector] = (sectorMap[p.sector] || 0) + 1;
    }
    const sectorDistribution = Object.entries(sectorMap).map(([name, value]) => ({ name, value }));

    // Historical trends
    const complianceTrends = [
      { month: 'Mar 2026', score: 87.2, incidents: 4 },
      { month: 'Apr 2026', score: 88.6, incidents: 3 },
      { month: 'May 2026', score: 89.4, incidents: 5 },
      { month: 'Jun 2026', score: 90.8, incidents: 2 },
      { month: 'Jul 2026', score: 91.5, incidents: 3 },
      { month: 'Aug 2026', score: Math.round(overallComplianceRate * 10) / 10, incidents: openNcrCount },
    ];

    // Project Risk Matrix
    const projectRiskMatrix = projects.map((p) => {
      const projApprovals = approvals.filter((a) => a.projectId === p.id && a.status !== 'Approved');
      return {
        id: p.id,
        name: p.name,
        complianceScore: p.overallComplianceScore,
        riskTier: p.riskTier,
        pendingApprovals: projApprovals.length,
      };
    });

    const result: DashboardMetrics = {
      totalProjects,
      activeProjects,
      overallComplianceRate: Math.round(overallComplianceRate * 10) / 10,
      pendingClearancesCount: pendingClearances.length,
      urgentClearancesSlaRisk,
      activeMitigationTasks,
      totalEmpBudgetUsdMillion: Math.round(totalEmpBudgetUsdMillion * 10) / 10,
      spentEmpBudgetUsdMillion: Math.round(spentEmpBudgetUsdMillion * 10) / 10,
      openNcrCount,
      criticalSensorAlerts,
      sectorDistribution,
      complianceTrends,
      projectRiskMatrix,
    };

    await setCache(this.CACHE_KEY, result, 120);
    return result;
  }
}
