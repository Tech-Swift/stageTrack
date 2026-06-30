export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  tenant: {
    id: string;
    name: string;
  } | null;

  branding: {
    displayName?: string;
    logoUrl?: string;
    primaryColor: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    buttonRadius?: number;
  } | null;

  activeAssignment: {
    id: string;
    stageId: string;
    stage: {
      id: string;
      name: string;
    };
  } | null;

  status: "ON_DUTY" | "OFFLINE";
  canManageQueue: boolean;

  lastAssignment: {
    id: string;
    stage: {
      id: string;
      name: string;
    };
  } | null;

  queueSummary: {
    waiting: number;
    loading: number;
    dispatchedToday: number;
  };

  loadingVehicle: any;

  notificationsCount: number;
}