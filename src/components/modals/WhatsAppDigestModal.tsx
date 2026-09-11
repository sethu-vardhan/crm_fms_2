import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCheck, Smartphone, BellRing, Sparkles } from 'lucide-react';
import { AppUser, WorkOrder, TaskItem, AttendanceRecord, InvoiceRecord, SnagIssue } from '../../types';

interface WhatsAppDigestModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: AppUser;
  workOrders?: WorkOrder[];
  tasks?: TaskItem[];
  attendance?: AttendanceRecord[];
  invoices?: InvoiceRecord[];
  snags?: SnagIssue[];
}

export const WhatsAppDigestModal: React.FC<WhatsAppDigestModalProps> = ({
  isOpen = true,
  onClose,
  currentUser,
  workOrders = [],
  tasks = [],
  attendance = [],
  invoices = [],
  snags = [],
}) => {
  if (isOpen === false) return null;

  const [activeTab, setActiveTab] = useState<'owner' | 'supervisor' | 'accountant'>(
    currentUser.role === 'OWNER'
      ? 'owner'
      : currentUser.role === 'SUPERVISOR' || currentUser.role === 'SUBCONTRACTOR' || currentUser.role === 'WORKER'
      ? 'supervisor'
      : 'accountant'
  );

  const [sentAlert, setSentAlert] = useState<string | null>(null);

  const handleSendSimulated = (title: string) => {
    setSentAlert(title);
    setTimeout(() => {
      setSentAlert(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                WhatsApp Business & SMS Dispatch Simulator
                <span className="text-[10px] bg-emerald-500/50 text-white px-2 py-0.5 rounded-full font-medium">
                  Section 3.4 & MVP Scope
                </span>
              </h3>
              <p className="text-xs text-emerald-100">
                Automated role-based site digests & instant SMS/WhatsApp alerts for contractor crews
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-600 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('owner')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'owner'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🌅 Owner Daily Digest
          </button>
          <button
            onClick={() => setActiveTab('supervisor')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'supervisor'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            👷 Site Supervisor & Crew Alerts
          </button>
          <button
            onClick={() => setActiveTab('accountant')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'accountant'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💰 Accountant Payment Reminder
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {sentAlert && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-medium border border-emerald-300 animate-in fade-in">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulated WhatsApp message successfully dispatched to verified recipient phone!</span>
            </div>
          )}

          {activeTab === 'owner' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Recipient: Sethu Vardhan (+91 98480 12345)</span>
                <span className="text-[11px] text-slate-500">Scheduled: Daily at 19:30 IST</span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-[#E7FFDB] p-4 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-200 text-xs text-slate-800 space-y-2 max-w-lg">
                <div className="flex items-center gap-2 text-emerald-900 font-bold border-b border-emerald-200/60 pb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>SETHU WORKS — DAILY EXECUTIVE DIGEST</span>
                </div>
                <p className="leading-relaxed">
                  <strong>Date:</strong> 10-Mar-2026 | <strong>Client:</strong> MMIL Vizianagaram Plant
                </p>
                <div className="space-y-1 bg-white/70 p-2.5 rounded-lg border border-emerald-100 text-[11px]">
                  <p>👥 <strong>Total Manpower on Site:</strong> 78 workers across 3 active jobs</p>
                  <p>🏗️ <strong>Steel Work Erected:</strong> 23.3 MT erected today (Pellet Plant + Kiln)</p>
                  <p>📋 <strong>DPR Submissions:</strong> 2 reports filed by Resident Engg Suresh Naidu</p>
                  <p>⚠️ <strong>Open Snags:</strong> 1 high-priority snag (Rafter bolt hole alignment Grid B3)</p>
                  <p>💳 <strong>Billing Status:</strong> RA Bill 2 (₹49.15 Lakh) pending certification from MMIL Accounts</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Automated digest sent via WhatsApp Business API</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    19:30 <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleSendSimulated('Owner Daily Digest')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Test Digest to Owner
                </button>
              </div>
            </div>
          )}

          {activeTab === 'supervisor' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Recipient: Suresh Naidu (+91 94401 77889)</span>
                <span className="text-[11px] text-slate-500">Trigger: High-Priority Task Dispatch</span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-[#E7FFDB] p-4 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-200 text-xs text-slate-800 space-y-2 max-w-lg">
                <div className="font-bold text-emerald-900 border-b border-emerald-200/60 pb-1.5 flex items-center justify-between">
                  <span>🚨 NEW TASK DISPATCH ALERT</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">HIGH PRIORITY</span>
                </div>
                <p>
                  <strong>Site:</strong> MMIL Vizianagaram Plant (Kiln #2 Area)
                </p>
                <div className="bg-white/70 p-2.5 rounded-lg border border-emerald-100 text-[11px] space-y-1">
                  <p><strong>Task:</strong> Circumferential Shell Root Pass & Full Penetration Welding</p>
                  <p><strong>Crew Lead:</strong> K. Ravi (Sai Rigging & Welding Works)</p>
                  <p><strong>Welder Assigned:</strong> Ramesh Naidu</p>
                  <p><strong>Safety Note:</strong> Hot work permit signed. Continuous pre-heat at 150°C required.</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Tap to open Sethu Works App</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    08:15 <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSendSimulated('Supervisor Task Dispatch')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Task Alert via WhatsApp
              </button>
            </div>
          )}

          {activeTab === 'accountant' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Recipient: Venkat Rao (+91 98482 98765)</span>
                <span className="text-[11px] text-slate-500">Trigger: RA Bill Due / Aging</span>
              </div>

              {/* Chat Bubble */}
              <div className="bg-[#E7FFDB] p-4 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-200 text-xs text-slate-800 space-y-2 max-w-lg">
                <div className="font-bold text-emerald-900 border-b border-emerald-200/60 pb-1.5">
                  <span>💰 CLIENT PAYMENT AGING ALERT</span>
                </div>
                <p>
                  <strong>Client:</strong> Maa Mahamaya Industries Limited (MMIL)
                </p>
                <div className="bg-white/70 p-2.5 rounded-lg border border-emerald-100 text-[11px] space-y-1">
                  <p><strong>Invoice No:</strong> INV/2025-26/072 (RA Bill 2 - Pellet Plant)</p>
                  <p><strong>Net Amount:</strong> ₹49,15,500 (incl. 18% GST, 5% retention withheld)</p>
                  <p><strong>Due Date:</strong> 15-Mar-2026 (5 days remaining)</p>
                  <p><strong>Action Required:</strong> Call MMIL Commercial Head (Sundara Murthy) for release schedule.</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Automated billing reminder</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    10:00 <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSendSimulated('Payment Milestone Reminder')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Payment Reminder
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            Designed for budget Android devices with instant SMS/WhatsApp integration
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
