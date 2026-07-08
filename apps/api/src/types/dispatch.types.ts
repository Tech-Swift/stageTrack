export interface CreateDispatchRequest {
  queueId: string;
  busFare: number;
  saccoFee?: number;
  remarks?: string;
}

export interface DispatchCalculation {
  expectedRevenue: number;
  platformFee: number;
}