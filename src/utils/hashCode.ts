import crypto, { BinaryLike } from "crypto";

export const hashCode = (resetCode: BinaryLike) =>
  crypto.createHash("sha256").update(resetCode).digest("hex");
