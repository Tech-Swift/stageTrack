import jwt from "jsonwebtoken";

export interface JwtPayload {
    userId: string;
    tenantId: string | null;
    tenantCode: string
    role: string;
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
