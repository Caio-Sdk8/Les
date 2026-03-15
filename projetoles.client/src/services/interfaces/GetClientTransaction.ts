export interface ITransaction {
  id?: number;
  uuid?: string;
  customerId: number;
  creditCardId?: number | null;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface IGetTransactionsResponse {
  items: ITransaction[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
