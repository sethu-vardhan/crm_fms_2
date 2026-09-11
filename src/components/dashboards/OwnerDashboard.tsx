import React from 'react';
import {
  TrendingUp,
  Building2,
  Users,
  IndianRupee,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowUpRight,
  HardHat,
  FileCheck2,
} from 'lucide-react';
import { WorkOrder, TaskItem, AttendanceRecord, InvoiceRecord, SnagIssue, DailyProgressReport } from '../../types';

interface OwnerDashboardProps {
  workOrders: WorkOrder[];
  tasks: TaskItem[];
  attendance: AttendanceRecord[];
  invoices: InvoiceRecord[];
  snags: SnagIssue[];
  dprReports: DailyProgressReport[];
  onNavigate: (tab: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  workOrders = [],
  tasks = [],
  attendance = [],
  invoices = [],
  snags = [],
  dprReports = [],
  onNavigate,
}) => {
  const safeWorkOrders = workOrders || [];
  const safeTasks = tasks || [];
  const safeAttendance = attendance || [];
  const safeInvoices = invoices || [];
  const safeSnags = snags || [];
  const safeDpr = dprReports || [];

  const totalContractValue = safeWorkOrders.reduce((sum, w) => sum + (w?.contractValue || 0), 0);
  const totalIncurredCost = safeWorkOrders.reduce((sum, w) => sum + (w?.actualCostIncurred || 0), 0);
  const grossProfitMargin = totalContractValue > 0
    ? Math.round(((totalContractValue - totalIncurredCost) / totalContractValue) * 100)
    : 0;

  const totalBilled = safeInvoices.reduce((sum, inv) => sum + (inv?.basicAmount || 0), 0);
  const totalCollected = safeInvoices.reduce((sum, inv) => sum + (inv?.paidAmount || 0), 0);
  const totalRetention = safeInvoices.reduce((sum, inv) => sum + (inv?.retentionAmount || 0), 0);
  const totalPendingReceivables = safeInvoices.reduce((sum, inv) => sum + (inv?.balanceDue || 0), 0);

  const activeWorkersToday = safeAttendance.length;
  const criticalSnags = safeSnags.filter((s) => s.status === 'OPEN' || s.status === 'IN_REPAIR');

  return (
    <div className="space-y-6">
      {/* Top Banner with Company Executive Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-6 text-white shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Managing Director / Owner View
              </span>
              <span className="text-xs text-slate-300">Company-wide Scope (All Sites & Finances)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
              Sethu Engineering Works — Executive Cockpit
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Turnkey Mechanical Structural Fabrication & Heavy Erection for Maa Mahamaya Industries Limited (MMIL Vizianagaram Plant).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('crm')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>View MMIL Work Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Key KPI Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Active Contracts Value</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-extrabold mt-1 text-white">
              ₹{(totalContractValue / 100000).toFixed(2)} L
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{workOrders.length} Turnkey Work Orders</span>
            </div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Gross Profit Margin</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold mt-1 text-emerald-400">
              {grossProfitMargin}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Actual Cost: ₹{(totalIncurredCost / 100000).toFixed(2)} L
            </div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Pending Receivables</span>
              <Clock className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl font-extrabold mt-1 text-white">
              ₹{(totalPendingReceivables / 100000).toFixed(2)} L
            </div>
            <div className="text-[11px] text-amber-300 mt-1">
              Retention: ₹{(totalRetention / 100000).toFixed(2)} L
            </div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Field Manpower on Site</span>
              <HardHat className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-extrabold mt-1 text-white">
              78 Men
            </div>
            <div className="text-[11px] text-blue-300 mt-1">
              {activeWorkersToday} Verified GPS logs today
            </div>
          </div>
        </div>
      </div>

      {/* Active Work Orders & Profitability Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Job-Wise Profitability & Execution Progress (Section 3.3)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contract value vs actual cost incurred across MMIL plant projects
            </p>
          </div>
          <button
            onClick={() => onNavigate('financials')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Detailed Invoices →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Work Order & Project</th>
                <th className="p-3.5">Contract Value</th>
                <th className="p-3.5">Incurred Cost</th>
                <th className="p-3.5">Gross Margin</th>
                <th className="p-3.5">Erection Progress</th>
                <th className="p-3.5">Target Completion</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {workOrders.map((wo) => {
                const margin = Math.round(((wo.contractValue - wo.actualCostIncurred) / wo.contractValue) * 100);
                return (
                  <tr key={wo.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{wo.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{wo.workOrderNo}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      ₹{(wo.contractValue / 100000).toFixed(2)} L
                    </td>
                    <td className="p-3.5 text-slate-600">
                      ₹{(wo.actualCostIncurred / 100000).toFixed(2)} L
                    </td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {margin}%
                      </span>
                    </td>
                    <td className="p-3.5 w-44">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                        <span>{wo.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${wo.progressPercentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500">{wo.targetCompletionDate}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                        {wo.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Recent DPRs & Critical Snags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Progress Reports Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              Latest Daily Progress Reports (DPR)
            </h3>
            <button
              onClick={() => onNavigate('dpr')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              All Reports →
            </button>
          </div>

          <div className="space-y-3">
            {dprReports.slice(0, 2).map((dpr) => (
              <div key={dpr.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{dpr.workOrderTitle}</span>
                  <span className="text-slate-500 text-[11px]">{dpr.date} ({dpr.shift} Shift)</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dpr.summary}
                </p>
                <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-700 pt-1 border-t border-slate-200/60">
                  <span>🏗️ Erected: {dpr.tonnageErectedMT} MT</span>
                  <span>👥 Manpower: {dpr.manpowerPresent}</span>
                  <span>👷 In-Charge: {dpr.supervisorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Quality / Snag Alert */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              Open Site Snags & Quality Issues ({criticalSnags.length})
            </h3>
            <button
              onClick={() => onNavigate('safety')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Inspection Log →
            </button>
          </div>

          <div className="space-y-3">
            {snags.map((snag) => (
              <div key={snag.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{snag.title}</h4>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      snag.priority === 'HIGH'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {snag.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{snag.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Raised by: {snag.raisedBy}</span>
                  <span className="font-semibold text-orange-600">Status: {snag.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
