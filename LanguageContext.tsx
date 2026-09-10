import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  en: {
    'platform.title': 'SahakarGig',
    'platform.subtitle': 'Cooperative Gig Services Platform',
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.howItWorks': 'How It Works',
    'nav.about': 'About NCCT & Cooperatives',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'hero.title': 'Empowering Cooperatives. Connecting Communities. Creating Opportunities.',
    'hero.sub': 'SahakarGig connects verified skilled workers from labour cooperatives with households, communities, and institutions through a trusted digital service platform.',
    'btn.findService': 'Find a Service',
    'btn.joinWorker': 'Join as a Worker',
    'btn.partnerCoop': 'Partner With SahakarGig',
    'btn.emergency': 'Request Emergency Service',
    'emergency.banner': 'Need a service urgently? Verified emergency artisans available in under 15 minutes.',
    'stats.workers': 'Verified Workers',
    'stats.jobs': 'Jobs Completed',
    'stats.coops': 'Cooperative Partners',
    'stats.rating': 'Average Rating',
    'portal.customer': 'Customer Portal',
    'portal.worker': 'Worker Portal',
    'portal.admin': 'Cooperative Admin'
  },
  hi: {
    'platform.title': 'सहकारगिग',
    'platform.subtitle': 'सहकारी गिग सेवा मंच',
    'nav.home': 'मुख्य पृष्ठ',
    'nav.services': 'सेवाएं',
    'nav.howItWorks': 'यह कैसे काम करता है',
    'nav.about': 'एनसीईटी एवं सहकारिता',
    'nav.contact': 'संपर्क',
    'nav.login': 'लॉग इन',
    'nav.register': 'पंजीकरण',
    'hero.title': 'सहकारिता का सशक्तिकरण। समुदायों का जुड़ाव। अवसरों का सृजन।',
    'hero.sub': 'सहकारगिग श्रम सहकारी समितियों से सत्यापित कुशल कामगारों को डिजिटल मंच के माध्यम से घरों और संस्थानों से जोड़ता है।',
    'btn.findService': 'सेवा खोजें',
    'btn.joinWorker': 'कामगार के रूप में जुड़ें',
    'btn.partnerCoop': 'सहकारगिग से जुड़ें',
    'btn.emergency': 'आपातकालीन सेवा का अनुरोध करें',
    'emergency.banner': 'क्या आपको तुरंत सेवा की आवश्यकता है? 15 मिनट में सत्यापित कारीगर उपलब्ध हैं।',
    'stats.workers': 'सत्यापित कामगार',
    'stats.jobs': 'पूर्ण किए गए कार्य',
    'stats.coops': 'सहकारी समितियां',
    'stats.rating': 'औसत रेटिंग',
    'portal.customer': 'ग्राहक पोर्टल',
    'portal.worker': 'कामगार पोर्टल',
    'portal.admin': 'सहकारी व्यवस्थापक'
  },
  te: {
    'platform.title': 'సహకార్‌గిగ్',
    'platform.subtitle': 'సహకార గిగ్ సర్వీసెస్ ప్లాట్‌ఫామ్',
    'nav.home': 'హోమ్',
    'nav.services': 'సేవలు',
    'nav.howItWorks': 'ఎలా పనిచేస్తుంది',
    'nav.about': 'ఎన్‌సీసీటీ & సహకారం',
    'nav.contact': 'సంప్రదించండి',
    'nav.login': 'లాగిన్',
    'nav.register': 'రిజిస్టర్',
    'hero.title': 'సహకార సంఘాల సాధికారత. సమాజ అనుసంధానం. అవకాశాల సృష్టి.',
    'hero.sub': 'సహకార్‌గిగ్ కార్మిక సహకార సంఘాల నుండి ధృవీకరించబడిన నైపుణ్యం కలిగిన కార్మికులను గృహాలు మరియు సంస్థలతో డిజిటల్ ప్లాట్‌ఫామ్ ద్వారా కలుపుతుంది.',
    'btn.findService': 'సేవను కనుగొనండి',
    'btn.joinWorker': 'కార్మికుడిగా చేరండి',
    'btn.partnerCoop': 'సహకార్‌గిగ్‌తో భాగస్వామ్యం',
    'btn.emergency': 'అత్యవసర సేవను అభ్యర్థించండి',
    'emergency.banner': 'తక్షణ సేవ కావాలా? 15 నిమిషాల్లో ధృవీకరించబడిన నిపుణులు అందుబాటులో ఉంటారు.',
    'stats.workers': 'ధృవీకరించబడిన కార్మికులు',
    'stats.jobs': 'పూర్తయిన పనులు',
    'stats.coops': 'సహకార భాగస్వాములు',
    'stats.rating': 'సగటు రేటింగ్',
    'portal.customer': 'కస్టమర్ పోర్టల్',
    'portal.worker': 'కార్మిక పోర్టల్',
    'portal.admin': 'సహకార అడ్మిన్'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('sahakar_language') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('sahakar_language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    return DICTIONARY[language]?.[key] || DICTIONARY['en']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
