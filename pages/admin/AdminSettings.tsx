import React, { useEffect, useRef, useState } from 'react';
import { SiteSettings } from '../../types';
import { queueEmailDispatch, saveSiteSettings } from '../../api/endpoints';

interface AdminSettingsProps {
  siteSettings: SiteSettings;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ siteSettings }) => {
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [emailSubject, setEmailSubject] = useState('AutoElite admin test email');
  const [emailMessage, setEmailMessage] = useState('This is a test email from the admin dashboard.');
  const [emailStatus, setEmailStatus] = useState('');
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

  const handleSendTestEmail = async () => {
    setEmailStatus('');
    try {
      await queueEmailDispatch({
        to: formData.emailSettings.notificationsEmail,
        subject: emailSubject,
        message: emailMessage,
        type: 'test'
      });
      setEmailStatus('Test email queued successfully.');
    } catch (error) {
      console.error('Failed to queue test email', error);
      setEmailStatus('Unable to queue test email. Please try again.');
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
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Homepage Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'categoriesEnabled', label: 'Categories' },
              { key: 'offersEnabled', label: 'Special Offers' },
              { key: 'whyChooseUsEnabled', label: 'Why Choose Us' },
              { key: 'featuredEnabled', label: 'Featured Inventory' },
              { key: 'testimonialsEnabled', label: 'Testimonials' },
              { key: 'ctaEnabled', label: 'Call To Action' }
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-black uppercase tracking-wide text-slate-700">{item.label}</span>
                <input
                  type="checkbox"
                  checked={formData.sections[item.key as keyof SiteSettings['sections']]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sections: {
                        ...formData.sections,
                        [item.key]: e.target.checked
                      }
                    })
                  }
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6 border-t border-slate-100 pt-8">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Email Setup</h2>
          <p className="text-sm text-slate-500 font-medium">Configure sender details and destination inbox. Outbound messages are queued for backend processing.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Provider</label>
              <select
                className={inputClass}
                value={formData.emailSettings.provider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...formData.emailSettings,
                      provider: e.target.value as SiteSettings['emailSettings']['provider']
                    }
                  })
                }
              >
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Notifications Email</label>
              <input
                className={inputClass}
                value={formData.emailSettings.notificationsEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, notificationsEmail: e.target.value }
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Sender Name</label>
              <input
                className={inputClass}
                value={formData.emailSettings.senderName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, senderName: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Sender Email</label>
              <input
                className={inputClass}
                value={formData.emailSettings.senderEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, senderEmail: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Reply-To Email</label>
              <input
                className={inputClass}
                value={formData.emailSettings.replyToEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, replyToEmail: e.target.value }
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>SMTP Host</label>
              <input
                className={inputClass}
                value={formData.emailSettings.smtpHost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, smtpHost: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>SMTP Port</label>
              <input
                type="number"
                className={inputClass}
                value={formData.emailSettings.smtpPort}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, smtpPort: Number(e.target.value) || 587 }
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>SMTP Username</label>
              <input
                className={inputClass}
                value={formData.emailSettings.smtpUsername}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, smtpUsername: e.target.value }
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>SMTP Password</label>
              <input
                type="password"
                className={inputClass}
                value={formData.emailSettings.smtpPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: { ...formData.emailSettings, smtpPassword: e.target.value }
                  })
                }
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-xs font-black uppercase tracking-wide text-slate-700">
            <input
              type="checkbox"
              checked={formData.emailSettings.smtpSecure}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  emailSettings: { ...formData.emailSettings, smtpSecure: e.target.checked }
                })
              }
              className="h-5 w-5 accent-indigo-600"
            />
            Use secure SMTP (TLS/SSL)
          </label>

          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Send Test Email</h3>
            <input
              className={inputClass}
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject"
            />
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Email body"
            />
            <button
              type="button"
              onClick={handleSendTestEmail}
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-black uppercase text-xs"
            >
              Queue Test Email
            </button>
            {emailStatus && (
              <div className={`text-sm font-bold ${emailStatus.includes('successfully') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {emailStatus}
              </div>
            )}
          </div>
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
