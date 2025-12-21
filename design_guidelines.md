# Sirdab Marketplace 2.0 - Design Guidelines

## Design Approach

**Reference-Based Approach** inspired by leading marketplace platforms:
- **Airbnb**: Card-based catalogue, search-first experience, clean property presentation
- **Zillow**: Real estate filters, map integration, property detail layouts
- **Linear**: Modern typography, clean spacing, efficient information density

**Core Principle**: Catalogue-first, transaction-ready commercial real estate marketplace prioritizing speed, clarity, and trust.

---

## Typography

**Font Stack**: Google Fonts
- **Primary**: Rubik (UI, body text, data) - matching Sirdab marketplace branding
  - Regular (400): Body text, descriptions
  - Medium (500): Labels, secondary headings
  - Semibold (600): Card titles, CTAs, primary headings
  - Bold (700): Page headers, hero text

## Brand Colors

**Primary Palette**: Sirdab Teal
- Primary: #05999E (HSL 181 95% 32%) - Main brand color, CTAs, active states
- Primary Foreground: White (#FFFFFF)
- Accent: #1F2937 (Dark gray) - Secondary text, navigation
- Background: #FFFFFF (White)
- Text Primary: #0C0A09 (Near black)

**Hierarchy**:
- Hero/H1: text-4xl md:text-5xl lg:text-6xl, font-bold
- Section Headers/H2: text-3xl md:text-4xl, font-semibold
- Card Titles/H3: text-xl md:text-2xl, font-semibold
- Property Specs: text-sm md:text-base, font-medium
- Body: text-base, font-normal
- Meta Info: text-sm, font-normal

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16, 20**
- Micro spacing: p-2, gap-2 (tight elements)
- Standard spacing: p-4, gap-4, mb-6 (cards, forms)
- Section spacing: py-12 md:py-16 lg:py-20 (vertical rhythm)
- Container padding: px-4 md:px-6 lg:px-8

**Container Strategy**:
- Global container: max-w-7xl mx-auto
- Content areas: max-w-6xl mx-auto
- Forms/detailed content: max-w-4xl mx-auto

**Grid Systems**:
- Property listings: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Filter sections: Two-column split (filters + results)
- Property details: 60/40 split (images/40%, info/60% on desktop)

---

## Component Library

### Navigation
- Sticky header with search bar prominence
- Category pills/tabs for warehouse/workshop/storage/storefront
- Filter toggle button for mobile
- User account dropdown

### Property Cards
- High-quality image (16:9 ratio, rounded corners)
- Price badge overlay (top-left, semi-transparent background)
- Property title, location with pin icon
- Key specs in pills (size, type, availability)
- "Schedule Visit" and "View Details" CTAs
- Saved/favorited state icon (top-right)

### Search & Filters
- Prominent search bar (location-based)
- Collapsible filter sidebar (desktop) / bottom sheet (mobile)
- Filter categories: Location, Size Range, Price Range, Property Type, Availability, Duration
- Active filter chips with clear option
- Map/List view toggle

### Property Detail Page
- Image gallery (primary large + thumbnail strip)
- Pricing card (sticky on desktop): Price, availability calendar, booking CTA
- Property specifications grid
- Location map embed
- Visit scheduler (calendar picker + time slots)
- Similar properties carousel

### Booking Flow
- Step indicator (Select Dates → Review → Payment)
- Summary sidebar (sticky): Property thumbnail, dates, total cost breakdown
- Form fields with clear validation
- Payment options with trust badges

### User Account
- Dashboard: Upcoming visits, active bookings, saved properties
- Simple tab navigation
- List view of items with key actions

---

## Images

**Hero Section**: 
Full-width hero (h-[60vh] md:h-[70vh]) featuring high-quality warehouse/commercial space photography with search overlay. Image should show a modern, well-lit commercial property to establish quality and trust.

**Property Cards**: 
Each listing card requires a primary image (aspect-ratio-16/9) showing the property's best angle. Use placeholder for unverified listings.

**Property Detail Gallery**: 
Minimum 5-8 images per property showing exterior, interior, loading areas, facilities. Large primary image (aspect-ratio-4/3) with thumbnail navigation.

**Category Headers**: 
Each category (Warehouses, Workshops, Storage, Storefronts) includes a background image treatment (h-48 md:h-64) with category title overlay.

**Trust Signals**: 
Small verification badge icons, payment provider logos in footer.

---

## Key Interactions

**Minimal Animation Strategy**:
- Smooth card hover: subtle lift (translate-y-1) + shadow enhancement
- Image crossfade in galleries (300ms)
- Filter panel slide transitions (mobile)
- No scroll animations, no parallax effects

**Mobile-First Priorities**:
- Bottom navigation for core actions
- Swipeable image galleries
- Full-screen filter overlay
- Sticky booking CTA button
- Click-to-call for visit scheduling

---

## Icons

**Library**: Heroicons (via CDN)
- Navigation: home, search, user, heart, calendar
- Property specs: ruler, warehouse, map-pin, clock
- Actions: chevron, filter, close, check
- Trust: shield-check, verified-badge

---

## Accessibility

- High contrast text on all backgrounds
- Focus indicators on interactive elements
- ARIA labels for icon-only buttons
- Keyboard navigation support throughout
- Form inputs with clear labels and error states
- Alt text for all property images