import { ErrorRequestHandler } from "express";
import { UserError } from "../errors";

const ErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof UserError) {
    res.status(error.errorCode).json({ error: error.errorMessage });
  } else {
    console.log(error);
    res.status(500).json({
      error: "This is your basic error message",
    });
  }
};

export default ErrorHandler;