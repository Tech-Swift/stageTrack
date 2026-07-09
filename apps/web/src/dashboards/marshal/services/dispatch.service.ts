import { api } from "@/lib/api";

import type {
  CreateDispatchPayload,
  DispatchResponse,
} from "../types/dispatch";

export const createDispatch = async (
  payload: CreateDispatchPayload
): Promise<DispatchResponse> => {
  const response = await api.post(
    "/dispatches",
    payload
  );

  return response.data.data;
};