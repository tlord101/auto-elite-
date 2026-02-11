
import React, { useState, useRef, useEffect } from 'react';
import { collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Vehicle, VehicleCategory, VehicleCondition } from '../../types';
import { db, storage } from '../../firebaseClient';

interface AdminVehiclesProps {
  vehicles: Vehicle[];
}

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
}

const AdminVehicles: React.FC<AdminVehiclesProps> = ({ vehicles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const placeholderImage = 'https://images.unsplash.com/photo-1486497395400-7ecb21335ad3?q=80&w=200&auto=format&fit=crop';

  const [formData, setFormData] = useState<Partial<Vehicle>>({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    category: VehicleCategory.CAR,
    condition: VehicleCondition.NEW,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    bodyType: '',
    location: 'Main Showroom',
    mileage: 0,
    description: '',
    images: [],
    specs: {
      engine: '',
      transmission: '',
      drivetrain: '',
      exteriorColor: '',
      interiorColor: ''
    },
    status: 'available',
    isFeatured: false,
    isVerified: false
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData(editingVehicle);
      setImageItems(
        editingVehicle.images.map((url) => ({
          id: url,
          url,
          isNew: false
        }))
      );
    } else {
      setFormData({
        name: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        category: VehicleCategory.CAR,
        condition: VehicleCondition.NEW,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: '',
        location: 'Main Showroom',
        mileage: 0,
        description: '',
        images: [],
        specs: {
          engine: '',
          transmission: '',
          drivetrain: '',
          exteriorColor: '',
          interiorColor: ''
        },
        status: 'available',
        isFeatured: false,
        isVerified: false
      });
      setImageItems([]);
    }
  }, [editingVehicle, isModalOpen]);

  const filteredVehicles = vehicles.filter(v => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCount = (status: string) => {
    if (status === 'all') return vehicles.length;
    return vehicles.filter(v => v.status === status).length;
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      deleteDoc(doc(db, 'vehicles', id)).catch((error) => {
        console.error('Failed to delete vehicle', error);
      });
    }
  };

  const handleEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newItems = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      file,
      isNew: true
    }));

    setImageItems((prev) => [...prev, ...newItems]);
  };

  const removeImage = (index: number) => {
    setImageItems((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...imageItems];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setImageItems(newItems);
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setIsSaving(true);
    try {
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

      const finalImages = imageItems.map((item) => (item.isNew ? uploadMap.get(item.id) || '' : item.url)).filter(Boolean);

      const safeSpecs = formData.specs || {
        engine: '',
        transmission: '',
        drivetrain: '',
        exteriorColor: '',
        interiorColor: ''
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
        isVerified: Boolean(formData.isVerified)
      };

      const vehiclePayload = {
        ...safePayload,
        specs: safeSpecs,
        name: `${safePayload.year} ${safePayload.brand} ${safePayload.model}`.trim(),
        images: finalImages,
        views: editingVehicle?.views ?? 0,
        reviews: editingVehicle?.reviews ?? [],
        updatedAt: serverTimestamp(),
        ...(editingVehicle ? {} : { createdAt: serverTimestamp() })
      } as Vehicle;

      if (editingVehicle) {
        await updateDoc(docRef, vehiclePayload);
      } else {
        await setDoc(docRef, vehiclePayload);
      }

      setIsModalOpen(false);
      setEditingVehicle(null);
    } catch (error) {
      console.error('Failed to save vehicle', error);
      setSaveError('Unable to save vehicle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block";

  return (
    <div className="space-y-6 relative">
      <canvas className="hidden" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Master Showroom</h1>
          <p className="text-slate-500 text-sm font-medium">Global inventory and asset management system</p>
        </div>
        <button 
          onClick={handleAdd}
          className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center shadow-2xl shadow-indigo-600/20 active:scale-95 text-sm uppercase tracking-wider"
        >
          <span className="mr-3 text-xl">+</span> Add Listing
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Added z-index to prevent clashing */}
        <div className="lg:w-72 space-y-6 flex-shrink-0">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8 sticky top-24 z-20">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Find</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="BMW, Tesla, etc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Status Filters</label>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Units', color: 'bg-slate-900' },
                  { id: 'available', label: 'In Stock', color: 'bg-emerald-500' },
                  { id: 'sold', label: 'Sold Units', color: 'bg-rose-500' },
                  { id: 'pending', label: 'Reservations', color: 'bg-amber-500' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStatusFilter(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                      statusFilter === item.id 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-4 ${item.color}`}></span>
                      <span className="uppercase tracking-tighter">{item.label}</span>
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      statusFilter === item.id ? 'bg-white/20' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {getCount(item.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-center">
              <button 
                onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.3em]"
              >
                Clear View
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="flex-grow z-10">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Information</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Investment</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-lg border-4 border-white">
                              <img 
                                src={v.images[0] || placeholderImage} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                alt={v.name} 
                              />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 leading-tight uppercase tracking-tight text-lg">{v.name}</p>
                              <div className="flex items-center text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                                <span>{v.year}</span>
                                <span className="mx-2 opacity-30">•</span>
                                <span>{v.mileage.toLocaleString()} MI</span>
                                <span className="mx-2 opacity-30">•</span>
                                <span className="text-indigo-600">{v.brand}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-xl uppercase tracking-widest">
                            {v.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-slate-900 text-xl">${v.price.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">MSRP Base</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full ${
                               v.status === 'available' ? 'bg-emerald-500' : v.status === 'sold' ? 'bg-rose-500' : 'bg-amber-500'
                             }`}></span>
                             <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${
                               v.status === 'available' ? 'text-emerald-600' : v.status === 'sold' ? 'text-rose-600' : 'text-amber-600'
                             }`}>
                               {v.status}
                             </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(v)}
                              className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-xl rounded-2xl transition-all"
                              title="Edit Intelligence"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(v.id)}
                              className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-xl rounded-2xl transition-all"
                              title="Purge Entry"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-32 text-center">
                        <div className="max-w-sm mx-auto space-y-8">
                          <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">No Assets Found</h3>
                            <p className="text-slate-400 font-medium">No units matching your current filter set were identified in our records.</p>
                          </div>
                          <button 
                            onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                            className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-xs uppercase tracking-[0.2em]"
                          >
                            Restore Master View
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
                </h2>
                <p className="text-slate-500 text-sm font-medium">Manage inventory details and media</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-10 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Brand</label>
                  <input
                    className={inputClass}
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Tesla"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Model</label>
                  <input
                    className={inputClass}
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Model S"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Year</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.year || ''}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Price</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    className={inputClass}
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as VehicleCategory })}
                  >
                    {Object.values(VehicleCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Condition</label>
                  <select
                    className={inputClass}
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as VehicleCondition })}
                  >
                    {Object.values(VehicleCondition).map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                  >
                    <option value="available">available</option>
                    <option value="pending">pending</option>
                    <option value="sold">sold</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Fuel Type</label>
                  <select
                    className={inputClass}
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as Vehicle['fuelType'] })}
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Transmission</label>
                  <select
                    className={inputClass}
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value as Vehicle['transmission'] })}
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="Semi-Auto">Semi-Auto</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Mileage</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={formData.mileage || ''}
                    onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Body Type</label>
                  <input
                    className={inputClass}
                    value={formData.bodyType || ''}
                    onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                    placeholder="SUV"
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    className={inputClass}
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Main Showroom"
                  />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isFeatured)}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-xs font-black uppercase text-slate-500">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isVerified)}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Verified
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={`${inputClass} min-h-[120px]`}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a detailed description of the vehicle..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Engine</label>
                  <input
                    className={inputClass}
                    value={formData.specs?.engine || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...(formData.specs || {}), engine: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Spec Transmission</label>
                  <input
                    className={inputClass}
                    value={formData.specs?.transmission || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...(formData.specs || {}), transmission: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Drivetrain</label>
                  <input
                    className={inputClass}
                    value={formData.specs?.drivetrain || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...(formData.specs || {}), drivetrain: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Exterior Color</label>
                  <input
                    className={inputClass}
                    value={formData.specs?.exteriorColor || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...(formData.specs || {}), exteriorColor: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Interior Color</label>
                  <input
                    className={inputClass}
                    value={formData.specs?.interiorColor || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      specs: { ...(formData.specs || {}), interiorColor: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Images</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2 bg-slate-900 text-white text-xs font-black uppercase rounded-xl"
                  >
                    Upload Images
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {imageItems.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm">
                    No images uploaded yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragEnd={onDragEnd}
                      >
                        <img src={item.url} className="w-full h-32 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-slate-700 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {saveError && (
                <div className="text-rose-600 text-sm font-bold">{saveError}</div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehicles;
