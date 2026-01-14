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
  type Ad,
  type InsertAd,
  type City,
} from '@shared/schema';
import { randomUUID } from 'crypto';

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  searchProperties(filters: PropertyFilters): Promise<Property[]>;

  // Ads
  getAdsByUserId(userId: string): Promise<Ad[]>;
  getAd(id: number): Promise<Ad | undefined>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad | undefined>;
  getPublishedAds(): Promise<Ad[]>;

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

  // Cities
  getCities(): Promise<City[]>;

  // Admin
  getAllAds(): Promise<Ad[]>;
}

// Hardcoded cities
const HARDCODED_CITIES: City[] = [
  { id: 1, nameEn: 'Riyadh', nameAr: 'الرياض', latitude: '24.7136', longitude: '46.6753', isActive: true, countryId: 1 },
  { id: 2, nameEn: 'Jeddah', nameAr: 'جدة', latitude: '21.4858', longitude: '39.1925', isActive: true, countryId: 1 },
  { id: 3, nameEn: 'Dammam', nameAr: 'الدمام', latitude: '26.4207', longitude: '50.0888', isActive: true, countryId: 1 },
  { id: 4, nameEn: 'Al Khobar', nameAr: 'الخبر', latitude: '26.2172', longitude: '50.1971', isActive: true, countryId: 1 },
  { id: 5, nameEn: 'Al Ahsa', nameAr: 'الأحساء', latitude: '25.3648', longitude: '49.5855', isActive: true, countryId: 1 },
  { id: 6, nameEn: 'Abha', nameAr: 'أبها', latitude: '18.2164', longitude: '42.5053', isActive: true, countryId: 1 },
  { id: 7, nameEn: 'Buraydah', nameAr: 'بريدة', latitude: '26.3260', longitude: '43.9750', isActive: true, countryId: 1 },
  { id: 8, nameEn: 'Mecca', nameAr: 'مكة المكرمة', latitude: '21.3891', longitude: '39.8579', isActive: true, countryId: 1 },
  { id: 9, nameEn: 'Medina', nameAr: 'المدينة المنورة', latitude: '24.5247', longitude: '39.5692', isActive: true, countryId: 1 },
  { id: 10, nameEn: 'Tabuk', nameAr: 'تبوك', latitude: '28.3838', longitude: '36.5550', isActive: true, countryId: 1 },
  { id: 11, nameEn: 'Khamis Mushait', nameAr: 'خميس مشيط', latitude: '18.3093', longitude: '42.7453', isActive: true, countryId: 1 },
];

// Hardcoded properties data
const HARDCODED_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Dry Warehouse in Industrial City',
    description: 'Spacious dry warehouse with high ceilings and excellent ventilation. Located in Riyadh Industrial City with easy access to major highways.',
    category: 'warehouse',
    subType: 'Dry / Ambient',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 25000,
    priceUnit: 'month',
    annualPrice: 300000,
    size: 2500,
    location: 'Industrial City, Second Industrial Area',
    city: 'Riyadh',
    district: 'Industrial City',
    latitude: 24.7136,
    longitude: 46.6753,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-02-01',
    minDuration: 12,
    maxDuration: 60,
    ownerName: 'Ahmed Al-Rashid',
    ownerPhone: '+966501234567',
    typeAttributes: { temperatureSettings: 'dry', hazardLevel: 'low', flooring: 'concrete' }
  },
  {
    id: '2',
    title: 'Cold Storage Facility with SFDA Approval',
    description: 'Temperature-controlled warehouse ideal for food and pharmaceutical storage. SFDA approved with full documentation.',
    category: 'warehouse',
    subType: 'Cold & Chilled',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 45000,
    priceUnit: 'month',
    annualPrice: 540000,
    size: 1800,
    location: 'Al Sulay, Industrial Zone',
    city: 'Riyadh',
    district: 'Al Sulay',
    latitude: 24.6289,
    longitude: 46.8467,
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80'],
    amenities: ['SFDA Food License', 'Municipality License', 'Civil Defense License', 'Security Cameras'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-01-15',
    minDuration: 24,
    maxDuration: 120,
    ownerName: 'Mohammed Al-Faisal',
    ownerPhone: '+966509876543',
    typeAttributes: { temperatureSettings: 'cold', hazardLevel: 'low', flooring: 'epoxy' }
  },
  {
    id: '3',
    title: 'Port-Side Industrial Warehouse',
    description: 'Prime location warehouse near Jeddah Islamic Port. Ideal for import/export businesses.',
    category: 'warehouse',
    subType: 'Industrial Storage',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 35000,
    priceUnit: 'month',
    annualPrice: 420000,
    size: 3200,
    location: 'Jeddah Islamic Port Industrial Area',
    city: 'Jeddah',
    district: 'Port Area',
    latitude: 21.4858,
    longitude: 39.1925,
    imageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-03-01',
    minDuration: 12,
    maxDuration: 60,
    ownerName: 'Khalid Al-Harbi',
    ownerPhone: '+966502345678',
    typeAttributes: { temperatureSettings: 'dry', hazardLevel: 'medium', flooring: 'concrete' }
  },
  {
    id: '4',
    title: 'Auto Workshop with Service Bays',
    description: 'Fully equipped automotive workshop with 6 service bays, hydraulic lifts, and inspection pit.',
    category: 'workshop',
    subType: 'Auto Workshop',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: true,
    price: 18000,
    priceUnit: 'month',
    annualPrice: 216000,
    size: 800,
    location: 'Al Shifa Industrial Area',
    city: 'Riyadh',
    district: 'Al Shifa',
    latitude: 24.5892,
    longitude: 46.7234,
    imageUrl: 'https://images.unsplash.com/photo-1580983218765-e6e3a8a60c12?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1580983218765-e6e3a8a60c12?w=800&q=80'],
    amenities: ['Municipality License', 'Civil Defense License', 'Electricity', 'Water', 'Sewage'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-02-15',
    minDuration: 12,
    maxDuration: 60,
    ownerName: 'Fahad Al-Otaibi',
    ownerPhone: '+966505678901',
    typeAttributes: { powerCapacity: '100 kVA', ventilation: 'mechanical', equipmentIncluded: true }
  },
  {
    id: '5',
    title: 'SME Inventory Storage Units',
    description: 'Secure storage units perfect for small business inventory. 24/7 access, climate controlled.',
    category: 'storage',
    subType: 'SME Inventory',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: true,
    forLeaseTransfer: false,
    price: 3500,
    priceUnit: 'month',
    annualPrice: 42000,
    size: 50,
    location: 'Al Malaz Storage Complex',
    city: 'Riyadh',
    district: 'Al Malaz',
    latitude: 24.6678,
    longitude: 46.7234,
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80'],
    amenities: ['Security Cameras', 'Electricity'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: 1,
    maxDuration: null,
    ownerName: null,
    ownerPhone: '+966509012345',
    typeAttributes: { unitSize: 'medium', climateControlled: true, accessHours: '24/7' }
  },
  {
    id: '6',
    title: 'Prime Retail Showroom - Olaya',
    description: 'High-visibility showroom on Olaya Street. Large glass facade, high foot traffic area.',
    category: 'storefront',
    subType: 'Showroom',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: true,
    price: 85000,
    priceUnit: 'month',
    annualPrice: 1020000,
    size: 450,
    location: 'Olaya Street',
    city: 'Riyadh',
    district: 'Olaya',
    latitude: 24.6912,
    longitude: 46.6845,
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80'],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water', 'Sewage'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-03-01',
    minDuration: 24,
    maxDuration: 60,
    ownerName: 'Ibrahim Al-Saud',
    ownerPhone: '+966512345678',
    typeAttributes: { facadeType: 'glass', displayWindows: 4, footTraffic: 'high', parkingSpots: 8 }
  },
  {
    id: '7',
    title: 'Petrochemical Storage Facility',
    description: 'Specialized warehouse for petrochemical and industrial materials. Fully compliant with safety regulations.',
    category: 'warehouse',
    subType: 'Industrial Storage',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 75000,
    priceUnit: 'month',
    annualPrice: 900000,
    size: 6000,
    location: 'Dammam Industrial City',
    city: 'Dammam',
    district: 'Industrial City',
    latitude: 26.4207,
    longitude: 50.0888,
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80'],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water', 'Sewage'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-04-01',
    minDuration: 36,
    maxDuration: 120,
    ownerName: 'Sultan Al-Dosari',
    ownerPhone: '+966504567890',
    typeAttributes: { temperatureSettings: 'climate-controlled', hazardLevel: 'high', flooring: 'epoxy' }
  },
  {
    id: '8',
    title: 'SME Retail Space - Tahlia Street',
    description: 'Boutique retail space on popular Tahlia Street. Perfect for fashion, accessories, or specialty retail.',
    category: 'storefront',
    subType: 'SME Retail',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 45000,
    priceUnit: 'month',
    annualPrice: 540000,
    size: 180,
    location: 'Tahlia Street',
    city: 'Jeddah',
    district: 'Al Rawdah',
    latitude: 21.5789,
    longitude: 39.1234,
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80'],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-02-01',
    minDuration: 12,
    maxDuration: 36,
    ownerName: 'Layla Al-Juhani',
    ownerPhone: '+966514567890',
    typeAttributes: { facadeType: 'glass', displayWindows: 2, footTraffic: 'high', parkingSpots: 2 }
  },
];

// Convert Property to Ad format
function propertyToAd(property: Property): Ad {
  return {
    id: parseInt(property.id, 10) || 0,
    createdAt: new Date(),
    slug: `property-${property.id}`,
    title: property.title,
    description: property.description,
    userId: '00000000-0000-0000-0000-000000000000',
    images: property.images,
    phoneNumber: property.ownerPhone?.replace(/^\+\d+/, '') || '000000000',
    phoneCountryCode: '+966',
    city: property.city,
    country: 'Saudi Arabia',
    district: property.district,
    address: property.location,
    municipalityLicense: property.amenities.includes('Municipality License'),
    civilDefenseLicense: property.amenities.includes('Civil Defense License'),
    sfdaFoodLicense: property.amenities.includes('SFDA Food License'),
    sfdaCosmeticsLicense: false,
    sfdaMedicalEquipmentLicense: false,
    sfdaPharmaLicense: false,
    sfdaPetFoodLicense: false,
    sfdaPesticidesLicense: false,
    price: String(property.annualPrice),
    paymentTerm: property.priceUnit === 'day' ? 'daily' : property.priceUnit === 'month' ? 'monthly' : 'yearly',
    availableDateFrom: property.availableFrom || null,
    availableDateTo: null,
    type: property.subType,
    temperatureSettings: null,
    hazardLevel: null,
    flooring: null,
    forkliftAvailability: property.amenities.includes('Forklift Available') ? 'yes' : null,
    rackingSystem: null,
    numberOfStreets: null,
    numberOfDoors: null,
    numberOfWalls: null,
    areaInM2: String(property.size),
    securityCameras: property.amenities.includes('Security Cameras'),
    manualRamp: property.amenities.includes('Manual Ramp'),
    automaticRamp: property.amenities.includes('Automatic Ramp'),
    published: property.isAvailable,
    deleted: false,
    verified: property.isVerified,
    lat: property.latitude || null,
    lng: property.longitude || null,
    meetingUrl: null,
    dateAdded: null,
    facade: null,
    hasElectricity: property.amenities.includes('Electricity'),
    hasSewage: property.amenities.includes('Sewage'),
    hasWater: property.amenities.includes('Water'),
    lastUpdated: null,
    length: null,
    propertyAge: null,
    scrapedId: null,
    streetWidth: null,
    width: null,
    forRent: property.forRent,
    forSale: property.forSale,
    forDailyRent: property.forDailyRent,
    typeAttributes: property.typeAttributes || null,
  };
}

export class InMemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private visits: Map<string, Visit> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private savedProperties: Map<string, SavedProperty> = new Map();
  private ads: Map<number, Ad> = new Map();
  private nextAdId = 100;

  constructor() {
    // Initialize with hardcoded ads
    HARDCODED_PROPERTIES.forEach(prop => {
      const ad = propertyToAd(prop);
      this.ads.set(ad.id, ad);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === username);
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

  // Property methods - using hardcoded data
  async getProperties(): Promise<Property[]> {
    return [...HARDCODED_PROPERTIES];
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return HARDCODED_PROPERTIES.find(p => p.id === id);
  }

  async searchProperties(filters: PropertyFilters): Promise<Property[]> {
    let results = [...HARDCODED_PROPERTIES];

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
      results = results.filter((p) => p.annualPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.annualPrice <= filters.maxPrice!);
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
  }

  // Ad methods
  async getAdsByUserId(userId: string): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(ad => ad.userId === userId && !ad.deleted);
  }

  async getAd(id: number): Promise<Ad | undefined> {
    return this.ads.get(id);
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const id = this.nextAdId++;
    const ad: Ad = {
      ...insertAd,
      id,
      createdAt: new Date(),
      images: insertAd.images || [],
    } as Ad;
    this.ads.set(id, ad);
    return ad;
  }

  async updateAd(id: number, updates: Partial<InsertAd>): Promise<Ad | undefined> {
    const ad = this.ads.get(id);
    if (!ad) return undefined;
    const updated = { ...ad, ...updates };
    this.ads.set(id, updated);
    return updated;
  }

  async getPublishedAds(): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(ad => ad.published && !ad.deleted);
  }

  async getAllAds(): Promise<Ad[]> {
    return Array.from(this.ads.values()).filter(ad => !ad.deleted);
  }

  // Visit methods
  async getVisits(): Promise<Visit[]> {
    return Array.from(this.visits.values());
  }

  async getVisit(id: string): Promise<Visit | undefined> {
    return this.visits.get(id);
  }

  async getVisitsByProperty(propertyId: string): Promise<Visit[]> {
    return Array.from(this.visits.values()).filter((v) => v.propertyId === propertyId);
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

  async updateVisit(id: string, updates: Partial<InsertVisit>): Promise<Visit | undefined> {
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
    return Array.from(this.bookings.values()).filter((b) => b.propertyId === propertyId);
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((b) => b.userId === userId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { ...insertBooking, id } as Booking;
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updated = { ...booking, ...updates };
    this.bookings.set(id, updated);
    return updated;
  }

  // Saved Properties methods
  async getSavedProperties(userId: string): Promise<SavedProperty[]> {
    return Array.from(this.savedProperties.values()).filter((s) => s.userId === userId);
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

  // Cities methods
  async getCities(): Promise<City[]> {
    return [...HARDCODED_CITIES];
  }
}

export const storage = new InMemoryStorage();
