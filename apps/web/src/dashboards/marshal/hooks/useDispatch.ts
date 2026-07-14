import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDispatch } from "../services/dispatch.service";
import { returnToQueue } from "../services/queue.service";

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

export function useReturnToQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnToQueue,

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