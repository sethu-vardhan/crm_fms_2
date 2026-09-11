import React from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  IndianRupee,
  ShieldCheck,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { ClientProfile, WorkOrder, AppUser } from '../../types';

interface ClientDossierProps {
  client: ClientProfile;
  workOrders: WorkOrder[];
  currentUser: AppUser;
  onSelectWorkOrder: (wo: WorkOrder) => void;
}

export const ClientDossier: React.FC<ClientDossierProps> = ({
  client,
  workOrders,
  currentUser,
  onSelectWorkOrder,
}) => {
  const canSeeMoney = currentUser.role === 'OWNER' || currentUser.role === 'HOD' || currentUser.role === 'ACCOUNTANT';

  return (
    <div className="space-y-6">
      {/* Client Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              MMIL
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900">{client.companyName}</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Key Strategic Client
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {client.plantLocation}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Producer of Mangal TMT Bars | {client.industrialZone}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs font-mono text-slate-600">
                <span>GSTIN: <strong>{client.gstin}</strong></span>
                <span>•</span>
                <span>Vendor Code: <strong>SEW-MMIL-V042</strong></span>
              </div>
            </div>
          </div>

          {canSeeMoney && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-right shrink-0">
              <span className="text-xs text-slate-500 font-medium">Active Engagement Value</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">
                ₹{(client.totalContractsValue / 100000).toFixed(2)} Lakh
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Across {client.activeContractsCount} Turnkey Mechanical Packages
              </span>
            </div>
          )}
        </div>

        {/* Repeat Business / Renewal Reminder (Section 3.1) */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold block">Tender Cycle Renewal Alert (Section 3.1)</span>
              <span>
                MMIL Pellet Plant Phase-2 Expansion (2.0 MTPA) mechanical tender opens in 45 days. Keep safety audit & NDT records updated.
              </span>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg shrink-0 text-center">
            Upcoming Tender: May 2026
          </span>
        </div>
      </div>

      {/* Key Plant Officials & Contacts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          Key MMIL Plant Officials & Contacts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {client.keyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
            >
              <h3 className="text-sm font-bold text-slate-900">{contact.name}</h3>
              <p className="text-xs font-semibold text-blue-700">{contact.designation}</p>

              <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1 text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`tel:${contact.phone}`} className="hover:text-blue-600 font-medium">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${contact.email}`} className="hover:text-blue-600 font-medium truncate">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Work Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Active Mechanical Construction Packages at Vizianagaram Plant
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {workOrders.length} Ongoing Packages
          </span>
        </div>

        <div className="space-y-3">
          {workOrders.map((wo) => (
            <div
              key={wo.id}
              onClick={() => onSelectWorkOrder(wo)}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white transition-all cursor-pointer space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {wo.workOrderNo}
                    </span>
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {wo.department}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{wo.title}</h3>
                </div>

                <div className="text-right">
                  {canSeeMoney && (
                    <div className="text-sm font-black text-slate-900">
                      ₹{(wo.contractValue / 100000).toFixed(2)} Lakh
                    </div>
                  )}
                  <div className="text-xs font-bold text-emerald-600">
                    {wo.progressPercentage}% Completed
                  </div>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${wo.progressPercentage}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 line-clamp-1">{wo.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
