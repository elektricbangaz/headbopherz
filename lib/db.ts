import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

// Lazy singleton — deferred until first query so `next build` doesn't require DATABASE_URL
let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    if (!_db) {
      _db = drizzle(neon(process.env.DATABASE_URL!));
    }
    return (_db as any)[prop];
  },
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingRef: text("booking_ref").notNull().unique(),
  clientId: integer("client_id").references(() => clients.id),
  clientName: text("client_name").notNull(),
  clientCompany: text("client_company"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  eventType: text("event_type").notNull(),
  eventDate: text("event_date").notNull(),
  endDate: text("end_date"),
  venue: text("venue").notNull(),
  guestCount: integer("guest_count").notNull().default(0),
  notes: text("notes"),
  adminNote: text("admin_note"),
  status: text("status").notNull().default("pending"),
  estimatedValue: integer("estimated_value"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  totalQuantity: integer("total_quantity").notNull().default(1),
  availableQuantity: integer("available_quantity").notNull().default(1),
  status: text("status").notNull().default("available"),
  dailyRate: integer("daily_rate").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
