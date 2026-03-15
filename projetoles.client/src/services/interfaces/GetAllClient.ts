export interface IGetAllClientResponse {
  items: Item[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Item {
  uuid: string;
  customerCode: string;
  name: string;
  email: string;
  cpf: string;
  isActive: boolean;
  ranking: number;
}
