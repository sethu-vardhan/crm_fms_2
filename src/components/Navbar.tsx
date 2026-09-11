import React, { useState } from 'react';
import {
  Shield,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  Languages,
  UserCheck,
  ChevronDown,
  Building2,
  HardHat,
  Receipt,
  Truck,
  Wrench,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { AppUser, LanguageCode, OfflineQueueItem } from '../types';
import { USERS } from '../data/mockData';
import { useTranslation } from '../utils/translations';

interface NavbarProps {
  currentUser: AppUser;
  onSelectUser?: (user: AppUser) => void;
  onSwitchUser?: (user: AppUser) => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  offlineQueue?: OfflineQueueItem[] | any[];
  offlineQueueCount?: number;
  onSyncQueue?: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenRbacInfoModal?: () => void;
  onOpenRbacModal?: () => void;
  onOpenTallyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUser,
  onSwitchUser,
  language,
  onSelectLanguage,
  isOnline,
  onToggleOnline,
  offlineQueue = [],
  offlineQueueCount,
  onSyncQueue = () => {},
  onOpenWhatsAppModal,
  onOpenRbacInfoModal,
  onOpenRbacModal,
  onOpenTallyModal,
}) => {
  const t = useTranslation(language);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleSelectUser = onSelectUser || onSwitchUser || (() => {});
  const handleOpenRbac = onOpenRbacInfoModal || onOpenRbacModal || (() => {});
  const queueLength = offlineQueueCount !== undefined ? offlineQueueCount : (offlineQueue?.length || 0);

  const getRoleIcon = (role: AppUser['role']) => {
    switch (role) {
      case 'OWNER':
        return <Shield className="w-4 h-4 text-amber-600" />;
      case 'HOD':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'ACCOUNTANT':
        return <Receipt className="w-4 h-4 text-emerald-600" />;
      case 'SUPERVISOR':
        return <HardHat className="w-4 h-4 text-orange-600" />;
      case 'SUBCONTRACTOR':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'WORKER':
        return <Wrench className="w-4 h-4 text-cyan-600" />;
    }
  };

  const getRoleBadgeColor = (role: AppUser['role']) => {
    switch (role) {
      case 'OWNER':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'HOD':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'ACCOUNTANT':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SUPERVISOR':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'SUBCONTRACTOR':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'WORKER':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
    }
  };

  const getScopeDescription = (user: AppUser) => {
    switch (user.scopeType) {
      case 'COMPANY':
        return user.role === 'ACCOUNTANT' ? 'Financials (All Jobs)' : 'Company-wide (All Sites & Finances)';
      case 'DEPARTMENT':
        return `Dept: ${user.department}`;
      case 'SITE':
        return `Site: ${user.assignedSiteName}`;
      case 'SUBCONTRACT':
        return `Scope: ${user.subcontractorOrgName}`;
      case 'SELF':
        return 'Individual Assigned Tasks';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Offline sync banner if offline or pending */}
      {(!isOnline || queueLength > 0) && (
        <div
          id="offline-status-banner"
          className={`px-4 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
            !isOnline ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {!isOnline ? <WifiOff className="w-3.5 h-3.5 animate-pulse" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>
              {!isOnline
                ? 'Plant Site Offline Mode (No Signal at Kiln Yard) — Field changes saved locally'
                : 'Connected to Network'}
            </span>
            {queueLength > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold">
                {queueLength} {t('queued_changes')}
              </span>
            )}
          </div>
          {queueLength > 0 && (
            <button
              id="btn-sync-offline-queue"
              onClick={onSyncQueue}
              className="flex items-center gap-1 bg-white text-slate-800 hover:bg-slate-100 px-2.5 py-0.5 rounded-md font-semibold text-xs shadow-xs transition-transform active:scale-95"
            >
              <RefreshCw className="w-3 h-3 text-blue-600" />
              {t('sync_now')}
            </button>
          )}
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-sm border border-slate-700 shrink-0">
              SEW
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight truncate">
                  Sethu Engineering Works
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  MMIL Steel Plant Contractor
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                TMT Steel Plant Mechanical Structure & Erection Management
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Online / Offline Simulator Toggle */}
            <button
              id="btn-toggle-connectivity"
              onClick={onToggleOnline}
              title="Simulate offline field site connectivity"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                isOnline
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-700" />}
              <span className="hidden sm:inline">{isOnline ? t('online') : t('offline_site_mode')}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                id="btn-language-selector"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700"
              >
                <Languages className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    onClick={() => {
                      onSelectLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      language === 'en' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectLanguage('te');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      language === 'te' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>తెలుగు (Telugu)</span>
                    {language === 'te' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectLanguage('hi');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      language === 'hi' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {language === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp Notifications digest trigger */}
            <button
              id="btn-whatsapp-digest"
              onClick={onOpenWhatsAppModal}
              title="View WhatsApp Daily Digest & Task Dispatch"
              className="relative p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-600 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {/* RBAC Matrix Info Guide */}
            <button
              id="btn-rbac-info"
              onClick={handleOpenRbac}
              title="View RBAC Access Matrix & Guidelines"
              className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Optional Tally Export trigger for financial roles */}
            {onOpenTallyModal && (currentUser.role === 'OWNER' || currentUser.role === 'ACCOUNTANT') && (
              <button
                id="btn-navbar-tally"
                onClick={onOpenTallyModal}
                title="Tally XML / CSV Accounting Bridge"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tally</span>
              </button>
            )}

            {/* Role Switcher Button & Dropdown */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all text-left shadow-2xs hover:shadow-xs ${getRoleBadgeColor(
                  currentUser.role,
                )}`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-black/10"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs leading-none">{currentUser.name}</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 bg-black/5 rounded">
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-[10px] opacity-80 block truncate max-w-[140px] leading-tight mt-0.5">
                    {currentUser.designation}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div
                  id="role-switcher-dropdown"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Role Switcher (RBAC Demo)
                      </span>
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Switch personas to test exact role boundaries & data scope.
                    </p>
                  </div>

                  <div className="space-y-1 max-h-[420px] overflow-y-auto">
                    {USERS.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          id={`select-role-${user.role.toLowerCase()}`}
                          onClick={() => {
                            handleSelectUser(user);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 mt-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold truncate">{user.name}</span>
                              <span
                                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                                  isSelected ? 'bg-white/20 text-white' : getRoleBadgeColor(user.role)
                                }`}
                              >
                                {user.role}
                              </span>
                            </div>
                            <div className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {user.designation}
                            </div>
                            <div
                              className={`text-[10px] mt-1 flex items-center gap-1 font-medium ${
                                isSelected ? 'text-amber-300' : 'text-slate-600'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {getScopeDescription(user)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
