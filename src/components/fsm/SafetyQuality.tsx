import React, { useState } from 'react';
import {
  ShieldAlert,
  HardHat,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Plus,
  Flame,
  FileCheck,
  UserCheck,
} from 'lucide-react';
import { SnagIssue, AppUser, WorkOrder } from '../../types';

interface SafetyQualityProps {
  snags: SnagIssue[];
  workOrders: WorkOrder[];
  currentUser: AppUser;
  onAddSnag: (newSnag: Partial<SnagIssue>) => void;
  onResolveSnag: (snagId: string) => void;
}

export const SafetyQuality: React.FC<SafetyQualityProps> = ({
  snags = [],
  workOrders = [],
  currentUser,
  onAddSnag,
  onResolveSnag,
}) => {
  const safeSnags = snags || [];
  const safeWorkOrders = workOrders || [];
  const [activeTab, setActiveTab] = useState<'snags' | 'permits' | 'tbt'>('snags');
  const [showSnagModal, setShowSnagModal] = useState(false);

  // New Snag state
  const [snagTitle, setSnagTitle] = useState('');
  const [snagDesc, setSnagDesc] = useState('');
  const [snagPriority, setSnagPriority] = useState<SnagIssue['priority']>('HIGH');
  const [location, setLocation] = useState('Vizianagaram Plant - Pellet Plant Area');
  const [snagPhoto, setSnagPhoto] = useState<string | null>(null);

  const handleCreateSnag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snagTitle.trim()) return;

    onAddSnag({
      workOrderId: 'wo-01',
      title: snagTitle,
      description: snagDesc,
      location,
      priority: snagPriority,
      status: 'OPEN',
      raisedBy: currentUser.name,
      assignedTo: 'K. Ravi (Sai Rigging)',
      dateReported: new Date().toISOString().split('T')[0],
      photoUrl: snagPhoto || 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    });

    setShowSnagModal(false);
    setSnagTitle('');
    setSnagDesc('');
    setSnagPhoto(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Safety Permits, Toolbox Talks & Quality Snags
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mandatory MMIL steel plant safety compliance, hot-work permits, and joint inspection snags
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('snags')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'snags'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Snag Tracker ({safeSnags.length})
          </button>
          <button
            onClick={() => setActiveTab('permits')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'permits'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Hot-Work Permits
          </button>
          <button
            onClick={() => setActiveTab('tbt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tbt'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Daily TBT Sign-off
          </button>
        </div>
      </div>

      {activeTab === 'snags' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Open Quality Rectification Items
            </span>
            <button
              onClick={() => setShowSnagModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Quality Snag</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeSnags.map((snag) => (
              <div
                key={snag.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        snag.priority === 'HIGH'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {snag.priority} Priority
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        snag.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {snag.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2">{snag.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{snag.description}</p>
                </div>

                {snag.photoUrl && (
                  <img
                    src={snag.photoUrl}
                    alt="Snag photo"
                    className="w-full h-32 object-cover rounded-xl border border-slate-100"
                  />
                )}

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Raised: {snag.raisedBy} ({snag.dateReported})</span>
                    <span>Fix Assigned: <strong>{snag.assignedTo}</strong></span>
                  </div>

                  {snag.status !== 'RESOLVED' && (
                    <button
                      onClick={() => onResolveSnag(snag.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Rectified & Close Snag</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'permits' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Active Hot-Work & Height Permits (MMIL Safety Department)
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Valid Today (08:00 - 18:00)
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                permitNo: 'HWP-MMIL-2026-088',
                type: 'HOT WORK & GAS CUTTING',
                location: 'Pellet Plant Phase 1 - Cooler Shell (Elevation +14m)',
                safetyOfficer: 'K. Satyanarayana (MMIL Safety DGM)',
                precautions: 'Fire extinguisher 9kg DCP on standby, sparks arrestor screen installed',
              },
              {
                permitNo: 'WHP-MMIL-2026-041',
                type: 'WORK AT HEIGHT (> 2 METERS)',
                location: 'Tandem Conveyor Gallery BC-04',
                safetyOfficer: 'K. Satyanarayana (MMIL Safety DGM)',
                precautions: 'Dual lanyard full body harness, lifeline rope anchored to primary column',
              },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{p.permitNo}</span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-extrabold text-[10px]">
                    {p.type}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">Location: {p.location}</p>
                <p className="text-slate-600">Mandatory Controls: {p.precautions}</p>
                <div className="pt-2 border-t border-slate-200 text-slate-500 flex justify-between">
                  <span>Sign-off: {p.safetyOfficer}</span>
                  <span className="font-bold text-emerald-700">Permit Status: APPROVED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tbt' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Daily Toolbox Talk (TBT) Morning Register
            </h3>
            <span className="text-xs font-bold text-emerald-600">78 Attendees Signed</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Conducted By:</span>
              <span className="font-bold text-slate-800">Suresh Naidu (Site Supervisor)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Topic of the Day:</span>
              <span className="font-bold text-slate-800">Crane Tandem Lifting Rigging Protocols & Pinch Points</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-mono text-slate-700">10-Mar-2026 07:30 AM</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All fitters, riggers, and welders passed the morning breathalyzer and PPE check before entering plant gate.
            </span>
          </div>
        </div>
      )}

      {/* Modal: Log Snag */}
      {showSnagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold">Log Site Snag / Quality Issue</h3>
              <button
                onClick={() => setShowSnagModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSnag} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Splice joint weld porosity observed"
                  value={snagTitle}
                  onChange={(e) => setSnagTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={snagPriority}
                  onChange={(e) => setSnagPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High (Must fix before erection)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe defects, joint numbers, or structural grid references..."
                  value={snagDesc}
                  onChange={(e) => setSnagDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Defect / Snag Photo Evidence</span>
                  <span className="text-[10px] text-slate-500">Camera / Files</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setSnagPhoto(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                />
                {snagPhoto && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 h-28">
                    <img src={snagPhoto} alt="Snag Evidence" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded font-mono">
                      Photo Attached
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSnagModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl"
                >
                  Log Snag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
