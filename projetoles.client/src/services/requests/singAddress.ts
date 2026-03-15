export interface AddressPayload {
  addressType: number;
  label?: string;
  residenceType: number;
  streetType: string;
  street: string;
  number: string;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  observations?: string;
}

import api from "./api";

export const AddAddressClient = async (
  uuid: string,
  payload: AddressPayload,
) => {
  const { data } = await api.post(`/api/customers/${uuid}/addresses`, payload);
  return data;
};
