export const QUERY_KEYS = {
  APP_SHELL: ["app-shell"] as const,

  DASHBOARD: ["dashboard"] as const,

  QUEUE: (stageId: string) =>
    ["queue", stageId] as const,

  NEXT_VEHICLE: (stageId: string) =>
    ["next-vehicle", stageId] as const,

  ARRIVALS: ["arrivals"] as const,

  NOTIFICATIONS: ["notifications"] as const,
};