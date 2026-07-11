import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDispatch } from "../services/dispatch.service";

export function useDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispatch,

    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["queue"],
          type: "active",
        }),
        queryClient.refetchQueries({
          queryKey: ["marshal-dashboard"],
          type: "active",
        }),
      ]);
    },
  });
}