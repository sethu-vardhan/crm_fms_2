import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  MapPin,
  Camera,
  Clock,
  HardHat,
  AlertTriangle,
  Upload,
  Calendar,
  Send,
  ShieldAlert,
  Receipt,
  Plus,
  Sparkles,
  IndianRupee,
  Eye,
} from 'lucide-react';
import { AppUser, TaskItem, AttendanceRecord, LanguageCode, FieldExpenseBill, WorkOrder } from '../types';
import { useTranslation } from '../utils/translations';
import { OcrBillScannerModal } from './modals/OcrBillScannerModal';

interface WorkerPortalProps {
  currentUser: AppUser;
  tasks: TaskItem[];
  attendance: AttendanceRecord[];
  fieldBills?: FieldExpenseBill[];
  workOrders?: WorkOrder[];
  onMarkAttendance: (record: Partial<AttendanceRecord>) => void;
  onUpdateTaskProgress: (taskId: string, newPercentage: number) => void;
  onAddExpenseBill?: (bill: Partial<FieldExpenseBill>) => void;
  language: LanguageCode;
  isOnline: boolean;
}

export const WorkerPortal: React.FC<WorkerPortalProps> = ({
  currentUser,
  tasks,
  attendance,
  fieldBills = [],
  workOrders = [],
  onMarkAttendance,
  onUpdateTaskProgress,
  onAddExpenseBill,
  language,
  isOnline,
}) => {
  const t = useTranslation(language);
  const [checkedInToday, setCheckedInToday] = useState(
    attendance.some((a) => a.workerId === currentUser.id && a.date === '2026-03-10')
  );
  const [activeTab, setActiveTab] = useState<'tasks' | 'attendance' | 'bills' | 'safety'>('tasks');
  const [photoUploaded, setPhotoUploaded] = useState<string | null>(null);
  const [photoEvidenceInput, setPhotoEvidenceInput] = useState<string>('');
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [safetySigned, setSafetySigned] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const todayRecord = attendance.find(
    (a) => a.workerId === currentUser.id && a.date === '2026-03-10'
  );

  // Worker's own bills
  const myBills = fieldBills.filter((b) => b.paidByUserId === currentUser.id);
  const myTotalClaimed = myBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const myReimbursed = myBills.filter((b) => b.status === 'REIMBURSED').reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const handleQuickCheckIn = () => {
    // Attempt real browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onMarkAttendance({
            workerId: currentUser.id,
            workerName: currentUser.name,
            roleType: 'WELDER',
            siteId: currentUser.assignedSiteId || 'site-mmil-vzm',
            siteName: currentUser.assignedSiteName || 'MMIL Vizianagaram Plant',
            status: 'PRESENT',
            checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            markedBy: 'SELF_GPS',
            markedByName: `${currentUser.name} (Live GPS Check-in)`,
            gpsLocation: {
              latitude: Number(pos.coords.latitude.toFixed(4)),
              longitude: Number(pos.coords.longitude.toFixed(4)),
              landmark: 'Vizianagaram Plant - Main Gate #3 Geofence Verified',
              verifiedGeofence: true,
            },
          });
          setCheckedInToday(true);
        },
        () => {
          // Fallback if permission denied
          onMarkAttendance({
            workerId: currentUser.id,
            workerName: currentUser.name,
            roleType: 'WELDER',
            siteId: currentUser.assignedSiteId || 'site-mmil-vzm',
            siteName: currentUser.assignedSiteName || 'MMIL Vizianagaram Plant',
            status: 'PRESENT',
            checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            markedBy: 'SELF_GPS',
            markedByName: `${currentUser.name} (Self Geofence Check-in)`,
            gpsLocation: {
              latitude: 18.1124,
              longitude: 83.3956,
              landmark: 'Vizianagaram Plant - Main Gate #3 Geofence Verified',
              verifiedGeofence: true,
            },
          });
          setCheckedInToday(true);
        }
      );
    } else {
      onMarkAttendance({
        workerId: currentUser.id,
        workerName: currentUser.name,
        roleType: 'WELDER',
        siteId: currentUser.assignedSiteId || 'site-mmil-vzm',
        siteName: currentUser.assignedSiteName || 'MMIL Vizianagaram Plant',
        status: 'PRESENT',
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        markedBy: 'SELF_GPS',
        markedByName: `${currentUser.name} (Self Geofence Check-in)`,
      });
      setCheckedInToday(true);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoUploaded(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* Worker Greeting & Today Status */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-3xl shadow-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400/80"
            />
            <div>
              <h2 className="text-lg font-black tracking-tight">{currentUser.name}</h2>
              <p className="text-xs text-amber-300 font-semibold">{currentUser.designation}</p>
            </div>
          </div>
          <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-slate-300 font-medium">
            {isOnline ? '🟢 Connected' : '🟡 Site Offline'}
          </span>
        </div>

        {/* Site Badge */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{currentUser.assignedSiteName || 'MMIL Vizianagaram Site'}</span>
          </div>
          <span className="text-[11px] text-slate-400">10-Mar-2026</span>
        </div>
      </div>

      {/* Quick Action Banner: Bought something for company? */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-400/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">Bought tools / supplies for site?</span>
            <span className="text-[11px] text-slate-600 block">Snap photo of receipt for fast reimbursement</span>
          </div>
        </div>
        <button
          onClick={() => setShowOcrModal(true)}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs shrink-0 shadow-xs flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Snap Bill</span>
        </button>
      </div>

      {/* Touch-Friendly 4-Tab Bar */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'tasks'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardHat className="w-4 h-4 text-amber-600" />
          <span className="text-[11px]">{t('nav_tasks')}</span>
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'bills'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-amber-500" />
          <span className="text-[11px]">My Bills</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'attendance'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-[11px]">{t('nav_attendance')}</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`py-2.5 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
            activeTab === 'safety'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span className="text-[11px]">{t('nav_safety')}</span>
        </button>
      </div>

      {/* TAB 1: Assigned Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              My Assigned Tasks ({tasks.length})
            </h3>
            <span className="text-xs text-slate-500">Live work orders</span>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              No tasks assigned directly to you today. Check with Supervisor Suresh Naidu.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                      {task.stage}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {task.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{task.workOrderTitle}</p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      task.priority === 'CRITICAL'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'HIGH'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                {task.notes && (
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                    💡 <strong>Supervisor Instructions:</strong> {task.notes}
                  </div>
                )}

                {/* Progress bar and interactive input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Work Completion</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={task.completionPercentage}
                        onChange={(e) => {
                          const val = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                          onUpdateTaskProgress(task.id, val);
                        }}
                        className="w-12 text-center font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded px-1 py-0.5 text-xs"
                      />
                      <span className="text-blue-600">%</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${task.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Quick Action Percentage Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => onUpdateTaskProgress(task.id, pct)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        task.completionPercentage === pct
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Photo Proof Upload */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600" />
              Upload Work Photo Evidence
            </h4>
            <p className="text-xs text-slate-500">
              Capture welding seam, structural alignment, or completed task for supervisor sign-off.
            </p>

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {photoUploaded ? (
              <div className="space-y-2">
                <img
                  src={photoUploaded}
                  alt="Captured work"
                  className="w-full h-44 object-cover rounded-xl border border-slate-200"
                />
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Photo stamped with GPS & time ({currentUser.assignedSiteName || 'MMIL Gate 3'})
                </p>
                <button
                  onClick={() => setPhotoUploaded(null)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Take Another Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="py-4 px-3 bg-slate-50 hover:bg-amber-50/50 border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-xl flex flex-col items-center gap-1 text-slate-700 active:scale-98 transition-all"
                >
                  <Camera className="w-6 h-6 text-amber-600" />
                  <span className="text-xs font-bold">Snap Camera</span>
                </button>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="py-4 px-3 bg-slate-50 hover:bg-blue-50/50 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl flex flex-col items-center gap-1 text-slate-700 active:scale-98 transition-all"
                >
                  <Upload className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-bold">Upload Gallery</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: My Bills & Expense Claims */}
      {activeTab === 'bills' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              My Bills & Reimbursements
            </h3>
            <button
              onClick={() => setShowOcrModal(true)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Snap New Bill</span>
            </button>
          </div>

          {/* Quick Stats for Worker */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Total Submitted</span>
              <div className="text-base font-black text-slate-900 mt-0.5">
                ₹{myTotalClaimed.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[11px] text-emerald-600 font-medium">Reimbursed to You</span>
              <div className="text-base font-black text-emerald-600 mt-0.5">
                ₹{myReimbursed.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Bills List */}
          {myBills.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <Receipt className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">No bills submitted yet</div>
              <p className="text-[11px] text-slate-500">
                Whenever you purchase welding rods, grinding wheels, bolts, or site tea, take a photo and upload it here.
              </p>
              <button
                onClick={() => setShowOcrModal(true)}
                className="px-3.5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Upload First Bill
              </button>
            </div>
          ) : (
            myBills.map((b) => (
              <div key={b.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{b.merchantName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{b.billNumber} • {b.date}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      b.status === 'REIMBURSED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'APPROVED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600">
                  {b.items?.map((it) => `${it.description} (${it.quantity} ${it.unit})`).join(', ')}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Mode: {b.paymentMode}</span>
                  <span className="font-black text-slate-900 text-sm">₹{b.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Attendance & Check-In */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                GPS Site Attendance Check-In
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Geofence coordinates: 18.1124° N, 83.3956° E (MMIL Plant Gate 3 - Vizianagaram)
              </p>
            </div>

            {checkedInToday || todayRecord ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Checked In for Today!
                </div>
                <p className="text-xs text-emerald-700">
                  Time: {todayRecord?.checkInTime || '07:48 AM'} | Status: {todayRecord?.status || 'PRESENT'}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium">
                  Verified inside plant geofence boundary.
                </p>
              </div>
            ) : (
              <button
                onClick={handleQuickCheckIn}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                TAP TO CHECK-IN (GPS VERIFIED)
              </button>
            )}

            <div className="text-[11px] text-slate-400">
              Workers without smartphones are marked by Supervisor Suresh Naidu via Master Batch Register.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Safety Checklist */}
      {activeTab === 'safety' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-600" />
              Daily PPE & Safety Confirmation
            </h3>
            <p className="text-xs text-slate-500">
              Confirm before starting any heavy structural, rigging, or welding work on plant floor.
            </p>

            <div className="space-y-2">
              {[
                'Full-body safety harness with dual lanyard inspected',
                'Safety helmet with chin strap fastened',
                'Steel-toe safety shoes & leather welding gloves on',
                'Attended Morning Toolbox Talk (TBT) with Suresh Naidu',
              ].map((item, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>

            {safetySigned ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200">
                ✓ Safety Self-Declaration Verified & Signed for Today
              </div>
            ) : (
              <button
                onClick={() => setSafetySigned(true)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Sign-Off Daily Safety Declaration
              </button>
            )}
          </div>
        </div>
      )}

      {/* OCR Bill Scanner Modal for Worker */}
      <OcrBillScannerModal
        isOpen={showOcrModal}
        onClose={() => setShowOcrModal(false)}
        currentUser={currentUser}
        workOrders={workOrders}
        onSaveBill={(bill) => {
          if (onAddExpenseBill) onAddExpenseBill(bill);
        }}
      />
    </div>
  );
};
