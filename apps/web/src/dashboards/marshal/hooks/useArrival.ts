import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  searchVehicles,
  createArrival,
} from "../services/arrival.service";

export const useVehicleSearch = () => {
  return useMutation({
    mutationFn: searchVehicles,
  });
};

export const useCreateArrival = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createArrival,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["queue"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "marshal-dashboard",
        ],
      });
    },
  });
};