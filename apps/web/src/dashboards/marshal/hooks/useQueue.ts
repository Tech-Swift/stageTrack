import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { QueueVehicle } from "../types/queue";

import {
  getStageQueue,
  getNextVehicle,
  markReady,
  dispatchVehicle,
} from "../services/queue.service";

/* =========================
   QUEUE
========================= */

export const useQueue = (stageId?: string) => {
  return useQuery<QueueVehicle[]>({
    queryKey: ["queue", stageId],
    queryFn: () => getStageQueue(stageId!),
    enabled: !!stageId,
  });
};

/* =========================
   NEXT VEHICLE
========================= */

export const useNextVehicle = (stageId?: string) => {
  return useQuery<QueueVehicle | null>({
    queryKey: ["next-vehicle", stageId],
    queryFn: () => getNextVehicle(stageId!),
    enabled: !!stageId,
  });
};

/* =========================
   MARK READY
========================= */

export const useMarkReady = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markReady,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["queue"],
      });

      queryClient.invalidateQueries({
        queryKey: ["next-vehicle"],
      });

      queryClient.invalidateQueries({
        queryKey: ["marshal-dashboard"],
      });
    },
  });
};

/* =========================
   DISPATCH
========================= */

export const useDispatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      queueId,
      payload,
    }: {
      queueId: string;
      payload: {
        fareCollected: number;
        platformFee: number;
        saccoFee: number;
      };
    }) => dispatchVehicle(queueId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["queue"],
      });

      queryClient.invalidateQueries({
        queryKey: ["next-vehicle"],
      });

      queryClient.invalidateQueries({
        queryKey: ["marshal-dashboard"],
      });
    },
  });
};