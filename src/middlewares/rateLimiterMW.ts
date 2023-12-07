import rateLimit from "express-rate-limit";

export const apiLimiter = (
  msg: string,
  time: number = 15,
  maxLimit: number = 5
) =>
  rateLimit({
    windowMs: time * 60 * 1000, // Time
    max: maxLimit, // Limit each IP requests
    message: msg,
  });
