import { sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  bigint,
  boolean,
  timestamp,
  doublePrecision,
  uuid,
  date,
  jsonb,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name'),
  email: text('email'),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end', { withTimezone: true }),
  meetingUrl: text('meeting_url'),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type PropertyPurpose = 'buy' | 'rent' | 'daily_rent';

export const purposeLabels: Record<PropertyPurpose, string> = {
  buy: 'Buy',
  rent: 'Rent',
  daily_rent: 'Daily Rental',
};

export type PropertyCategory = 'warehouse' | 'workshop' | 'storage' | 'storefront';

export const categoryLabels: Record<PropertyCategory, string> = {
  warehouse: 'Warehouses',
  workshop: 'Workshops',
  storage: 'Self-Storage',
  storefront: 'Storefronts',
};

export const categoryDescriptions: Record<PropertyCategory, string> = {
  warehouse: 'Dry, cold, cross-dock & industrial storage',
  workshop: 'Auto, manufacturing & light industrial',
  storage: 'SME inventory & personal storage',
  storefront: 'Showrooms, retail & service spaces',
};

export const propertySubTypes: Record<PropertyCategory, string[]> = {
  warehouse: ['Dry / Ambient', 'Cold & Chilled', 'Cross-dock', 'Industrial Storage'],
  workshop: ['Auto Workshop', 'Light Manufacturing', 'Carpentry / Metal', 'Small Industrial'],
  storage: ['SME Inventory', 'Personal Storage', 'Overflow / Seasonal'],
  storefront: ['Dark Store', 'Showroom', 'SME Retail', 'Service Business', 'Pop-up Space'],
};

export const ads = pgTable('ads', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  userId: uuid('user_id').notNull(),
  images: text('images').array(),
  phoneNumber: text('phone_number').notNull().default('000000000'),
  phoneCountryCode: text('phone_country_code').default('000'),
  city: text('city').notNull().default('-'),
  country: text('country').notNull().default('-'),
  district: text('district').notNull().default('-'),
  address: text('address').notNull().default('-'),
  municipalityLicense: boolean('municipalityLicense').default(false),
  civilDefenseLicense: boolean('civilDefenseLicense'),
  sfdaFoodLicense: boolean('SFDAFoodLicense').default(false),
  sfdaCosmeticsLicense: boolean('SFDACosmeticsLicense').default(false),
  sfdaMedicalEquipmentLicense: boolean('SFDAMedicalEquipmentLicense').default(false),
  sfdaPharmaLicense: boolean('SFDAPharmaLicense').default(false),
  sfdaPetFoodLicense: boolean('SFDAPetFoodLicense').default(false),
  sfdaPesticidesLicense: boolean('SFDAPesticidesLicense').default(false),
  price: text('price').notNull().default('0'),
  paymentTerm: text('payment_term').default('monthly'),
  availableDateFrom: date('available_date_from'),
  availableDateTo: date('available_date_to'),
  type: text('type'),
  temperatureSettings: text('temperature_settings'),
  hazardLevel: text('hazard_level'),
  flooring: text('flooring'),
  forkliftAvailability: text('forklift_availability'),
  rackingSystem: text('racking_system'),
  numberOfStreets: text('number_of_streets'),
  numberOfDoors: text('number_of_doors'),
  numberOfWalls: text('number_of_walls'),
  areaInM2: text('area_in_m2'),
  securityCameras: boolean('security_cameras'),
  manualRamp: boolean('manual_ramp'),
  automaticRamp: boolean('automatic_ramp'),
  published: boolean('published').notNull().default(true),
  deleted: boolean('deleted').notNull().default(false),
  verified: boolean('verified').notNull().default(false),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  meetingUrl: text('meeting_url'),
  dateAdded: text('date_added'),
  facade: text('facade'),
  hasElectricity: boolean('has_electricity'),
  hasSewage: boolean('has_sewage'),
  hasWater: boolean('has_water'),
  lastUpdated: text('last_updated'),
  length: text('length'),
  propertyAge: text('property_age'),
  scrapedId: text('scraped_id'),
  streetWidth: text('street_width'),
  width: text('width'),
  forRent: boolean('for_rent').default(true),
  forSale: boolean('for_sale').default(false),
  forDailyRent: boolean('for_daily_rent').default(false),
  typeAttributes: jsonb('type_attributes'),
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
});

export type InsertAd = z.infer<typeof insertAdSchema>;
export type Ad = typeof ads.$inferSelect;

export const warehouseAttributesSchema = z.object({
  temperatureSettings: z.enum(['dry', 'cold', 'frozen', 'climate-controlled']).optional(),
  hazardLevel: z.enum(['low', 'medium', 'high']).optional(),
  flooring: z.enum(['concrete', 'epoxy', 'asphalt', 'tiles']).optional(),
  forkliftAvailability: z.enum(['none', 'day', '24/7']).optional(),
  rackingSystem: z.string().optional(),
  ceilingHeight: z.string().optional(),
  loadingDocks: z.number().optional(),
  crossDocking: z.boolean().optional(),
});

export const workshopAttributesSchema = z.object({
  powerCapacity: z.string().optional(),
  ventilation: z.enum(['natural', 'mechanical', 'both']).optional(),
  equipmentIncluded: z.boolean().optional(),
  threePhaseElectric: z.boolean().optional(),
  pitAvailable: z.boolean().optional(),
  craneAvailable: z.boolean().optional(),
});

export const storageAttributesSchema = z.object({
  unitSize: z.enum(['small', 'medium', 'large', 'extra-large']).optional(),
  climateControlled: z.boolean().optional(),
  accessHours: z.enum(['business', 'extended', '24/7']).optional(),
  securityLevel: z.enum(['basic', 'standard', 'premium']).optional(),
});

export const storefrontAttributesSchema = z.object({
  facadeType: z.enum(['glass', 'solid', 'mixed']).optional(),
  displayWindows: z.number().optional(),
  footTraffic: z.enum(['low', 'medium', 'high']).optional(),
  parkingSpots: z.number().optional(),
  mallLocation: z.boolean().optional(),
  streetLevel: z.boolean().optional(),
});

export type WarehouseAttributes = z.infer<typeof warehouseAttributesSchema>;
export type WorkshopAttributes = z.infer<typeof workshopAttributesSchema>;
export type StorageAttributes = z.infer<typeof storageAttributesSchema>;
export type StorefrontAttributes = z.infer<typeof storefrontAttributesSchema>;

export type TypeAttributes =
  | WarehouseAttributes
  | WorkshopAttributes
  | StorageAttributes
  | StorefrontAttributes;

export function getTypeAttributesSchema(category: PropertyCategory) {
  switch (category) {
    case 'warehouse':
      return warehouseAttributesSchema;
    case 'workshop':
      return workshopAttributesSchema;
    case 'storage':
      return storageAttributesSchema;
    case 'storefront':
      return storefrontAttributesSchema;
  }
}

export const cities = pgTable('cities', {
  id: bigint('ID', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  nameEn: text('Name'),
  nameAr: text('NameLocale'),
  latitude: text('Latitude'),
  longitude: text('Longitude'),
  isActive: boolean('Active'),
  countryId: bigint('Country ID', { mode: 'number' }),
});

export type City = typeof cities.$inferSelect;

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  content: text('content').notNull(),
  slug: text('slug').notNull(),
  author: text('author').default('Sirdab'),
  publishedAt: timestamp('published_at', { withTimezone: true }).default(sql`now()`),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`now()`),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  subType: string;
  purpose: PropertyPurpose;
  forRent: boolean;
  forSale: boolean;
  forDailyRent: boolean;
  forLeaseTransfer: boolean;
  price: number;
  priceUnit: string;
  annualPrice: number;
  size: number;
  location: string;
  city: string;
  district: string;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl: string;
  images: string[];
  amenities: string[];
  isVerified: boolean;
  isAvailable: boolean;
  availableFrom?: string | null;
  minDuration?: number | null;
  maxDuration?: number | null;
  ownerName?: string | null;
  ownerPhone?: string | null;
  typeAttributes?: TypeAttributes | null;
}

export type InsertProperty = Omit<Property, 'id'>;

export const visits = pgTable('visits', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  propertyId: text('property_id').notNull(),
  userId: uuid('user_id'),
  visitorName: text('visitor_name').notNull(),
  visitorEmail: text('visitor_email').notNull(),
  visitorPhone: text('visitor_phone').notNull(),
  visitDate: text('visit_date').notNull(),
  visitTime: text('visit_time').notNull(),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
});

export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;

export const bookings = pgTable('bookings', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  propertyId: text('property_id').notNull(),
  userId: uuid('user_id'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  totalPrice: bigint('total_price', { mode: 'number' }).notNull(),
  platformFee: bigint('platform_fee', { mode: 'number' }).notNull(),
  status: text('status').notNull().default('pending'),
  paymentStatus: text('payment_status').notNull().default('unpaid'),
  notes: text('notes'),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const savedProperties = pgTable('saved_properties', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  propertyId: text('property_id').notNull(),
});

export const insertSavedPropertySchema = createInsertSchema(savedProperties).omit({
  id: true,
});

export type InsertSavedProperty = z.infer<typeof insertSavedPropertySchema>;
export type SavedProperty = typeof savedProperties.$inferSelect;

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

export function adToProperty(ad: Ad): Property {
  const images = ad.images || [];
  const firstImage =
    images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80';

  let category: PropertyCategory = 'warehouse';
  const adType = ad.type?.toLowerCase() || '';
  if (adType.includes('workshop') || adType.includes('ورشة')) {
    category = 'workshop';
  } else if (adType.includes('storage') || adType.includes('تخزين')) {
    category = 'storage';
  } else if (adType.includes('storefront') || adType.includes('محل') || adType.includes('retail')) {
    category = 'storefront';
  }

  let purpose: PropertyPurpose = 'rent';
  let priceUnit = 'year';
  const paymentTerm = ad.paymentTerm?.toLowerCase() || 'yearly';
  if (paymentTerm === 'daily') {
    purpose = 'daily_rent';
    priceUnit = 'day';
  } else if (paymentTerm === 'monthly') {
    priceUnit = 'month';
  }

  const amenities: string[] = [];
  if (ad.municipalityLicense) amenities.push('Municipality License');
  if (ad.civilDefenseLicense) amenities.push('Civil Defense License');
  if (ad.sfdaFoodLicense) amenities.push('SFDA Food License');
  if (ad.securityCameras) amenities.push('Security Cameras');
  if (ad.manualRamp) amenities.push('Manual Ramp');
  if (ad.automaticRamp) amenities.push('Automatic Ramp');
  if (ad.hasElectricity) amenities.push('Electricity');
  if (ad.hasWater) amenities.push('Water');
  if (ad.hasSewage) amenities.push('Sewage');
  if (ad.forkliftAvailability === 'yes') amenities.push('Forklift Available');
  if (ad.rackingSystem) amenities.push(`Racking: ${ad.rackingSystem}`);
  if (ad.temperatureSettings) amenities.push(`Temp: ${ad.temperatureSettings}`);

  const parsedYearlyPrice = parseInt(ad.price, 10);
  const parsedSize = parseInt(ad.areaInM2 || '0', 10);

  let displayPrice = isNaN(parsedYearlyPrice) ? 0 : parsedYearlyPrice;
  if (paymentTerm === 'monthly' && displayPrice > 0) {
    displayPrice = Math.round(displayPrice / 12);
  } else if (paymentTerm === 'daily' && displayPrice > 0) {
    displayPrice = Math.round(displayPrice / 365);
  }

  const annualPrice = isNaN(parsedYearlyPrice) ? 0 : parsedYearlyPrice;

  const forRent = ad.forRent ?? true;
  const forSale = ad.forSale ?? false;
  const forDailyRent = ad.forDailyRent ?? false;
  const typeAttrs = ad.typeAttributes as Record<string, unknown> | null;
  const forLeaseTransfer = (typeAttrs?.forLeaseTransfer as boolean) ?? false;

  return {
    id: String(ad.id),
    title: ad.title,
    description: ad.description,
    category,
    subType: ad.type || 'General',
    purpose,
    forRent,
    forSale,
    forDailyRent,
    forLeaseTransfer,
    price: displayPrice,
    priceUnit,
    annualPrice,
    size: isNaN(parsedSize) ? 0 : parsedSize,
    location: ad.address !== '-' ? ad.address : `${ad.district}, ${ad.city}`,
    city: ad.city !== '-' ? ad.city : 'Unknown',
    district: ad.district !== '-' ? ad.district : 'Unknown',
    latitude: ad.lat != null && !isNaN(ad.lat) ? ad.lat : null,
    longitude: ad.lng != null && !isNaN(ad.lng) ? ad.lng : null,
    imageUrl: firstImage,
    images: images,
    amenities,
    isVerified: ad.verified ?? false,
    isAvailable: (ad.published ?? true) && !(ad.deleted ?? false),
    availableFrom: ad.availableDateFrom ? String(ad.availableDateFrom) : null,
    minDuration: null,
    maxDuration: null,
    ownerName: null,
    ownerPhone:
      ad.phoneNumber && ad.phoneNumber !== '000000000'
        ? `${ad.phoneCountryCode || ''}${ad.phoneNumber}`
        : null,
    typeAttributes: ad.typeAttributes as TypeAttributes | null,
  };
}
