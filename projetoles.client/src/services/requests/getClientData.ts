import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { IGetClientDataResponse } from "../interfaces/GetClientData";

export const GetClientDataRequest = (uuid: string) => {
  return useQuery({
    queryKey: ["GetClientData"],
    queryFn: async () => {
      const { data } = await api.get<IGetClientDataResponse>(`/api/customers/${uuid}`);
      return data;
    },
  });
};
