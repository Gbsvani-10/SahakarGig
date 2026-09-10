import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Globe, Bell, Shield, Moon, CheckCircle2 } from 'lucide-react';

export const CustomerSettings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { addToast } = useApp();
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);

  const handleSave = () => {
    addToast('success', 'Preferences Saved', 'Your application preferences have been updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Portal Settings & Preferences</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Configure notification dispatch, regional language, and security rules
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Language Selection */}
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>Regional Language (बहुभाषी समर्थन)</span>
          </h3>
          <p className="text-xs text-gray-500">
            Select your preferred interface language for booking confirmation SMS and portal text.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'mr', label: 'मराठी (Marathi)' },
              { code: 'ta', label: 'தமிழ் (Tamil)' },
              { code: 'te', label: 'తెలుగు (Telugu)' },
              { code: 'bn', label: 'বাংলা (Bengali)' },
              { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
              { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`py-2 px-3 rounded-lg border text-center transition-colors cursor-pointer ${
                  language === lang.code
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-700" />
            <span>Dispatch Notifications</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer">
              <div>
                <p className="font-bold text-gray-900">SMS Dispatch Updates</p>
                <p className="text-gray-500">Receive artisan arrival updates and OTP verification via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer">
              <div>
                <p className="font-bold text-gray-900">WhatsApp Notification Grid</p>
                <p className="text-gray-500">Get live worker map location link and GST invoices on WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave} rightIcon={<CheckCircle2 className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
};
