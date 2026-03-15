import { useQuery } from "@tanstack/react-query";
import api from "./api";
import { IGetTransactionsResponse } from "../interfaces/GetClientTransaction";

export const GetTransactionClientRequest = (
  uuid: string,
  page = 1,
  pageSize = 20,
) => {
  return useQuery({
    queryKey: ["GetTransactionClient", uuid, page, pageSize],
    queryFn: async () => {
      const { data } = await api.get<IGetTransactionsResponse>(
        `/api/customers/${uuid}/transactions`,
        {
          params: {
            page,
            pageSize,
          },
        },
      );
      return data;
    },
    enabled: !!uuid,
  });
};
