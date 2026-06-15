import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// ── Types ──

export type PlatformStats = {
  totalTenants: number;
  activePlayers: number;
  mrr: string;
  moduleAttachRate: string;
  bookings24h: number;
  avgOnboardingMin: string;
};

export type TenantSummary = {
  id: string;
  name: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  modules: number;
  bookingsPerDay: number;
  mrr: string;
  healthScore: number;
  color: string;
  initials: string;
};

export type PlatformModule = {
  id: string;
  name: string;
  description: string;
  priceMonthlyVnd: number;
  category: string;
  installedCount: number;
  isBestSeller: boolean;
  isEnterprise: boolean;
  active: boolean;
  iconName: string;
  color: string;
};

export type RbacRole = {
  name: string;
  count: number;
};

export type RbacPermission = {
  label: string;
  group: string;
  access: Array<1 | 0 | 'partial' | 'self'>;
};

export type RbacMatrix = {
  roles: RbacRole[];
  groups: Array<{
    name: string;
    permissions: RbacPermission[];
  }>;
};

export type AuditEvent = {
  severity: 'info' | 'warn' | 'crit';
  actor: string;
  tenant: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  relativeTime: string;
};

export type AuditStats = {
  events24h: string;
  concurrencySaves: string;
  failedAuth: string;
  avgLockResolve: string;
};

export type InvoiceItem = {
  id: string;
  tenant: string;
  plan: string;
  amount: string;
  status: 'paid' | 'due' | 'failed';
  date: string;
};

export type BillingStats = {
  mrr: string;
  collections: string;
  pastDue: string;
  churnRisk: string;
};

export type DunningRule = {
  label: string;
  value: string;
};

export type MeteredUsage = {
  label: string;
  value: string;
  color: string;
};

export type ConcurrencyTenant = {
  name: string;
  locks: number;
  p99: number;
  doubleBookings: number;
  mode: 'strict' | 'lenient';
  color: string;
  initials: string;
};

export type ConcurrencyStats = {
  locks24h: string;
  avgResolve: string;
  conflictsStopped: string;
  doubleBookings: string;
};

export type GlobalPolicy = {
  label: string;
  value: string;
};

// ── API Functions ──

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const res = await axiosInstance.get<ApiResponse<PlatformStats>>('/admin/platform/stats');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch platform stats');
  return res.data.data;
}

export async function fetchTopTenants(): Promise<TenantSummary[]> {
  const res = await axiosInstance.get<ApiResponse<TenantSummary[]>>('/admin/platform/tenants');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch tenants');
  return res.data.data;
}

export async function fetchModules(): Promise<PlatformModule[]> {
  const res = await axiosInstance.get<ApiResponse<PlatformModule[]>>('/admin/platform/modules');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch modules');
  return res.data.data;
}

export async function fetchRbacMatrix(): Promise<RbacMatrix> {
  const res = await axiosInstance.get<ApiResponse<RbacMatrix>>('/admin/platform/rbac/matrix');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch RBAC matrix');
  return res.data.data;
}

export async function fetchAuditLogs(): Promise<{
  stats: AuditStats;
  events: AuditEvent[];
}> {
  const res = await axiosInstance.get<ApiResponse<{ stats: AuditStats; events: AuditEvent[] }>>('/admin/platform/audit/logs');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch audit logs');
  return res.data.data;
}

export async function fetchBillingData(): Promise<{
  stats: BillingStats;
  invoices: InvoiceItem[];
  dunningRules: DunningRule[];
  meteredUsage: MeteredUsage[];
}> {
  const res = await axiosInstance.get<ApiResponse<{
    stats: BillingStats;
    invoices: InvoiceItem[];
    dunningRules: DunningRule[];
    meteredUsage: MeteredUsage[];
  }>>('/admin/platform/billing');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch billing data');
  return res.data.data;
}

export async function fetchConcurrencyData(): Promise<{
  stats: ConcurrencyStats;
  tenants: ConcurrencyTenant[];
  globalPolicy: GlobalPolicy[];
  observability: GlobalPolicy[];
}> {
  const res = await axiosInstance.get<ApiResponse<{
    stats: ConcurrencyStats;
    tenants: ConcurrencyTenant[];
    globalPolicy: GlobalPolicy[];
    observability: GlobalPolicy[];
  }>>('/admin/platform/concurrency');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch concurrency data');
  return res.data.data;
}

export type CatalogModule = {
  id: string;
  name: string;
  category: string | null;
  isEnterprise: boolean;
};

export type CatalogRole = {
  id: string;
  name: string;
  isSystem: boolean;
  inheritsFrom: string | null;
};

export type CatalogPermission = {
  key: string;
  groupName: string;
  label: string;
  requiredModule: string | null;
};

export async function fetchCatalogModules(): Promise<CatalogModule[]> {
  const res = await axiosInstance.get<ApiResponse<CatalogModule[]>>(
    '/admin/platform/catalog/modules',
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch modules');
  return res.data.data;
}

export async function fetchCatalogRoles(): Promise<CatalogRole[]> {
  const res = await axiosInstance.get<ApiResponse<CatalogRole[]>>(
    '/admin/platform/catalog/roles',
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch roles');
  return res.data.data;
}

export async function fetchCatalogPermissions(): Promise<CatalogPermission[]> {
  const res = await axiosInstance.get<ApiResponse<CatalogPermission[]>>(
    '/admin/platform/catalog/permissions',
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch permissions');
  return res.data.data;
}

export type TableRowsData = {
  columns: string[];
  rows: Record<string, unknown>[];
};

export async function fetchPlatformTables(): Promise<string[]> {
  const res = await axiosInstance.get<ApiResponse<string[]>>('/admin/platform/tables');
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch platform tables');
  return res.data.data;
}

export async function fetchPlatformTableRows(tableName: string, search?: string): Promise<TableRowsData> {
  const res = await axiosInstance.get<ApiResponse<TableRowsData>>(`/admin/platform/tables/${tableName}`, {
    params: search ? { search } : undefined,
  });
  if (!res.data.success) throw new Error(res.data.message || `Failed to fetch rows for table ${tableName}`);
  return res.data.data;
}

// ── Mutations ──

export type OnboardTenantInput = {
  name: string;
  email: string;
  plan?: string;
};

export async function onboardTenant(input: OnboardTenantInput): Promise<{ id: string; name: string; email: string; plan: string; createdAt: string }> {
  const res = await axiosInstance.post<ApiResponse<{ id: string; name: string; email: string; plan: string; createdAt: string }>>(
    '/admin/platform/tenants',
    input,
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to onboard tenant');
  return res.data.data;
}

export type UpdateModuleInput = {
  id: string;
  priceMonthlyVnd?: number;
  active?: boolean;
  isBestSeller?: boolean;
};

export async function updateModule({ id, ...patch }: UpdateModuleInput): Promise<PlatformModule | null> {
  const res = await axiosInstance.patch<ApiResponse<PlatformModule | null>>(`/admin/platform/modules/${id}`, patch);
  if (!res.data.success) throw new Error(res.data.message || 'Failed to update module');
  return res.data.data;
}

export type UpdateRbacCellInput = {
  group: string;
  label: string;
  roleIndex: number;
  value: 1 | 0 | 'partial' | 'self';
};

export async function updateRbacCell(input: UpdateRbacCellInput): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<null>>('/admin/platform/rbac/cell', input);
  if (!res.data.success) throw new Error(res.data.message || 'Failed to update RBAC cell');
}

export type AddCustomRoleInput = {
  name: string;
  inheritFrom?: string;
  description?: string;
};

export async function addCustomRole(input: AddCustomRoleInput): Promise<RbacMatrix> {
  const res = await axiosInstance.post<ApiResponse<RbacMatrix>>('/admin/platform/rbac/roles', input);
  if (!res.data.success) throw new Error(res.data.message || 'Failed to add role');
  return res.data.data;
}

export type ModuleOrderStatus =
  | 'pending_payment'
  | 'awaiting_confirmation'
  | 'active'
  | 'rejected'
  | 'cancelled';

export type AdminModuleOrder = {
  id: string;
  moduleId: string;
  moduleName: string;
  priceVndSnapshot: number;
  channel: string;
  transferRef: string;
  status: ModuleOrderStatus;
  reason?: string;
  createdAt: string;
  activatedAt?: string;
  owner: {
    id: string;
    username: string | null;
    email: string | null;
  };
};

export async function fetchModuleOrders(status?: ModuleOrderStatus): Promise<AdminModuleOrder[]> {
  const res = await axiosInstance.get<ApiResponse<AdminModuleOrder[]>>('/admin/platform/module-orders', {
    params: status ? { status } : undefined,
  });
  if (!res.data.success) throw new Error(res.data.message || 'Failed to fetch module orders');
  return res.data.data;
}

export async function confirmModuleOrder(orderId: string): Promise<AdminModuleOrder> {
  const res = await axiosInstance.post<ApiResponse<AdminModuleOrder>>(
    `/admin/platform/module-orders/${orderId}/confirm`,
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to confirm order');
  return res.data.data;
}

export type RejectModuleOrderInput = {
  orderId: string;
  reason: string;
};

export async function rejectModuleOrder({ orderId, reason }: RejectModuleOrderInput): Promise<AdminModuleOrder> {
  const res = await axiosInstance.post<ApiResponse<AdminModuleOrder>>(
    `/admin/platform/module-orders/${orderId}/reject`,
    { reason },
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to reject order');
  return res.data.data;
}

export type CreateCreditInput = {
  tenant: string;
  amount: string;
  reason?: string;
};

export async function createCredit(input: CreateCreditInput): Promise<{ id: string; tenant: string; amount: string; reason?: string; createdAt: string }> {
  const res = await axiosInstance.post<ApiResponse<{ id: string; tenant: string; amount: string; reason?: string; createdAt: string }>>(
    '/admin/platform/billing/credits',
    input,
  );
  if (!res.data.success) throw new Error(res.data.message || 'Failed to create credit');
  return res.data.data;
}

export async function updateDunningRules(rules: DunningRule[]): Promise<DunningRule[]> {
  const res = await axiosInstance.patch<ApiResponse<DunningRule[]>>('/admin/platform/billing/dunning', { rules });
  if (!res.data.success) throw new Error(res.data.message || 'Failed to update dunning rules');
  return res.data.data;
}

export async function downloadBillingCsv(): Promise<Blob> {
  const res = await axiosInstance.get('/admin/platform/billing/export', { responseType: 'blob' });
  return res.data as Blob;
}

export async function updateGlobalPolicy(policy: GlobalPolicy[]): Promise<GlobalPolicy[]> {
  const res = await axiosInstance.patch<ApiResponse<GlobalPolicy[]>>('/admin/platform/concurrency/policy', { policy });
  if (!res.data.success) throw new Error(res.data.message || 'Failed to update policy');
  return res.data.data;
}

export type TenantOverrideInput = {
  name: string;
  mode: 'strict' | 'lenient';
  reservationTtlSeconds?: number;
};

export async function setTenantOverride({ name, ...rest }: TenantOverrideInput): Promise<void> {
  const res = await axiosInstance.patch<ApiResponse<null>>(`/admin/platform/concurrency/tenants/${encodeURIComponent(name)}`, rest);
  if (!res.data.success) throw new Error(res.data.message || 'Failed to set tenant override');
}

export type SimulationInput = {
  bookingsPerSecond?: number;
  durationSeconds?: number;
};

export type SimulationResult = {
  summary: string;
  locks: number;
  contention: string;
  doubleBookings: number;
  p99Ms: number;
  successRate: string;
};

export async function runConcurrencySimulation(input: SimulationInput): Promise<SimulationResult> {
  const res = await axiosInstance.post<ApiResponse<SimulationResult>>('/admin/platform/concurrency/simulate', input);
  if (!res.data.success) throw new Error(res.data.message || 'Simulation failed');
  return res.data.data;
}

