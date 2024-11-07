import { NextFunction, Request, Response } from "express";
import AppError from "@/errors/AppError";
import { ZodError } from "zod";

export default (
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction
) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return response.status(400).send({
      error: "Validation error",
      issues: err.issues,
    });
  }

  console.error("ERROR:", err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
