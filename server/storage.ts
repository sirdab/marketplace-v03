import {
  type User,
  type InsertUser,
  type Property,
  type InsertProperty,
  type Visit,
  type InsertVisit,
  type Booking,
  type InsertBooking,
  type SavedProperty,
  type InsertSavedProperty,
  type PropertyFilters,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private properties: Map<string, Property>;
  private visits: Map<string, Visit>;
  private bookings: Map<string, Booking>;
  private savedProperties: Map<string, SavedProperty>;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.visits = new Map();
    this.bookings = new Map();
    this.savedProperties = new Map();

    // Seed with sample properties
    this.seedProperties();
  }

  private seedProperties() {
    const sampleProperties: InsertProperty[] = [
      // Warehouses
      {
        title: "Modern Logistics Warehouse - Industrial City",
        description: "State-of-the-art warehouse facility with high ceilings, loading docks, and 24/7 security. Perfect for logistics and distribution operations. Features include fire suppression systems, climate control options, and dedicated parking for trucks.",
        category: "warehouse",
        subType: "Dry / Ambient",
        price: 85000,
        priceUnit: "month",
        size: 2500,
        location: "Industrial City, Building A12",
        city: "Riyadh",
        district: "Industrial City",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
        images: [],
        amenities: ["Loading Docks", "24/7 Security", "Fire Suppression", "Parking"],
        isVerified: true,
        isAvailable: true,
        ownerName: "Ahmed Al-Rashid",
        ownerPhone: "+966 50 123 4567",
      },
      {
        title: "Cold Storage Facility - Jeddah Port",
        description: "Temperature-controlled warehouse near Jeddah Port. Ideal for perishable goods, food products, and pharmaceutical storage. Multiple temperature zones available from -25°C to +8°C.",
        category: "warehouse",
        subType: "Cold & Chilled",
        price: 120000,
        priceUnit: "month",
        size: 1800,
        location: "Jeddah Islamic Port Road",
        city: "Jeddah",
        district: "Port Area",
        imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
        images: [],
        amenities: ["Temperature Control", "Loading Bays", "Backup Power", "24/7 Monitoring"],
        isVerified: true,
        isAvailable: true,
        ownerName: "Khalid Industries",
        ownerPhone: "+966 50 234 5678",
      },
      {
        title: "Cross-Dock Distribution Center",
        description: "Strategic cross-dock facility for rapid goods transfer. Multiple loading bays on both sides for efficient throughput. Located at a major highway intersection.",
        category: "warehouse",
        subType: "Cross-dock",
        price: 95000,
        priceUnit: "month",
        size: 3200,
        location: "Highway 40 Intersection",
        city: "Dammam",
        district: "Industrial Zone",
        imageUrl: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
        images: [],
        amenities: ["Multiple Bays", "Office Space", "Staff Facilities", "Truck Parking"],
        isVerified: true,
        isAvailable: true,
      },

      // Workshops
      {
        title: "Auto Workshop with Full Equipment",
        description: "Fully equipped automotive workshop with hydraulic lifts, painting booth, and diagnostic equipment. Suitable for car repair, maintenance, and customization services.",
        category: "workshop",
        subType: "Auto Workshop",
        price: 45000,
        priceUnit: "month",
        size: 800,
        location: "Al Sulay Industrial Area",
        city: "Riyadh",
        district: "Al Sulay",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
        images: [],
        amenities: ["Hydraulic Lifts", "Paint Booth", "Office", "Customer Waiting Area"],
        isVerified: true,
        isAvailable: true,
        ownerName: "Mohammed Hassan",
        ownerPhone: "+966 55 345 6789",
      },
      {
        title: "Light Manufacturing Unit",
        description: "Versatile light manufacturing space with 3-phase power, overhead crane, and goods lift. Perfect for assembly, packaging, or small-scale production operations.",
        category: "workshop",
        subType: "Light Manufacturing",
        price: 55000,
        priceUnit: "month",
        size: 1200,
        location: "Second Industrial City",
        city: "Riyadh",
        district: "Second Industrial City",
        imageUrl: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800&q=80",
        images: [],
        amenities: ["3-Phase Power", "Overhead Crane", "Goods Lift", "Office Space"],
        isVerified: false,
        isAvailable: true,
      },
      {
        title: "Carpentry & Woodworking Shop",
        description: "Specialized woodworking facility with dust extraction system, natural lighting, and heavy-duty power connections. Ideal for furniture manufacturing and carpentry.",
        category: "workshop",
        subType: "Carpentry / Metal",
        price: 38000,
        priceUnit: "month",
        size: 650,
        location: "Craftsmen Village",
        city: "Jeddah",
        district: "Al Harazat",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        images: [],
        amenities: ["Dust Extraction", "Natural Light", "Heavy Power", "Storage Area"],
        isVerified: true,
        isAvailable: true,
      },

      // Self-Storage
      {
        title: "SME Storage Units - Various Sizes",
        description: "Flexible storage solutions for small and medium businesses. Units from 20 to 100 sqm available. Secure access, CCTV monitoring, and easy drive-up access.",
        category: "storage",
        subType: "SME Inventory",
        price: 3500,
        priceUnit: "month",
        size: 50,
        location: "King Fahd Road",
        city: "Riyadh",
        district: "Al Malqa",
        imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
        images: [],
        amenities: ["24/7 Access", "CCTV", "Drive-up Access", "Climate Control"],
        isVerified: true,
        isAvailable: true,
        minDuration: 30,
      },
      {
        title: "Personal Storage Lockers",
        description: "Secure personal storage units for household items, seasonal goods, or personal belongings. Clean, well-lit facility with easy access.",
        category: "storage",
        subType: "Personal Storage",
        price: 1200,
        priceUnit: "month",
        size: 15,
        location: "Olaya District",
        city: "Riyadh",
        district: "Olaya",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        images: [],
        amenities: ["Clean Facility", "Well-Lit", "Easy Access", "Security"],
        isVerified: false,
        isAvailable: true,
        minDuration: 7,
      },

      // Long-Term Storefronts
      {
        title: "Prime Retail Showroom - Tahlia Street",
        description: "High-visibility retail space on Tahlia Street. Large glass frontage, high foot traffic, and excellent parking. Perfect for luxury brands, electronics, or fashion retail.",
        category: "storefront-long",
        subType: "Showroom",
        price: 180000,
        priceUnit: "month",
        size: 350,
        location: "Tahlia Street, Building 45",
        city: "Riyadh",
        district: "Tahlia",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        images: [],
        amenities: ["Glass Frontage", "AC", "Staff Room", "Storage", "Parking"],
        isVerified: true,
        isAvailable: true,
        ownerName: "Tahlia Properties",
        ownerPhone: "+966 50 456 7890",
      },
      {
        title: "Dark Store Location - E-commerce Ready",
        description: "Ready-to-use dark store for e-commerce fulfillment. Ground floor with multiple entry points, perfect for quick commerce and delivery operations.",
        category: "storefront-long",
        subType: "Dark Store",
        price: 65000,
        priceUnit: "month",
        size: 500,
        location: "Al Woroud District",
        city: "Riyadh",
        district: "Al Woroud",
        imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
        images: [],
        amenities: ["Multiple Entries", "Loading Area", "Power Backup", "AC"],
        isVerified: true,
        isAvailable: true,
      },
      {
        title: "SME Retail Space - Al Khobar",
        description: "Affordable retail space for small businesses. Located in a busy commercial area with good visibility and foot traffic.",
        category: "storefront-long",
        subType: "SME Retail",
        price: 28000,
        priceUnit: "month",
        size: 120,
        location: "Prince Turki Street",
        city: "Dammam",
        district: "Al Khobar",
        imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
        images: [],
        amenities: ["Display Windows", "AC", "Storage", "Restroom"],
        isVerified: false,
        isAvailable: true,
      },

      // Short-Term Storefronts
      {
        title: "Event Pop-up Space - Mall of Arabia",
        description: "Premium pop-up location inside Mall of Arabia. High foot traffic, perfect for brand launches, seasonal campaigns, or product demonstrations.",
        category: "storefront-short",
        subType: "Event Pop-up",
        price: 5000,
        priceUnit: "day",
        size: 80,
        location: "Mall of Arabia, Ground Floor",
        city: "Jeddah",
        district: "Al Rawdah",
        imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
        images: [],
        amenities: ["High Traffic", "AC", "Power Outlets", "WiFi"],
        isVerified: true,
        isAvailable: true,
        minDuration: 1,
        maxDuration: 30,
      },
      {
        title: "Exhibition Stand - Conference Center",
        description: "Flexible exhibition space at the Riyadh International Convention Center. Available for trade shows, exhibitions, and corporate events.",
        category: "storefront-short",
        subType: "Exhibition",
        price: 8000,
        priceUnit: "day",
        size: 100,
        location: "RICC, Hall B",
        city: "Riyadh",
        district: "Diplomatic Quarter",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        images: [],
        amenities: ["Power", "WiFi", "Setup Assistance", "Security"],
        isVerified: true,
        isAvailable: true,
        minDuration: 1,
        maxDuration: 14,
      },
      {
        title: "Brand Activation Space - Boulevard",
        description: "Outdoor activation space at Riyadh Boulevard. Perfect for brand experiences, product launches, and interactive marketing campaigns.",
        category: "storefront-short",
        subType: "Brand Activation",
        price: 12000,
        priceUnit: "day",
        size: 200,
        location: "Riyadh Boulevard, Zone C",
        city: "Riyadh",
        district: "Boulevard",
        imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
        images: [],
        amenities: ["Outdoor Space", "Power", "Water Access", "Setup Support"],
        isVerified: true,
        isAvailable: true,
        minDuration: 1,
        maxDuration: 7,
      },
    ];

    sampleProperties.forEach((prop) => {
      const id = randomUUID();
      this.properties.set(id, { ...prop, id } as Property);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const property: Property = { ...insertProperty, id } as Property;
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(
    id: string,
    updates: Partial<InsertProperty>
  ): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    const updated = { ...property, ...updates };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  async searchProperties(filters: PropertyFilters): Promise<Property[]> {
    let results = Array.from(this.properties.values());

    if (filters.category) {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters.subType) {
      results = results.filter((p) => p.subType === filters.subType);
    }
    if (filters.city) {
      results = results.filter((p) => p.city === filters.city);
    }
    if (filters.district) {
      results = results.filter((p) => p.district === filters.district);
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
  }

  // Visit methods
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

  // Booking methods
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

  // Saved Properties methods
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

export const storage = new MemStorage();
