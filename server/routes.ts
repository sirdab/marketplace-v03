import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertPropertySchema,
  insertVisitSchema,
  insertBookingSchema,
  insertSavedPropertySchema,
  type PropertyFilters,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
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
        isVerified: req.query.verified === "true" ? true : undefined,
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
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const parsed = insertPropertySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const property = await storage.createProperty(parsed.data);
      res.status(201).json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.patch("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.updateProperty(req.params.id, req.body);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Visits endpoints
  app.get("/api/visits", async (req, res) => {
    try {
      const visits = await storage.getVisits();
      res.json(visits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      res.status(500).json({ error: "Failed to fetch visits" });
    }
  });

  app.get("/api/visits/:id", async (req, res) => {
    try {
      const visit = await storage.getVisit(req.params.id);
      if (!visit) {
        return res.status(404).json({ error: "Visit not found" });
      }
      res.json(visit);
    } catch (error) {
      console.error("Error fetching visit:", error);
      res.status(500).json({ error: "Failed to fetch visit" });
    }
  });

  app.post("/api/visits", async (req, res) => {
    try {
      const parsed = insertVisitSchema.safeParse({
        ...req.body,
        status: req.body.status || "pending",
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const visit = await storage.createVisit(parsed.data);
      res.status(201).json(visit);
    } catch (error) {
      console.error("Error creating visit:", error);
      res.status(500).json({ error: "Failed to create visit" });
    }
  });

  app.patch("/api/visits/:id", async (req, res) => {
    try {
      const visit = await storage.updateVisit(req.params.id, req.body);
      if (!visit) {
        return res.status(404).json({ error: "Visit not found" });
      }
      res.json(visit);
    } catch (error) {
      console.error("Error updating visit:", error);
      res.status(500).json({ error: "Failed to update visit" });
    }
  });

  // Bookings endpoints
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const parsed = insertBookingSchema.safeParse({
        ...req.body,
        status: req.body.status || "pending",
        paymentStatus: req.body.paymentStatus || "unpaid",
      });
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const booking = await storage.createBooking(parsed.data);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(req.params.id, req.body);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  // Saved properties endpoints
  app.get("/api/saved/:userId", async (req, res) => {
    try {
      const saved = await storage.getSavedProperties(req.params.userId);
      res.json(saved);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      res.status(500).json({ error: "Failed to fetch saved properties" });
    }
  });

  app.post("/api/saved", async (req, res) => {
    try {
      const parsed = insertSavedPropertySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const saved = await storage.saveProperty(parsed.data);
      res.status(201).json(saved);
    } catch (error) {
      console.error("Error saving property:", error);
      res.status(500).json({ error: "Failed to save property" });
    }
  });

  app.delete("/api/saved/:userId/:propertyId", async (req, res) => {
    try {
      const deleted = await storage.unsaveProperty(
        req.params.userId,
        req.params.propertyId
      );
      if (!deleted) {
        return res.status(404).json({ error: "Saved property not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error unsaving property:", error);
      res.status(500).json({ error: "Failed to unsave property" });
    }
  });

  // Categories metadata endpoint
  app.get("/api/categories", async (req, res) => {
    const categories = [
      { id: "warehouse", label: "Warehouses", description: "Dry, cold, cross-dock & industrial storage" },
      { id: "workshop", label: "Workshops", description: "Auto, manufacturing & light industrial" },
      { id: "storage", label: "Self-Storage", description: "SME inventory & personal storage" },
      { id: "storefront-long", label: "Long-Term Storefronts", description: "Showrooms, retail & service spaces" },
      { id: "storefront-short", label: "Short-Term Storefronts", description: "Pop-ups, events & brand activations" },
    ];
    res.json(categories);
  });

  return httpServer;
}
