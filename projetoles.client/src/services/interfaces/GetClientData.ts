export interface IPhone {
  uuid: string;
  phoneType: number;
  areaCode: string;
  number: string;
  isMain: boolean;
}

export interface IGetClientDataResponse {
  uuid: string;
  customerCode: string;
  name: string;
  gender: number;
  birthDate: string;
  cpf: string;
  email: string;
  isActive: boolean;
  ranking: number;
  createdAt: string;
  updatedAt: string;
  phones: IPhone[];
}
