import { useQuery } from "@tanstack/react-query";
import { getMarshalDashboard } from "../services/dashboard.service";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["marshal-dashboard"],
    queryFn: getMarshalDashboard,
    staleTime: 1000 * 60 * 5,
  });
};