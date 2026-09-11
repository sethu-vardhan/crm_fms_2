import React, { useState } from 'react';
import {
  USERS,
  MMIL_CLIENT,
  INITIAL_WORK_ORDERS,
  INITIAL_TASKS,
  INITIAL_ATTENDANCE,
  INITIAL_MATERIALS,
  INITIAL_INVOICES,
  INITIAL_SNAGS,
  INITIAL_DPR,
  INITIAL_FIELD_BILLS,
} from './data/mockData';
import {
  AppUser,
  WorkOrder,
  TaskItem,
  AttendanceRecord,
  MaterialIndent,
  InvoiceRecord,
  SnagIssue,
  DailyProgressReport,
  LanguageCode,
  OfflineActionItem,
  FieldExpenseBill,
} from './types';
import {
  filterWorkOrders,
  filterTasks,
  filterAttendance,
  filterMaterials,
  filterInvoices,
  hasPermission,
} from './utils/rbac';
import { useTranslation } from './utils/translations';
import { Navbar } from './components/Navbar';
import { RbacInfoModal } from './components/modals/RbacInfoModal';
import { WhatsAppDigestModal } from './components/modals/WhatsAppDigestModal';
import { TallyExportModal } from './components/modals/TallyExportModal';

// Role Dashboards
import { OwnerDashboard } from './components/dashboards/OwnerDashboard';
import { HODDashboard } from './components/dashboards/HODDashboard';
import { AccountantDashboard } from './components/dashboards/AccountantDashboard';
import { SupervisorDashboard } from './components/dashboards/SupervisorDashboard';
import { SubcontractorDashboard } from './components/dashboards/SubcontractorDashboard';

// Specialized Portals & Modules
import { WorkerPortal } from './components/WorkerPortal';
import { ClientDossier } from './components/crm/ClientDossier';
import { ContractsWorkOrders } from './components/crm/ContractsWorkOrders';
import { InvoicingPayments } from './components/crm/InvoicingPayments';
import { TaskManagement } from './components/fsm/TaskManagement';
import { AttendanceTracker } from './components/fsm/AttendanceTracker';
import { DailyProgressReports } from './components/fsm/DailyProgressReports';
import { MaterialTracker } from './components/fsm/MaterialTracker';
import { SafetyQuality } from './components/fsm/SafetyQuality';

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<AppUser>(USERS[0]); // Starts as Owner R. Sethupathi
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueue, setOfflineQueue] = useState<OfflineActionItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Domain Collections
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [materials, setMaterials] = useState<MaterialIndent[]>(INITIAL_MATERIALS);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(INITIAL_INVOICES);
  const [fieldBills, setFieldBills] = useState<FieldExpenseBill[]>(INITIAL_FIELD_BILLS);
  const [snags, setSnags] = useState<SnagIssue[]>(INITIAL_SNAGS);
  const [dprReports, setDprReports] = useState<DailyProgressReport[]>(INITIAL_DPR);

  // Modals
  const [showRbacModal, setShowRbacModal] = useState<boolean>(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [showTallyModal, setShowTallyModal] = useState<boolean>(false);

  // Translation hook
  const t = useTranslation(language);

  // Network toggle handler
  const handleToggleOnline = () => {
    if (!isOnline && offlineQueue.length > 0) {
      alert(`Back Online! Synced ${offlineQueue.length} offline records to MMIL central database.`);
      setOfflineQueue([]);
    }
    setIsOnline(!isOnline);
  };

  // Queue an offline action
  const queueOfflineAction = (actionType: OfflineActionItem['actionType'], payload: any) => {
    const newItem: OfflineActionItem = {
      id: `offline-${Date.now()}`,
      actionType,
      payload,
      timestamp: new Date().toISOString(),
      synced: false,
    };
    setOfflineQueue((prev) => [...prev, newItem]);
  };

  // RBAC Filtered Data Views
  const visibleWorkOrders = filterWorkOrders(workOrders, currentUser);
  const visibleTasks = filterTasks(tasks, currentUser);
  const visibleAttendance = filterAttendance(attendance, currentUser);
  const visibleMaterials = filterMaterials(materials, currentUser);
  const visibleInvoices = filterInvoices(invoices, currentUser);

  // Data Handlers
  const handleAddWorkOrder = (newWo: Partial<WorkOrder>) => {
    const created: WorkOrder = {
      id: `wo-${Date.now()}`,
      workOrderNo: newWo.workOrderNo || `WO-MMIL-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newWo.title || 'New Work Order',
      department: newWo.department || 'Mechanical Projects & Erection',
      siteId: newWo.siteId || 'site-mmil-vzm',
      siteName: newWo.siteName || 'MMIL Vizianagaram Plant Site',
      clientId: 'client-mmil',
      clientName: 'Maa Mahamaya Industries Limited',
      contractValue: newWo.contractValue || 0,
      estimatedCost: newWo.estimatedCost || 0,
      actualCostIncurred: 0,
      status: 'IN_PROGRESS',
      progressPercentage: 0,
      startDate: newWo.startDate || '2026-03-15',
      targetCompletionDate: newWo.targetCompletionDate || '2026-08-30',
      description: newWo.description || '',
      scopeOfWork: newWo.scopeOfWork || [],
      documents: newWo.documents || [],
      milestones: newWo.milestones || [],
    };

    setWorkOrders((prev) => [created, ...prev]);
    if (!isOnline) queueOfflineAction('CREATE_WORK_ORDER', created);
  };

  const handleAddTask = (newTask: Partial<TaskItem>) => {
    const created: TaskItem = {
      id: `task-${Date.now()}`,
      workOrderId: newTask.workOrderId || 'wo-01',
      workOrderTitle: newTask.workOrderTitle || 'MMIL Project',
      siteId: newTask.siteId || 'site-mmil-vzm',
      siteName: newTask.siteName || 'MMIL Vizianagaram Plant Site',
      title: newTask.title || 'New Task',
      stage: newTask.stage || 'Structure Erection',
      assignedToRole: newTask.assignedToRole || 'SUPERVISOR',
      assignedWorkerId: newTask.assignedWorkerId,
      assignedWorkerName: newTask.assignedWorkerName,
      assignedSubcontractorId: newTask.assignedSubcontractorId,
      assignedSubcontractorName: newTask.assignedSubcontractorName,
      priority: newTask.priority || 'MEDIUM',
      status: newTask.status || 'TODO',
      plannedDays: newTask.plannedDays || 3,
      completionPercentage: 0,
      dueDate: newTask.dueDate || '2026-03-25',
      steelWeightMT: newTask.steelWeightMT,
      notes: newTask.notes,
    };

    setTasks((prev) => [created, ...prev]);
    if (!isOnline) queueOfflineAction('CREATE_TASK', created);
  };

  const handleUpdateTaskProgress = (taskId: string, percentage: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completionPercentage: percentage,
              status: percentage === 100 ? 'COMPLETED' : percentage > 0 ? 'IN_PROGRESS' : t.status,
            }
          : t
      )
    );
    if (!isOnline) queueOfflineAction('UPDATE_TASK_PROGRESS', { taskId, percentage });
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              completionPercentage: status === 'COMPLETED' ? 100 : t.completionPercentage,
            }
          : t
      )
    );
  };

  const handleUpdateTaskPriority = (taskId: string, priority: TaskItem['priority']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              priority,
            }
          : t
      )
    );
    if (!isOnline) queueOfflineAction('UPDATE_TASK_PRIORITY' as any, { taskId, priority });
  };

  const handleMarkAttendance = (record: Partial<AttendanceRecord>) => {
    const created: AttendanceRecord = {
      id: `att-${Date.now()}`,
      workerId: record.workerId || `w-${Date.now()}`,
      workerName: record.workerName || 'Worker',
      roleType: record.roleType || 'FITTER',
      siteId: record.siteId || 'site-mmil-vzm',
      siteName: record.siteName || 'MMIL Vizianagaram Plant Site',
      date: new Date().toISOString().split('T')[0],
      status: record.status || 'PRESENT',
      checkInTime: record.checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      markedBy: record.markedBy || 'SELF_GPS',
      markedByName: record.markedByName || currentUser.name,
      overtimeHours: record.overtimeHours || 0,
      gpsLocation: record.gpsLocation,
    };

    setAttendance((prev) => [created, ...prev]);
    if (!isOnline) queueOfflineAction('LOG_ATTENDANCE', created);
  };

  const handleAddDpr = (newDpr: Partial<DailyProgressReport>) => {
    const created: DailyProgressReport = {
      id: `dpr-${Date.now()}`,
      workOrderId: newDpr.workOrderId || 'wo-01',
      workOrderTitle: newDpr.workOrderTitle || 'MMIL Project',
      siteId: newDpr.siteId || 'site-mmil-vzm',
      siteName: newDpr.siteName || 'MMIL Vizianagaram Plant Site',
      date: newDpr.date || new Date().toISOString().split('T')[0],
      shift: newDpr.shift || 'GENERAL',
      supervisorId: newDpr.supervisorId || currentUser.id,
      supervisorName: newDpr.supervisorName || currentUser.name,
      tonnageErectedMT: newDpr.tonnageErectedMT || 0,
      jointsWelded: newDpr.jointsWelded || 0,
      manpowerPresent: newDpr.manpowerPresent || 0,
      weatherCondition: newDpr.weatherCondition || 'Clear 32°C',
      equipmentDeployed: newDpr.equipmentDeployed || ['50T Mobile Crane', 'Welding Inverters'],
      summary: newDpr.summary || 'Shift executed as per drawing.',
      delaysOrBottlenecks: newDpr.delaysOrBottlenecks,
      safetyMeetingHeld: newDpr.safetyMeetingHeld ?? true,
      photos: newDpr.photos || [],
    };

    setDprReports((prev) => [created, ...prev]);
    if (!isOnline) queueOfflineAction('LOG_DPR', created);
  };

  const handleAddMaterialIndent = (newIndent: Partial<MaterialIndent>) => {
    const created: MaterialIndent = {
      id: `indent-${Date.now()}`,
      workOrderId: newIndent.workOrderId || 'wo-01',
      workOrderTitle: newIndent.workOrderTitle || 'MMIL Project',
      siteId: newIndent.siteId || 'site-mmil-vzm',
      siteName: newIndent.siteName || 'MMIL Vizianagaram Plant Site',
      itemName: newIndent.itemName || 'Material',
      category: newIndent.category || 'STEEL_SECTIONS',
      quantityRequested: newIndent.quantityRequested || 1,
      quantityDelivered: 0,
      stockRemainingAtSite: 0,
      unit: newIndent.unit || 'MT',
      urgency: newIndent.urgency || 'MEDIUM',
      status: 'REQUESTED',
      requestedBy: newIndent.requestedBy || currentUser.name,
      requestDate: new Date().toISOString().split('T')[0],
      purpose: newIndent.purpose,
    };

    setMaterials((prev) => [created, ...prev]);
    if (!isOnline) queueOfflineAction('RAISE_MATERIAL_INDENT', created);
  };

  const handleApproveIndent = (indentId: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === indentId ? { ...m, status: 'APPROVED' } : m))
    );
  };

  const handleAddInvoice = (newInv: Partial<InvoiceRecord>) => {
    const created: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNo: newInv.invoiceNo || `INV/2025-26/${Math.floor(100 + Math.random() * 900)}`,
      workOrderId: newInv.workOrderId || 'wo-01',
      workOrderTitle: newInv.workOrderTitle || 'MMIL Project',
      billType: newInv.billType || 'RA_BILL_1',
      date: newInv.date || new Date().toISOString().split('T')[0],
      dueDate: newInv.dueDate || '2026-03-31',
      basicAmount: newInv.basicAmount || 0,
      gstRate: 0.18,
      gstAmount: (newInv.basicAmount || 0) * 0.18,
      retentionRate: 0.05,
      retentionAmount: (newInv.basicAmount || 0) * 0.05,
      netPayable:
        (newInv.basicAmount || 0) +
        (newInv.basicAmount || 0) * 0.18 -
        (newInv.basicAmount || 0) * 0.05,
      paidAmount: 0,
      balanceDue:
        (newInv.basicAmount || 0) +
        (newInv.basicAmount || 0) * 0.18 -
        (newInv.basicAmount || 0) * 0.05,
      status: 'PENDING',
      daysOverdue: 0,
    };

    setInvoices((prev) => [created, ...prev]);
  };

  const handleAddSnag = (newSnag: Partial<SnagIssue>) => {
    const created: SnagIssue = {
      id: `snag-${Date.now()}`,
      workOrderId: newSnag.workOrderId || 'wo-01',
      title: newSnag.title || 'New Snag',
      description: newSnag.description || '',
      location: newSnag.location || 'Vizianagaram Plant',
      priority: newSnag.priority || 'HIGH',
      status: 'OPEN',
      raisedBy: newSnag.raisedBy || currentUser.name,
      assignedTo: newSnag.assignedTo || 'Fabrication Team',
      dateReported: new Date().toISOString().split('T')[0],
      photoUrl: newSnag.photoUrl,
    };

    setSnags((prev) => [created, ...prev]);
  };

  const handleResolveSnag = (snagId: string) => {
    setSnags((prev) =>
      prev.map((s) => (s.id === snagId ? { ...s, status: 'RESOLVED' } : s))
    );
  };

  const handleAddExpenseBill = (bill: Partial<FieldExpenseBill>) => {
    const created: FieldExpenseBill = {
      id: `bill-${Date.now()}`,
      billNumber: bill.billNumber || `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: bill.date || new Date().toISOString().split('T')[0],
      merchantName: bill.merchantName || 'Site Vendor',
      merchantGstin: bill.merchantGstin,
      category: bill.category || 'Consumables & Hardware',
      items: bill.items || [
        {
          id: `item-${Date.now()}`,
          description: 'Emergency site purchase',
          quantity: 1,
          unit: 'Nos',
          rate: bill.totalAmount || 0,
          amount: bill.totalAmount || 0,
        },
      ],
      subtotal: bill.subtotal || bill.totalAmount || 0,
      taxAmount: bill.taxAmount || 0,
      totalAmount: bill.totalAmount || 0,
      paidByUserId: bill.paidByUserId || currentUser.id,
      paidByName: bill.paidByName || currentUser.name,
      paidByRole: bill.paidByRole || currentUser.role,
      workOrderId: bill.workOrderId || 'wo-01',
      workOrderTitle: bill.workOrderTitle || 'Pellet Plant 1.2 MTPA Structural',
      siteId: bill.siteId || 'site-mmil-vzm',
      siteName: bill.siteName || 'MMIL Vizianagaram Plant Site',
      paymentMode: bill.paymentMode || 'UPI',
      status: 'PENDING_APPROVAL',
      receiptPhotoUrl: bill.receiptPhotoUrl,
      ocrExtracted: bill.ocrExtracted ?? false,
      notes: bill.notes,
      createdAt: new Date().toISOString(),
    };

    setFieldBills((prev) => [created, ...prev]);
    if (!isOnline) queueOfflineAction('LOG_FIELD_EXPENSE' as any, created);
  };

  const handleUpdateExpenseBillStatus = (billId: string, status: FieldExpenseBill['status']) => {
    setFieldBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status } : b))
    );
  };

  const handleDeleteExpenseBill = (billId: string) => {
    setFieldBills((prev) => prev.filter((b) => b.id !== billId));
  };

  // Render role-appropriate dashboard view
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'OWNER':
        return (
          <OwnerDashboard
            workOrders={visibleWorkOrders}
            tasks={visibleTasks}
            attendance={visibleAttendance}
            invoices={visibleInvoices}
            snags={snags}
            dprReports={dprReports}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'HOD':
        return (
          <HODDashboard
            currentUser={currentUser}
            workOrders={visibleWorkOrders}
            tasks={visibleTasks}
            materials={visibleMaterials}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'ACCOUNTANT':
        return (
          <AccountantDashboard
            invoices={visibleInvoices}
            workOrders={visibleWorkOrders}
            fieldBills={fieldBills}
            onOpenTallyModal={() => setShowTallyModal(true)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'SUPERVISOR':
        return (
          <SupervisorDashboard
            currentUser={currentUser}
            tasks={visibleTasks}
            attendance={visibleAttendance}
            materials={visibleMaterials}
            snags={snags}
            dprReports={dprReports}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenNewDpr={() => setActiveTab('dpr')}
          />
        );
      case 'SUBCONTRACTOR':
        return (
          <SubcontractorDashboard
            currentUser={currentUser}
            tasks={visibleTasks}
            attendance={visibleAttendance}
            materials={visibleMaterials}
            invoices={visibleInvoices}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'WORKER':
        return (
          <WorkerPortal
            currentUser={currentUser}
            tasks={visibleTasks}
            attendance={attendance}
            fieldBills={fieldBills}
            workOrders={visibleWorkOrders}
            onMarkAttendance={handleMarkAttendance}
            onUpdateTaskProgress={handleUpdateTaskProgress}
            onAddExpenseBill={handleAddExpenseBill}
            language={language}
            isOnline={isOnline}
          />
        );
      default:
        return null;
    }
  };

  // Determine allowed secondary tabs based on RBAC rules
  const canAccessCRM = hasPermission(currentUser.role, 'VIEW_ALL_JOBS');
  const canAccessFinancials =
    currentUser.role === 'OWNER' ||
    currentUser.role === 'HOD' ||
    currentUser.role === 'ACCOUNTANT' ||
    currentUser.role === 'SUBCONTRACTOR';
  const canAccessTasks = currentUser.role !== 'ACCOUNTANT';
  const canAccessAttendance = true;
  const canAccessDPR = currentUser.role !== 'ACCOUNTANT' && currentUser.role !== 'WORKER';
  const canAccessMaterials = currentUser.role !== 'ACCOUNTANT' && currentUser.role !== 'WORKER';
  const canAccessSafety = currentUser.role !== 'ACCOUNTANT';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={(user) => {
          setCurrentUser(user);
          // If switching to worker, auto navigate to dashboard which renders WorkerPortal
          setActiveTab('dashboard');
        }}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          setActiveTab('dashboard');
        }}
        language={language}
        onSelectLanguage={(lang) => setLanguage(lang)}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        offlineQueue={offlineQueue}
        offlineQueueCount={offlineQueue.length}
        onSyncQueue={handleToggleOnline}
        onOpenRbacInfoModal={() => setShowRbacModal(true)}
        onOpenRbacModal={() => setShowRbacModal(true)}
        onOpenWhatsAppModal={() => setShowWhatsAppModal(true)}
        onOpenTallyModal={() => setShowTallyModal(true)}
      />

      {/* Role Navigation Secondary Bar (hidden for Worker to maintain clean mobile-first UI) */}
      {currentUser.role !== 'WORKER' && (
        <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t('nav_dashboard')}
            </button>

            {canAccessCRM && (
              <button
                onClick={() => setActiveTab('crm')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'crm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('nav_client')}
              </button>
            )}

            {canAccessCRM && (
              <button
                onClick={() => setActiveTab('work_orders')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'work_orders'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('nav_work_orders')}
              </button>
            )}

            {canAccessFinancials && (
              <button
                onClick={() => setActiveTab('financials')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'financials'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {currentUser.role === 'SUBCONTRACTOR' ? 'My Invoices' : t('nav_invoices')}
              </button>
            )}

            {canAccessTasks && (
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'tasks'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('nav_tasks')}
              </button>
            )}

            {canAccessAttendance && (
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'attendance'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('nav_attendance')}
              </button>
            )}

            {canAccessDPR && (
              <button
                onClick={() => setActiveTab('dpr')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'dpr'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('nav_dpr')}
              </button>
            )}

            {canAccessMaterials && (
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'materials'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('nav_materials')}
              </button>
            )}

            {canAccessSafety && (
              <button
                onClick={() => setActiveTab('safety')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'safety'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {t('nav_safety')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && renderDashboard()}

        {activeTab === 'crm' && (
          <ClientDossier
            client={MMIL_CLIENT}
            workOrders={visibleWorkOrders}
            currentUser={currentUser}
            onSelectWorkOrder={() => setActiveTab('work_orders')}
          />
        )}

        {activeTab === 'work_orders' && (
          <ContractsWorkOrders
            workOrders={visibleWorkOrders}
            currentUser={currentUser}
            onAddWorkOrder={handleAddWorkOrder}
          />
        )}

        {activeTab === 'financials' && (
          <InvoicingPayments
            invoices={visibleInvoices}
            fieldBills={fieldBills}
            currentUser={currentUser}
            workOrders={visibleWorkOrders}
            onOpenTallyModal={() => setShowTallyModal(true)}
            onAddInvoice={handleAddInvoice}
            onAddExpenseBill={handleAddExpenseBill}
            onUpdateExpenseBillStatus={handleUpdateExpenseBillStatus}
            onDeleteExpenseBill={handleDeleteExpenseBill}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManagement
            tasks={visibleTasks}
            workOrders={visibleWorkOrders}
            currentUser={currentUser}
            onAddTask={handleAddTask}
            onUpdateTaskProgress={handleUpdateTaskProgress}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTracker
            attendance={visibleAttendance}
            currentUser={currentUser}
            onMarkAttendance={handleMarkAttendance}
            language={language}
          />
        )}

        {activeTab === 'dpr' && (
          <DailyProgressReports
            dprReports={dprReports}
            workOrders={visibleWorkOrders}
            currentUser={currentUser}
            onAddDpr={handleAddDpr}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'materials' && (
          <MaterialTracker
            materials={visibleMaterials}
            workOrders={visibleWorkOrders}
            currentUser={currentUser}
            onAddMaterialIndent={handleAddMaterialIndent}
            onApproveIndent={handleApproveIndent}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyQuality
            snags={snags}
            workOrders={visibleWorkOrders}
            currentUser={currentUser}
            onAddSnag={handleAddSnag}
            onResolveSnag={handleResolveSnag}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Sethu Engineering Works</strong> — MMIL Vizianagaram Plant Turnkey CRM + FSM System
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Active User: {currentUser.name} ({currentUser.role}) | Scope: {currentUser.scopeType}
          </span>
        </div>
      </footer>

      {/* Interactive Feature Modals */}
      {showRbacModal && (
        <RbacInfoModal
          currentUser={currentUser}
          onClose={() => setShowRbacModal(false)}
        />
      )}

      {showWhatsAppModal && (
        <WhatsAppDigestModal
          currentUser={currentUser}
          workOrders={visibleWorkOrders}
          tasks={visibleTasks}
          attendance={visibleAttendance}
          invoices={visibleInvoices}
          snags={snags}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}

      {showTallyModal && (
        <TallyExportModal
          invoices={invoices}
          clientGstin={MMIL_CLIENT.gstin}
          clientName={MMIL_CLIENT.companyName}
          onClose={() => setShowTallyModal(false)}
        />
      )}
    </div>
  );
}
