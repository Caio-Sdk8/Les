import api from "./api";

export const UpdateClient = async (uuid: string, payload: any) => {
  const { data } = await api.put(`/api/customers/${uuid}`, payload);
  return data;
};
