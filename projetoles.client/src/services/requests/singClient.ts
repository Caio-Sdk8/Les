import api from "./api";

export const SingClient = async (payload: any) => {
  const { data } = await api.post("/api/customers/register", payload);
  return data;
};
