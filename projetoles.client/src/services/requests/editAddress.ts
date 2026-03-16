import api from "./api";

export const UpdateAddress = async (
  uuid: string,
  payload: any,
  addressUuid: string,
) => {
  const { data } = await api.put(
    `/api/customers/${uuid}/addresses/${addressUuid}`,
    payload,
  );
  return data;
};
