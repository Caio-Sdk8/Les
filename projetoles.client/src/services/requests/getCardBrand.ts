import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { IGetCardBrandResponse } from "../interfaces/GetCardBrand";

export const GetCardBrandRequest = () => {
  return useQuery({
    queryKey: ["GetCardBrand"],
    queryFn: async () => {
      const { data } =
        await api.get<IGetCardBrandResponse[]>(`/api/card-brands`);
      return data;
    },
  });
};
