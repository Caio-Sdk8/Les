import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uuid: string) => {
      return api.delete(`/api/customers/${uuid}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["GetAllClient"],
      });
    },
  });
};
