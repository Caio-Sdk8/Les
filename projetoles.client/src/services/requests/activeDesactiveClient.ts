import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const useToggleClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string) => {
      return api.patch(`/api/customers/${uuid}/toggle-active`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetAllClient"],
      });
    },
  });
};
