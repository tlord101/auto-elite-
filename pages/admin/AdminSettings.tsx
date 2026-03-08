import React, { useEffect, useState } from 'react';
import { CheckCircle2, Mail, Save, Settings } from 'lucide-react';
import { SiteSettings } from '../../types';

interface AdminSettingsProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings, heroImageFile: File | null) => Promise<void>;
  onQueueTestEmail: (payload: {
    to: string;
    subject: string;
    message: string;
    type: 'admin_notification' | 'customer_reply' | 'test';
    emailSettings?: SiteSettings['emailSettings'];
    metadata?: Record<string, unknown>;
  }) => Promise<void>;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({
  siteSettings,
  onSaveSiteSettings,
  onQueueTestEmail,
}) => {
  const [form, setForm] = useState<SiteSettings>(siteSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setForm(siteSettings);
  }, [siteSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    setStatus('');
    try {
      await onSaveSiteSettings(form, null);
      setStatus('Settings saved successfully.');
    } catch (error) {
      console.error('Failed to save site settings', error);
      setStatus('Unable to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setStatus('');
    try {
      await onQueueTestEmail({
        to: form.emailSettings.notificationsEmail,
        subject: 'AutoElite test email',
        message: 'This test email was queued from the new admin dashboard.',
        type: 'test',
        emailSettings: form.emailSettings,
      });
      setStatus('Test email queued successfully.');
    } catch (error) {
      console.error('Failed to queue test email', error);
      setStatus('Unable to queue test email.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-gray-500 mt-1">Configure homepage content and email notifications.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70"
        >
          <Save size={16} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {status && (
        <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center text-sm font-medium">
          <CheckCircle2 size={18} className="mr-2" />
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Brand Settings" icon={Settings}>
          <Field label="Site Name" value={form.siteName} onChange={(value) => setForm({ ...form, siteName: value })} />
          <Field label="Hero Badge" value={form.heroBadge} onChange={(value) => setForm({ ...form, heroBadge: value })} />
          <Field label="Hero Title" value={form.heroTitle} onChange={(value) => setForm({ ...form, heroTitle: value })} />
          <TextAreaField
            label="Hero Subtitle"
            value={form.heroSubtitle}
            onChange={(value) => setForm({ ...form, heroSubtitle: value })}
          />
          <Field
            label="Hero Image URL"
            value={form.heroImageUrl}
            onChange={(value) => setForm({ ...form, heroImageUrl: value })}
          />
        </SectionCard>

        <SectionCard title="Email Setup" icon={Mail}>
          <Field
            label="Notifications Email"
            value={form.emailSettings.notificationsEmail}
            onChange={(value) =>
              setForm({ ...form, emailSettings: { ...form.emailSettings, notificationsEmail: value } })
            }
          />
          <Field
            label="Sender Name"
            value={form.emailSettings.senderName}
            onChange={(value) => setForm({ ...form, emailSettings: { ...form.emailSettings, senderName: value } })}
          />
          <Field
            label="Sender Email"
            value={form.emailSettings.senderEmail}
            onChange={(value) => setForm({ ...form, emailSettings: { ...form.emailSettings, senderEmail: value } })}
          />
          <Field
            label="SMTP Host"
            value={form.emailSettings.smtpHost}
            onChange={(value) => setForm({ ...form, emailSettings: { ...form.emailSettings, smtpHost: value } })}
          />
          <Field
            label="SMTP Port"
            value={String(form.emailSettings.smtpPort)}
            onChange={(value) =>
              setForm({
                ...form,
                emailSettings: { ...form.emailSettings, smtpPort: Number(value) || 587 },
              })
            }
          />
          <button
            onClick={handleTestEmail}
            className="w-full mt-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Queue Test Email
          </button>
        </SectionCard>
      </div>
    </div>
  );
};

const SectionCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
    <h3 className="text-sm font-bold text-gray-900 flex items-center">
      <Icon size={16} className="mr-2 text-blue-600" /> {title}
    </h3>
    {children}
  </div>
);

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const TextAreaField: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
    <textarea
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
    />
  </div>
);

export default AdminSettings;
