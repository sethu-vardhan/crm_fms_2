import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  IndianRupee,
  Paperclip,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Eye,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { WorkOrder, AppUser, ContractDocument, PaymentMilestone } from '../../types';
import { hasPermission } from '../../utils/rbac';

interface ContractsWorkOrdersProps {
  workOrders: WorkOrder[];
  currentUser: AppUser;
  onAddWorkOrder: (newWo: Partial<WorkOrder>) => void;
}

export const ContractsWorkOrders: React.FC<ContractsWorkOrdersProps> = ({
  workOrders = [],
  currentUser,
  onAddWorkOrder,
}) => {
  const safeWorkOrders = workOrders || [];
  const [selectedWoId, setSelectedWoId] = useState<string>(safeWorkOrders[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const selectedWo = safeWorkOrders.find((w) => w.id === selectedWoId) || safeWorkOrders[0];

  // RBAC permission checks
  const canViewMoney = hasPermission(currentUser.role, 'VIEW_CONTRACT_VALUES');
  const canCreateEdit = hasPermission(currentUser.role, 'CREATE_EDIT_WORK_ORDERS');

  // New Work Order form state
  const [newTitle, setNewTitle] = useState('');
  const [newWoNo, setNewWoNo] = useState(`WO-MMIL-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [newDepartment, setNewDepartment] = useState('Mechanical Projects & Erection');
  const [newValue, setNewValue] = useState(4500000);
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState('2026-03-15');
  const [newTargetDate, setNewTargetDate] = useState('2026-07-30');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddWorkOrder({
      workOrderNo: newWoNo,
      title: newTitle,
      department: newDepartment,
      siteId: 'site-mmil-vzm',
      siteName: 'MMIL Vizianagaram Plant Site',
      clientId: 'client-mmil',
      clientName: 'Maa Mahamaya Industries Limited',
      contractValue: Number(newValue),
      estimatedCost: Number(newValue) * 0.8,
      actualCostIncurred: 0,
      status: 'IN_PROGRESS',
      progressPercentage: 0,
      startDate: newStartDate,
      targetCompletionDate: newTargetDate,
      description: newDescription,
      scopeOfWork: [
        'Site mobilization & baseline survey',
        'Structural steel fabrication and alignment',
        'Joint inspection and customer sign-off',
      ],
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: `${newTitle} Approved GA Drawing.pdf`,
          type: 'DRAWING',
          referenceNo: `DWG-${newWoNo}`,
          fileSize: '4.5 MB',
          uploadedAt: new Date().toISOString().split('T')[0],
        },
      ],
      milestones: [
        {
          id: `ms-adv-${Date.now()}`,
          title: 'Mobilization Advance (15%)',
          percentage: 15,
          amount: Number(newValue) * 0.15,
          status: 'PENDING',
          dueDate: newStartDate,
        },
        {
          id: `ms-ra1-${Date.now()}`,
          title: 'RA Bill 1 - Structural Erection (50%)',
          percentage: 50,
          amount: Number(newValue) * 0.5,
          status: 'PENDING',
          dueDate: newTargetDate,
          retentionWithheld: Number(newValue) * 0.025,
        },
      ],
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Work Orders & Contract Milestones
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Turnkey contracts, itemized scope, milestone billings & drawings for MMIL
          </p>
        </div>

        {canCreateEdit && (
          <button
            id="btn-create-work-order"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create Work Order</span>
          </button>
        )}
      </div>

      {/* Main Split: Work Orders Selector on Left, Detailed View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Work Order Cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Contract Packages ({safeWorkOrders.length})
          </div>

          {safeWorkOrders.map((wo) => {
            const isSelected = selectedWo?.id === wo.id;
            return (
              <div
                key={wo.id}
                onClick={() => setSelectedWoId(wo.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {wo.workOrderNo}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {wo.progressPercentage}%
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {wo.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">{wo.department}</p>
                </div>

                {canViewMoney && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Contract Value:</span>
                    <span className="font-black text-slate-900">
                      ₹{(wo.contractValue / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Selected Work Order Deep-Dive */}
        {selectedWo && (
          <div className="lg:col-span-2 space-y-6">
            {/* Header info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded-md">
                      {selectedWo.workOrderNo}
                    </span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {selectedWo.department}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-2">
                    {selectedWo.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Client: {selectedWo.clientName} | Site: {selectedWo.siteName}
                  </p>
                </div>

                {canViewMoney && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-right shrink-0">
                    <span className="text-[11px] text-slate-500 font-medium">Contract Value</span>
                    <div className="text-lg font-black text-slate-900">
                      ₹{(selectedWo.contractValue / 100000).toFixed(2)} Lakh
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Planned Margin: 20%
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                {selectedWo.description}
              </p>

              {/* Progress and Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">Start Date</span>
                  <span className="font-bold text-slate-800">{selectedWo.startDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">Target Handover</span>
                  <span className="font-bold text-slate-800">{selectedWo.targetCompletionDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 text-[11px] block">Erection Status</span>
                  <span className="font-bold text-blue-600">{selectedWo.progressPercentage}% Completed</span>
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Approved Scope of Work & Deliverables
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {(selectedWo.scopeOfWork || []).map((scope, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{scope}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Milestones & Stage Tracking */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  Milestone & Running Payment Stages
                </h3>
                <span className="text-[11px] text-slate-500">
                  5% Retention Withheld until DLP Expiry
                </span>
              </div>

              <div className="space-y-3">
                {(selectedWo.milestones || []).map((ms) => (
                  <div
                    key={ms.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ms.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {ms.percentage}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Due: {ms.dueDate} {ms.paidDate && `| Paid: ${ms.paidDate}`}
                        {ms.invoiceNo && ` | Ref: ${ms.invoiceNo}`}
                      </div>
                    </div>

                    <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      {canViewMoney && (
                        <div className="font-black text-slate-900">
                          ₹{ms.amount.toLocaleString('en-IN')}
                        </div>
                      )}
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          ms.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ms.status === 'RAISED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ms.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Vault (Section 3.1) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                  Engineering Drawings & Compliance Document Vault
                </h3>
                <span className="text-xs text-slate-500">
                  {(selectedWo.documents || []).length} Files Attached
                </span>
              </div>

              {(selectedWo.documents || []).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedWo.documents || []).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {doc.type}
                        </span>
                        <h4 className="font-bold text-slate-800 truncate mt-1">{doc.title}</h4>
                        <span className="text-[11px] text-slate-400">
                          {doc.referenceNo} • {doc.fileSize}
                        </span>
                      </div>
                      <button
                        onClick={() => alert(`Simulating download of ${doc.title}`)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-blue-600 shrink-0"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                  No documents attached yet to this package.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Work Order (Owner/HOD only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold">Create New MMIL Work Order</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Order Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sponge Iron Kiln-3 Cooler Shell Overhaul"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Order Ref No</label>
                  <input
                    type="text"
                    required
                    value={newWoNo}
                    onChange={(e) => setNewWoNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contract Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Completion</label>
                  <input
                    type="date"
                    required
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scope Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Fabrication, rigging, alignment, and NDT testing requirements..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Save & Issue Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
