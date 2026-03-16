import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

interface ToggleCardParams {
  customerUuid: string;
  cardUuid: string;
}

export const useToggleCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerUuid, cardUuid }: ToggleCardParams) => {
      return api.patch(
        `/api/customers/${customerUuid}/credit-cards/${cardUuid}/set-preferred`,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["GetAllCLientCards", variables.customerUuid],
      });
    },
  });
};
