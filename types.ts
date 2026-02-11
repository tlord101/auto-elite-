
export enum VehicleCategory {
  CAR = 'CAR',
  BIKE = 'BIKE',
  TRUCK = 'TRUCK',
  BUS = 'BUS'
}

export enum VehicleCondition {
  NEW = 'NEW',
  USED = 'USED',
  CERTIFIED = 'CERTIFIED'
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SiteSettings {
  siteName: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: VehicleCategory;
  condition: VehicleCondition;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic' | 'Semi-Auto';
  bodyType: string;
  location: string;
  mileage: number;
  description: string;
  images: string[];
  specs: {
    engine: string;
    transmission: string;
    drivetrain: string;
    exteriorColor: string;
    interiorColor: string;
  };
  status: 'available' | 'sold' | 'pending';
  isFeatured?: boolean;
  isVerified?: boolean;
  views: number;
  reviews: Review[];
  createdAt: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  email: string;
  phone: string;
  driversLicense: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rescheduled' | 'rejected';
}

export interface FinancingRequest {
  id: string;
  customerName: string;
  email: string;
  loanAmount: number;
  downPayment: number;
  term: number;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}
