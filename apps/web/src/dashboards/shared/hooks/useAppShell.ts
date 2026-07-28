import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";

import { getAppShell } from "../services/appShell.service";

export const useAppShell = () => {
  return useQuery({
    queryKey: QUERY_KEYS.APP_SHELL,
    queryFn: getAppShell,

    staleTime: 1000 * 60 * 5,

    retry: 1,
  });
};