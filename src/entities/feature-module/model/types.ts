export type ModuleCatalogStatus =
  | 'active'
  | 'tier'
  | 'pending'
  | 'locked'
  | 'enterprise';

export type ModuleOrderStatus =
  | 'pending_payment'
  | 'awaiting_confirmation'
  | 'active'
  | 'rejected'
  | 'cancelled';

export type ModuleOrderChannel = 'bank_transfer' | 'gateway';

export type FeatureCatalogModule = {
  id: string;
  name: string;
  description: string;
  category: string;
  priceMonthlyVnd: number;
  isBestSeller: boolean;
  isEnterprise: boolean;
  status: ModuleCatalogStatus;
  orderId?: string;
  orderStatus?: ModuleOrderStatus;
};

export type ModuleOrder = {
  id: string;
  moduleId: string;
  moduleName: string;
  priceVndSnapshot: number;
  channel: ModuleOrderChannel;
  transferRef: string;
  status: ModuleOrderStatus;
  reason?: string;
  createdAt: string;
  activatedAt?: string;
};

export function formatVnd(amount: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}₫`;
}
