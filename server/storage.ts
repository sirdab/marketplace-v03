import {
  type User,
  type InsertUser,
  type Property,
  type Visit,
  type InsertVisit,
  type Booking,
  type InsertBooking,
  type SavedProperty,
  type InsertSavedProperty,
  type PropertyFilters,
  ads,
  adToProperty,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, or, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Properties (read-only from Supabase)
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  searchProperties(filters: PropertyFilters): Promise<Property[]>;

  // Visits
  getVisits(): Promise<Visit[]>;
  getVisit(id: string): Promise<Visit | undefined>;
  getVisitsByProperty(propertyId: string): Promise<Visit[]>;
  getVisitsByUser(userId: string): Promise<Visit[]>;
  createVisit(visit: InsertVisit): Promise<Visit>;
  updateVisit(id: string, visit: Partial<InsertVisit>): Promise<Visit | undefined>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingsByProperty(propertyId: string): Promise<Booking[]>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;

  // Saved Properties
  getSavedProperties(userId: string): Promise<SavedProperty[]>;
  saveProperty(saved: InsertSavedProperty): Promise<SavedProperty>;
  unsaveProperty(userId: string, propertyId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods - using in-memory for now since users table structure differs
  private users: Map<string, User> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
      meetingUrl: null,
    } as User;
    this.users.set(id, user);
    return user;
  }

  // Property methods - reading from Supabase ads table
  async getProperties(): Promise<Property[]> {
    try {
      const result = await db
        .select()
        .from(ads)
        .where(and(eq(ads.published, true), eq(ads.deleted, false)));
      
      return result.map(adToProperty);
    } catch (error) {
      console.error("Error fetching properties from database:", error);
      return [];
    }
  }

  async getProperty(id: string): Promise<Property | undefined> {
    try {
      const adId = parseInt(id);
      if (isNaN(adId)) return undefined;
      
      const result = await db
        .select()
        .from(ads)
        .where(eq(ads.id, adId))
        .limit(1);
      
      if (result.length === 0) return undefined;
      return adToProperty(result[0]);
    } catch (error) {
      console.error("Error fetching property from database:", error);
      return undefined;
    }
  }

  async searchProperties(filters: PropertyFilters): Promise<Property[]> {
    try {
      let results = await this.getProperties();

      if (filters.category) {
        results = results.filter((p) => p.category === filters.category);
      }
      if (filters.subType) {
        results = results.filter((p) => p.subType === filters.subType);
      }
      if (filters.city) {
        results = results.filter((p) => p.city.toLowerCase() === filters.city!.toLowerCase());
      }
      if (filters.district) {
        results = results.filter((p) => p.district.toLowerCase() === filters.district!.toLowerCase());
      }
      if (filters.minPrice !== undefined) {
        results = results.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.minSize !== undefined) {
        results = results.filter((p) => p.size >= filters.minSize!);
      }
      if (filters.maxSize !== undefined) {
        results = results.filter((p) => p.size <= filters.maxSize!);
      }
      if (filters.isVerified !== undefined) {
        results = results.filter((p) => p.isVerified === filters.isVerified);
      }
      if (filters.purpose) {
        results = results.filter((p) => p.purpose === filters.purpose);
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        results = results.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.location.toLowerCase().includes(query) ||
            p.city.toLowerCase().includes(query) ||
            p.district.toLowerCase().includes(query)
        );
      }

      return results;
    } catch (error) {
      console.error("Error searching properties:", error);
      return [];
    }
  }

  // Visit methods - in-memory for now
  private visits: Map<string, Visit> = new Map();

  async getVisits(): Promise<Visit[]> {
    return Array.from(this.visits.values());
  }

  async getVisit(id: string): Promise<Visit | undefined> {
    return this.visits.get(id);
  }

  async getVisitsByProperty(propertyId: string): Promise<Visit[]> {
    return Array.from(this.visits.values()).filter(
      (v) => v.propertyId === propertyId
    );
  }

  async getVisitsByUser(userId: string): Promise<Visit[]> {
    return Array.from(this.visits.values()).filter((v) => v.userId === userId);
  }

  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const id = randomUUID();
    const visit: Visit = { ...insertVisit, id } as Visit;
    this.visits.set(id, visit);
    return visit;
  }

  async updateVisit(
    id: string,
    updates: Partial<InsertVisit>
  ): Promise<Visit | undefined> {
    const visit = this.visits.get(id);
    if (!visit) return undefined;
    const updated = { ...visit, ...updates };
    this.visits.set(id, updated);
    return updated;
  }

  // Booking methods - in-memory for now
  private bookings: Map<string, Booking> = new Map();

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByProperty(propertyId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (b) => b.propertyId === propertyId
    );
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (b) => b.userId === userId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { ...insertBooking, id } as Booking;
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(
    id: string,
    updates: Partial<InsertBooking>
  ): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updated = { ...booking, ...updates };
    this.bookings.set(id, updated);
    return updated;
  }

  // Saved Properties methods - in-memory for now
  private savedProperties: Map<string, SavedProperty> = new Map();

  async getSavedProperties(userId: string): Promise<SavedProperty[]> {
    return Array.from(this.savedProperties.values()).filter(
      (s) => s.userId === userId
    );
  }

  async saveProperty(insertSaved: InsertSavedProperty): Promise<SavedProperty> {
    const id = randomUUID();
    const saved: SavedProperty = { ...insertSaved, id };
    this.savedProperties.set(id, saved);
    return saved;
  }

  async unsaveProperty(userId: string, propertyId: string): Promise<boolean> {
    const toDelete = Array.from(this.savedProperties.entries()).find(
      ([_, s]) => s.userId === userId && s.propertyId === propertyId
    );
    if (toDelete) {
      this.savedProperties.delete(toDelete[0]);
      return true;
    }
    return false;
  }
}

export const storage = new DatabaseStorage();
