import React from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { TranslationSchema } from '../i18n/translations';

interface SecurityBannerProps {
  t: TranslationSchema;
  compact?: boolean;
}

export const SecurityBanner: React.FC<SecurityBannerProps> = ({ t, compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3 text-amber-900 text-xs sm:text-sm">
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="font-semibold leading-tight">
          {t.securityMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-bold text-emerald-950">
              {t.securityTitle}
            </h4>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
              NPCI Compliant
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-emerald-900 mt-1 leading-relaxed">
            {t.neverAskPinDesc}
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.safeRedirectNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
