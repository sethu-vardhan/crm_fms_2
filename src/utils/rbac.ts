import { AppUser, UserRole, WorkOrder, TaskItem, MaterialIndent, InvoiceRecord, AttendanceRecord } from '../types';

export const PERMISSIONS = {
  VIEW_ALL_JOBS: 'VIEW_ALL_JOBS',
  VIEW_CONTRACT_VALUES: 'VIEW_CONTRACT_VALUES',
  CREATE_EDIT_WORK_ORDERS: 'CREATE_EDIT_WORK_ORDERS',
  TASK_ASSIGNMENT: 'TASK_ASSIGNMENT',
  ATTENDANCE_MARKING: 'ATTENDANCE_MARKING',
  MATERIAL_REQUESTS: 'MATERIAL_REQUESTS',
  INVOICING_PAYMENTS: 'INVOICING_PAYMENTS',
  PAYROLL: 'PAYROLL',
  SAFETY_CHECKLISTS: 'SAFETY_CHECKLISTS',
  REPORTS_DASHBOARD: 'REPORTS_DASHBOARD',
  EXPORT_TALLY: 'EXPORT_TALLY',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  switch (role) {
    case 'OWNER':
      return true; // Owner has omni-access
    case 'HOD':
      // HOD can do all project & field supervision, view contract values, but cannot approve payroll/Tally export
      return [
        'VIEW_ALL_JOBS',
        'VIEW_CONTRACT_VALUES',
        'CREATE_EDIT_WORK_ORDERS',
        'TASK_ASSIGNMENT',
        'ATTENDANCE_MARKING',
        'MATERIAL_REQUESTS',
        'INVOICING_PAYMENTS', // view only
        'SAFETY_CHECKLISTS',
        'REPORTS_DASHBOARD',
      ].includes(permission);
    case 'ACCOUNTANT':
      // Accountant sees all financial data, invoices, payments, payroll, contract values, but no site tech/safety
      return [
        'VIEW_ALL_JOBS',
        'VIEW_CONTRACT_VALUES',
        'INVOICING_PAYMENTS',
        'PAYROLL',
        'REPORTS_DASHBOARD',
        'EXPORT_TALLY',
      ].includes(permission);
    case 'SUPERVISOR':
      // Supervisor controls their site tasks, attendance, material indents, safety, but 0% contract values
      return [
        'TASK_ASSIGNMENT',
        'ATTENDANCE_MARKING',
        'MATERIAL_REQUESTS',
        'SAFETY_CHECKLISTS',
        'REPORTS_DASHBOARD',
      ].includes(permission);
    case 'SUBCONTRACTOR':
      // Subcontractor only own crew tasks, crew attendance, own material requests, view own bills
      return [
        'TASK_ASSIGNMENT',
        'ATTENDANCE_MARKING',
        'MATERIAL_REQUESTS',
        'INVOICING_PAYMENTS', // view own only
        'SAFETY_CHECKLISTS',
        'REPORTS_DASHBOARD',
      ].includes(permission);
    case 'WORKER':
      // Worker only own tasks, self attendance, submit safety check
      return [
        'ATTENDANCE_MARKING', // self checkin
        'SAFETY_CHECKLISTS', // submit
      ].includes(permission);
    default:
      return false;
  }
}

/**
 * Filter work orders based on role and scope
 */
export function filterWorkOrders(orders: WorkOrder[], user: AppUser): WorkOrder[] {
  if (user.role === 'OWNER' || user.role === 'ACCOUNTANT') {
    return orders;
  }
  if (user.role === 'HOD') {
    return orders.filter(o => !user.department || o.department === user.department);
  }
  if (user.role === 'SUPERVISOR') {
    return orders.filter(o => o.siteId === user.assignedSiteId);
  }
  if (user.role === 'SUBCONTRACTOR') {
    // Show only the work order containing subcontractor's assigned scope
    return orders.filter(o => o.siteId === user.assignedSiteId);
  }
  if (user.role === 'WORKER') {
    return orders.filter(o => o.siteId === user.assignedSiteId);
  }
  return [];
}

/**
 * Filter tasks based on role and scope
 */
export function filterTasks(tasks: TaskItem[], user: AppUser): TaskItem[] {
  if (user.role === 'OWNER' || user.role === 'HOD' || user.role === 'ACCOUNTANT') {
    return tasks;
  }
  if (user.role === 'SUPERVISOR') {
    return tasks.filter(t => t.siteId === user.assignedSiteId);
  }
  if (user.role === 'SUBCONTRACTOR') {
    return tasks.filter(t => t.assignedSubcontractorId === user.subcontractorOrgId);
  }
  if (user.role === 'WORKER') {
    return tasks.filter(t => t.assignedWorkerId === user.id || t.assignedWorkerName === user.name);
  }
  return [];
}

/**
 * Filter material indents based on role and scope
 */
export function filterMaterialIndents(indents: MaterialIndent[], user: AppUser): MaterialIndent[] {
  if (user.role === 'OWNER' || user.role === 'HOD' || user.role === 'ACCOUNTANT') {
    return indents;
  }
  if (user.role === 'SUPERVISOR') {
    return indents.filter(i => i.siteId === user.assignedSiteId);
  }
  if (user.role === 'SUBCONTRACTOR') {
    return indents.filter(i => (i.requestedByName && i.requestedByName.includes(user.name)) || (i.subcontractorScope && i.subcontractorScope.includes(user.name)));
  }
  return [];
}

export const filterMaterials = filterMaterialIndents;

/**
 * Filter attendance records based on role and scope
 */
export function filterAttendance(records: AttendanceRecord[], user: AppUser): AttendanceRecord[] {
  if (user.role === 'OWNER' || user.role === 'HOD' || user.role === 'ACCOUNTANT') {
    return records;
  }
  if (user.role === 'SUPERVISOR') {
    return records.filter(a => a.siteId === user.assignedSiteId);
  }
  if (user.role === 'SUBCONTRACTOR') {
    return records.filter(a => a.subcontractorOrg?.includes(user.subcontractorOrgName || ''));
  }
  if (user.role === 'WORKER') {
    return records.filter(a => a.workerId === user.id || a.workerName === user.name);
  }
  return [];
}

/**
 * Filter invoices based on role and scope
 */
export function filterInvoices(invoices: InvoiceRecord[], user: AppUser): InvoiceRecord[] {
  if (user.role === 'OWNER' || user.role === 'HOD' || user.role === 'ACCOUNTANT') {
    return invoices;
  }
  if (user.role === 'SUBCONTRACTOR') {
    // Subcontractors only see their own billing
    return invoices.filter(inv => inv.subcontractorBill && inv.subcontractorName?.includes(user.subcontractorOrgName || ''));
  }
  return [];
}
