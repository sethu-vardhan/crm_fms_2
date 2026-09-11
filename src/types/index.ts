export type UserRole =
  | 'OWNER'
  | 'HOD'
  | 'ACCOUNTANT'
  | 'SUPERVISOR'
  | 'SUBCONTRACTOR'
  | 'WORKER';

export type ScopeType =
  | 'COMPANY'
  | 'DEPARTMENT'
  | 'SITE'
  | 'SUBCONTRACT'
  | 'SELF';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  designation: string;
  phone: string;
  email: string;
  avatar: string;
  scopeType: ScopeType;
  department?: string;
  assignedSiteId?: string;
  assignedSiteName?: string;
  subcontractorOrgId?: string;
  subcontractorOrgName?: string;
}

export type LanguageCode = 'en' | 'te' | 'hi';

export interface ClientProfile {
  id: string;
  companyName: string;
  shortName: string;
  plantLocation: string;
  industrialZone: string;
  gstin: string;
  keyContacts: {
    name: string;
    designation: string;
    phone: string;
    email: string;
  }[];
  totalContractsValue: number;
  activeContractsCount: number;
  notes: string;
}

export interface ContractDocument {
  id: string;
  title: string;
  type: 'PO' | 'DRAWING' | 'BOQ' | 'SAFETY_CERT' | 'INSURANCE';
  referenceNo: string;
  fileSize: string;
  uploadedAt: string;
  downloadUrl?: string;
}

export interface PaymentMilestone {
  id: string;
  title: string;
  percentage: number;
  amount: number;
  status: 'PENDING' | 'RAISED' | 'APPROVED' | 'PAID' | 'OVERDUE';
  dueDate: string;
  paidDate?: string;
  invoiceNo?: string;
  retentionWithheld?: number;
}

export interface WorkOrder {
  id: string;
  workOrderNo: string;
  title: string;
  department: string;
  siteId: string;
  siteName: string;
  clientId: string;
  clientName: string;
  contractValue: number; // ₹ (Visible only to Owner, HOD, Accountant)
  estimatedCost: number; // ₹
  actualCostIncurred: number; // ₹
  status: 'DRAFT' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
  progressPercentage: number;
  startDate: string;
  targetCompletionDate: string;
  description: string;
  scopeOfWork: string[];
  documents: ContractDocument[];
  milestones: PaymentMilestone[];
}

export interface TaskItem {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  siteId: string;
  siteName: string;
  title: string;
  stage: 'Foundation & Anchors' | 'Structure Erection' | 'Welding & Assembly' | 'Alignment & Leveling' | 'Testing & NDT';
  assignedToRole: 'SUPERVISOR' | 'SUBCONTRACTOR' | 'WORKER';
  assignedSupervisorId?: string;
  assignedSupervisorName?: string;
  assignedSubcontractorId?: string;
  assignedSubcontractorName?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
  plannedDays: number;
  completionPercentage: number;
  dueDate: string;
  steelWeightMT?: number; // Metric tonnes of steel
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  workerId: string;
  workerName: string;
  roleType: 'FITTER' | 'RIGGER' | 'WELDER' | 'HELPER' | 'SUPERVISOR';
  siteId: string;
  siteName: string;
  subcontractorOrg?: string;
  status: 'PRESENT' | 'HALF_DAY' | 'OVERTIME' | 'ABSENT';
  overtimeHours?: number;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    landmark: string;
    verifiedGeofence: boolean;
  };
  checkInTime?: string;
  checkOutTime?: string;
  markedBy: 'SELF_GPS' | 'SUPERVISOR_BATCH';
  markedByName: string;
}

export interface DailyProgressReport {
  id: string;
  date: string;
  siteId: string;
  siteName: string;
  workOrderId: string;
  workOrderTitle: string;
  supervisorId?: string;
  supervisorName: string;
  shift: 'DAY' | 'NIGHT' | 'GENERAL';
  manpowerPresent: number;
  tonnageErectedMT: number;
  totalJointsWelded?: number;
  jointsWelded?: number;
  weatherCondition?: string;
  equipmentDeployed?: string[];
  safetyMeetingHeld?: boolean;
  summary: string;
  delaysOrBottlenecks?: string;
  photos: {
    id: string;
    caption: string;
    imageUrl?: string;
    url?: string;
    timestamp: string;
  }[];
  offlineCreated?: boolean;
}

export interface MaterialIndent {
  id: string;
  indentNo?: string;
  siteId: string;
  siteName: string;
  workOrderId: string;
  workOrderTitle: string;
  itemName: string;
  category: 'STRUCTURAL_STEEL' | 'FASTENERS' | 'CONSUMABLES' | 'EQUIPMENT_CRANE' | 'STEEL_SECTIONS' | 'MACHINERY';
  specification?: string;
  quantityRequested: number;
  quantityDelivered?: number;
  unit: string;
  requestedByRole?: 'SUPERVISOR' | 'SUBCONTRACTOR';
  requestedByName?: string;
  requestedBy?: string;
  subcontractorScope?: string;
  purpose?: string;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'REQUESTED' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED_AT_SITE' | 'DELIVERED' | 'CONSUMED';
  requestedDate?: string;
  requestDate?: string;
  requiredByDate?: string;
  stockRemainingAtYard?: number;
  stockRemainingAtSite?: number;
}

export interface SafetyCheckItem {
  id: string;
  siteId: string;
  siteName: string;
  date: string;
  type: 'TOOLBOX_TALK' | 'HOT_WORK_PERMIT' | 'PPE_COMPLIANCE' | 'HEIGHT_WORK_PERMIT';
  conductedBy: string;
  workersAttendedCount: number;
  checkedItems: {
    checkName: string;
    passed: boolean;
  }[];
  notes: string;
  status: 'PASSED' | 'WARNING_ISSUED' | 'HALTED';
}

export interface SnagIssue {
  id: string;
  siteId?: string;
  siteName?: string;
  workOrderId: string;
  title: string;
  description: string;
  location?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  raisedBy: string;
  assignedTo: string;
  status: 'OPEN' | 'IN_REPAIR' | 'RESOLVED' | 'VERIFIED';
  photoUrl?: string;
  dateReported?: string;
  createdAt?: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  workOrderId: string;
  workOrderTitle: string;
  billType: 'ADVANCE' | 'RA_BILL_1' | 'RA_BILL_2' | 'RA_BILL_3' | 'FINAL_BILL';
  date: string;
  dueDate: string;
  basicAmount: number;
  gstRate: number; // 18% for construction / fabrication works contracts
  gstAmount: number;
  retentionRate: number; // typically 5% withheld until DLP
  retentionAmount: number;
  netPayable: number;
  paidAmount: number;
  balanceDue: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  daysOverdue: number;
  subcontractorBill?: boolean;
  subcontractorName?: string;
}

export interface ExpenseLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface FieldExpenseBill {
  id: string;
  billNumber: string;
  merchantName: string;
  merchantGstin?: string;
  date: string;
  category:
    | 'Consumables & Hardware'
    | 'Welding Rods & Gas'
    | 'Tools & Equipment'
    | 'Safety PPE'
    | 'Fuel & Transport'
    | 'Site Food & Tea'
    | 'Crane & Machinery'
    | 'Emergency Plant Spares'
    | 'General Site Expense';
  items: ExpenseLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Company Account';
  paidByUserId: string;
  paidByName: string;
  paidByRole: UserRole;
  workOrderId: string;
  workOrderTitle: string;
  siteId: string;
  siteName: string;
  receiptPhotoUrl?: string;
  ocrExtracted: boolean;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REIMBURSED' | 'REJECTED';
  reimbursedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface CommunicationLog {
  id: string;
  date: string;
  contactPerson: string;
  organization: string;
  channel: 'SITE_VISIT' | 'PHONE_CALL' | 'EMAIL' | 'TECHNICAL_MEETING';
  summary: string;
  actionItem: string;
  loggedBy: string;
}

export interface OfflineQueueItem {
  id: string;
  timestamp: string;
  actionType: 'ATTENDANCE_MARK' | 'DPR_SUBMIT' | 'MATERIAL_INDENT' | 'SNAG_RAISE';
  title: string;
  payload: any;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface OfflineActionItem {
  id: string;
  actionType: string;
  payload: any;
  timestamp: string;
  synced: boolean;
}
