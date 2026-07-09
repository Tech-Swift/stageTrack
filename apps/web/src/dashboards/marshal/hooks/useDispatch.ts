import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDispatch } from "../services/dispatch.service";

export function useDispatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispatch,

    onSuccess: () => {
      /**
       * Refresh queue
       */
      queryClient.invalidateQueries({
        queryKey: ["queue"],
      });

      /**
       * Refresh dashboard
       */
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}