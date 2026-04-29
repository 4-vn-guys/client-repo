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
};

export type UploadedFile = {
  id: string;
  url: string;
  fileType: string;
  fileName: string;
};
