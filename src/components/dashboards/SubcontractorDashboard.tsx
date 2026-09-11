import React from 'react';
import {
  Truck,
  Users,
  CheckCircle2,
  Receipt,
  HardHat,
  Package,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { TaskItem, AttendanceRecord, MaterialIndent, InvoiceRecord, AppUser } from '../../types';

interface SubcontractorDashboardProps {
  currentUser: AppUser;
  tasks: TaskItem[];
  attendance: AttendanceRecord[];
  materials: MaterialIndent[];
  invoices: InvoiceRecord[];
  onNavigate: (tab: string) => void;
}

export const SubcontractorDashboard: React.FC<SubcontractorDashboardProps> = ({
  currentUser,
  tasks,
  attendance,
  materials,
  invoices,
  onNavigate,
}) => {
  const ownCrewAttendance = attendance.filter((a) =>
    a.subcontractorOrg?.includes(currentUser.subcontractorOrgName || '')
  );

  const ownInvoices = invoices.filter((inv) =>
    inv.subcontractorBill && inv.subcontractorName?.includes(currentUser.subcontractorOrgName || '')
  );

  const totalBilled = ownInvoices.reduce((sum, inv) => sum + inv.basicAmount, 0);
  const totalReceived = ownInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalPending = ownInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  return (
    <div className="space-y-6">
      {/* Subcontractor Portal Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-purple-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Subcontractor Partner Portal
              </span>
              <span className="text-xs text-purple-200">
                Company: {currentUser.subcontractorOrgName || 'Sai Rigging & Welding Works'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
              Assigned Scope & Crew Management
            </h1>
            <p className="text-xs text-purple-100 mt-1 max-w-2xl">
              Restricted portal view for your contracted structural erection & welding packages. Zero access to other subcontractor rates or client contracts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('tasks')}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>View My Scope Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subcontractor KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-800/60">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-purple-200">Assigned Tasks</div>
            <div className="text-xl font-extrabold mt-1 text-white">{tasks.length} Work Packages</div>
            <div className="text-[11px] text-purple-300 mt-0.5">Intermediate beams & gallery</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-purple-200">My Crew Present Today</div>
            <div className="text-xl font-extrabold mt-1 text-white">
              {ownCrewAttendance.length || 3} Riggers/Welders
            </div>
            <div className="text-[11px] text-emerald-300 mt-0.5">Verified on site</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-purple-200">My Bills Submitted</div>
            <div className="text-xl font-extrabold mt-1 text-white">
              ₹{(totalBilled / 100000).toFixed(2)} L
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">RA Bill 1 (Rigging Scope)</div>
          </div>

          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <div className="text-xs text-purple-200">Payment Received</div>
            <div className="text-xl font-extrabold mt-1 text-emerald-400">
              ₹{(totalReceived / 100000).toFixed(2)} L
            </div>
            <div className="text-[11px] text-amber-300 mt-0.5">Balance: ₹{(totalPending / 100000).toFixed(2)} L</div>
          </div>
        </div>
      </div>

      {/* Assigned Tasks for Subcontractor Scope */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          My Subcontracted Work Packages (Scope of Work)
        </h2>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                    {task.stage}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{task.title}</h3>
                  <p className="text-xs text-slate-500">{task.workOrderTitle}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-purple-700">{task.completionPercentage}% Done</span>
                  <div className="text-[11px] text-slate-500">Target: {task.dueDate}</div>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${task.completionPercentage}%` }}
                />
              </div>

              {task.notes && (
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600">
                  ⚠️ <strong>Supervisor Note:</strong> {task.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Subcontractor Billing & Payment Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-600" />
            My Invoices & Payment Ledger
          </h3>
          <span className="text-xs font-bold text-slate-500">Zero Visibility into MMIL Rates</span>
        </div>

        {ownInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Bill Ref No</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Bill Date</th>
                  <th className="p-3">Basic (₹)</th>
                  <th className="p-3">Net Payable</th>
                  <th className="p-3">Paid (₹)</th>
                  <th className="p-3">Balance (₹)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {ownInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="p-3 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                    <td className="p-3">{inv.workOrderTitle}</td>
                    <td className="p-3 text-slate-500">{inv.date}</td>
                    <td className="p-3 font-semibold">₹{inv.basicAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-bold text-slate-900">₹{inv.netPayable.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-emerald-600 font-bold">₹{inv.paidAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-amber-600 font-bold">₹{inv.balanceDue.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
            No bills submitted yet for this cycle.
          </div>
        )}
      </div>
    </div>
  );
};
