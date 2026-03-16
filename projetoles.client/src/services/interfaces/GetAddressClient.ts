export interface IGetAddressResponse {
  uuid: string;
  addressType: number;
  label: string;
  residenceType: number;
  streetType: string;
  street: string;
  number: string;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  observations: string;
  isActive: boolean;
}
