import { NextFunction, Request, Response } from "express";
import AppError from "@/errors/AppError";
import { verify } from "jsonwebtoken";
import { env } from "@/env";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

const ensureAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const authHeader = request.headers.authorization;
  const token: string = authHeader
    ? authHeader.split(" ")[1]
    : request.cookies.token;

  if (!token) {
    throw new AppError(400, "JWT token is missing");
  }

  try {
    const decoded = verify(token || "", env.JWT_SECRET);

    const { sub } = decoded as TokenPayload;

    request.user = sub;
    request.token = token || "";

    return next();
  } catch {
    throw new AppError(401, "Unauthorized");
  }
};

export default ensureAuthenticated;
