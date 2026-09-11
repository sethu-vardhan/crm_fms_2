import React from 'react';
import {
  HardHat,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Truck,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { TaskItem, AttendanceRecord, MaterialIndent, SnagIssue, DailyProgressReport, AppUser } from '../../types';

interface SupervisorDashboardProps {
  currentUser: AppUser;
  tasks: TaskItem[];
  attendance: AttendanceRecord[];
  materials: MaterialIndent[];
  snags: SnagIssue[];
  dprReports: DailyProgressReport[];
  onNavigate: (tab: string) => void;
  onOpenNewDpr: () => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  currentUser,
  tasks = [],
  attendance = [],
  materials = [],
  snags = [],
  dprReports = [],
  onNavigate,
  onOpenNewDpr,
}) => {
  const safeAttendance = attendance || [];
  const safeTasks = tasks || [];
  const safeMaterials = materials || [];
  const safeSnags = snags || [];
  const safeDpr = dprReports || [];

  const activeCrewCount = safeAttendance.length;
  const inProgressTasks = safeTasks.filter((t) => t.status === 'IN_PROGRESS');
  const criticalTasks = safeTasks.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH');
  const openSnags = safeSnags.filter((s) => s.status === 'OPEN' || s.status === 'IN_REPAIR');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 rounded-2xl p-6 text-white shadow-md border border-orange-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                Site Supervisor / Resident Engineer
              </span>
              <span className="text-xs text-orange-200">
                Site Scope: {currentUser.assignedSiteName || 'MMIL Vizianagaram Plant'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
              Ground Execution & Field Control
            </h1>
            <p className="text-xs text-orange-100 mt-1 max-w-2xl">
              Daily crew muster, crane lifts, hot-work safety permits, daily progress reporting (DPR), and material indents. Zero financial clutter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewDpr}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Today's DPR</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>

        {/* Site Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-orange-800/60">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-orange-200">Crew Present Today</div>
            <div className="text-xl font-extrabold mt-1 text-white">{activeCrewCount} Workers</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Fitters, Riggers, Welders</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-orange-200">Active Site Tasks</div>
            <div className="text-xl font-extrabold mt-1 text-white">{inProgressTasks.length} in progress</div>
            <div className="text-[11px] text-amber-300 mt-0.5">{criticalTasks.length} high priority</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-orange-200">Pending Site Snags</div>
            <div className="text-xl font-extrabold mt-1 text-amber-400">{openSnags.length} Issues</div>
            <div className="text-[11px] text-slate-300 mt-0.5">Bolt reaming & slag</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-orange-200">Safety Status</div>
            <div className="text-xl font-extrabold mt-1 text-emerald-400">PASSED</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">TBT & Hot Work Permit Valid</div>
          </div>
        </div>
      </div>

      {/* Critical Site Tasks Today */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Today's Field Tasks & Crew Assignments
            </h2>
            <p className="text-xs text-slate-500">
              Execution status for steel erection, bolting, and alignment at Vizianagaram Plant
            </p>
          </div>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>All Tasks</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {task.stage}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        task.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{task.title}</h3>
                  <p className="text-xs text-slate-500">{task.workOrderTitle}</p>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-xs font-bold text-slate-900">{task.completionPercentage}% Done</div>
                  <div className="text-[11px] text-slate-500">Due: {task.dueDate}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${task.completionPercentage}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span>👷 Crew: {task.assignedWorkerName || task.assignedSubcontractorName || 'Assigned'}</span>
                {task.steelWeightMT && <span>🏗️ Steel: {task.steelWeightMT} MT</span>}
                <span className="text-[11px] text-slate-400 font-mono">ID: {task.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
