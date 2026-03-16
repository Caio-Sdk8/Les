import api from "./api";

export const UpdateClient = async (
  uuid: string,
  payload: { name: string; gender: number; birthDate: string },
) => {
  const { data } = await api.put(`/api/customers/${uuid}`, payload);
  return data;
};
