import api from "./api";

export interface ICreateCreditCardPayload {
  CardBrandUuid: string;
  CardNumber: string;
  PrintedName: string;
  SecurityCode: string;
  ExpirationDate: string;
  IsPreferred: boolean;
}

export const createCreditCard = async (
  uuid: string,
  payload: ICreateCreditCardPayload,
) => {
  const { data } = await api.post(
    `/api/customers/${uuid}/credit-cards`,
    payload,
  );

  return data;
};
