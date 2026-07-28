import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import { pageMetadata } from "../navigation/pageMetadata";

export const usePageMetadata = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    const exact = pageMetadata[pathname];

    if (exact) {
      return exact;
    }

    const matched = Object.keys(pageMetadata).find((route) =>
      pathname.startsWith(route)
    );

    if (matched) {
      return pageMetadata[matched];
    }

    return {
      title: "Dashboard",
      description: "Welcome to StageTrack",
    };
  }, [pathname]);
};