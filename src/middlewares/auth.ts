import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { Unauthorized } from "../errors";

const auth: RequestHandler = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Unauthorized();
    }
    const token = authorization.replace("Bearer ", "");
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // @ts-ignore
    req.user = user;
    next();
  } catch (error) {
    next(new Unauthorized());
  }
};

export default auth;
