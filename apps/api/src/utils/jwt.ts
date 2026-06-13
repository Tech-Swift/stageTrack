import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

export interface JwtPayload {
    userId: string;
    tenantId: string | null;
    tenantCode: string
    role: UserRole;
}

export const generateToken = (
    payload: JwtPayload
): string=> {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET!,
    {
        expiresIn: "7d",
    }
    );
};
