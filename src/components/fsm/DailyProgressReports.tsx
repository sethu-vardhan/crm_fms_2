import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Calendar,
  Camera,
  AlertTriangle,
  HardHat,
  Truck,
  CheckCircle2,
  MapPin,
  Clock,
} from 'lucide-react';
import { DailyProgressReport, AppUser, WorkOrder } from '../../types';

interface DailyProgressReportsProps {
  dprReports: DailyProgressReport[];
  workOrders: WorkOrder[];
  currentUser: AppUser;
  onAddDpr: (newDpr: Partial<DailyProgressReport>) => void;
  isOnline: boolean;
}

export const DailyProgressReports: React.FC<DailyProgressReportsProps> = ({
  dprReports = [],
  workOrders = [],
  currentUser,
  onAddDpr,
  isOnline,
}) => {
  const safeDpr = dprReports || [];
  const safeWorkOrders = workOrders || [];
  const [showModal, setShowModal] = useState(false);
  const [selectedDprId, setSelectedDprId] = useState<string>(safeDpr[0]?.id || '');

  const selectedDpr = safeDpr.find((d) => d.id === selectedDprId) || safeDpr[0];

  // Form State
  const [selectedWoId, setSelectedWoId] = useState(safeWorkOrders[0]?.id || 'wo-01');
  const [tonnageErected, setTonnageErected] = useState(8.5);
  const [jointsWelded, setJointsWelded] = useState(14);
  const [manpowerCount, setManpowerCount] = useState(24);
  const [weather, setWeather] = useState('Clear 32°C');
  const [summary, setSummary] = useState('');
  const [delaysBottlenecks, setDelaysBottlenecks] = useState('');
  const [safetyMeetingHeld, setSafetyMeetingHeld] = useState(true);
  const [dprPhoto, setDprPhoto] = useState<string | null>(null);

  const handleCreateDpr = (e: React.FormEvent) => {
    e.preventDefault();
    const wo = workOrders.find((w) => w.id === selectedWoId);

    onAddDpr({
      workOrderId: selectedWoId,
      workOrderTitle: wo?.title || 'MMIL Project',
      siteId: wo?.siteId || 'site-mmil-vzm',
      siteName: wo?.siteName || 'MMIL Vizianagaram Plant Site',
      date: new Date().toISOString().split('T')[0],
      shift: 'GENERAL',
      supervisorId: currentUser.id,
      supervisorName: currentUser.name,
      tonnageErectedMT: Number(tonnageErected),
      jointsWelded: Number(jointsWelded),
      manpowerPresent: Number(manpowerCount),
      weatherCondition: weather,
      equipmentDeployed: ['50T Mobile Crane', '4x Inverter Arc Welders', 'Torque Wrenches'],
      summary: summary || 'Completed structural alignment and welding as planned.',
      delaysOrBottlenecks: delaysBottlenecks,
      safetyMeetingHeld,
      photos: [
        {
          id: `p-${Date.now()}`,
          url: dprPhoto || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800&auto=format&fit=crop&q=80',
          caption: `${summary || 'Erection work'} - ${wo?.title || 'MMIL Project'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
    });

    setShowModal(false);
    setSummary('');
    setDelaysBottlenecks('');
    setDprPhoto(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Daily Progress Reports (DPR)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Shift-wise structural tonnage erected, welding joints, manpower count & photo logs
          </p>
        </div>

        <button
          id="btn-create-dpr"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Submit Today's DPR</span>
        </button>
      </div>

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Site Offline Mode:</strong> DPRs and photos saved locally in indexed queue and will auto-sync when cellular signal returns.
            </span>
          </div>
          <span className="font-bold text-amber-800">Auto-queue Enabled</span>
        </div>
      )}

      {/* 2-Column Split: Reports List & Detailed Inspector View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: DPR cards */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Submitted Reports ({safeDpr.length})
          </div>

          {safeDpr.map((dpr) => {
            const isSelected = selectedDpr?.id === dpr.id;
            return (
              <div
                key={dpr.id}
                onClick={() => setSelectedDprId(dpr.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-1 ring-blue-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{dpr.date}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {dpr.shift} Shift
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{dpr.workOrderTitle}</h3>
                  <p className="text-[11px] text-slate-500">By: {dpr.supervisorName}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-700">🏗️ {dpr.tonnageErectedMT} MT</span>
                  <span className="font-semibold text-slate-600">⚡ {dpr.jointsWelded} Joints</span>
                  <span className="text-slate-500">👥 {dpr.manpowerPresent} Men</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Selected DPR Details */}
        {selectedDpr && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {selectedDpr.date} ({selectedDpr.shift} Shift)
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Site: {selectedDpr.siteName}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    {selectedDpr.workOrderTitle}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Supervisor</span>
                  <span className="text-xs font-bold text-slate-900">{selectedDpr.supervisorName}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Steel Erected</span>
                  <span className="text-lg font-black text-slate-900">{selectedDpr.tonnageErectedMT} MT</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Joints Welded</span>
                  <span className="text-lg font-black text-slate-900">{selectedDpr.jointsWelded}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Manpower</span>
                  <span className="text-lg font-black text-slate-900">{selectedDpr.manpowerPresent}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Weather</span>
                  <span className="text-xs font-bold text-slate-900 mt-1 block">{selectedDpr.weatherCondition}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800">Shift Execution Summary</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {selectedDpr.summary}
                </p>
              </div>

              {/* Delays / Bottlenecks */}
              {selectedDpr.delaysOrBottlenecks && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Bottleneck / Delay Alert</span>
                  </div>
                  <p>{selectedDpr.delaysOrBottlenecks}</p>
                </div>
              )}

              {/* Photo Evidence with GPS Watermark */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-slate-600" />
                  Site Photo Evidence (GPS Watermarked)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedDpr.photos || []).map((photo) => (
                    <div key={photo.id} className="relative rounded-xl overflow-hidden border border-slate-200 group">
                      <img
                        src={photo.url || (photo as any).imageUrl || ''}
                        alt={photo.caption}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-slate-950/90 to-transparent text-white text-[11px]">
                        <p className="font-semibold truncate">{photo.caption}</p>
                        <p className="text-[10px] text-slate-300">
                          {selectedDpr.date} {photo.timestamp} • MMIL Plant Gate 3
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Submit New DPR */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <h3 className="text-sm font-bold">Log Daily Progress Report (DPR)</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDpr} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Work Order</label>
                <select
                  value={selectedWoId}
                  onChange={(e) => setSelectedWoId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium"
                >
                  {workOrders.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.workOrderNo} — {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Steel Erected (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={tonnageErected}
                    onChange={(e) => setTonnageErected(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Joints Welded</label>
                  <input
                    type="number"
                    required
                    value={jointsWelded}
                    onChange={(e) => setJointsWelded(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manpower</label>
                  <input
                    type="number"
                    required
                    value={manpowerCount}
                    onChange={(e) => setManpowerCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Accomplished Today</label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Lifted beam B-12 using 50T crane, fitted gusset plates, 14 root welds completed."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delays / Bottlenecks (if any)</label>
                <input
                  type="text"
                  value={delaysBottlenecks}
                  onChange={(e) => setDelaysBottlenecks(e.target.value)}
                  placeholder="e.g. 1.5 hr delay waiting for MMIL safety officer hot-work clearance."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Site Progress Photo Evidence</span>
                  <span className="text-[10px] text-slate-500">Camera or Gallery</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setDprPhoto(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full p-2 text-xs border border-slate-300 rounded-xl bg-slate-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {dprPhoto && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 h-28">
                    <img src={dprPhoto} alt="DPR Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded font-mono">
                      Ready to upload
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save & Post DPR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
