import { api } from "@/lib/api";
import type { QueueVehicle } from "../types/queue";

export const getStageQueue = async (stageId: string) => {
  const response = await api.get(
    `/stages/${stageId}/queue`
  );

  return response.data.data;
};

export const getNextVehicle = async (
  stageId: string
): Promise<QueueVehicle | null> => {
  const response = await api.get(
    `/queue/${stageId}/queue/next`
  );

  return response.data.data;
};

export const markReady = async (
  queueId: string
) => {
  const response = await api.patch(
    `/queue/${queueId}/ready`
  );

  return response.data;
};

export const dispatchVehicle = async (
  queueId: string,
  payload: {
    fareCollected: number;
    platformFee: number;
    saccoFee: number;
  }
) => {
  const response = await api.patch(
    `/queue/${queueId}/dispatch`,
    payload
  );

  return response.data;
};

export const returnToQueue = async (
  queueId: string
) => {
  const response = await api.patch(
    `/queue/${queueId}/return`
  );

  return response.data.data;
};