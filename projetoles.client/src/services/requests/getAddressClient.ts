import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { IGetAddressResponse } from "../interfaces/GetAddressClient";

export const GetAllCLientAddressRequest = (uuid: string) => {
  return useQuery({
    queryKey: ["GetAllCLientAddress"],
    queryFn: async () => {
      const { data } = await api.get<IGetAddressResponse[]>(
        `/api/customers/${uuid}/addresses`,
      );
      return data;
    },
  });
};
