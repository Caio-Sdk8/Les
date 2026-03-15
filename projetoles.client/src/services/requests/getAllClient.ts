import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { IGetAllClientResponse } from "../interfaces/GetAllClient";

export const GetAllCLientRequest = () => {
  return useQuery({
    queryKey: ["GetAllCLient"],
    queryFn: async () => {
      const { data } = await api.get<IGetAllClientResponse>("/api/customers");
      return data;
    },
  });
};
