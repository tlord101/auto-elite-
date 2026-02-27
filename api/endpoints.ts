import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebaseClient';
import { mapBookingDoc, mapFinancingDoc, mapSiteSettingsDoc, mapVehicleDoc } from '../firebaseData';
import { Booking, FinancingRequest, SiteSettings, Vehicle, VehicleCategory, VehicleCondition } from '../types';

export interface UploadableImageItem {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
}

export const subscribeVehicles = (onData: (vehicles: Vehicle[]) => void) => {
  const vehicleQuery = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
  return onSnapshot(vehicleQuery, (snapshot) => {
    onData(snapshot.docs.map(mapVehicleDoc));
  });
};

export const subscribeSiteSettings = (onData: (settings: SiteSettings) => void) => {
  const settingsRef = doc(db, 'siteSettings', 'global');
  return onSnapshot(settingsRef, (snapshot) => {
    if (!snapshot.exists()) {
      onData(mapSiteSettingsDoc(null));
      return;
    }

    onData(mapSiteSettingsDoc(snapshot.data()));
  });
};

export const incrementVehicleViews = async (vehicleId: string) => {
  await updateDoc(doc(db, 'vehicles', vehicleId), { views: increment(1) });
};

export const submitBookingRequest = async (payload: {
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
}) => {
  await addDoc(collection(db, 'bookings'), {
    ...payload,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const submitFinancingRequest = async (payload: {
  customerName: string;
  email: string;
  loanAmount: number;
  downPayment: number;
  term: number;
}) => {
  await addDoc(collection(db, 'financingRequests'), {
    ...payload,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const observeAdminAuth = (onData: (user: User | null) => void) => onAuthStateChanged(auth, onData);

export const getCurrentAdminUser = () => auth.currentUser;

export const signInAdmin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const signOutAdmin = () => signOut(auth);

export const verifyAdminAccess = async (uid: string) => {
  const adminRef = doc(db, 'admins', uid);
  const adminSnap = await getDoc(adminRef);
  return adminSnap.exists();
};

export const subscribeAdminBookings = (onData: (bookings: Booking[]) => void) => {
  const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  return onSnapshot(bookingsQuery, (snapshot) => {
    onData(snapshot.docs.map(mapBookingDoc));
  });
};

export const updateBookingStatus = (id: string, status: Booking['status']) =>
  updateDoc(doc(db, 'bookings', id), { status });

export const subscribeAdminFinancing = (onData: (requests: FinancingRequest[]) => void) => {
  const financingQuery = query(collection(db, 'financingRequests'), orderBy('createdAt', 'desc'));
  return onSnapshot(financingQuery, (snapshot) => {
    onData(snapshot.docs.map(mapFinancingDoc));
  });
};

export const updateFinancingStatus = (id: string, status: FinancingRequest['status']) =>
  updateDoc(doc(db, 'financingRequests', id), { status });

export const saveSiteSettings = async (settings: SiteSettings, heroImageFile: File | null) => {
  let heroImageUrl = settings.heroImageUrl;

  if (heroImageFile) {
    const storageRef = ref(storage, `site/hero-${Date.now()}-${heroImageFile.name}`);
    await uploadBytes(storageRef, heroImageFile);
    heroImageUrl = await getDownloadURL(storageRef);
  }

  const settingsRef = doc(db, 'siteSettings', 'global');
  await setDoc(
    settingsRef,
    {
      ...settings,
      heroImageUrl,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const deleteVehicle = async (vehicleId: string) => {
  await deleteDoc(doc(db, 'vehicles', vehicleId));
};

export const saveVehicle = async (params: {
  editingVehicle: Vehicle | null;
  formData: Partial<Vehicle>;
  imageItems: UploadableImageItem[];
}) => {
  const { editingVehicle, formData, imageItems } = params;
  const docRef = editingVehicle ? doc(db, 'vehicles', editingVehicle.id) : doc(collection(db, 'vehicles'));
  const vehicleId = docRef.id;

  const uploadMap = new Map<string, string>();
  const newImageItems = imageItems.filter((item) => item.isNew && item.file);

  await Promise.all(
    newImageItems.map(async (item) => {
      const storageRef = ref(storage, `vehicles/${vehicleId}/${item.id}`);
      await uploadBytes(storageRef, item.file as File);
      const url = await getDownloadURL(storageRef);
      uploadMap.set(item.id, url);
    })
  );

  const finalImages = imageItems
    .map((item) => (item.isNew ? uploadMap.get(item.id) || '' : item.url))
    .filter(Boolean);

  const safeSpecs = formData.specs || {
    engine: '',
    transmission: '',
    drivetrain: '',
    exteriorColor: '',
    interiorColor: '',
  };

  const safePayload = {
    brand: formData.brand || '',
    model: formData.model || '',
    year: Number(formData.year ?? new Date().getFullYear()),
    price: Number(formData.price ?? 0),
    category: formData.category || VehicleCategory.CAR,
    condition: formData.condition || VehicleCondition.NEW,
    fuelType: formData.fuelType || 'Gasoline',
    transmission: formData.transmission || 'Automatic',
    bodyType: formData.bodyType || '',
    location: formData.location || 'Main Showroom',
    mileage: Number(formData.mileage ?? 0),
    description: formData.description || '',
    status: formData.status || 'available',
    isFeatured: Boolean(formData.isFeatured),
    isVerified: Boolean(formData.isVerified),
  };

  const vehiclePayload = {
    ...safePayload,
    specs: safeSpecs,
    name: `${safePayload.year} ${safePayload.brand} ${safePayload.model}`.trim(),
    images: finalImages,
    views: editingVehicle?.views ?? 0,
    reviews: editingVehicle?.reviews ?? [],
    updatedAt: serverTimestamp(),
    ...(editingVehicle ? {} : { createdAt: serverTimestamp() }),
  } as Vehicle;

  if (editingVehicle) {
    await updateDoc(docRef, vehiclePayload);
  } else {
    await setDoc(docRef, vehiclePayload);
  }
};
