import { api } from "@/lib/api";

export interface CreateTenantApplicationPayload {
  saccoName: string;
  registrationNumber?: string;
  preferredCode?: string;

  county: string;
  town?: string;
  physicalAddress?: string;

  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactPosition?: string;
}

export interface TenantApplicationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    referenceNumber: string;
    saccoName: string;
    status: string;
  };
}

export const submitTenantApplication = async (
  data: CreateTenantApplicationPayload
) => {
  const response =
    await api.post<TenantApplicationResponse>(
      "/tenant-applications",
      data
    );

  return response.data;
};