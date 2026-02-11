
import { Vehicle, VehicleCategory, SiteSettings } from './types';

// Showroom inventory. In this version, the admin dashboard has been removed.
export const MOCK_VEHICLES: Vehicle[] = [];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'AutoElite',
  heroBadge: 'Welcome to the Elite Circle',
  heroTitle: 'DRIVE THE EXCEPTIONAL',
  heroSubtitle: 'Curated premium inventory for the modern connoisseur. Experience unparalleled quality and service.',
  heroImageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000'
};

export const CATEGORIES = [
  { 
    id: VehicleCategory.CAR, 
    name: 'Cars', 
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', 
    description: 'Sedans, SUVs & coupes' 
  },
  { 
    id: VehicleCategory.BIKE, 
    name: 'Motorcycles', 
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800', 
    description: 'Sport, cruiser & touring' 
  },
  { 
    id: VehicleCategory.TRUCK, 
    name: 'Trucks', 
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', 
    description: 'Pickups & commercial' 
  },
  { 
    id: VehicleCategory.BUS, 
    name: 'Buses', 
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800', 
    description: 'Passenger & transit' 
  }
];
