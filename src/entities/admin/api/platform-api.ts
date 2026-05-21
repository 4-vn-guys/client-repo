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
  price: string;
  category: string;
  installedCount: number;
  isBestSeller: boolean;
  isEnterprise: boolean;
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
