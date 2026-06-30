import { useState } from "react";
import axios from "axios";

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
    useState<VehicleSearchResult[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  const searchMutation =
    useVehicleSearch();

  const createMutation =
    useCreateArrival();

  const handleSearch = async (
    value: string
  ) => {
    setSearch(value);
    setError(null);

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

  const handleSelect = async (
    vehicleId: string
  ) => {
    setError(null);

    try {
      await createMutation.mutateAsync({
        vehicleId,
        stageId,
      });

      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)){
        setError (
          error.response?.data?.message??
          "Unable to add vehicle."
        );
      } else {
        setError("Unable to add vehicle")
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-slate-900">
          Add Vehicle Arrival
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Search using the last digits of the plate.
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

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">
                ⚠️
              </span>

              <div>
                <h3 className="font-semibold text-red-700">
                  Unable to Add Vehicle
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
          {vehicles.map(
            (vehicle) => (
              <button
                key={vehicle.id}
                onClick={() =>
                  handleSelect(vehicle.id)
                }
                disabled={createMutation.isPending}
                className={`w-full rounded-2xl border border-slate-200 p-4 text-left transition ${
                  createMutation.isPending
                    ? "cursor-not-allowed opacity-60"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="font-bold">
                    {vehicle.plateNumber}

                    {createMutation.isPending && (
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        Adding...
                      </span>
                    )}
                  </div>
                <div className="text-sm text-slate-500">
                  {vehicle.capacity}
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