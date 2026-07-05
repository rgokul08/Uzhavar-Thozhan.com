import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(farmerId: string) {
  return jwt.sign({ farmerId }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifySession(token: string): { farmerId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { farmerId: string };
  } catch {
    return null;
  }
}

// TODO: Replace password-based login with OTP-over-SMS for low-literacy
// farmer access, using the SMS_API_KEY provider configured in .env.
