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
  >
>;

export type BranchDepositRevenueResponse = {
  branchId: string;
  policy: {
    depositEnabled: boolean;
    depositType: 'percent' | 'fixed';
    depositValue: number;
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
