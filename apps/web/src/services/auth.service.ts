import { api } from "../lib/api";
import type { AuthResponse } from "../types/auth";

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    payload
  );

  return response.data;
};