import React from 'react';
import {
  Receipt,
  FileSpreadsheet,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ArrowUpRight,
  CreditCard,
  Building,
  Camera,
  Sparkles,
} from 'lucide-react';
import { InvoiceRecord, WorkOrder, FieldExpenseBill } from '../../types';

interface AccountantDashboardProps {
  invoices: InvoiceRecord[];
  workOrders: WorkOrder[];
  fieldBills?: FieldExpenseBill[];
  onOpenTallyModal: () => void;
  onNavigate: (tab: string) => void;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({
  invoices,
  workOrders,
  fieldBills = [],
  onOpenTallyModal,
  onNavigate,
}) => {
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.basicAmount, 0);
  const totalReceived = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalBalanceDue = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const totalRetention = invoices.reduce((sum, inv) => sum + inv.retentionAmount, 0);
  const totalGstOutput = invoices.reduce((sum, inv) => sum + inv.gstAmount, 0);

  const pendingInvoices = invoices.filter((inv) => inv.status === 'PENDING' || inv.status === 'PARTIAL');
  const paidInvoices = invoices.filter((inv) => inv.status === 'PAID');

  const pendingFieldBills = fieldBills.filter((b) => b.status === 'PENDING_APPROVAL');
  const pendingFieldBillAmount = pendingFieldBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalFieldBillAmount = fieldBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-6 text-white shadow-md border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Finance & Accounts Division
              </span>
              <span className="text-xs text-emerald-200">Financial Visibility & OCR Reimbursements</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
              Billing, Cashflow & Tally Integration
            </h1>
            <p className="text-xs text-emerald-100 mt-1 max-w-2xl">
              Running Account (RA) bills submitted to MMIL, 5% retention ledger tracking, 18% Works Contract GST, and employee expense reimbursements.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onNavigate('financials')}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-xs transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span>Scan / Review Bills</span>
            </button>
            <button
              id="btn-accountant-tally-export"
              onClick={onOpenTallyModal}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Tally XML / GST CSV</span>
            </button>
          </div>
        </div>

        {/* Top KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-emerald-800/60">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] font-medium text-emerald-200">Total Billed to MMIL</span>
            <div className="text-xl font-black text-white mt-0.5">
              ₹{(totalBilled / 100000).toFixed(2)} Lakh
            </div>
            <div className="text-[11px] text-emerald-300 mt-0.5">{invoices.length} RA Invoices</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] font-medium text-emerald-200">Net Realized into Bank</span>
            <div className="text-xl font-black text-emerald-300 mt-0.5">
              ₹{(totalReceived / 100000).toFixed(2)} Lakh
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Cleared via RTGS</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] font-medium text-amber-200">Receivables Due</span>
            <div className="text-xl font-black text-amber-300 mt-0.5">
              ₹{(totalBalanceDue / 100000).toFixed(2)} Lakh
            </div>
            <div className="text-[11px] text-amber-300 mt-0.5">{pendingInvoices.length} Pending Bills</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] font-medium text-blue-200">Output GST Payable (18%)</span>
            <div className="text-xl font-black text-blue-300 mt-0.5">
              ₹{(totalGstOutput / 100000).toFixed(2)} Lakh
            </div>
            <div className="text-[11px] text-blue-300 mt-0.5">SAC 9954 Works Contract</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <span className="text-[11px] font-medium text-yellow-200">Site Expense Claims</span>
            <div className="text-xl font-black text-yellow-300 mt-0.5">
              ₹{pendingFieldBillAmount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-yellow-200 mt-0.5">
              {pendingFieldBills.length} Bills Pending Approval
            </div>
          </div>
        </div>
      </div>

      {/* Field Bills & Employee Claims Summary Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-sm">
              Employee Field Purchase Claims & Receipts ({fieldBills.length} Recorded)
            </span>
            <span className="text-slate-600 block">
              Staff snap photos of local hardware, welding, and fuel bills with AI OCR extraction. Total: ₹{totalFieldBillAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('financials')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs shrink-0 flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Manage / Reimburse Bills →</span>
        </button>
      </div>

      {/* Payment Aging Report */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Payment Aging Analysis (Section 3.3)
            </h2>
            <p className="text-xs text-slate-500">
              Categorizing outstanding receivables by age since invoice submission
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Client: MMIL (GSTIN: 37AABCM8821L1Z4)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">0 - 15 Days (Current)</div>
            <div className="text-lg font-black text-slate-900 mt-1">₹49.15 Lakh</div>
            <div className="text-[11px] text-slate-500 mt-0.5">RA Bill 2 (Due 15-Mar)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">16 - 30 Days</div>
            <div className="text-lg font-black text-slate-900 mt-1">₹1.24 Lakh</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Subcontractor balance</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">31 - 60 Days</div>
            <div className="text-lg font-black text-emerald-600 mt-1">₹0.00</div>
            <div className="text-[11px] text-slate-500 mt-0.5">All cleared on time</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium">60+ Days (Overdue)</div>
            <div className="text-lg font-black text-emerald-600 mt-1">₹0.00</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero bad debts</div>
          </div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Recent Running Bills & Invoices
          </h3>
          <button
            onClick={() => onNavigate('financials')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            All Tax Invoices →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Invoice No</th>
                <th className="p-3.5">Job / Scope</th>
                <th className="p-3.5">Bill Type</th>
                <th className="p-3.5">Basic (₹)</th>
                <th className="p-3.5">GST 18% (₹)</th>
                <th className="p-3.5">Retention 5%</th>
                <th className="p-3.5">Net Payable</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-900 font-mono">{inv.invoiceNo}</td>
                  <td className="p-3.5">{inv.workOrderTitle}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {inv.billType}
                    </span>
                  </td>
                  <td className="p-3.5">₹{inv.basicAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5">₹{inv.gstAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-slate-500">
                    {inv.retentionAmount > 0 ? `₹${inv.retentionAmount.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">
                    ₹{inv.netPayable.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
  );
};
