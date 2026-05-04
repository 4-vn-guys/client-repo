export type ProductCategory = 'equipment' | 'beverages' | 'accessories';

export interface CatalogProduct {
  id: string;
  branchId: string;
  name: string;
  /** Stable code for imports (optional); distinct SKUs keep brands separate */
  sku?: string | null;
  description: string | null;
  category: ProductCategory;
  unitPrice: number;
  isActive: boolean;
  stockOnHand?: number;
  stockReserved?: number;
  /** Server-computed: on_hand − reserved */
  available?: number;
  lowStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoodsOrderItem {
  id: string;
  goodsOrderId: string;
  productId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface GoodsOrder {
  id: string;
  branchId: string;
  userId: string;
  customerLabel: string | null;
  orderType: 'goods_only';
  fulfillmentType: 'immediate' | 'pickup';
  status: string;
  statusPayment: string;
  totalPrice: number;
  note: string | null;
  invoiceCode: string;
  items?: GoodsOrderItem[];
  createdAt?: string;
  updatedAt?: string;
}
