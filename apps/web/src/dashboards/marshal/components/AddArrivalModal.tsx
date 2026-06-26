import {
  useState,
} from "react";

import {
  useVehicleSearch,
  useCreateArrival,
} from "../hooks/useArrival";

import type {
  VehicleSearchResult,
} from "../types/arrival";

interface Props {
  stageId: string;
  primaryColor: string;
  onClose: () => void;
}

export default function AddArrivalModal({
  stageId,
  primaryColor,
  onClose,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [vehicles, setVehicles] =
    useState<
      VehicleSearchResult[]
    >([]);

  const searchMutation =
    useVehicleSearch();

  const createMutation =
    useCreateArrival();

  const handleSearch = async (
    value: string
  ) => {
    setSearch(value);

    if (value.length < 2) {
      setVehicles([]);
      return;
    }

    try {
      const results =
        await searchMutation.mutateAsync(
          value
        );

      setVehicles(results);
    } catch {
      setVehicles([]);
    }
  };

  const handleSelect =
    async (
      vehicleId: string
    ) => {
      await createMutation.mutateAsync({
        vehicleId,
        stageId,
      });

      onClose();
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-slate-900">
          Add Vehicle Arrival
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Search using the last
          digits of the plate.
        </p>

        <input
          value={search}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
          placeholder="003C"
          className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
        />

        <div className="mt-4 max-h-72 overflow-y-auto space-y-3">
          {vehicles.map(
            (vehicle) => (
              <button
                key={vehicle.id}
                onClick={() =>
                  handleSelect(
                    vehicle.id
                  )
                }
                className="w-full rounded-2xl border border-slate-200 p-4 text-left hover:bg-slate-50"
              >
                <div className="font-bold">
                  {
                    vehicle.plateNumber
                  }
                </div>

                <div className="text-sm text-slate-500">
                  {
                    vehicle.capacity
                  }
                  -Seater
                </div>
              </button>
            )
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl py-3 font-semibold text-white"
          style={{
            backgroundColor:
              primaryColor,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}