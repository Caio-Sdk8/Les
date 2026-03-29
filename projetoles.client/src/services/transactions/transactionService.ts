import api from "../requests/api";

export interface CheckoutItemPayload {
  productUuid: string;
  quantity: number;
}

export interface CheckoutSplitPaymentPayload {
  firstCardLabel?: string;
  secondCardLabel?: string;
  firstAmount?: number;
  secondAmount?: number;
  firstCardUuid?: string;
  secondCardUuid?: string;
}

export interface CheckoutPayload {
  items: CheckoutItemPayload[];
  paymentType: string;
  addressLabel: string;
  addressUuid?: string;
  couponCode: string;
  singleCardLabel?: string;
  singleCardUuid?: string;
  splitPayment?: CheckoutSplitPaymentPayload;
  prescriptionFileName?: string;
  prescriptionFileContentType?: string;
  prescriptionFileBase64?: string;
}

export interface CheckoutResponse {
  transactionUuid: string;
  transactionCode: string;
  status: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface TransactionItem {
  id?: number;
  uuid?: string;
  customerId: number;
  creditCardId?: number | null;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface OrderDetailItem {
  productUuid: string;
  productName: string;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionLabel: string;
}

export interface OrderDetail {
  transactionUuid: string;
  transactionCode: string;
  status: string;
  createdAt: string;
  description: string;
  paymentType: string;
  addressLabel: string;
  couponCode: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  prescriptionFileName?: string | null;
  prescriptionStatus: string;
  prescriptionNote?: string | null;
  items: OrderDetailItem[];
  afterSalesRequests: AfterSalesRequest[];
}

export type AfterSalesType = "TROCA" | "DEVOLUCAO";
export type AfterSalesStatus = "PENDENTE" | "APROVADA" | "REPROVADA";

export interface AfterSalesRequestItem {
  productUuid: string;
  productName: string;
  quantity: number;
}

export interface AfterSalesRequest {
  requestUuid: string;
  transactionUuid: string;
  transactionCode: string;
  type: AfterSalesType;
  status: AfterSalesStatus;
  reason: string;
  reviewNote?: string | null;
  requestedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  items: AfterSalesRequestItem[];
}

export interface TransactionsPagedResponse {
  items: TransactionItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PrescriptionReviewStatus = "PENDENTE" | "APROVADA" | "REPROVADA" | "REENVIO_SOLICITADO";

export interface PrescriptionReviewItem {
  id: number;
  transactionUuid: string;
  transactionCode: string;
  customerName: string;
  customerDocument: string;
  sentAt: string;
  fileName: string;
  status: PrescriptionReviewStatus;
  note: string;
  products: Array<{
    name: string;
    quantity: number;
    prescriptionLabel: string;
  }>;
}

export interface SalesPoint {
  period: string;
  label: string;
  quantity: number;
  revenue: number;
}

export interface SalesSeries {
  id: string;
  label: string;
  points: SalesPoint[];
}

export interface SalesCatalog {
  periods: Array<{ value: string; label: string }>;
  products: SalesSeries[];
  categories: SalesSeries[];
}

export interface PrescriptionFileResponse {
  fileName: string;
  contentType: string;
  base64: string;
}

export interface PrescriptionResubmissionPayload {
  prescriptionFileName: string;
  prescriptionFileContentType: string;
  prescriptionFileBase64: string;
  note?: string;
}

export interface CheckoutAddressOption {
  uuid: string;
  label: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  isActive: boolean;
}

export interface CheckoutCardOption {
  uuid: string;
  cardBrandName: string;
  maskedCardNumber: string;
  isPreferred: boolean;
  isActive: boolean;
}

export interface AfterSalesRequestCreatePayload {
  type: AfterSalesType;
  reason: string;
  items: Array<{
    productUuid: string;
    quantity: number;
  }>;
}

export const transactionService = {
  async getMyOrders(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<TransactionsPagedResponse> {
    const { data } = await api.get<TransactionsPagedResponse>("/api/transactions/my", {
      params,
    });
    return data;
  },

  async getOrders(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    customerUuid?: string;
  }): Promise<TransactionsPagedResponse> {
    const { data } = await api.get<TransactionsPagedResponse>("/api/transactions", {
      params,
    });
    return data;
  },

  async getOrderDetail(transactionUuid: string): Promise<OrderDetail> {
    const { data } = await api.get<OrderDetail>(`/api/transactions/${transactionUuid}`);
    return data;
  },

  async createAfterSalesRequest(
    transactionUuid: string,
    payload: AfterSalesRequestCreatePayload
  ): Promise<AfterSalesRequest> {
    const { data } = await api.post<AfterSalesRequest>(
      `/api/transactions/${transactionUuid}/after-sales-requests`,
      payload
    );
    return data;
  },

  async getAfterSalesRequests(params?: {
    status?: string;
    type?: string;
    requestedFrom?: string;
    requestedTo?: string;
  }): Promise<AfterSalesRequest[]> {
    const { data } = await api.get<AfterSalesRequest[]>("/api/transactions/after-sales-requests", {
      params,
    });
    return data;
  },

  async approveAfterSalesRequest(
    transactionUuid: string,
    requestUuid: string,
    note?: string
  ): Promise<void> {
    await api.patch(
      `/api/transactions/${transactionUuid}/after-sales-requests/${requestUuid}/approve`,
      { note: note ?? "" }
    );
  },

  async rejectAfterSalesRequest(
    transactionUuid: string,
    requestUuid: string,
    note?: string
  ): Promise<void> {
    await api.patch(
      `/api/transactions/${transactionUuid}/after-sales-requests/${requestUuid}/reject`,
      { note: note ?? "" }
    );
  },

  async checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    const { data } = await api.post<CheckoutResponse>("/api/transactions/checkout", payload);
    return data;
  },

  async getMyCheckoutAddresses(): Promise<CheckoutAddressOption[]> {
    const { data } = await api.get<CheckoutAddressOption[]>("/api/customers/me/addresses");
    return data;
  },

  async getMyCheckoutCards(): Promise<CheckoutCardOption[]> {
    const { data } = await api.get<CheckoutCardOption[]>("/api/customers/me/credit-cards");
    return data;
  },

  async getPrescriptionReviews(status?: PrescriptionReviewStatus): Promise<PrescriptionReviewItem[]> {
    const { data } = await api.get<PrescriptionReviewItem[]>("/api/transactions/prescriptions", {
      params: status ? { status } : undefined,
    });
    return data;
  },

  async approvePrescription(transactionUuid: string, note?: string): Promise<void> {
    await api.patch(`/api/transactions/prescriptions/${transactionUuid}/approve`, { note: note ?? "" });
  },

  async rejectPrescription(transactionUuid: string, note?: string): Promise<void> {
    await api.patch(`/api/transactions/prescriptions/${transactionUuid}/reject`, { note: note ?? "" });
  },

  async requestPrescriptionResubmission(transactionUuid: string, note?: string): Promise<void> {
    await api.patch(`/api/transactions/prescriptions/${transactionUuid}/request-resubmission`, {
      note: note ?? "",
    });
  },

  async getPrescriptionFile(transactionUuid: string): Promise<PrescriptionFileResponse> {
    const { data } = await api.get<PrescriptionFileResponse>(
      `/api/transactions/${transactionUuid}/prescription-file`
    );
    return data;
  },

  async resubmitPrescription(
    transactionUuid: string,
    payload: PrescriptionResubmissionPayload
  ): Promise<void> {
    await api.patch(`/api/transactions/${transactionUuid}/prescription-resubmission`, payload);
  },

  async getSalesCatalog(): Promise<SalesCatalog> {
    const { data } = await api.get<SalesCatalog>("/api/transactions/sales-catalog");
    return data;
  },
};
