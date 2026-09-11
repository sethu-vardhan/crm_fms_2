import React from 'react';
import { X, ShieldCheck, Check, Minus, Lock } from 'lucide-react';

import { AppUser } from '../../types';

interface RbacInfoModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser?: AppUser;
}

export const RbacInfoModal: React.FC<RbacInfoModalProps> = ({ isOpen = true, onClose, currentUser }) => {
  if (isOpen === false) return null;

  const matrix = [
    {
      module: 'All Jobs & Contracts (View)',
      owner: '✅ Full',
      hod: '✅ Dept Only',
      accountant: '✅ Full',
      supervisor: '❌ Own Site Only',
      subcontractor: '❌ Own Scope Only',
      worker: '❌ None',
    },
    {
      module: 'Contract Values & Profit Margins',
      owner: '✅ Full',
      hod: '✅ Full',
      accountant: '✅ Full',
      supervisor: '❌ Hidden (0%)',
      subcontractor: '❌ Hidden (0%)',
      worker: '❌ Hidden (0%)',
    },
    {
      module: 'Create / Edit Work Orders',
      owner: '✅ Full',
      hod: '✅ Full',
      accountant: '❌ Forbidden',
      supervisor: '❌ Forbidden',
      subcontractor: '❌ Forbidden',
      worker: '❌ Forbidden',
    },
    {
      module: 'Task Assignment (Site WBS)',
      owner: '✅ Full',
      hod: '✅ Full',
      accountant: '❌ None',
      supervisor: '✅ Own Site',
      subcontractor: '✅ Own Crew Only',
      worker: '❌ None',
    },
    {
      module: 'Attendance Marking',
      owner: '✅ Full',
      hod: '✅ Full',
      accountant: '❌ None',
      supervisor: '✅ Batch & GPS',
      subcontractor: '✅ Own Crew',
      worker: 'Self GPS/Check-in Only',
    },
    {
      module: 'Material Indents & Requests',
      owner: '✅ Full',
      hod: '✅ Approve',
      accountant: '❌ None',
      supervisor: '✅ Request Own Site',
      subcontractor: '✅ Request Own Scope',
      worker: '❌ None',
    },
    {
      module: 'Invoicing & Client Payments',
      owner: '✅ Full',
      hod: 'View Milestones Only',
      accountant: '✅ Full & Tally Export',
      supervisor: '❌ Forbidden',
      subcontractor: 'View Own Bills Only',
      worker: '❌ None',
    },
    {
      module: 'Safety & Quality Checklists',
      owner: '✅ Full',
      hod: '✅ Full',
      accountant: '❌ None',
      supervisor: '✅ Full (TBT & Hot Work)',
      subcontractor: '✅ Own Scope Check',
      worker: 'Submit / Sign-off Only',
    },
    {
      module: 'Dashboards & Analytics',
      owner: 'Company-wide (All Sites)',
      hod: 'Department-wide',
      accountant: 'Financial & Cashflow',
      supervisor: 'Site-only Execution',
      subcontractor: 'Subcontractor Portal',
      worker: 'Worker Task Mobile View',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sethu Engineering Works — Role-Based Access Matrix (Section 2.3)
              </h3>
              <p className="text-xs text-slate-500">
                Strict data scoping and permission boundaries enforced across all modules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
              <span className="font-bold block mb-1">Financial Separation Rule</span>
              Site Supervisors & Subcontractors see 100% operational detail but 0% contract values or margin percentages.
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
              <span className="font-bold block mb-1">Site Scoping Boundary</span>
              Supervisors are locked strictly to their assigned plant site (MMIL Vizianagaram Plant).
            </div>
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
              <span className="font-bold block mb-1">Subcontractor Wall</span>
              Subcontractors only see their own assigned tasks, crew attendance, and billing with zero visibility into peers.
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Module / Data</th>
                  <th className="p-3 text-amber-900">Owner</th>
                  <th className="p-3 text-blue-900">HOD</th>
                  <th className="p-3 text-emerald-900">Accountant</th>
                  <th className="p-3 text-orange-900">Supervisor</th>
                  <th className="p-3 text-purple-900">Subcontractor</th>
                  <th className="p-3 text-cyan-900">Worker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {matrix.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-3 font-semibold text-slate-800">{row.module}</td>
                    <td className="p-3 text-slate-700">{row.owner}</td>
                    <td className="p-3 text-slate-700">{row.hod}</td>
                    <td className="p-3 text-slate-700">{row.accountant}</td>
                    <td className="p-3 text-slate-700">{row.supervisor}</td>
                    <td className="p-3 text-slate-700">{row.subcontractor}</td>
                    <td className="p-3 text-slate-700">{row.worker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Client: Maa Mahamaya Industries Limited (MMIL) Vizianagaram</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
