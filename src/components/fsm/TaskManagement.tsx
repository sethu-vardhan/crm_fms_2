import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Filter,
  Clock,
  HardHat,
  AlertTriangle,
  Layers,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { TaskItem, AppUser, WorkOrder } from '../../types';
import { hasPermission } from '../../utils/rbac';

interface TaskManagementProps {
  tasks: TaskItem[];
  workOrders: WorkOrder[];
  currentUser: AppUser;
  onAddTask: (newTask: Partial<TaskItem>) => void;
  onUpdateTaskProgress: (taskId: string, percentage: number) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskItem['status']) => void;
  onUpdateTaskPriority?: (taskId: string, priority: TaskItem['priority']) => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  tasks,
  workOrders,
  currentUser,
  onAddTask,
  onUpdateTaskProgress,
  onUpdateTaskStatus,
  onUpdateTaskPriority,
}) => {
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const canAssignTasks = hasPermission(currentUser.role, 'TASK_ASSIGNMENT');

  const filteredTasks = tasks.filter((t) => {
    if (stageFilter === 'ALL') return true;
    return t.stage === stageFilter;
  });

  // New task form state
  const [title, setTitle] = useState('');
  const [selectedWoId, setSelectedWoId] = useState(workOrders[0]?.id || 'wo-01');
  const [stage, setStage] = useState<TaskItem['stage']>('Structure Erection');
  const [priority, setPriority] = useState<TaskItem['priority']>('HIGH');
  const [plannedDays, setPlannedDays] = useState(4);
  const [steelWeightMT, setSteelWeightMT] = useState(12.5);
  const [notes, setNotes] = useState('');
  const [assignedRole, setAssignedRole] = useState<'SUPERVISOR' | 'SUBCONTRACTOR' | 'WORKER'>('WORKER');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const wo = workOrders.find((w) => w.id === selectedWoId);

    onAddTask({
      workOrderId: selectedWoId,
      workOrderTitle: wo?.title || 'MMIL Project',
      siteId: wo?.siteId || 'site-mmil-vzm',
      siteName: wo?.siteName || 'MMIL Vizianagaram Plant Site',
      title,
      stage,
      assignedToRole: assignedRole,
      assignedWorkerId: assignedRole === 'WORKER' ? 'user-worker' : undefined,
      assignedWorkerName: assignedRole === 'WORKER' ? 'Ramesh Naidu' : undefined,
      assignedSubcontractorId: assignedRole === 'SUBCONTRACTOR' ? 'subcon-sai' : undefined,
      assignedSubcontractorName: assignedRole === 'SUBCONTRACTOR' ? 'Sai Rigging & Welding Works' : undefined,
      priority,
      status: 'TODO',
      plannedDays,
      completionPercentage: 0,
      dueDate: '2026-03-24',
      steelWeightMT,
      notes,
    });

    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Field Operations: Work Breakdown Structure (WBS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage-wise mechanical tasks: Foundation → Erection → Welding → Alignment → Testing
          </p>
        </div>

        {canAssignTasks && (
          <button
            id="btn-create-field-task"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Assign New Task</span>
          </button>
        )}
      </div>

      {/* Stage Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          'ALL',
          'Foundation & Anchors',
          'Structure Erection',
          'Welding & Assembly',
          'Alignment & Leveling',
          'Testing & NDT',
        ].map((stg) => (
          <button
            key={stg}
            onClick={() => setStageFilter(stg)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              stageFilter === stg
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {stg}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {task.stage}
                  </span>
                  <span
                    className={`relative inline-flex items-center text-[10px] font-extrabold rounded-full border transition-all shadow-2xs group cursor-pointer ${
                      task.priority === 'CRITICAL'
                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300'
                        : task.priority === 'HIGH'
                        ? 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100 hover:border-orange-300'
                        : task.priority === 'LOW'
                        ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                    }`}
                    title="Click to change task priority level"
                  >
                    <select
                      id={`task-priority-${task.id}`}
                      aria-label={`Change priority for ${task.title}`}
                      value={task.priority}
                      onChange={(e) =>
                        onUpdateTaskPriority?.(task.id, e.target.value as TaskItem['priority'])
                      }
                      className="appearance-none bg-transparent pl-2.5 pr-5 py-0.5 text-[10px] font-black cursor-pointer outline-none focus:ring-1 focus:ring-slate-400 rounded-full"
                    >
                      <option value="LOW" className="bg-white text-slate-800 font-bold">
                        LOW Priority
                      </option>
                      <option value="MEDIUM" className="bg-white text-blue-800 font-bold">
                        MEDIUM Priority
                      </option>
                      <option value="HIGH" className="bg-white text-orange-800 font-bold">
                        HIGH Priority
                      </option>
                      <option value="CRITICAL" className="bg-white text-red-700 font-bold">
                        CRITICAL Priority
                      </option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>

                <select
                  value={task.status}
                  onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as any)}
                  className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                {task.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{task.workOrderTitle}</p>

              {task.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-2.5 border border-slate-100">
                  ⚠️ {task.notes}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              {/* Progress Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Completion Rate</span>
                  <span className="text-blue-600 font-bold">{task.completionPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={task.completionPercentage}
                  onChange={(e) => onUpdateTaskProgress(task.id, Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Assigned:{' '}
                  <strong className="text-slate-700">
                    {task.assignedWorkerName || task.assignedSubcontractorName || 'Site Supervisor'}
                  </strong>
                </span>
                {task.steelWeightMT && (
                  <span className="font-semibold text-slate-700">
                    🏗️ {task.steelWeightMT} MT
                  </span>
                )}
                <span>Due: {task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Task */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold">Assign New Field Task (WBS Breakdown)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Work Order</label>
                <select
                  value={selectedWoId}
                  onChange={(e) => setSelectedWoId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-900"
                >
                  {workOrders.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.workOrderNo} — {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Conveyor BC-04 Gallery Tandem Lift"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Construction Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  >
                    <option value="Foundation & Anchors">Foundation & Anchors</option>
                    <option value="Structure Erection">Structure Erection</option>
                    <option value="Welding & Assembly">Welding & Assembly</option>
                    <option value="Alignment & Leveling">Alignment & Leveling</option>
                    <option value="Testing & NDT">Testing & NDT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign To</label>
                  <select
                    value={assignedRole}
                    onChange={(e) => setAssignedRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  >
                    <option value="WORKER">Senior Fitter Ramesh Naidu</option>
                    <option value="SUBCONTRACTOR">Sai Rigging & Welding Works</option>
                    <option value="SUPERVISOR">Site Supervisor Suresh Naidu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Steel (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={steelWeightMT}
                    onChange={(e) => setSteelWeightMT(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Safety / Supervisor Instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Safety harness tie-off, crane outrigger pads required."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
