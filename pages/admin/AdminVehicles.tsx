
import React, { useState, useRef, useEffect } from 'react';
import { Vehicle, VehicleCategory, VehicleCondition } from '../../types';

interface AdminVehiclesProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

interface ImageEditorState {
  index: number;
  data: string;
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
}

const AdminVehicles: React.FC<AdminVehiclesProps> = ({ vehicles, setVehicles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Image Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorState, setEditorState] = useState<ImageEditorState | null>(null);
  const editorCanvasRef = useRef<HTMLCanvasElement>(null);

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
    status: 'available'
  });

  useEffect(() => {
    if (editingVehicle) {
      setFormData(editingVehicle);
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
        status: 'available'
      });
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
      setVehicles(prev => prev.filter(v => v.id !== id));
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

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), base64String]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const onDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...(formData.images || [])];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setFormData({ ...formData, images: newImages });
  };

  const onDragEnd = () => {
    setDraggedIndex(null);
  };

  const openEditor = (index: number, data: string) => {
    setEditorState({
      index,
      data,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0
    });
    setIsEditorOpen(true);
  };

  const applyEdits = () => {
    if (!editorState || !editorCanvasRef.current) return;

    const canvas = editorCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = editorState.data;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.filter = `brightness(${editorState.brightness}%) contrast(${editorState.contrast}%) saturate(${editorState.saturation}%) grayscale(${editorState.grayscale}%)`;
      ctx.drawImage(img, 0, 0);

      const editedData = canvas.toDataURL('image/jpeg', 0.9);
      const newImages = [...(formData.images || [])];
      newImages[editorState.index] = editedData;
      
      setFormData({ ...formData, images: newImages });
      setIsEditorOpen(false);
      setEditorState(null);
    };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleData = {
      ...formData,
      id: editingVehicle?.id || Math.random().toString(36).substr(2, 9),
      createdAt: editingVehicle?.createdAt || new Date().toISOString(),
      name: `${formData.year} ${formData.brand} ${formData.model}`
    } as Vehicle;

    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? vehicleData : v));
    } else {
      setVehicles(prev => [vehicleData, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      <canvas ref={editorCanvasRef} className="hidden" />
      
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
    </div>
  );
};

export default AdminVehicles;
