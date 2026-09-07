import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Globe, Bell, Shield, CheckCircle2 } from 'lucide-react';

export const WorkerSettings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { addToast } = useApp();
  const [loudEmergencyRingtone, setLoudEmergencyRingtone] = useState(true);
  const [smsJobAlerts, setSmsJobAlerts] = useState(true);

  const handleSave = () => {
    addToast('success', 'Worker Settings Saved', 'Your dispatch alert preferences have been updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Artisan Portal Preferences</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Configure multi-language interface and audio dispatch notifications
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Language Selection */}
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-700" />
            <span>Select Regional App Language (भाषा चुनें)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
            {[
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'en', label: 'English' },
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
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dispatch Audio Settings */}
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-700" />
            <span>Audio & SMS Dispatch Alerts</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer">
              <div>
                <p className="font-bold text-gray-900">Loud Emergency Alarm Tone</p>
                <p className="text-gray-500">Play prominent siren tone during incoming 15-min emergency dispatches</p>
              </div>
              <input
                type="checkbox"
                checked={loudEmergencyRingtone}
                onChange={(e) => setLoudEmergencyRingtone(e.target.checked)}
                className="rounded text-teal-700 focus:ring-teal-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer">
              <div>
                <p className="font-bold text-gray-900">Direct SMS Booking Updates</p>
                <p className="text-gray-500">Receive customer address and phone number on mobile SMS</p>
              </div>
              <input
                type="checkbox"
                checked={smsJobAlerts}
                onChange={(e) => setSmsJobAlerts(e.target.checked)}
                className="rounded text-teal-700 focus:ring-teal-500 w-4 h-4"
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
