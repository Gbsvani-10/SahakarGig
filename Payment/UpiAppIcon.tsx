import React from 'react';

interface UpiAppIconProps {
  appId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UpiAppIcon: React.FC<UpiAppIconProps> = ({
  appId,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  switch (appId) {
    case 'phonepe':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-[#5f259f] flex items-center justify-center shadow-sm overflow-hidden p-1 flex-shrink-0 transition-transform ${className}`}
          title="PhonePe"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* White circle ring */}
            <circle cx="50" cy="50" r="42" stroke="#ffffff" strokeWidth="6" fill="#5f259f" />
            {/* Official PhonePe Devanagari 'पे' glyph */}
            {/* Top horizontal line (shirorekha) */}
            <path
              d="M32 30 H68"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Vertical stem on right */}
            <path
              d="M58 30 V72"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Left curved bowl */}
            <path
              d="M40 30 V49 C40 56 46 59 58 59"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Top vowel diagonal accent stroke (matra) */}
            <path
              d="M58 30 C56 19 46 17 42 22"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 'gpay':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center shadow-xs overflow-hidden p-1.5 flex-shrink-0 transition-transform ${className}`}
          title="Google Pay"
        >
          {/* Authentic Google Pay 4-color Interlocking Ribbons */}
          <svg viewBox="0 0 48 48" className="w-full h-full">
            {/* Blue ribbon (Top-left loop) */}
            <path
              d="M33.6 15.6c-2.4-4-7.6-5.4-11.6-3L10.5 19.3c-4 2.4-5.4 7.6-3 11.6 2.4 4 7.6 5.4 11.6 3l11.5-6.7c4-2.4 5.4-7.6 3-11.6z"
              fill="#4285F4"
            />
            {/* Green ribbon (Bottom-right loop) */}
            <path
              d="M37.5 17.5c-4-2.4-9.2-1-11.6 3l-6.7 11.5c-2.4 4-1 9.2 3 11.6 4 2.4 9.2 1 11.6-3l6.7-11.5c2.4-4 1-9.2-3-11.6z"
              fill="#34A853"
            />
            {/* Yellow ribbon (Top-right overlap) */}
            <path
              d="M37.5 17.5c-2.4-4-7.6-5.4-11.6-3l-3.9 2.3 8.8 8.8 3.7-2.1c4-2.4 5.4-7.6 3-6z"
              fill="#FBBC04"
            />
            {/* Red ribbon (Bottom-left overlap) */}
            <path
              d="M10.5 19.3c-2.4 4-1 9.2 3 11.6l3.9 2.3 8.8-8.8-4.1-2.4c-4-2.4-9.2-1-11.6-2.7z"
              fill="#EA4335"
            />
          </svg>
        </div>
      );

    case 'paytm':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center shadow-xs overflow-hidden p-1 flex-shrink-0 transition-transform ${className}`}
          title="Paytm"
        >
          {/* Authentic Paytm Wordmark Logo (Navy 'Pay' + Cyan 'tm') */}
          <div className="flex items-center justify-center font-black tracking-tighter leading-none select-none">
            <span className="text-[#002970] text-[13px] sm:text-[15px] font-extrabold" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Pay
            </span>
            <span className="text-[#00BAF2] text-[13px] sm:text-[15px] font-extrabold" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              tm
            </span>
          </div>
        </div>
      );

    case 'bhim':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-white border border-slate-200/90 flex flex-col items-center justify-center shadow-xs overflow-hidden p-1 flex-shrink-0 transition-transform ${className}`}
          title="BHIM UPI"
        >
          {/* Official BHIM Dual Triangle Chevron (Saffron & Green) */}
          <svg viewBox="0 0 40 30" className="w-6 h-4">
            {/* Saffron Chevron */}
            <polygon points="12,2 28,2 20,13 4,13" fill="#F47920" />
            {/* Green Chevron */}
            <polygon points="20,15 36,15 28,26 12,26" fill="#008751" />
          </svg>
          <span className="text-[8px] font-black text-[#003366] tracking-tighter leading-none mt-0.5">
            BHIM
          </span>
        </div>
      );

    case 'amazonpay':
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-[#232F3E] flex flex-col items-center justify-center shadow-xs overflow-hidden p-1 flex-shrink-0 transition-transform ${className}`}
          title="Amazon Pay"
        >
          <div className="flex items-center justify-center">
            <span className="text-white text-[11px] font-black tracking-tight leading-none">
              pay
            </span>
          </div>
          {/* Amazon Orange Curved Smile Arrow */}
          <svg viewBox="0 0 30 10" className="w-5 h-2 mt-0.5">
            <path
              d="M2 3 Q 15 9 26 2"
              stroke="#FF9900"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M23 1 L 27 2 L 25 5 Z" fill="#FF9900" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs overflow-hidden p-1 flex-shrink-0 transition-transform ${className}`}
          title="UPI App"
        >
          {/* NPCI UPI Brand Icon */}
          <div className="flex items-center justify-center gap-0.5">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
              <polygon points="3,4 13,4 8,20 0,20" fill="#097939" />
              <polygon points="11,4 21,4 16,20 8,20" fill="#F58220" />
            </svg>
            <span className="text-[10px] font-black italic tracking-tighter">UPI</span>
          </div>
        </div>
      );
  }
};
