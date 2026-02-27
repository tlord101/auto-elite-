import React, { useEffect, useRef, useState } from 'react';
import { SiteSettings } from '../../types';
import { saveSiteSettings } from '../../api/endpoints';

interface AdminSettingsProps {
  siteSettings: SiteSettings;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ siteSettings }) => {
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(siteSettings);
    setHeroImagePreview('');
    setHeroImageFile(null);
  }, [siteSettings]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroImageFile(file);
    setHeroImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('');

    try {
      await saveSiteSettings(formData, heroImageFile);

      setSaveStatus('Settings saved successfully.');
    } catch (error) {
      console.error('Failed to save site settings', error);
      setSaveStatus('Unable to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Site Settings</h1>
        <p className="text-slate-500 text-sm font-medium">Control branding and hero content across the site.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Site Name</label>
            <input
              className={inputClass}
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Hero Badge</label>
            <input
              className={inputClass}
              value={formData.heroBadge}
              onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Hero Title</label>
          <input
            className={inputClass}
            value={formData.heroTitle}
            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Hero Subtitle</label>
          <textarea
            className={`${inputClass} min-h-[120px]`}
            value={formData.heroSubtitle}
            onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Hero Image</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2 bg-slate-900 text-white text-xs font-black uppercase rounded-xl"
            >
              Upload Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <input
            className={inputClass}
            value={formData.heroImageUrl}
            onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
            placeholder="Paste an image URL or upload a file"
          />

          <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
            <img
              src={heroImagePreview || formData.heroImageUrl}
              alt="Hero preview"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        {saveStatus && (
          <div className={`text-sm font-bold ${saveStatus.includes('success') ? 'text-emerald-600' : 'text-rose-600'}`}>
            {saveStatus}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
