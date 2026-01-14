export interface City {
  id: number;
  nameEn: string;
  nameAr: string;
  latitude: string;
  longitude: string;
  isActive: boolean;
  countryId: number;
  slug: string;
}

export const hardcodedCities: City[] = [
  {
    id: 1,
    nameEn: 'Riyadh',
    nameAr: 'الرياض',
    latitude: '24.7136',
    longitude: '46.6753',
    isActive: true,
    countryId: 1,
    slug: 'riyadh'
  },
  {
    id: 2,
    nameEn: 'Jeddah',
    nameAr: 'جدة',
    latitude: '21.4858',
    longitude: '39.1925',
    isActive: true,
    countryId: 1,
    slug: 'jeddah'
  },
  {
    id: 3,
    nameEn: 'Dammam',
    nameAr: 'الدمام',
    latitude: '26.4207',
    longitude: '50.0888',
    isActive: true,
    countryId: 1,
    slug: 'dammam'
  },
  {
    id: 4,
    nameEn: 'Al Khobar',
    nameAr: 'الخبر',
    latitude: '26.2891',
    longitude: '50.2134',
    isActive: true,
    countryId: 1,
    slug: 'al-khobar'
  },
  {
    id: 5,
    nameEn: 'Al Ahsa',
    nameAr: 'الأحساء',
    latitude: '25.3838',
    longitude: '49.5872',
    isActive: true,
    countryId: 1,
    slug: 'al-ahsa'
  },
  {
    id: 6,
    nameEn: 'Abha',
    nameAr: 'أبها',
    latitude: '18.2164',
    longitude: '42.5053',
    isActive: true,
    countryId: 1,
    slug: 'abha'
  },
  {
    id: 7,
    nameEn: 'Buraydah',
    nameAr: 'بريدة',
    latitude: '26.3264',
    longitude: '43.9750',
    isActive: true,
    countryId: 1,
    slug: 'buraydah'
  },
  {
    id: 8,
    nameEn: 'Mecca',
    nameAr: 'مكة المكرمة',
    latitude: '21.3891',
    longitude: '39.8579',
    isActive: true,
    countryId: 1,
    slug: 'mecca'
  },
  {
    id: 9,
    nameEn: 'Medina',
    nameAr: 'المدينة المنورة',
    latitude: '24.5247',
    longitude: '39.5692',
    isActive: true,
    countryId: 1,
    slug: 'medina'
  },
  {
    id: 10,
    nameEn: 'Tabuk',
    nameAr: 'تبوك',
    latitude: '28.3998',
    longitude: '36.5717',
    isActive: true,
    countryId: 1,
    slug: 'tabuk'
  },
  {
    id: 11,
    nameEn: 'Khamis Mushait',
    nameAr: 'خميس مشيط',
    latitude: '18.3000',
    longitude: '42.7333',
    isActive: true,
    countryId: 1,
    slug: 'khamis-mushait'
  }
];

// Helper function to get city by slug
export function getCityBySlug(slug: string): City | undefined {
  return hardcodedCities.find(c => c.slug.toLowerCase() === slug.toLowerCase());
}

// Helper function to get city by name (English)
export function getCityByName(name: string): City | undefined {
  return hardcodedCities.find(c => c.nameEn.toLowerCase() === name.toLowerCase());
}

// Helper function to get all active cities
export function getActiveCities(): City[] {
  return hardcodedCities.filter(c => c.isActive);
}
