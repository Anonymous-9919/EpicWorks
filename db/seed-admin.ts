import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { adminUsers } from "./schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const hash = bcrypt.hashSync("admin123", 10);
  await db
    .insert(adminUsers)
    .values({
      email: "admin@epicworks.com",
      passwordHash: hash,
      name: "Admin",
    })
    .onConflictDoNothing();
  console.log("Admin user created: admin@epicworks.com / admin123");
}

seedAdmin().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
