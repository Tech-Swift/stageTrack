import { api } from "@/lib/api";
import type { LoginResponse } from "../types";

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const { data } = await api.post(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return data;
};

export const getProfile = async () => {
  const { data } = await api.get(
    "/auth/profile"
  );

  return data;
};

export const updateProfile = async (
  payload: {
    phone?: string;
    profileImageUrl?: string;
  }
) => {
  const { data } = await api.put(
    "/auth/profile",
    payload
  );

  return data;
};

export const changePassword = async (
  payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
) => {
  const { data } = await api.put(
    "/auth/change-password",
    payload
  );

  return data;
};

export const forgotPassword = async (
  email: string
) => {
  const { data } = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return data;
};

export const resetPassword = async (
  payload: {
    token: string;
    password: string;
    confirmPassword: string;
  }
) => {
  const { data } = await api.post(
    "/auth/reset-password",
    payload
  );

  return data;
};

export const setPassword = async (
  payload: {
    token: string;
    password: string;
    confirmPassword: string;
  }
) => {
  const { data } = await api.post(
    "/auth/set-password",
    payload
  );

  return data;
};