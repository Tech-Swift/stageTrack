import { useMemo } from "react";

import { useAppShellContext } from "../context/AppShellContext";
import { buildNavigation } from "../navigation/buildNavigation";

export const useNavigation = () => {
  const { user } = useAppShellContext();

  return useMemo(() => {
    if (!user) {
      return [];
    }

    return buildNavigation(user.role);
  }, [user]);
};