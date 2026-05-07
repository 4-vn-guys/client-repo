import axios from 'axios';
import { axiosInstance } from '@/shared/lib/axios';
import type {
  CatalogProduct,
  GoodsOrder,
  ProductCategory,
} from '../model/types';

type ApiOk<T> = { success: boolean; data: T; message?: string };

export type CreateBranchProductPayload = {
  branchId: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  sku?: string | null;
  description?: string | null;
  initialStock?: number;
};

export type UpdateBranchProductPayload = {
  branchId: string;
  productId: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  sku?: string | null;
  description?: string | null;
};

export type DeleteBranchProductPayload = {
  branchId: string;
  productId: string;
};

export type ProShopImportResult = {
  created: number;
  updated: number;
  errors: Array<{ row: number; message: string }>;
};

export async function fetchBranchProducts(
  branchId: string
): Promise<CatalogProduct[]> {
  const response = await axiosInstance.get<ApiOk<CatalogProduct[]>>(
    `/products/branch/${branchId}`
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to load catalog');
  }
  return response.data.data;
}

export async function createBranchProduct(
  payload: CreateBranchProductPayload
): Promise<CatalogProduct> {
  const response = await axiosInstance.post<ApiOk<CatalogProduct>>(
    '/products',
    payload
  );
  if (!response.data.success || response.data.data === undefined) {
    throw new Error(response.data.message || 'Failed to create product');
  }
  return response.data.data;
}

export async function updateBranchProduct(
  payload: UpdateBranchProductPayload
): Promise<CatalogProduct> {
  const { productId, ...body } = payload;
  const response = await axiosInstance.patch<ApiOk<CatalogProduct>>(
    `/products/${productId}`,
    body
  );
  if (!response.data.success || response.data.data === undefined) {
    throw new Error(response.data.message || 'Failed to update product');
  }
  return response.data.data;
}

export async function deleteBranchProduct(
  payload: DeleteBranchProductPayload
): Promise<void> {
  const { productId, branchId } = payload;
  try {
    const response = await axiosInstance.delete<
      ApiOk<{ id: string; deactivated: true }>
    >(`/products/${productId}`, { data: { branchId } });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to remove product');
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const d = e.response?.data as
        | { error?: { message?: string }; message?: string }
        | undefined;
      const msg = d?.error?.message ?? d?.message;
      if (msg) throw new Error(msg);
    }
    throw e instanceof Error ? e : new Error('Failed to remove product');
  }
}

export async function downloadProShopImportTemplate(
  branchId: string
): Promise<void> {
  const response = await axiosInstance.get(
    `/products/branch/${branchId}/import-template`,
    {
      responseType: 'blob',
    }
  );
  const blob =
    response.data instanceof Blob
      ? response.data
      : new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pro-shop-import-template.xlsx';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProShopExcel(
  branchId: string,
  file: File
): Promise<ProShopImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post<ApiOk<ProShopImportResult>>(
    `/products/branch/${branchId}/import`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  if (!response.data.success || response.data.data === undefined) {
    throw new Error(response.data.message || 'Import failed');
  }
  return response.data.data;
}

export type CreateGoodsOrderPayload = {
  branchId: string;
  fulfillmentType: 'immediate' | 'pickup';
  items: Array<{ productId: string; quantity: number }>;
  note?: string;
  customerLabel?: string;
  statusPayment?: 'paid' | 'unpaid';
};

export async function createGoodsOrder(
  payload: CreateGoodsOrderPayload
): Promise<GoodsOrder> {
  const response = await axiosInstance.post<ApiOk<GoodsOrder>>(
    '/goods-orders/',
    payload
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to create order');
  }
  return response.data.data;
}

export async function fetchGoodsOrdersByBranch(
  branchId: string
): Promise<GoodsOrder[]> {
  const response = await axiosInstance.get<ApiOk<GoodsOrder[]>>(
    `/goods-orders/branch/${branchId}`
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to load orders');
  }
  return response.data.data;
}
