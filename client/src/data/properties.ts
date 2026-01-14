import type { Property, PropertyCategory } from '@shared/schema';

export const hardcodedProperties: Property[] = [
  // WAREHOUSES - Riyadh
  {
    id: '1',
    title: 'Modern Dry Warehouse in Industrial City',
    description: 'Spacious dry warehouse with high ceilings and excellent ventilation. Located in Riyadh Industrial City with easy access to major highways. Features include loading docks, office space, and 24/7 security.',
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
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
      'https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water', 'Manual Ramp'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-02-01',
    minDuration: 12,
    maxDuration: 60,
    ownerName: 'Ahmed Al-Rashid',
    ownerPhone: '+966501234567',
    typeAttributes: {
      temperatureSettings: 'dry',
      hazardLevel: 'low',
      flooring: 'concrete',
      forkliftAvailability: '24/7',
      ceilingHeight: '12m',
      loadingDocks: 4
    }
  },
  {
    id: '2',
    title: 'Cold Storage Facility with SFDA Approval',
    description: 'Temperature-controlled warehouse ideal for food and pharmaceutical storage. SFDA approved with full documentation. Features multiple temperature zones from -25°C to +8°C.',
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
    images: [
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
      'https://images.unsplash.com/photo-1586528116022-dc59ec1b0d5a?w=800&q=80'
    ],
    amenities: ['SFDA Food License', 'Municipality License', 'Civil Defense License', 'Security Cameras', 'Automatic Ramp', 'Temp: cold'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-01-15',
    minDuration: 24,
    maxDuration: 120,
    ownerName: 'Mohammed Al-Faisal',
    ownerPhone: '+966509876543',
    typeAttributes: {
      temperatureSettings: 'cold',
      hazardLevel: 'low',
      flooring: 'epoxy',
      forkliftAvailability: '24/7',
      ceilingHeight: '8m',
      loadingDocks: 2
    }
  },
  {
    id: '3',
    title: 'Cross-Dock Distribution Center',
    description: 'Strategic cross-docking facility with 12 loading bays. Perfect for logistics and distribution operations. Located near King Khalid International Airport.',
    category: 'warehouse',
    subType: 'Cross-dock',
    purpose: 'rent',
    forRent: true,
    forSale: true,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 65000,
    priceUnit: 'month',
    annualPrice: 780000,
    size: 4500,
    location: 'Airport Industrial City',
    city: 'Riyadh',
    district: 'Airport Area',
    latitude: 24.9578,
    longitude: 46.6989,
    imageUrl: 'https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&q=80',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water', 'Sewage', 'Automatic Ramp', 'Forklift Available'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: 12,
    maxDuration: null,
    ownerName: null,
    ownerPhone: '+966555123456',
    typeAttributes: {
      temperatureSettings: 'dry',
      hazardLevel: 'low',
      flooring: 'concrete',
      forkliftAvailability: '24/7',
      ceilingHeight: '14m',
      loadingDocks: 12,
      crossDocking: true
    }
  },

  // WAREHOUSES - Jeddah
  {
    id: '4',
    title: 'Port-Side Industrial Warehouse',
    description: 'Prime location warehouse near Jeddah Islamic Port. Ideal for import/export businesses. Features customs clearance support and bonded storage options.',
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
    images: [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water', 'Manual Ramp', 'Racking: Heavy-duty'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-03-01',
    minDuration: 12,
    maxDuration: 60,
    ownerName: 'Khalid Al-Harbi',
    ownerPhone: '+966502345678',
    typeAttributes: {
      temperatureSettings: 'dry',
      hazardLevel: 'medium',
      flooring: 'concrete',
      forkliftAvailability: 'day',
      ceilingHeight: '10m',
      loadingDocks: 6
    }
  },
  {
    id: '5',
    title: 'Modern Logistics Hub - South Jeddah',
    description: 'State-of-the-art logistics facility with advanced inventory management systems. Perfect for e-commerce fulfillment operations. Multiple temperature zones available.',
    category: 'warehouse',
    subType: 'Dry / Ambient',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 55000,
    priceUnit: 'month',
    annualPrice: 660000,
    size: 5000,
    location: 'South Industrial City',
    city: 'Jeddah',
    district: 'Al Khumra',
    latitude: 21.3891,
    longitude: 39.2145,
    imageUrl: 'https://images.unsplash.com/photo-1586528116022-dc59ec1b0d5a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586528116022-dc59ec1b0d5a?w=800&q=80',
      'https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&q=80',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'SFDA Food License', 'Security Cameras', 'Electricity', 'Water', 'Sewage', 'Automatic Ramp'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: 24,
    maxDuration: null,
    ownerName: null,
    ownerPhone: '+966503456789',
    typeAttributes: {
      temperatureSettings: 'climate-controlled',
      hazardLevel: 'low',
      flooring: 'epoxy',
      forkliftAvailability: '24/7',
      ceilingHeight: '12m',
      loadingDocks: 8
    }
  },

  // WAREHOUSES - Dammam
  {
    id: '6',
    title: 'Petrochemical Storage Facility',
    description: 'Specialized warehouse for petrochemical and industrial materials. Fully compliant with safety regulations. Fire suppression systems and hazmat handling capabilities.',
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
    images: [
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water', 'Sewage', 'Automatic Ramp'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-04-01',
    minDuration: 36,
    maxDuration: 120,
    ownerName: 'Sultan Al-Dosari',
    ownerPhone: '+966504567890',
    typeAttributes: {
      temperatureSettings: 'climate-controlled',
      hazardLevel: 'high',
      flooring: 'epoxy',
      forkliftAvailability: '24/7',
      ceilingHeight: '15m',
      loadingDocks: 10
    }
  },

  // WORKSHOPS - Riyadh
  {
    id: '7',
    title: 'Auto Workshop with Service Bays',
    description: 'Fully equipped automotive workshop with 6 service bays, hydraulic lifts, and inspection pit. Includes waiting area and parts storage. Perfect for car service center.',
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
    images: [
      'https://images.unsplash.com/photo-1580983218765-e6e3a8a60c12?w=800&q=80',
      'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Electricity', 'Water', 'Sewage'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-02-15',
    minDuration: 12,
    maxDuration: 60,
    ownerName: 'Fahad Al-Otaibi',
    ownerPhone: '+966505678901',
    typeAttributes: {
      powerCapacity: '100 kVA',
      ventilation: 'mechanical',
      equipmentIncluded: true,
      threePhaseElectric: true,
      pitAvailable: true
    }
  },
  {
    id: '8',
    title: 'Light Manufacturing Workshop',
    description: 'Industrial workshop suitable for light manufacturing, assembly, and packaging operations. Three-phase power, overhead crane, and generous floor space.',
    category: 'workshop',
    subType: 'Light Manufacturing',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 22000,
    priceUnit: 'month',
    annualPrice: 264000,
    size: 1200,
    location: 'Second Industrial City',
    city: 'Riyadh',
    district: 'Industrial City',
    latitude: 24.7012,
    longitude: 46.6823,
    imageUrl: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
      'https://images.unsplash.com/photo-1580983218765-e6e3a8a60c12?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: 12,
    maxDuration: null,
    ownerName: null,
    ownerPhone: '+966506789012',
    typeAttributes: {
      powerCapacity: '200 kVA',
      ventilation: 'both',
      equipmentIncluded: false,
      threePhaseElectric: true,
      craneAvailable: true
    }
  },

  // WORKSHOPS - Jeddah
  {
    id: '9',
    title: 'Carpentry & Metal Workshop',
    description: 'Spacious workshop ideal for carpentry, metalwork, or fabrication. Dust extraction system installed. Good height clearance and ventilation.',
    category: 'workshop',
    subType: 'Carpentry / Metal',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 15000,
    priceUnit: 'month',
    annualPrice: 180000,
    size: 600,
    location: 'Al Harazat Industrial',
    city: 'Jeddah',
    district: 'Al Harazat',
    latitude: 21.5234,
    longitude: 39.1567,
    imageUrl: 'https://images.unsplash.com/photo-1588783948922-b39202546a81?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588783948922-b39202546a81?w=800&q=80',
      'https://images.unsplash.com/photo-1580983218765-e6e3a8a60c12?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Electricity', 'Water'],
    isVerified: false,
    isAvailable: true,
    availableFrom: '2024-01-01',
    minDuration: 12,
    maxDuration: 36,
    ownerName: 'Yasser Al-Maliki',
    ownerPhone: '+966507890123',
    typeAttributes: {
      powerCapacity: '75 kVA',
      ventilation: 'mechanical',
      equipmentIncluded: false,
      threePhaseElectric: true
    }
  },

  // WORKSHOPS - Al Khobar
  {
    id: '10',
    title: 'Small Industrial Unit - Al Khobar',
    description: 'Compact industrial workshop perfect for small-scale manufacturing or repairs. Located in accessible area with parking. Clean and ready for immediate use.',
    category: 'workshop',
    subType: 'Small Industrial',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: true,
    forLeaseTransfer: false,
    price: 12000,
    priceUnit: 'month',
    annualPrice: 144000,
    size: 400,
    location: 'Al Thuqbah Industrial',
    city: 'Al Khobar',
    district: 'Al Thuqbah',
    latitude: 26.2891,
    longitude: 50.2134,
    imageUrl: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Electricity', 'Water'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: 6,
    maxDuration: null,
    ownerName: 'Nasser Al-Ghamdi',
    ownerPhone: '+966508901234',
    typeAttributes: {
      powerCapacity: '50 kVA',
      ventilation: 'natural',
      equipmentIncluded: false,
      threePhaseElectric: true
    }
  },

  // STORAGE - Riyadh
  {
    id: '11',
    title: 'SME Inventory Storage Units',
    description: 'Secure storage units perfect for small business inventory. 24/7 access, climate controlled, with inventory management support available. Various unit sizes.',
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
    images: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
    ],
    amenities: ['Security Cameras', 'Electricity'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: 1,
    maxDuration: null,
    ownerName: null,
    ownerPhone: '+966509012345',
    typeAttributes: {
      unitSize: 'medium',
      climateControlled: true,
      accessHours: '24/7',
      securityLevel: 'premium'
    }
  },
  {
    id: '12',
    title: 'Personal Storage - North Riyadh',
    description: 'Clean and secure personal storage units. Ideal for household items, furniture, or personal belongings. Monthly rentals with flexible terms.',
    category: 'storage',
    subType: 'Personal Storage',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 1500,
    priceUnit: 'month',
    annualPrice: 18000,
    size: 25,
    location: 'Al Yasmin Storage',
    city: 'Riyadh',
    district: 'Al Yasmin',
    latitude: 24.8234,
    longitude: 46.6345,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
    ],
    amenities: ['Security Cameras'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-01-10',
    minDuration: 1,
    maxDuration: 24,
    ownerName: 'Sara Al-Hussein',
    ownerPhone: '+966510123456',
    typeAttributes: {
      unitSize: 'small',
      climateControlled: false,
      accessHours: 'extended',
      securityLevel: 'standard'
    }
  },

  // STORAGE - Jeddah
  {
    id: '13',
    title: 'Overflow & Seasonal Storage',
    description: 'Large storage space for businesses needing seasonal or overflow inventory storage. Flexible rental terms. Forklift access available.',
    category: 'storage',
    subType: 'Overflow / Seasonal',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: true,
    forLeaseTransfer: false,
    price: 8000,
    priceUnit: 'month',
    annualPrice: 96000,
    size: 200,
    location: 'Al Safa Business Park',
    city: 'Jeddah',
    district: 'Al Safa',
    latitude: 21.5567,
    longitude: 39.1789,
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
    ],
    amenities: ['Security Cameras', 'Electricity', 'Manual Ramp', 'Forklift Available'],
    isVerified: false,
    isAvailable: true,
    availableFrom: null,
    minDuration: 1,
    maxDuration: null,
    ownerName: 'Omar Al-Zahrani',
    ownerPhone: '+966511234567',
    typeAttributes: {
      unitSize: 'extra-large',
      climateControlled: false,
      accessHours: 'business',
      securityLevel: 'basic'
    }
  },

  // STOREFRONTS - Riyadh
  {
    id: '14',
    title: 'Prime Retail Showroom - Olaya',
    description: 'High-visibility showroom on Olaya Street. Large glass facade, high foot traffic area. Ideal for automotive, furniture, or electronics showroom.',
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
    images: [
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water', 'Sewage'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-03-01',
    minDuration: 24,
    maxDuration: 60,
    ownerName: 'Ibrahim Al-Saud',
    ownerPhone: '+966512345678',
    typeAttributes: {
      facadeType: 'glass',
      displayWindows: 4,
      footTraffic: 'high',
      parkingSpots: 8,
      streetLevel: true
    }
  },
  {
    id: '15',
    title: 'Dark Store for E-commerce',
    description: 'Ready-to-use dark store facility for quick commerce and delivery operations. Strategic location with easy access to residential areas.',
    category: 'storefront',
    subType: 'Dark Store',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 28000,
    priceUnit: 'month',
    annualPrice: 336000,
    size: 300,
    location: 'Al Muruj Commercial Area',
    city: 'Riyadh',
    district: 'Al Muruj',
    latitude: 24.7456,
    longitude: 46.6234,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'SFDA Food License', 'Security Cameras', 'Electricity', 'Water'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: 12,
    maxDuration: null,
    ownerName: null,
    ownerPhone: '+966513456789',
    typeAttributes: {
      facadeType: 'solid',
      footTraffic: 'low',
      parkingSpots: 4,
      streetLevel: true
    }
  },

  // STOREFRONTS - Jeddah
  {
    id: '16',
    title: 'SME Retail Space - Tahlia Street',
    description: 'Boutique retail space on popular Tahlia Street. Perfect for fashion, accessories, or specialty retail. High foot traffic and affluent customer base.',
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
    images: [
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80',
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Security Cameras', 'Electricity', 'Water'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-02-01',
    minDuration: 12,
    maxDuration: 36,
    ownerName: 'Layla Al-Juhani',
    ownerPhone: '+966514567890',
    typeAttributes: {
      facadeType: 'glass',
      displayWindows: 2,
      footTraffic: 'high',
      parkingSpots: 2,
      streetLevel: true
    }
  },
  {
    id: '17',
    title: 'Pop-up Space - Red Sea Mall',
    description: 'Temporary retail space inside Red Sea Mall. Perfect for product launches, seasonal campaigns, or market testing. Fully fitted and ready to use.',
    category: 'storefront',
    subType: 'Pop-up Space',
    purpose: 'daily_rent',
    forRent: false,
    forSale: false,
    forDailyRent: true,
    forLeaseTransfer: false,
    price: 2500,
    priceUnit: 'day',
    annualPrice: 912500,
    size: 50,
    location: 'Red Sea Mall',
    city: 'Jeddah',
    district: 'Al Zahra',
    latitude: 21.6012,
    longitude: 39.1567,
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80'
    ],
    amenities: ['Security Cameras', 'Electricity'],
    isVerified: true,
    isAvailable: true,
    availableFrom: null,
    minDuration: null,
    maxDuration: null,
    ownerName: null,
    ownerPhone: '+966515678901',
    typeAttributes: {
      facadeType: 'mixed',
      displayWindows: 1,
      footTraffic: 'high',
      mallLocation: true
    }
  },

  // STOREFRONTS - Dammam
  {
    id: '18',
    title: 'Service Business Space',
    description: 'Versatile commercial space suitable for service businesses - salon, clinic, office, or professional services. Good parking and accessibility.',
    category: 'storefront',
    subType: 'Service Business',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 18000,
    priceUnit: 'month',
    annualPrice: 216000,
    size: 150,
    location: 'King Saud Street',
    city: 'Dammam',
    district: 'Al Faisaliyah',
    latitude: 26.4312,
    longitude: 50.1034,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Electricity', 'Water', 'Sewage'],
    isVerified: false,
    isAvailable: true,
    availableFrom: '2024-01-15',
    minDuration: 12,
    maxDuration: 48,
    ownerName: 'Mansour Al-Qahtani',
    ownerPhone: '+966516789012',
    typeAttributes: {
      facadeType: 'mixed',
      displayWindows: 1,
      footTraffic: 'medium',
      parkingSpots: 3,
      streetLevel: true
    }
  },

  // Additional properties for variety
  {
    id: '19',
    title: 'Budget Warehouse - Al Ahsa',
    description: 'Affordable warehouse space in Al Ahsa. Basic amenities with good access to agricultural areas. Suitable for bulk storage.',
    category: 'warehouse',
    subType: 'Dry / Ambient',
    purpose: 'rent',
    forRent: true,
    forSale: false,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 8000,
    priceUnit: 'month',
    annualPrice: 96000,
    size: 1500,
    location: 'Industrial Area',
    city: 'Al Ahsa',
    district: 'Al Hofuf',
    latitude: 25.3838,
    longitude: 49.5872,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Electricity', 'Manual Ramp'],
    isVerified: false,
    isAvailable: true,
    availableFrom: null,
    minDuration: 6,
    maxDuration: null,
    ownerName: 'Saad Al-Muhanna',
    ownerPhone: '+966517890123',
    typeAttributes: {
      temperatureSettings: 'dry',
      hazardLevel: 'low',
      flooring: 'concrete',
      forkliftAvailability: 'none',
      ceilingHeight: '8m',
      loadingDocks: 2
    }
  },
  {
    id: '20',
    title: 'Premium Auto Workshop - Buraydah',
    description: 'Modern auto workshop in Buraydah with state-of-the-art equipment. Includes diagnostic systems, lifts, and tire service area.',
    category: 'workshop',
    subType: 'Auto Workshop',
    purpose: 'rent',
    forRent: true,
    forSale: true,
    forDailyRent: false,
    forLeaseTransfer: false,
    price: 20000,
    priceUnit: 'month',
    annualPrice: 240000,
    size: 700,
    location: 'Automotive District',
    city: 'Buraydah',
    district: 'Al Iskan',
    latitude: 26.3264,
    longitude: 43.9750,
    imageUrl: 'https://images.unsplash.com/photo-1580983218765-e6e3a8a60c12?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1580983218765-e6e3a8a60c12?w=800&q=80',
      'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80'
    ],
    amenities: ['Municipality License', 'Civil Defense License', 'Electricity', 'Water', 'Sewage'],
    isVerified: true,
    isAvailable: true,
    availableFrom: '2024-02-01',
    minDuration: 12,
    maxDuration: 60,
    ownerName: 'Turki Al-Mutairi',
    ownerPhone: '+966518901234',
    typeAttributes: {
      powerCapacity: '150 kVA',
      ventilation: 'mechanical',
      equipmentIncluded: true,
      threePhaseElectric: true,
      pitAvailable: true
    }
  }
];

// Helper function to get properties by category
export function getPropertiesByCategory(category: PropertyCategory): Property[] {
  return hardcodedProperties.filter(p => p.category === category);
}

// Helper function to get properties by city
export function getPropertiesByCity(city: string): Property[] {
  return hardcodedProperties.filter(p => p.city.toLowerCase() === city.toLowerCase());
}

// Helper function to get a single property by ID
export function getPropertyById(id: string): Property | undefined {
  return hardcodedProperties.find(p => p.id === id);
}

// Helper function to search properties
export function searchProperties(query: string): Property[] {
  const lowerQuery = query.toLowerCase();
  return hardcodedProperties.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.city.toLowerCase().includes(lowerQuery) ||
    p.district.toLowerCase().includes(lowerQuery) ||
    p.location.toLowerCase().includes(lowerQuery)
  );
}
