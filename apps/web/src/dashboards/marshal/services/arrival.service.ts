import { api } from "@/lib/api";
import type {
  VehicleSearchResult,
  CreateArrivalPayload,
} from "../types/arrival";

export const searchVehicles = async (
  plateNumber: string
): Promise<VehicleSearchResult[]> => {
  const response = await api.get(
    `/vehicles/search?plateNumber=${plateNumber}`
  );

  return response.data.data;
};

export const createArrival = async (
  payload: CreateArrivalPayload
) => {
  const response = await api.post(
    "/arrivals",
    payload
  );

  return response.data;
};