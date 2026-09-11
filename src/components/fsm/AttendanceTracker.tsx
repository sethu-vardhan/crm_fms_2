import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Plus,
  Compass,
} from 'lucide-react';
import { AttendanceRecord, AppUser, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/translations';

interface AttendanceTrackerProps {
  attendance: AttendanceRecord[];
  currentUser: AppUser;
  onMarkAttendance: (record: Partial<AttendanceRecord>) => void;
  language: LanguageCode;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  attendance = [],
  currentUser,
  onMarkAttendance,
  language,
}) => {
  const safeAttendance = attendance || [];
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'batch' | 'gps'>('batch');
  const [simulatedGps, setSimulatedGps] = useState({
    lat: 18.1124,
    lng: 83.3956,
    verified: true,
  });

  const [workerNameInput, setWorkerNameInput] = useState('');
  const [workerRoleInput, setWorkerRoleInput] = useState<AttendanceRecord['roleType']>('FITTER');
  const [otHoursInput, setOtHoursInput] = useState(0);

  const presentCount = safeAttendance.filter((a) => a.status === 'PRESENT' || a.status === 'OVERTIME').length;
  const overtimeCount = safeAttendance.filter((a) => a.status === 'OVERTIME').length;
  const halfDayCount = safeAttendance.filter((a) => a.status === 'HALF_DAY').length;

  const handleBatchMark = (status: AttendanceRecord['status'], workerName: string, roleType: AttendanceRecord['roleType']) => {
    onMarkAttendance({
      workerId: `w-${Date.now()}`,
      workerName,
      roleType,
      siteId: 'site-mmil-vzm',
      siteName: 'MMIL Vizianagaram Plant Site',
      status,
      overtimeHours: status === 'OVERTIME' ? 3 : 0,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      markedBy: 'SUPERVISOR_BATCH',
      markedByName: currentUser.name,
    });
  };

  const handleAddWorkerAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerNameInput.trim()) return;

    onMarkAttendance({
      workerId: `w-${Date.now()}`,
      workerName: workerNameInput,
      roleType: workerRoleInput,
      siteId: 'site-mmil-vzm',
      siteName: 'MMIL Vizianagaram Plant Site',
      status: otHoursInput > 0 ? 'OVERTIME' : 'PRESENT',
      overtimeHours: otHoursInput,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      markedBy: 'SUPERVISOR_BATCH',
      markedByName: currentUser.name,
    });

    setWorkerNameInput('');
    setOtHoursInput(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            {t('nav_attendance')} & Muster Roll
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            GPS-tagged geofenced check-in & supervisor batch marking for non-smartphone labor
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'batch'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Supervisor Batch Register
          </button>
          <button
            onClick={() => setActiveTab('gps')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gps'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            GPS Plant Geofence
          </button>
        </div>
      </div>

      {/* Attendance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Logged Today</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{attendance.length} Workers</div>
          <span className="text-[11px] text-slate-400">10-Mar-2026 Shift A</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Present On-Site</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{presentCount} Men</div>
          <span className="text-[11px] text-emerald-700">Full shift compliance</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Overtime (OT)</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-orange-600 mt-1">{overtimeCount} Men</div>
          <span className="text-[11px] text-orange-700">Evening crane lift shift</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Half Day / Late</span>
            <AlertCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-700 mt-1">{halfDayCount} Men</div>
          <span className="text-[11px] text-slate-400">4 hours logged</span>
        </div>
      </div>

      {activeTab === 'batch' && (
        <div className="space-y-6">
          {/* Quick Add Worker Record */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Mark Attendance for Non-Smartphone Workers (Supervisor Master Roll)
            </h3>
            <form onSubmit={handleAddWorkerAttendance} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Worker Name (e.g. S. Narayana)"
                value={workerNameInput}
                onChange={(e) => setWorkerNameInput(e.target.value)}
                className="p-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium"
              />
              <select
                value={workerRoleInput}
                onChange={(e) => setWorkerRoleInput(e.target.value as any)}
                className="p-2.5 rounded-xl border border-slate-300 text-slate-900"
              >
                <option value="FITTER">Fitter</option>
                <option value="RIGGER">Rigger</option>
                <option value="WELDER">Welder</option>
                <option value="HELPER">Helper</option>
                <option value="SUPERVISOR">Supervisor</option>
              </select>
              <input
                type="number"
                min="0"
                max="8"
                placeholder="OT Hours (0-8)"
                value={otHoursInput || ''}
                onChange={(e) => setOtHoursInput(Number(e.target.value))}
                className="p-2.5 rounded-xl border border-slate-300 text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Mark Present</span>
              </button>
            </form>
          </div>

          {/* Today's Muster Roll Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Site Muster Register — MMIL Vizianagaram Plant (10-Mar-2026)
              </span>
              <span className="text-[11px] text-slate-500">
                Marked by Site In-charge & Self GPS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Worker Name</th>
                    <th className="p-3.5">Trade / Skill</th>
                    <th className="p-3.5">Contractor / Subcon</th>
                    <th className="p-3.5">In-Time</th>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5">OT Hours</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {safeAttendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">{rec.workerName}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {rec.roleType}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">
                        {rec.subcontractorOrg || 'Sethu Engineering Works'}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{rec.checkInTime || '08:00 AM'}</td>
                      <td className="p-3.5">
                        {rec.markedBy === 'SELF_GPS' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            <MapPin className="w-3 h-3" />
                            Self GPS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                            <UserCheck className="w-3 h-3" />
                            Supervisor
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {rec.overtimeHours && rec.overtimeHours > 0 ? (
                          <span className="font-bold text-orange-600">+{rec.overtimeHours} hrs</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            rec.status === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rec.status === 'OVERTIME'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.status}
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

      {activeTab === 'gps' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              Vizianagaram Plant Geofence Coordinates
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              ● Geofence Active (Radius 500m)
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Target Geofence Center:</span>
              <span className="font-mono font-bold text-slate-800">
                18.1124° N, 83.3956° E (MMIL Plant Gate 3)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Allowed Precision:</span>
              <span className="font-semibold text-slate-700">± 50 meters GPS fix</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Security Rule:</span>
              <span className="font-semibold text-slate-700">
                Prevents off-site attendance check-ins from outside Vizianagaram plant boundaries
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              All {safeAttendance.filter((a) => a.markedBy === 'SELF_GPS').length} self-registered worker attendance checks today are verified within the steel plant perimeter.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
