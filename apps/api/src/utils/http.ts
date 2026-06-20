import { Request } from "express";

export const getParam = (req: Request, key: string): string | null => {
  const value = req.params[key];

  if (!value || Array.isArray(value)) {
    return null;
  }

  return value;
};