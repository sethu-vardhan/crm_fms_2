import React, { useState } from 'react';
import {
  Receipt,
  FileSpreadsheet,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Filter,
  Camera,
  Sparkles,
  Search,
  Eye,
  Check,
  X,
  Building,
  UserCheck,
  ArrowUpRight,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { InvoiceRecord, FieldExpenseBill, AppUser, WorkOrder } from '../../types';
import { hasPermission } from '../../utils/rbac';
import { OcrBillScannerModal } from '../modals/OcrBillScannerModal';

interface InvoicingPaymentsProps {
  invoices: InvoiceRecord[];
  fieldBills?: FieldExpenseBill[];
  currentUser: AppUser;
  workOrders: WorkOrder[];
  onOpenTallyModal: () => void;
  onAddInvoice: (newInv: Partial<InvoiceRecord>) => void;
  onAddExpenseBill: (bill: Partial<FieldExpenseBill>) => void;
  onUpdateExpenseBillStatus: (billId: string, status: FieldExpenseBill['status']) => void;
  onDeleteExpenseBill?: (billId: string) => void;
}

export const InvoicingPayments: React.FC<InvoicingPaymentsProps> = ({
  invoices = [],
  fieldBills = [],
  currentUser,
  workOrders = [],
  onOpenTallyModal,
  onAddInvoice,
  onAddExpenseBill,
  onUpdateExpenseBillStatus,
  onDeleteExpenseBill,
}) => {
  const [activeSection, setActiveSection] = useState<'CLIENT_RA_BILLS' | 'EMPLOYEE_BILLS'>('EMPLOYEE_BILLS');

  // Client RA Bills state
  const safeInvoices = invoices || [];
  const [clientFilterType, setClientFilterType] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);

  // Field Bills state
  const safeFieldBills = fieldBills || [];
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [billCategoryFilter, setBillCategoryFilter] = useState<string>('ALL');
  const [billStatusFilter, setBillStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [selectedBillForDetails, setSelectedBillForDetails] = useState<FieldExpenseBill | null>(null);

  const canManageInvoices = currentUser.role === 'OWNER' || currentUser.role === 'ACCOUNTANT';
  const canApproveExpenses =
    currentUser.role === 'OWNER' ||
    currentUser.role === 'ACCOUNTANT' ||
    currentUser.role === 'HOD' ||
    currentUser.role === 'SUPERVISOR';

  // Calculations for Client Invoices
  const filteredInvoices = safeInvoices.filter((inv) => {
    if (clientFilterType === 'PAID') return inv.status === 'PAID';
    if (clientFilterType === 'PENDING') return inv.status === 'PENDING' || inv.status === 'PARTIAL';
    return true;
  });

  const totalBasic = safeInvoices.reduce((sum, i) => sum + (i?.basicAmount || 0), 0);
  const totalGst = safeInvoices.reduce((sum, i) => sum + (i?.gstAmount || 0), 0);
  const totalRetention = safeInvoices.reduce((sum, i) => sum + (i?.retentionAmount || 0), 0);
  const totalReceived = safeInvoices.reduce((sum, i) => sum + (i?.paidAmount || 0), 0);
  const totalPending = safeInvoices.reduce((sum, i) => sum + (i?.balanceDue || 0), 0);

  // Calculations for Employee Field Bills
  const filteredFieldBills = safeFieldBills.filter((b) => {
    if (billCategoryFilter !== 'ALL' && b.category !== billCategoryFilter) return false;
    if (billStatusFilter !== 'ALL' && b.status !== billStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMerchant = b.merchantName.toLowerCase().includes(q);
      const matchBillNo = b.billNumber.toLowerCase().includes(q);
      const matchClaimant = b.paidByName.toLowerCase().includes(q);
      const matchItem = b.items?.some((it) => it.description.toLowerCase().includes(q));
      if (!matchMerchant && !matchBillNo && !matchClaimant && !matchItem) return false;
    }
    return true;
  });

  const totalExpenseSum = safeFieldBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const pendingApprovalSum = safeFieldBills
    .filter((b) => b.status === 'PENDING_APPROVAL')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const reimbursedSum = safeFieldBills
    .filter((b) => b.status === 'REIMBURSED')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const totalScannedCount = safeFieldBills.filter((b) => b.ocrExtracted).length;

  // New Client Invoice Form state
  const [invNo, setInvNo] = useState(`INV/2025-26/0${Math.floor(75 + Math.random() * 20)}`);
  const [basicAmt, setBasicAmt] = useState(2500000);
  const [billType, setBillType] = useState<InvoiceRecord['billType']>('RA_BILL_3');
  const [dueDate, setDueDate] = useState('2026-03-30');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const gst = basicAmt * 0.18;
    const ret = basicAmt * 0.05;
    const net = basicAmt + gst - ret;

    onAddInvoice({
      invoiceNo: invNo,
      workOrderId: 'wo-01',
      workOrderTitle: 'Pellet Plant 1.2 MTPA Structural',
      billType,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      basicAmount: basicAmt,
      gstRate: 0.18,
      gstAmount: gst,
      retentionRate: 0.05,
      retentionAmount: ret,
      netPayable: net,
      paidAmount: 0,
      balanceDue: net,
      status: 'PENDING',
      daysOverdue: 0,
    });

    setShowAddInvoiceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>Financials, Bills & Field Expenses</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              AI OCR Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Client RA bills, works contract GST, employee purchase bills & smart OCR receipt reimbursement
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowOcrModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-sm transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Bill / Upload Receipt (OCR)</span>
          </button>

          <button
            onClick={onOpenTallyModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Tally & GST Export</span>
          </button>

          {canManageInvoices && (
            <button
              onClick={() => setShowAddInvoiceModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Generate RA Bill</span>
            </button>
          )}
        </div>
      </div>

      {/* Two-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSection('EMPLOYEE_BILLS')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSection === 'EMPLOYEE_BILLS'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-600" />
          <span>Employee Bills & Site Receipts ({safeFieldBills.length})</span>
          {pendingApprovalSum > 0 && (
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full font-extrabold">
              ₹{Math.round(pendingApprovalSum).toLocaleString('en-IN')} pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('CLIENT_RA_BILLS')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeSection === 'CLIENT_RA_BILLS'
              ? 'border-amber-500 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4 text-blue-600" />
          <span>Client Works Contract RA Bills ({safeInvoices.length})</span>
        </button>
      </div>

      {/* SECTION 1: EMPLOYEE BILLS & SITE EXPENSES WITH OCR */}
      {activeSection === 'EMPLOYEE_BILLS' && (
        <div className="space-y-5">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Total Field Expenses</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                ₹{totalExpenseSum.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </div>
              <span className="text-[10px] text-slate-500">Across all site jobs</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-amber-700">Pending Approval / Review</span>
              <div className="text-lg font-black text-amber-600 mt-0.5">
                ₹{pendingApprovalSum.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">Requires manager sign-off</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-700">Reimbursed to Staff</span>
              <div className="text-lg font-black text-emerald-600 mt-0.5">
                ₹{reimbursedSum.toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Settled via UPI / Cash</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">AI OCR Extracted Bills</span>
              <div className="text-lg font-black text-blue-700 mt-0.5 flex items-center gap-2">
                <span>{totalScannedCount} Bills</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[10px] text-blue-600 font-semibold">Gemini Multimodal parser</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search store, bill no, item or employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs bg-slate-50"
                />
              </div>

              <select
                value={billCategoryFilter}
                onChange={(e) => setBillCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-semibold focus:outline-hidden"
              >
                <option value="ALL">All Categories</option>
                <option value="Consumables & Hardware">Consumables & Hardware</option>
                <option value="Welding Rods & Gas">Welding Rods & Gas</option>
                <option value="Tools & Equipment">Tools & Equipment</option>
                <option value="Safety PPE">Safety PPE</option>
                <option value="Fuel & Transport">Fuel & Transport</option>
                <option value="Site Food & Tea">Site Food & Tea</option>
                <option value="Crane & Machinery">Crane & Machinery</option>
              </select>

              <select
                value={billStatusFilter}
                onChange={(e) => setBillStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-semibold focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="REIMBURSED">Reimbursed</option>
              </select>
            </div>

            <button
              onClick={() => setShowOcrModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs self-start sm:self-auto shrink-0"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Snap / Upload Bill</span>
            </button>
          </div>

          {/* Bills List / Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredFieldBills.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-800">No bills found matching filters</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Employees can snap a photo of any purchase bill using their phone camera and upload it here with AI OCR extraction.
                </p>
                <button
                  onClick={() => setShowOcrModal(true)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors"
                >
                  Upload First Receipt
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredFieldBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    {/* Left: Thumbnail, Merchant, Bill details */}
                    <div className="flex items-start gap-3.5">
                      {/* Photo Thumbnail */}
                      <div
                        onClick={() => bill.receiptPhotoUrl && setPreviewPhotoUrl(bill.receiptPhotoUrl)}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer relative group flex items-center justify-center"
                      >
                        {bill.receiptPhotoUrl ? (
                          <>
                            <img
                              src={bill.receiptPhotoUrl}
                              alt="Receipt"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Eye className="w-4 h-4" />
                            </div>
                          </>
                        ) : (
                          <Receipt className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Content details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {bill.billNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                            {bill.category}
                          </span>
                          {bill.ocrExtracted && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 flex items-center gap-1 border border-amber-200">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              <span>AI OCR Extracted</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">{bill.merchantName}</h4>

                        {/* Line items summary */}
                        <div className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                          <span className="font-medium">
                            Items: {bill.items?.map((it) => `${it.description} (${it.quantity} ${it.unit})`).join(', ') || 'General supplies'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap pt-0.5">
                          <span>Date: {bill.date}</span>
                          <span>•</span>
                          <span>
                            Paid by: <strong>{bill.paidByName}</strong> ({bill.paidByRole})
                          </span>
                          <span>•</span>
                          <span>Mode: {bill.paymentMode}</span>
                          <span>•</span>
                          <span>For: {bill.workOrderTitle}</span>
                        </div>

                        {bill.notes && (
                          <div className="text-[11px] text-slate-600 bg-slate-100/70 px-2.5 py-1 rounded-lg mt-1 inline-block">
                            📝 <em>{bill.notes}</em>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Amount, Status and Quick Actions */}
                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <div className="text-base font-black text-slate-900">
                          ₹{bill.totalAmount.toLocaleString('en-IN')}
                        </div>
                        {bill.taxAmount > 0 && (
                          <div className="text-[10px] text-slate-500">
                            Incl. ₹{bill.taxAmount.toFixed(1)} GST
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          bill.status === 'REIMBURSED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : bill.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {bill.status.replace('_', ' ')}
                      </span>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        {canApproveExpenses && bill.status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => onUpdateExpenseBillStatus(bill.id, 'APPROVED')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1"
                            title="Approve expense"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        )}

                        {canManageInvoices && bill.status === 'APPROVED' && (
                          <button
                            onClick={() => onUpdateExpenseBillStatus(bill.id, 'REIMBURSED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1"
                            title="Mark as Reimbursed to employee"
                          >
                            <IndianRupee className="w-3 h-3" />
                            <span>Reimburse</span>
                          </button>
                        )}

                        {bill.receiptPhotoUrl && (
                          <button
                            onClick={() => setPreviewPhotoUrl(bill.receiptPhotoUrl!)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            title="View receipt image"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {onDeleteExpenseBill && canManageInvoices && (
                          <button
                            onClick={() => onDeleteExpenseBill(bill.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete bill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: CLIENT RA BILLS & INVOICES */}
      {activeSection === 'CLIENT_RA_BILLS' && (
        <div className="space-y-5">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Total Basic Works</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                ₹{(totalBasic / 100000).toFixed(2)} L
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Output GST (18%)</span>
              <div className="text-lg font-black text-blue-700 mt-0.5">
                ₹{(totalGst / 100000).toFixed(2)} L
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Retention Withheld (5%)</span>
              <div className="text-lg font-black text-amber-700 mt-0.5">
                ₹{(totalRetention / 100000).toFixed(2)} L
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Payments Realized</span>
              <div className="text-lg font-black text-emerald-700 mt-0.5">
                ₹{(totalReceived / 100000).toFixed(2)} L
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Pending Receivables</span>
              <div className="text-lg font-black text-orange-600 mt-0.5">
                ₹{(totalPending / 100000).toFixed(2)} L
              </div>
            </div>
          </div>

          {/* Invoices List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setClientFilterType('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    clientFilterType === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Invoices ({invoices.length})
                </button>
                <button
                  onClick={() => setClientFilterType('PENDING')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    clientFilterType === 'PENDING'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pending / Aging
                </button>
                <button
                  onClick={() => setClientFilterType('PAID')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    clientFilterType === 'PAID'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Paid
                </button>
              </div>

              <span className="text-xs text-slate-500 font-mono">GSTIN: 37AABCM8821L1Z4</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Invoice Ref</th>
                    <th className="p-3.5">Project Description</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Basic (₹)</th>
                    <th className="p-3.5">GST 18%</th>
                    <th className="p-3.5">Retention</th>
                    <th className="p-3.5">Net Amount</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{inv.workOrderTitle}</div>
                        {inv.subcontractorBill && (
                          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">
                            Subcontractor: {inv.subcontractorName}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {inv.billType}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{inv.date}</td>
                      <td className="p-3.5 font-semibold">₹{inv.basicAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-slate-500">₹{inv.gstAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-slate-500">
                        {inv.retentionAmount > 0 ? `₹${inv.retentionAmount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        ₹{inv.netPayable.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            inv.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Receipt Photo Fullscreen Preview */}
      {previewPhotoUrl && (
        <div
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-300 relative cursor-default"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>Original Bill / Receipt Document</span>
              </div>
              <button
                onClick={() => setPreviewPhotoUrl(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={previewPhotoUrl}
                alt="Receipt Full Preview"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* OCR Bill Scanner Modal */}
      <OcrBillScannerModal
        isOpen={showOcrModal}
        onClose={() => setShowOcrModal(false)}
        currentUser={currentUser}
        workOrders={workOrders}
        onSaveBill={onAddExpenseBill}
      />

      {/* Modal: Generate Client RA Bill */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold">Generate Running Account (RA) Tax Invoice</h3>
              <button
                onClick={() => setShowAddInvoiceModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  required
                  value={invNo}
                  onChange={(e) => setInvNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill Type</label>
                  <select
                    value={billType}
                    onChange={(e) => setBillType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium"
                  >
                    <option value="RA_BILL_1">RA Bill 1</option>
                    <option value="RA_BILL_2">RA Bill 2</option>
                    <option value="RA_BILL_3">RA Bill 3</option>
                    <option value="FINAL_BILL">Final Bill</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Basic Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={basicAmt}
                    onChange={(e) => setBasicAmt(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>GST 18%:</span>
                  <span className="font-bold text-slate-800">₹{(basicAmt * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Retention Withheld (5%):</span>
                  <span className="font-bold text-amber-700">₹{(basicAmt * 0.05).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                  <span>Net Payable by MMIL:</span>
                  <span>₹{(basicAmt + basicAmt * 0.18 - basicAmt * 0.05).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Create & Post Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
