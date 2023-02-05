import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../Keys";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, JSON_SIGNATURE) as {
      userId: number;
    };
  } catch (error) {
    return null;
  }
};
