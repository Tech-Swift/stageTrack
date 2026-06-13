import { UserRole } from "@prisma/client";

export interface AuthUser {
    userId:     string;
    tenantId:   string | null;
    role:       UserRole; 
}