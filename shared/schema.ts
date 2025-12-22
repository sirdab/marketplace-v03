import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phone: text("phone"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phone: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Property Purpose (Buy, Rent, Daily Rental)
export type PropertyPurpose = "buy" | "rent" | "daily_rent";

export const purposeLabels: Record<PropertyPurpose, string> = {
  "buy": "Buy",
  "rent": "Rent",
  "daily_rent": "Daily Rental",
};

// Property Categories
export type PropertyCategory = "warehouse" | "workshop" | "storage" | "storefront-long";

export const categoryLabels: Record<PropertyCategory, string> = {
  "warehouse": "Warehouses",
  "workshop": "Workshops",
  "storage": "Self-Storage",
  "storefront-long": "Long-Term Storefronts",
};

export const categoryDescriptions: Record<PropertyCategory, string> = {
  "warehouse": "Dry, cold, cross-dock & industrial storage",
  "workshop": "Auto, manufacturing & light industrial",
  "storage": "SME inventory & personal storage",
  "storefront-long": "Showrooms, retail & service spaces",
};

// Property sub-types
export const propertySubTypes: Record<PropertyCategory, string[]> = {
  "warehouse": ["Dry / Ambient", "Cold & Chilled", "Cross-dock", "Industrial Storage"],
  "workshop": ["Auto Workshop", "Light Manufacturing", "Carpentry / Metal", "Small Industrial"],
  "storage": ["SME Inventory", "Personal Storage", "Overflow / Seasonal"],
  "storefront-long": ["Dark Store", "Showroom", "SME Retail", "Service Business"],
};

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // PropertyCategory
  subType: text("sub_type").notNull(),
  purpose: text("purpose").notNull().default("rent"), // "buy" | "rent" | "daily_rent"
  price: integer("price").notNull(), // SAR per month or per day
  priceUnit: text("price_unit").notNull().default("month"), // "month" | "day"
  size: integer("size").notNull(), // sqm
  location: text("location").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  imageUrl: text("image_url").notNull(),
  images: text("images").array(),
  amenities: text("amenities").array(),
  isVerified: boolean("is_verified").default(false),
  isAvailable: boolean("is_available").default(true),
  availableFrom: text("available_from"),
  minDuration: integer("min_duration"), // days
  maxDuration: integer("max_duration"), // days
  ownerName: text("owner_name"),
  ownerPhone: text("owner_phone"),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// Visits table
export const visits = pgTable("visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  userId: varchar("user_id"),
  visitorName: text("visitor_name").notNull(),
  visitorEmail: text("visitor_email").notNull(),
  visitorPhone: text("visitor_phone").notNull(),
  visitDate: text("visit_date").notNull(),
  visitTime: text("visit_time").notNull(),
  status: text("status").notNull().default("pending"), // pending | confirmed | completed | cancelled
  notes: text("notes"),
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
});

export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  userId: varchar("user_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  platformFee: integer("platform_fee").notNull(), // 5% of total
  status: text("status").notNull().default("pending"), // pending | confirmed | active | completed | cancelled
  paymentStatus: text("payment_status").notNull().default("unpaid"), // unpaid | partial | paid
  notes: text("notes"),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Saved properties (favorites)
export const savedProperties = pgTable("saved_properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  propertyId: varchar("property_id").notNull(),
});

export const insertSavedPropertySchema = createInsertSchema(savedProperties).omit({
  id: true,
});

export type InsertSavedProperty = z.infer<typeof insertSavedPropertySchema>;
export type SavedProperty = typeof savedProperties.$inferSelect;

// Filter types for search
export interface PropertyFilters {
  category?: PropertyCategory;
  subType?: string;
  purpose?: PropertyPurpose;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  isVerified?: boolean;
  searchQuery?: string;
}
