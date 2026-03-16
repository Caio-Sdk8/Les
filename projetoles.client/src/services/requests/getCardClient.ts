import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { IGetCardClientResponse } from "../interfaces/GetCardClient";

export const GetAllCLientCardsRequest = (uuid: string) => {
  return useQuery({
    queryKey: ["GetAllCLientCards", uuid],
    queryFn: async () => {
      const { data } = await api.get<IGetCardClientResponse[]>(
        `/api/customers/${uuid}/credit-cards`,
      );
      return data;
    },
  });
};
