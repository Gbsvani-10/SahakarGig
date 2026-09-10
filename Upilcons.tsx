import React from 'react';

export function PhonePeIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-2xs overflow-hidden ${className}`}
      title="PhonePe"
    >
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        {/* Crisp white circular underlay so the cutout character 'पे' shows in brilliant white */}
        <circle cx="12" cy="12" r="11.8" fill="#ffffff" />
        {/* Official PhonePe brand purple path with the authentic Devanagari 'पे' glyph cutout */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.206 9.941h2.949v4.692c-.402.201-.938.268-1.34.268-1.072 0-1.609-.536-1.609-1.743V9.941zm13.47 4.816c-1.523 6.449-7.985 10.442-14.433 8.919C2.794 22.154-1.199 15.691.324 9.243c1.523-6.449 7.985-10.442 14.433-8.919c6.449 1.523 10.442 7.985 8.919 14.433zm-6.231-5.888a.887.887 0 0 0-.871-.871h-1.609l-3.686-4.222c-.335-.402-.871-.536-1.407-.402l-1.274.401c-.201.067-.268.335-.134.469l4.021 3.82H6.386c-.201 0-.335.134-.335.335v.67c0 .469.402.871.871.871h.938v3.217c0 2.413 1.273 3.82 3.418 3.82.67 0 1.206-.067 1.877-.335v2.145c0 .603.469 1.072 1.072 1.072h.938a.432.432 0 0 0 .402-.402V9.874h1.542c.201 0 .335-.134.335-.335v-.67z"
          fill="#5f259f"
        />
      </svg>
    </div>
  );
}

export function GooglePayIcon({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <div className={`rounded-full bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm shrink-0 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <path
          d="M21.35 11.1H12v3.13h5.36c-.46 2.28-2.48 3.87-5.36 3.87-3.23 0-5.85-2.62-5.85-5.85s2.62-5.85 5.85-5.85c1.45 0 2.76.53 3.77 1.41l2.35-2.35C20.48 3.93 16.5 2.5 12 2.5 6.75 2.5 2.5 6.75 2.5 12s4.25 9.5 9.5 9.5c5.48 0 9.15-3.86 9.15-9.31 0-.64-.07-1.15-.2-1.59z"
          fill="#4285F4"
        />
        <path
          d="M4.05 7.05l2.6 1.91c.7-2.07 2.66-3.56 4.95-3.56 1.45 0 2.76.53 3.77 1.41l2.35-2.35C16.5 2.75 14.38 2 12 2 8.7 2 5.82 3.93 4.05 7.05z"
          fill="#EA4335"
        />
        <path
          d="M12 22c2.4 0 4.54-.8 6.13-2.18l-2.46-2.02c-.99.66-2.25 1.07-3.67 1.07-2.88 0-4.9-1.59-5.36-3.87l-2.58 1.99C5.83 20.08 8.7 22 12 22z"
          fill="#34A853"
        />
        <path
          d="M3.55 14.99l2.58-1.99c-.11-.53-.18-1.09-.18-1.65 0-.56.07-1.12.18-1.65L3.55 7.71C2.88 9.04 2.5 10.53 2.5 12c0 1.47.38 2.96 1.05 4.29l-.01-.3-.04 1z"
          fill="#FBBC05"
        />
      </svg>
    </div>
  );
}

export function PaytmIcon({ className = 'w-7 h-7' }: { className?: string }) {
  const [imgErr, setImgErr] = React.useState(false);

  return (
    <div
      className={`rounded-full bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-2xs shrink-0 overflow-hidden ${className}`}
      title="Paytm"
    >
      {!imgErr ? (
        <img
          src="/paytm-icon.png"
          alt="Paytm"
          className="w-full h-full object-contain rounded-full"
          onError={() => setImgErr(true)}
        />
      ) : (
        <svg viewBox="-1 5 26 14" className="w-full h-full p-0.5" fill="none">
          {/* Official Paytm "Pay" in dark navy */}
          <path
            d="M.232 9.4A.234.234 0 0 0 0 9.636v5.924c0 .132.096.238.216.241h1.09c.13 0 .237-.107.237-.24l.004-1.658H2.57c.857 0 1.453-.605 1.453-1.481v-1.538c0-.877-.596-1.484-1.453-1.484H.232zm9.032 0a.239.239 0 0 0-.237.241v2.47c0 .94.657 1.608 1.579 1.608h.675s.016 0 .037.004a.253.253 0 0 1 .222.253c0 .13-.096.235-.219.251l-.018.004-.303.006H9.739a.239.239 0 0 0-.236.24v1.09a.24.24 0 0 0 .236.242h1.75c.92 0 1.577-.669 1.577-1.608v-4.56a.239.239 0 0 0-.236-.24h-1.07a.239.239 0 0 0-.236.24c-.005.787 0 1.525 0 2.255a.253.253 0 0 1-.25.25h-.449a.253.253 0 0 1-.25-.255c.005-.754-.005-1.5-.005-2.25a.239.239 0 0 0-.236-.24zm-4.004.006a.232.232 0 0 0-.238.226v1.023c0 .132.113.24.252.24h1.413c.112.017.2.1.213.23v.14c-.013.124-.1.214-.207.224h-.7c-.93 0-1.594.63-1.594 1.515v1.269c0 .88.57 1.506 1.495 1.506h1.94c.348 0 .63-.27.63-.6v-4.136c0-1.004-.508-1.637-1.72-1.637zm-3.713 1.572h.678c.139 0 .25.115.25.256v.836a.253.253 0 0 1-.25.256h-.1c-.192.002-.386 0-.578 0zm4.67 1.977h.445c.139 0 .252.108.252.24v.932a.23.23 0 0 1-.014.076.25.25 0 0 1-.238.164h-.445a.247.247 0 0 1-.252-.24v-.933c0-.132.113-.239.252-.239Z"
            fill="#002E6E"
          />
          {/* Official Paytm "tm" in cyan */}
          <path
            d="M15.85 8.167a.204.204 0 0 0-.04.004c-.68.19-.543 1.148-1.781 1.23h-.12a.23.23 0 0 0-.052.005h-.001a.24.24 0 0 0-.184.235v1.09c0 .134.106.241.237.241h.645v4.623c0 .132.104.238.233.238h1.058a.236.236 0 0 0 .233-.238v-4.623h.6c.13 0 .236-.107.236-.241v-1.09a.239.239 0 0 0-.236-.24h-.612V8.386a.218.218 0 0 0-.216-.22zm4.225 1.17c-.398 0-.762.15-1.042.395v-.124a.238.238 0 0 0-.234-.224h-1.07a.24.24 0 0 0-.236.242v5.92a.24.24 0 0 0 .236.242h1.07c.12 0 .217-.091.233-.209v-4.25a.393.393 0 0 1 .371-.408h.196a.41.41 0 0 1 .226.09.405.405 0 0 1 .145.319v4.074l.004.155a.24.24 0 0 0 .237.241h1.07a.239.239 0 0 0 .235-.23l-.001-4.246c0-.14.062-.266.174-.34a.419.419 0 0 1 .196-.068h.198c.23.02.37.2.37.408.005 1.396.004 2.8.004 4.224a.24.24 0 0 0 .237.241h1.07c.13 0 .236-.108.236-.241v-4.543c0-.31-.034-.442-.08-.577a1.601 1.601 0 0 0-1.51-1.09h-.015a1.58 1.58 0 0 0-1.152.5c-.291-.308-.7-.5-1.153-.5z"
            fill="#00BAF2"
          />
        </svg>
      )}
    </div>
  );
}

export function BhimIcon({ className = 'w-7 h-7' }: { className?: string }) {
  const [imgErr, setImgErr] = React.useState(false);

  return (
    <div
      className={`rounded-full bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-2xs shrink-0 overflow-hidden ${className}`}
      title="BHIM"
    >
      {!imgErr ? (
        <img
          src="/bhim-icon.png"
          alt="BHIM UPI"
          className="w-full h-full object-contain rounded-full"
          onError={() => setImgErr(true)}
        />
      ) : (
        <svg viewBox="0 0 33 24" className="w-full h-full p-0.5" fill="none">
          {/* Authentic BHIM wordmark and tricolor chevrons */}
          <g transform="translate(0.5, 4)">
            <path d="m0 0 4.466-8.881-9.388-8.88z" fill="#008c44" transform="matrix(.35277777 0 0 -.35277777 30.587739 .009974)"/>
            <path d="m0 0 4.462-8.881-9.392-8.88z" fill="#f47920" transform="matrix(.35277777 0 0 -.35277777 29.48358 .009974)"/>
            <path d="m0 0c-.343-.722-1.036-1.245-1.863-1.35h-.612-12l1.015 3.632h9.259 2.856.618c.464-.115.828-.482.934-.947.014-.105.023-.21.023-.319 0-.055-.003-.11-.008-.164-.001-.023-.001-.045-.003-.068zm-11.478 9.387h9.25 2.897.61c.35-.086.643-.314.813-.619.062-.214.097-.439.097-.671 0-.126-.012-.247-.031-.368l-.033-.116-.123-.444c-.328-.773-1.052-1.336-1.918-1.441h-.588-11.995zm13.288-13.678c.438.337.727.754.866 1.251l1.485 5.322c.136.484.076.89-.177 1.218s-.627.492-1.121.492c.494 0 .961.168 1.401.505.437.337.725.747.86 1.231l1.483 5.315c.145.517.096.943-.145 1.282-.241.338-.618.508-1.131.508h-19.37l-4.922-17.63h19.371c.494 0 .961.169 1.4.506" fill="#1e293b" transform="matrix(.35277777 0 0 -.35277777 7.06808 4.555754)"/>
            <path d="m0 0-1.947-7.081h-13.974l1.948 7.081h-3.474l-4.835-17.57h3.475l1.941 7.05h13.972l-1.939-7.05h3.475l4.834 17.57z" fill="#1e293b" transform="matrix(.35277777 0 0 -.35277777 16.557589 .034104)"/>
            <path d="m0 0h-3.498l4.864 17.566h3.497z" fill="#1e293b" transform="matrix(.35277777 0 0 -.35277777 18.140289 6.252135)"/>
            <path d="m0 0-14.513-12.3-5.062 8.413-2.34 3.887h-.063l-1.102-3.992-3.732-13.523h3.475l2.616 9.479 5.543-9.502 9.176 8.41-2.301-8.387h3.476l3.391 12.293 1.442 5.222z" fill="#1e293b" transform="matrix(.35277777 0 0 -.35277777 28.43664 .049594)"/>
          </g>
        </svg>
      )}
    </div>
  );
}

export function SahakarGigLogo({ className = 'h-9' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
          Sahakar<span className="text-emerald-600">Gig</span>
        </span>
        <span className="text-[10px] font-medium text-emerald-700 tracking-wider uppercase leading-tight mt-0.5">
          Cooperative
        </span>
      </div>
    </div>
  );
}
