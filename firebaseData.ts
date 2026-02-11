import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Vehicle, Booking, FinancingRequest, SiteSettings, VehicleCategory, VehicleCondition } from './types';

const normalizeDate = (value: unknown): string => {
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return new Date().toISOString();
};

export const mapVehicleDoc = (doc: QueryDocumentSnapshot<DocumentData>): Vehicle => {
  const data = doc.data();

  return {
    id: doc.id,
    name: data.name ?? '',
    brand: data.brand ?? '',
    model: data.model ?? '',
    year: Number(data.year ?? new Date().getFullYear()),
    price: Number(data.price ?? 0),
    category: (data.category as VehicleCategory) ?? VehicleCategory.CAR,
    condition: (data.condition as VehicleCondition) ?? VehicleCondition.NEW,
    fuelType: data.fuelType ?? 'Gasoline',
    transmission: data.transmission ?? 'Automatic',
    bodyType: data.bodyType ?? '',
    location: data.location ?? 'Main Showroom',
    mileage: Number(data.mileage ?? 0),
    description: data.description ?? '',
    images: Array.isArray(data.images) ? data.images : [],
    specs: {
      engine: data.specs?.engine ?? '',
      transmission: data.specs?.transmission ?? '',
      drivetrain: data.specs?.drivetrain ?? '',
      exteriorColor: data.specs?.exteriorColor ?? '',
      interiorColor: data.specs?.interiorColor ?? ''
    },
    status: data.status ?? 'available',
    isFeatured: Boolean(data.isFeatured),
    isVerified: Boolean(data.isVerified),
    views: Number(data.views ?? 0),
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    createdAt: normalizeDate(data.createdAt)
  };
};

export const mapBookingDoc = (doc: QueryDocumentSnapshot<DocumentData>): Booking => {
  const data = doc.data();

  return {
    id: doc.id,
    vehicleId: data.vehicleId ?? '',
    vehicleName: data.vehicleName ?? '',
    customerName: data.customerName ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    driversLicense: data.driversLicense ?? '',
    date: data.date ?? '',
    time: data.time ?? '',
    location: data.location ?? '',
    notes: data.notes ?? '',
    status: data.status ?? 'pending'
  };
};

export const mapFinancingDoc = (doc: QueryDocumentSnapshot<DocumentData>): FinancingRequest => {
  const data = doc.data();

  return {
    id: doc.id,
    customerName: data.customerName ?? '',
    email: data.email ?? '',
    loanAmount: Number(data.loanAmount ?? 0),
    downPayment: Number(data.downPayment ?? 0),
    term: Number(data.term ?? 0),
    status: data.status ?? 'pending'
  };
};

export const mapSiteSettingsDoc = (data?: DocumentData | null): SiteSettings => {
  return {
    siteName: data?.siteName ?? 'AutoElite',
    heroBadge: data?.heroBadge ?? 'Welcome to the Elite Circle',
    heroTitle: data?.heroTitle ?? 'DRIVE THE EXCEPTIONAL',
    heroSubtitle: data?.heroSubtitle ?? 'Curated premium inventory for the modern connoisseur. Experience unparalleled quality and service.',
    heroImageUrl: data?.heroImageUrl ?? 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000'
  };
};
