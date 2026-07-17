import "server-only";
import bcrypt from "bcryptjs";

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    throw new Error("ADMIN_PASSWORD_HASH is not set.");
  }
  return bcrypt.compare(password, hash);
}
