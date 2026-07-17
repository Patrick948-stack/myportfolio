import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

// Next.js's env-file loader (dotenv-expand) treats `$` as the start of a
// variable reference, which silently mangles raw bcrypt hashes (they're full
// of `$`). Escaping each one as `\$` makes it survive that parsing intact —
// verified round-trip: loadEnvConfig() reads `\$` back out as a literal `$`.
const escaped = hash.replace(/\$/g, () => "\\$");

console.log("Paste this exact line into .env.local:");
console.log(`ADMIN_PASSWORD_HASH=${escaped}`);
