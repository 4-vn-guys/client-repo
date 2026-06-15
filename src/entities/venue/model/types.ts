export interface Branch {
  id: string;
  name: string;
  address: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  policy?: string;
  policyFileId?: string;
  policyFile?: UploadedFile;
  hotline?: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
  courts?: BranchCourt[];
  depositEnabled?: boolean;
  depositType?: 'percent' | 'fixed';
  depositValue?: number;
  /** Null/undefined = use server default minutes for deposit transfer window */
  depositHoldMinutes?: number | null;
  /** Set on GET /branches/owner: how the current user can access this branch. */
  accessVia?: 'owner' | 'staff';
}

export interface BranchCourt {
  id: string;
  name: string;
  branchId: string;
  surfaceType: string;
  defaultHourlyRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bookings: [];
}

export type CreateBranchDto = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  policy?: string;
  policyFileId?: string;
  hotline?: string;
  depositEnabled?: boolean;
  depositType?: 'percent' | 'fixed';
  depositValue?: number;
  depositHoldMinutes?: number | null;
};

export type UpdateBranchDto = Partial<
  Pick<
    CreateBranchDto,
    | 'name'
    | 'address'
    | 'latitude'
    | 'longitude'
    | 'openTime'
    | 'closeTime'
    | 'policy'
    | 'policyFileId'
    | 'hotline'
    | 'depositEnabled'
    | 'depositType'
    | 'depositValue'
    | 'depositHoldMinutes'
  >
>;

export type BranchDepositRevenueResponse = {
  branchId: string;
  policy: {
    depositEnabled: boolean;
    depositType: 'percent' | 'fixed';
    depositValue: number;
    depositHoldMinutes: number | null;
    effectiveDepositHoldMinutes: number;
  };
  summary: {
    depositsCollected: number;
    balanceCollected: number;
    fullCollected: number;
    pendingDeposits: number;
    pendingBalance: number;
    pendingFull: number;
  };
};

export type UploadedFile = {
  id: string;
  url: string;
  fileType: string;
  fileName: string;
};
