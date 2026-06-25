import { api } from "../lib/api";


export const checkHealth = async () => {
  const response = await api.get("/health");
  return response.data;
};