/**
 * Seeds the admin user into the database.
 * Run: node scripts/seed-admin.mjs
 * Requires DATABASE_URL env var.
 */
import { createHash } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

function hashPassword(password) {
  return createHash("sha256").update(password + "bopherz_salt_2026").digest("hex");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

const username = process.argv[2] || "admin";
const password = process.argv[3] || "admin2026";

const [existing] = await db.select().from(adminUsers).where((t) => t.username.equals(username)).catch(() => [null]);
if (existing) {
  console.log(`Admin user '${username}' already exists.`);
} else {
  await db.insert(adminUsers).values({ username, passwordHash: hashPassword(password) });
  console.log(`Admin user '${username}' created with password '${password}'.`);
}
