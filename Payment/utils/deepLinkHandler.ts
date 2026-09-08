import { UpiApp } from '../types/payment.types';
import { sanitizeText } from './upiValidator';

export interface UpiUriParams {
  upiId: string;
  name: string;
  amount: number;
  transactionId: string;
  orderId?: string;
  note: string;
  currency?: string;
  appScheme?: string;
  merchantCategoryCode?: string;
}

/**
 * Generates an NPCI-compliant UPI deep link / intent URI.
 * Spec: upi://pay?pa=...&pn=...&am=...&cu=INR&tr=...&tn=...
 */
export function generateUpiUri(params: UpiUriParams): string {
  const {
    upiId,
    name,
    amount,
    transactionId,
    note,
    currency = 'INR',
    appScheme,
    merchantCategoryCode,
  } = params;

  const baseScheme = appScheme ? appScheme : 'upi://pay';

  const queryParams = new URLSearchParams();
  queryParams.set('pa', upiId.trim());
  queryParams.set('pn', sanitizeText(name, 50));
  queryParams.set('am', amount.toFixed(2));
  queryParams.set('cu', currency);
  queryParams.set('tr', transactionId.trim());
  queryParams.set('tn', sanitizeText(note, 60));

  if (merchantCategoryCode) {
    queryParams.set('mc', merchantCategoryCode);
  }

  // Handle schemes that might already contain a query delimiter
  const delimiter = baseScheme.includes('?') ? '&' : '?';
  return `${baseScheme}${delimiter}${queryParams.toString()}`;
}

/**
 * Popular UPI applications in India
 */
export const SUPPORTED_UPI_APPS: UpiApp[] = [
  {
    id: 'generic',
    name: 'Any UPI App',
    scheme: 'upi://pay',
    iconBg: '#10B981',
    popular: true,
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    scheme: 'phonepe://pay',
    packageName: 'com.phonepe.app',
    iconBg: '#5F259F',
    popular: true,
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    scheme: 'gpay://upi/pay',
    packageName: 'com.google.android.apps.nbu.paisa.user',
    iconBg: '#4285F4',
    popular: true,
  },
  {
    id: 'paytm',
    name: 'Paytm',
    scheme: 'paytmmp://pay',
    packageName: 'net.one97.paytm',
    iconBg: '#00BAF2',
    popular: true,
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    scheme: 'bhim://pay',
    packageName: 'in.org.npci.upiapp',
    iconBg: '#0066B3',
    popular: true,
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    scheme: 'amazonpay://pay',
    packageName: 'in.amazon.mShop.android.shopping',
    iconBg: '#FF9900',
    popular: false,
  },
];

/**
 * Checks if the user is running on an Android device
 */
export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return /android/i.test(ua);
}

/**
 * Checks if the user is on any mobile device (Android/iOS)
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
}

/**
 * Dispatches the UPI intent.
 * On Android browsers, assigning window.location.href to 'upi://pay?...'
 * invokes Android's native intent resolver, letting the user pick from any installed UPI app.
 */
export function launchUpiIntentUrl(
  uri: string,
  onHandoff?: () => void,
  onError?: (err: string) => void
): { dispatched: boolean; targetUri: string } {
  try {
    if (typeof window === 'undefined') {
      return { dispatched: false, targetUri: uri };
    }

    if (onHandoff) {
      onHandoff();
    }

    // Standard Android deep link invocation
    window.location.href = uri;

    return { dispatched: true, targetUri: uri };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to launch intent';
    if (onError) onError(errorMsg);
    return { dispatched: false, targetUri: uri };
  }
}
