import React from 'react';
import {
  ShieldCheck,
  Languages,
  Eye,
  Smartphone,
  Sliders,
} from 'lucide-react';
import { Language, PaymentMode } from '../types/payment.types';
import { TranslationSchema } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  mode: PaymentMode;
  onToggleMode: () => void;
  isVoiceEnabled?: boolean;
  onToggleVoice?: () => void;
  onOpenDemo: () => void;
  t: TranslationSchema;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  mode,
  onToggleMode,
  onOpenDemo,
  t,
}) => {
  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-800 shadow-md">
      {/* Top micro bar for system status & simulator launcher */}
      <div className="bg-emerald-950 px-4 py-1.5 flex items-center justify-between text-xs text-emerald-300 font-medium">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-800/80 text-emerald-200 text-[11px] font-semibold tracking-wide">
            LIVE UPI GATEWAY
          </span>
          <span className="hidden sm:inline">SahakarGig Cooperative Payment Architecture</span>
        </div>

        <button
          id="btn-simulator-controls"
          onClick={onOpenDemo}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm text-xs cursor-pointer"
          title="Open Payment Simulator & Test Harness"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Payment Simulator</span>
        </button>
      </div>

      {/* Main navigation header */}
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-inner">
            SG
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                SahakarGig
              </h1>
              <span className="text-xs bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                UPI Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/80 font-normal">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Global Toolbar: Language & Accessibility Mode */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Language Selector */}
          <div className="inline-flex items-center bg-emerald-950/70 rounded-lg p-1 border border-emerald-800">
            <Languages className="w-3.5 h-3.5 text-emerald-400 ml-1.5 mr-1" />
            <button
              id="lang-btn-en"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded transition ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              id="lang-btn-te"
              onClick={() => onLanguageChange('te')}
              className={`px-2 py-1 text-xs font-semibold rounded transition ${
                language === 'te'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
            <button
              id="lang-btn-hi"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 text-xs font-semibold rounded transition ${
                language === 'hi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Easy Payment Mode Toggle Button */}
          <button
            id="btn-toggle-easy-mode"
            onClick={onToggleMode}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold border flex items-center gap-2 transition shadow-sm ${
              mode === 'easy'
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300'
                : 'bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-600'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{mode === 'easy' ? t.standardMode : 'Easy Mode (పెద్ద అక్షరాలు)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
