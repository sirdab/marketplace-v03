import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { storage } from './storage';
import { requireAuth } from './auth';
import { z } from 'zod';
import {
  insertVisitSchema,
  insertBookingSchema,
  insertSavedPropertySchema,
  insertAdSchema,
  type PropertyFilters,
} from '@shared/schema';

const updateAdSchema = z.object({
  published: z.boolean().optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  price: z.string().optional(),
  paymentTerm: z.string().optional(),
  type: z.string().optional(),
  areaInM2: z.string().optional(),
  availableDateFrom: z.string().optional(),
  availableDateTo: z.string().optional(),
  phoneNumber: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  municipalityLicense: z.boolean().optional(),
  civilDefenseLicense: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  typeAttributes: z.record(z.any()).optional(),
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Properties endpoints
  app.get('/api/properties', async (req, res) => {
    try {
      const filters: PropertyFilters = {
        category: req.query.category as any,
        subType: req.query.subType as string,
        city: req.query.city as string,
        district: req.query.district as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        minSize: req.query.minSize ? parseInt(req.query.minSize as string) : undefined,
        maxSize: req.query.maxSize ? parseInt(req.query.maxSize as string) : undefined,
        isVerified: req.query.verified === 'true' ? true : undefined,
        searchQuery: req.query.q as string,
      };

      // Clean undefined values
      Object.keys(filters).forEach((key) => {
        if (filters[key as keyof PropertyFilters] === undefined) {
          delete filters[key as keyof PropertyFilters];
        }
      });

      const hasFilters = Object.keys(filters).length > 0;
      const properties = hasFilters
        ? await storage.searchProperties(filters)
        : await storage.getProperties();

      res.json(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.json(property);
    } catch (error) {
      console.error('Error fetching property:', error);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  });

  // Public Ads endpoints (for viewing published ads)
  app.get('/api/public/ads/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ad ID' });
      }
      const ad = await storage.getAd(id);
      if (!ad || !ad.published || ad.deleted) {
        return res.status(404).json({ error: 'Ad not found' });
      }
      res.json(ad);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ad' });
    }
  });

  function cityToSlug(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  app.get('/api/public/ads/region/:country/:city', async (req, res) => {
    try {
      const { city } = req.params;
      const [publishedAds, activeCities] = await Promise.all([
        storage.getPublishedAds(),
        storage.getCities(),
      ]);

      const citySlug = city.toLowerCase();
      const matchedCity = activeCities.find((c) => cityToSlug(c.nameEn) === citySlug);

      const filteredAds = publishedAds.filter((ad) => {
        if (!ad.city) return false;
        const adCity = ad.city.toLowerCase().trim();
        if (matchedCity) {
          return adCity === matchedCity.nameEn.toLowerCase().trim();
        }
        const cityLower = citySlug.replace(/-/g, ' ');
        return adCity.includes(cityLower) || cityLower.includes(adCity);
      });

      res.json(filteredAds);
    } catch (error) {
      console.error('Error fetching ads by region:', error);
      res.status(500).json({ error: 'Failed to fetch ads' });
    }
  });

  // User Ads endpoints (CRUD for user's own ads - all require authentication)
  app.get('/api/my-ads', requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const ads = await storage.getAdsByUserId(userId);
      res.json(ads);
    } catch (error) {
      console.error('Error fetching user ads:', error);
      res.status(500).json({ error: 'Failed to fetch ads' });
    }
  });

  app.get('/api/ads/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ad ID' });
      }
      const ad = await storage.getAd(id);
      if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
      }
      if (ad.userId !== req.user!.id) {
        return res.status(403).json({ error: 'You can only view your own ads' });
      }
      res.json(ad);
    } catch (error) {
      console.error('Error fetching ad:', error);
      res.status(500).json({ error: 'Failed to fetch ad' });
    }
  });

  app.post('/api/ads', requireAuth, async (req, res) => {
    try {
      // Ensure slug is exactly 21 ASCII characters (database constraint requirement)
      let slug = req.body.slug || '';
      const isValidSlug = /^[a-z0-9]+$/.test(slug) && slug.length === 21;
      if (!isValidSlug) {
        // Generate a unique 21-character ASCII slug
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        slug = '';
        for (let i = 0; i < 21; i++) {
          slug += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }

      const adData = {
        ...req.body,
        slug,
        userId: req.user!.id,
        country: req.body.country || 'Saudi Arabia',
        district: req.body.district || '-',
        address: req.body.address || '-',
        phoneNumber: req.body.phoneNumber || '000000000',
        phoneCountryCode: req.body.phoneCountryCode || '+966',
        published: req.body.published ?? true,
        deleted: false,
        verified: false,
        typeAttributes: req.body.typeAttributes || {},
      };

      const parsed = insertAdSchema.safeParse(adData);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }

      const ad = await storage.createAd(parsed.data);
      res.status(201).json(ad);
    } catch (error) {
      console.error('Error creating ad - Full error:', error);
      console.error('Error message:', (error as Error).message);
      console.error('Error stack:', (error as Error).stack);
      res.status(500).json({ error: 'Failed to create ad' });
    }
  });

  app.patch('/api/ads/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ad ID' });
      }
      const existingAd = await storage.getAd(id);
      if (!existingAd) {
        return res.status(404).json({ error: 'Ad not found' });
      }
      if (existingAd.userId !== req.user!.id) {
        return res.status(403).json({ error: 'You can only update your own ads' });
      }
      const parsed = updateAdSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const ad = await storage.updateAd(id, parsed.data);
      res.json(ad);
    } catch (error) {
      console.error('Error updating ad:', error);
      res.status(500).json({ error: 'Failed to update ad' });
    }
  });

  // Visits endpoints
  app.get('/api/visits', async (req, res) => {
    try {
      const visits = await storage.getVisits();
      res.json(visits);
    } catch (error) {
      console.error('Error fetching visits:', error);
      res.status(500).json({ error: 'Failed to fetch visits' });
    }
  });

  app.get('/api/visits/:id', async (req, res) => {
    try {
      const visit = await storage.getVisit(req.params.id);
      if (!visit) {
        return res.status(404).json({ error: 'Visit not found' });
      }
      res.json(visit);
    } catch (error) {
      console.error('Error fetching visit:', error);
      res.status(500).json({ error: 'Failed to fetch visit' });
    }
  });

  app.post('/api/visits', async (req, res) => {
    try {
      const parsed = insertVisitSchema.safeParse({
        ...req.body,
        status: req.body.status || 'pending',
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const visit = await storage.createVisit(parsed.data);
      res.status(201).json(visit);
    } catch (error) {
      console.error('Error creating visit:', error);
      res.status(500).json({ error: 'Failed to create visit' });
    }
  });

  app.patch('/api/visits/:id', async (req, res) => {
    try {
      const visit = await storage.updateVisit(req.params.id, req.body);
      if (!visit) {
        return res.status(404).json({ error: 'Visit not found' });
      }
      res.json(visit);
    } catch (error) {
      console.error('Error updating visit:', error);
      res.status(500).json({ error: 'Failed to update visit' });
    }
  });

  // Bookings endpoints
  app.get('/api/bookings', async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  app.get('/api/bookings/:id', async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const parsed = insertBookingSchema.safeParse({
        ...req.body,
        status: req.body.status || 'pending',
        paymentStatus: req.body.paymentStatus || 'unpaid',
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const booking = await storage.createBooking(parsed.data);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  app.patch('/api/bookings/:id', async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  // Saved properties endpoints
  app.get('/api/saved/:userId', async (req, res) => {
    try {
      const saved = await storage.getSavedProperties(req.params.userId);
      res.json(saved);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      res.status(500).json({ error: 'Failed to fetch saved properties' });
    }
  });

  app.post('/api/saved', async (req, res) => {
    try {
      const parsed = insertSavedPropertySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const saved = await storage.saveProperty(parsed.data);
      res.status(201).json(saved);
    } catch (error) {
      console.error('Error saving property:', error);
      res.status(500).json({ error: 'Failed to save property' });
    }
  });

  app.delete('/api/saved/:userId/:propertyId', async (req, res) => {
    try {
      const deleted = await storage.unsaveProperty(req.params.userId, req.params.propertyId);
      if (!deleted) {
        return res.status(404).json({ error: 'Saved property not found' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Error unsaving property:', error);
      res.status(500).json({ error: 'Failed to unsave property' });
    }
  });

  // Cities endpoint
  app.get('/api/cities', async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'Failed to fetch cities' });
    }
  });

  // Admin endpoints - all ads (requires auth)
  app.get('/api/admin/ads', requireAuth, async (req, res) => {
    try {
      const allAds = await storage.getAllAds();
      res.json(allAds);
    } catch (error) {
      console.error('Error fetching all ads:', error);
      res.status(500).json({ error: 'Failed to fetch ads' });
    }
  });

  // Categories metadata endpoint
  app.get('/api/categories', async (req, res) => {
    const categories = [
      {
        id: 'warehouse',
        label: 'Warehouses',
        description: 'Dry, cold, cross-dock & industrial storage',
      },
      { id: 'workshop', label: 'Workshops', description: 'Auto, manufacturing & light industrial' },
      { id: 'storage', label: 'Self-Storage', description: 'SME inventory & personal storage' },
      {
        id: 'storefront',
        label: 'Storefronts',
        description: 'Showrooms, retail, pop-ups & service spaces',
      },
    ];
    res.json(categories);
  });

  // SEO Endpoints - robots.txt, sitemaps
  function getBaseUrl(req: any): string {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers.host || req.hostname;
    return `${protocol}://${host}`;
  }

  function escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function toSlug(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  app.get('/robots.txt', (req, res) => {
    const baseUrl = getBaseUrl(req);
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-0.xml
`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = getBaseUrl(req);
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
`);
  });

  const FALLBACK_CITIES = [
    'riyadh',
    'jeddah',
    'dammam',
    'al-khobar',
    'al-ahsa',
    'abha',
    'buraydah',
    'mecca',
    'medina',
    'tabuk',
    'khamis-mushait',
  ];

  app.get('/sitemap-0.xml', async (req, res) => {
    try {
      const baseUrl = escapeXml(getBaseUrl(req));
      const [publishedAds, activeCities] = await Promise.all([
        storage.getPublishedAds(),
        storage.getCities(),
      ]);
      const now = new Date().toISOString();

      let urlEntries = '';

      for (const ad of publishedAds) {
        const lastmod = ad.createdAt ? new Date(ad.createdAt).toISOString() : now;
        urlEntries += `  <url>
    <loc>${baseUrl}/ads/${escapeXml(String(ad.id))}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }

      const citySlugs =
        activeCities.length > 0 ? activeCities.map((city) => toSlug(city.nameEn)) : FALLBACK_CITIES;

      for (const citySlug of citySlugs) {
        urlEntries += `  <url>
    <loc>${baseUrl}/ads/region/sa/${escapeXml(citySlug)}</loc>
    <lastmod>${escapeXml(now)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }

      res.set('Content-Type', 'application/xml; charset=utf-8');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}</urlset>
`);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  return httpServer;
}
