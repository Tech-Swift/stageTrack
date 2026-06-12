declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      tenantId: string;
      tenantCode: string;
      role: string;
    };
  }
}