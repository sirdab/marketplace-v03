// Re-export all hardcoded data from a single entry point
export { hardcodedProperties, getPropertyById, getPropertiesByCategory, getPropertiesByCity, searchProperties } from './properties';
export { hardcodedCities, getCityBySlug, getCityByName, getActiveCities } from './cities';
export type { City } from './cities';
