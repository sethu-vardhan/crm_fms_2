import React from 'react';
import {
  Building2,
  Calendar,
  Layers,
  HardHat,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { WorkOrder, TaskItem, MaterialIndent, AppUser } from '../../types';

interface HODDashboardProps {
  currentUser: AppUser;
  workOrders: WorkOrder[];
  tasks: TaskItem[];
  materials: MaterialIndent[];
  onNavigate: (tab: string) => void;
}

export const HODDashboard: React.FC<HODDashboardProps> = ({
  currentUser,
  workOrders = [],
  tasks = [],
  materials = [],
  onNavigate,
}) => {
  const safeWorkOrders = workOrders || [];
  const safeTasks = tasks || [];
  const safeMaterials = materials || [];

  const pendingIndents = safeMaterials.filter((m) => m.status === 'REQUESTED');
  const criticalTasks = safeTasks.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH');
  const avgProgress = safeWorkOrders.length > 0
    ? Math.round(safeWorkOrders.reduce((acc, w) => acc + (w.progressPercentage || 0), 0) / safeWorkOrders.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Department Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-md border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                HOD — Projects & Heavy Fabrication
              </span>
              <span className="text-xs text-blue-200">Scope: All Mechanical Sites (MMIL Steel Plant)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
              Engineering & Field Execution Oversight
            </h1>
            <p className="text-xs text-blue-100 mt-1 max-w-2xl">
              Coordinating work breakdown structures, structural tonnage erection, milestone sign-offs, and crane dispatches across plant sites.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('tasks')}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
            >
              <span>Manage Site Tasks (WBS)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* HOD Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-800/60">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-blue-200">Department Active Projects</div>
            <div className="text-xl font-extrabold mt-1 text-white">{workOrders.length} Sites</div>
            <div className="text-[11px] text-blue-300 mt-0.5">Average Execution: {avgProgress}%</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-blue-200">Critical & High Tasks</div>
            <div className="text-xl font-extrabold mt-1 text-amber-400">{criticalTasks.length} Active</div>
            <div className="text-[11px] text-slate-300 mt-0.5">Rotary Kiln & Pellet Disc Tower</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-blue-200">Pending Material Approvals</div>
            <div className="text-xl font-extrabold mt-1 text-white">{pendingIndents.length} Indents</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Steel Beams & 50T Crane</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-blue-200">Contract Scope Value</div>
            <div className="text-xl font-extrabold mt-1 text-white">
              ₹{(workOrders.reduce((sum, w) => sum + w.contractValue, 0) / 100000).toFixed(2)} L
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">MMIL Authorized Work Orders</div>
          </div>
        </div>
      </div>

      {/* Projects Progress List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {workOrders.map((wo) => (
          <div key={wo.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {wo.workOrderNo}
                </span>
                <span className="text-xs font-bold text-slate-900">{wo.progressPercentage}%</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                {wo.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {wo.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${wo.progressPercentage}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Target Date:</span>
                  <span className="font-semibold text-slate-700">{wo.targetCompletionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Milestones:</span>
                  <span className="font-semibold text-slate-700">
                    {(wo.milestones || []).filter((m) => m.status === 'PAID').length} of {(wo.milestones || []).length} Paid
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
