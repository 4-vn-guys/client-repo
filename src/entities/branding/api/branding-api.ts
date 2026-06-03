import { axiosInstance } from '@/shared/lib/axios';

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export type BrandingConfig = {
  branchId: string;
  displayName: string | null;
  subdomain: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  logoUrl: string | null;
};

export type TemplateKind =
  | 'booking_confirmed'
  | 'cancellation'
  | 'slot_relisted'
  | 'match_invite';

export type TemplateChannel = 'email' | 'sms' | 'push' | 'zalo';

export type NotificationTemplate = {
  branchId: string;
  kind: TemplateKind;
  channels: TemplateChannel[];
  subjectEn: string | null;
  subjectVi: string | null;
  bodyEn: string | null;
  bodyVi: string | null;
};

export async function fetchBranding(branchId: string): Promise<BrandingConfig> {
  const res = await axiosInstance.get<ApiResponse<BrandingConfig>>(
    `/branding/branches/${branchId}`,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load branding');
  }
  return res.data.data;
}

export type UpdateBrandingInput = {
  branchId: string;
  displayName?: string;
  subdomain?: string | null;
  primaryColor?: string;
  accentColor?: string;
  logoUrl?: string | null;
};

export async function updateBranding({
  branchId,
  ...patch
}: UpdateBrandingInput): Promise<BrandingConfig> {
  const res = await axiosInstance.patch<ApiResponse<BrandingConfig>>(
    `/branding/branches/${branchId}`,
    patch,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to update branding');
  }
  return res.data.data;
}

export async function fetchBrandingTemplates(
  branchId: string,
): Promise<NotificationTemplate[]> {
  const res = await axiosInstance.get<ApiResponse<NotificationTemplate[]>>(
    `/branding/branches/${branchId}/templates`,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to load templates');
  }
  return res.data.data;
}

export type UpsertTemplateInput = {
  branchId: string;
  kind: TemplateKind;
  channels?: TemplateChannel[];
  subjectEn?: string;
  subjectVi?: string;
  bodyEn?: string;
  bodyVi?: string;
};

export async function upsertBrandingTemplate({
  branchId,
  kind,
  ...patch
}: UpsertTemplateInput): Promise<NotificationTemplate> {
  const res = await axiosInstance.put<ApiResponse<NotificationTemplate>>(
    `/branding/branches/${branchId}/templates/${kind}`,
    patch,
  );
  if (!res.data.success) {
    throw new Error(res.data.message || 'Failed to save template');
  }
  return res.data.data;
}
