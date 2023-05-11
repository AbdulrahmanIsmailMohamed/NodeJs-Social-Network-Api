import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

interface DecodedToken extends JwtPayload {
    userId: ObjectId,
    iat: number
}

export default DecodedToken;