import api from "../requests/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export enum PrescriptionType {
  None = 0,
  TarjaAmarela = 1,
  TarjaVermelha = 2,
  TarjaPreta = 3,
}

export interface ProductSummary {
  uuid: string;
  productCode: string;
  name: string;
  activePrinciple?: string;
  imageUrl?: string;
  salePrice: number;
  prescriptionType: PrescriptionType;
  isActive: boolean;
  categories: string[];
  availableStock: number;
}

export interface ProductDetail extends ProductSummary {
  description?: string;
  barcode: string;
  heightCm?: number;
  widthCm?: number;
  depthCm?: number;
  weightGrams?: number;
  pricingGroupName: string;
  blockedStock: number;
}

export interface ProductFilter {
  search?: string;
  name?: string;
  activePrinciple?: string;
  barcode?: string;
  productCode?: string;
  categoryUuid?: string;
  prescriptionType?: PrescriptionType;
  isActive?: boolean;
  inStock?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Category {
  uuid: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface Supplier {
  uuid: string;
  name: string;
  cnpj: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
}

export interface StockEntry {
  uuid: string;
  productUuid: string;
  productName: string;
  supplierUuid: string;
  supplierName: string;
  quantity: number;
  costValue: number;
  entryDate: string;
  createdAt: string;
}

export interface StockEntryCreate {
  productUuid: string;
  supplierUuid: string;
  quantity: number;
  costValue: number;
  entryDate: string;
}

export interface ProductStock {
  productUuid: string;
  productName: string;
  availableQuantity: number;
  blockedQuantity: number;
  totalQuantity: number;
  lastUpdated: string;
}

export interface StockSummary {
  productUuid: string;
  productCode: string;
  productName: string;
  salePrice: number;
  availableQuantity: number;
  blockedQuantity: number;
}

export interface StockFilter {
  search?: string;
  productCode?: string;
  inStock?: boolean;
  categoryUuid?: string;
  page?: number;
  pageSize?: number;
}

export interface DrugInteractionAlert {
  productAUuid: string;
  productAName: string;
  productBUuid: string;
  productBName: string;
  description: string;
  severityLevel: number;
}

// ── Product API ───────────────────────────────────────────────────────────────

export const productService = {
  async getProducts(filter: ProductFilter = {}): Promise<PagedResult<ProductSummary>> {
    const params: Record<string, string | number | boolean> = {};
    if (filter.search) params.search = filter.search;
    if (filter.name) params.name = filter.name;
    if (filter.activePrinciple) params.activePrinciple = filter.activePrinciple;
    if (filter.barcode) params.barcode = filter.barcode;
    if (filter.productCode) params.productCode = filter.productCode;
    if (filter.categoryUuid) params.categoryUuid = filter.categoryUuid;
    if (filter.prescriptionType !== undefined) params.prescriptionType = filter.prescriptionType;
    if (filter.isActive !== undefined) params.isActive = filter.isActive;
    if (filter.inStock !== undefined) params.inStock = filter.inStock;
    if (filter.page) params.page = filter.page;
    if (filter.pageSize) params.pageSize = filter.pageSize;

    const { data } = await api.get<PagedResult<ProductSummary>>("/api/products", { params });
    return data;
  },

  async getProductByUuid(uuid: string): Promise<ProductDetail> {
    const { data } = await api.get<ProductDetail>(`/api/products/${uuid}`);
    return data;
  },

  async getSubstitutes(uuid: string): Promise<ProductSummary[]> {
    const { data } = await api.get<ProductSummary[]>(`/api/products/${uuid}/substitutes`);
    return data;
  },

  async checkDrugInteractions(productUuids: string[]): Promise<DrugInteractionAlert[]> {
    const { data } = await api.post<DrugInteractionAlert[]>("/api/products/drug-interactions", productUuids);
    return data;
  },
};

// ── Category API ──────────────────────────────────────────────────────────────

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/api/categories");
    return data;
  },
};

// ── Supplier API ──────────────────────────────────────────────────────────────

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const { data } = await api.get<Supplier[]>("/api/suppliers");
    return data;
  },
};

// ── Stock API ─────────────────────────────────────────────────────────────────

export const stockService = {
  async getStock(filter: StockFilter = {}): Promise<PagedResult<StockSummary>> {
    const params: Record<string, string | number | boolean> = {};
    if (filter.search) params.search = filter.search;
    if (filter.productCode) params.productCode = filter.productCode;
    if (filter.inStock !== undefined) params.inStock = filter.inStock;
    if (filter.categoryUuid) params.categoryUuid = filter.categoryUuid;
    if (filter.page) params.page = filter.page;
    if (filter.pageSize) params.pageSize = filter.pageSize;

    const { data } = await api.get<PagedResult<StockSummary>>("/api/stock", { params });
    return data;
  },

  async getStockByProduct(productUuid: string): Promise<ProductStock> {
    const { data } = await api.get<ProductStock>(`/api/stock/product/${productUuid}`);
    return data;
  },

  async getEntriesByProduct(productUuid: string): Promise<StockEntry[]> {
    const { data } = await api.get<StockEntry[]>(`/api/stock/product/${productUuid}/entries`);
    return data;
  },

  async registerEntry(entry: StockEntryCreate): Promise<StockEntry> {
    const { data } = await api.post<StockEntry>("/api/stock/entries", entry);
    return data;
  },
};
