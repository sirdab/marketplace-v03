import { useState, useEffect } from 'react';
import type { Property, Ad } from '@shared/schema';
import { hardcodedProperties, getPropertyById } from '@/data';
import { hardcodedCities, type City } from '@/data/cities';

// Simulates async data fetch with a small delay for realistic loading states
const SIMULATED_DELAY = 100;

interface UsePropertiesResult {
  data: Property[];
  isLoading: boolean;
  error: null;
}

interface UsePropertyResult {
  data: Property | undefined;
  isLoading: boolean;
  error: null;
}

interface UseCitiesResult {
  data: City[];
  isLoading: boolean;
  error: null;
}

interface UseAdResult {
  data: Ad | undefined;
  isLoading: boolean;
  error: null;
}

interface UseAdsResult {
  data: Ad[];
  isLoading: boolean;
  error: null;
}

/**
 * Convert a Property to Ad format for pages that expect Ad type
 */
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

/**
 * Hook to get all properties (replaces useQuery for /api/properties)
 */
export function useProperties(): UsePropertiesResult {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Property[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(hardcodedProperties);
      setIsLoading(false);
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, error: null };
}

/**
 * Hook to get a single property by ID (replaces useQuery for /api/properties/:id)
 */
export function useProperty(id: string | undefined): UsePropertyResult {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Property | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setData(getPropertyById(id));
      setIsLoading(false);
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
  }, [id]);

  return { data, isLoading, error: null };
}

/**
 * Hook to get all cities (replaces useQuery for /api/cities)
 */
export function useCities(): UseCitiesResult {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<City[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(hardcodedCities);
      setIsLoading(false);
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, error: null };
}

/**
 * Hook to get a single ad by ID (replaces useQuery for /api/public/ads/:id)
 */
export function useAd(id: string | undefined): UseAdResult {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Ad | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      const property = getPropertyById(id);
      setData(property ? propertyToAd(property) : undefined);
      setIsLoading(false);
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
  }, [id]);

  return { data, isLoading, error: null };
}

/**
 * Hook to get ads by city (replaces useQuery for /api/public/ads/region/:country/:city)
 */
export function useAdsByCity(city: string | undefined): UseAdsResult {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Ad[]>([]);

  useEffect(() => {
    if (!city) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      // Convert city slug to match against property city names
      const normalizedCity = city.replace(/-/g, ' ').toLowerCase();
      const filteredProperties = hardcodedProperties.filter(
        p => p.city.toLowerCase() === normalizedCity ||
             p.city.toLowerCase().replace(/\s+/g, '-') === city.toLowerCase()
      );
      setData(filteredProperties.map(propertyToAd));
      setIsLoading(false);
    }, SIMULATED_DELAY);

    return () => clearTimeout(timer);
  }, [city]);

  return { data, isLoading, error: null };
}
