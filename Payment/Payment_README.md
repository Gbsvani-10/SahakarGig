# SahakarGig UPI Payment Module

An accessible, secure, multilingual Unified Payments Interface (UPI) payment module engineered for the **SahakarGig** cooperative gig platform.

Designed to accommodate diverse users across India:
- Everyday smartphone users
- Elderly users
- Users with limited digital literacy
- Users preferring regional Indian languages (English, Telugu, Hindi)
- Users with visual or reading impairments

---

## 1. How the Payment Flow Works

```
[Customer Selects Gig Service / Booking]
                     │
                     ▼
[Payment Confirmation Screen]
  - Payee (Verified Cooperative Worker)
  - Amount in INR (e.g. ₹250.00)
  - Purpose & Booking Reference ID
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
 [Pay with Any UPI App]   [Alternative Methods]
  - Fires standard UPI     - Show QR Code
    intent deep link       - Copy UPI ID
  - Android Intent Chooser - Share Payment Link
         │
         ▼
[User Authenticates inside Official Bank UPI App]
  (Google Pay, PhonePe, Paytm, BHIM, etc.)
  *User enters Bank UPI PIN ONLY inside Bank App*
         │
         ▼
[Return to SahakarGig Status Screen]
  - Processing Payment...
  - Payment Successful (Receipt & Bank Ref)
  - OR Payment Failed / Cancelled / Unconfirmed
```

---

## 2. How UPI Intent Works

The UPI Intent flow enables any mobile browser on an Android device to trigger installed UPI applications without needing merchant-specific SDKs:

1. **NPCI URI Construction**:
   The system constructs a standards-compliant deep-link URL following NPCI specifications:
   ```text
   upi://pay?pa=merchant@bank&pn=Merchant%20Name&am=250.00&cu=INR&tr=SG173099238&tn=Service%20Fee%20ORD123
   ```
   - `pa`: Payee Virtual Payment Address (VPA / UPI ID)
   - `pn`: Payee registered legal name
   - `am`: Verified transaction amount (formatted to 2 decimal places)
   - `cu`: Currency code (`INR`)
   - `tr`: Unique transaction reference generated per attempt
   - `tn`: Transaction note / memo

2. **Android Intent Dispatch**:
   When the user taps **[ PAY WITH ANY UPI APP ]**, the browser triggers `window.location.href = upiUri`.
   On Android:
   - The OS detects the `upi://` URI scheme.
   - The native Android App Chooser bottom sheet opens, showing all compatible UPI apps installed on the device (Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay, etc.).
   - The user selects their preferred app, reviews the payee name and amount, and confirms payment.

3. **Fallback App Targets**:
   Direct scheme triggers are also provided as fallbacks:
   - PhonePe: `phonepe://pay?...`
   - Google Pay: `gpay://upi/pay?...`
   - Paytm: `paytmmp://pay?...`
   - BHIM: `bhim://pay?...`

---

## 3. How QR Payment Works

For users on desktop browsers, second devices, or when intent dispatch is unavailable:
1. Tap **[ Show QR Code ]** on the payment card.
2. A high-resolution QR code is generated dynamically in client memory via `qrcode` with error correction level M.
3. The QR encodes the identical NPCI URI (`upi://pay?...`).
4. The customer opens any UPI app on their phone, selects **Scan QR**, points the camera at the screen, and completes the payment.
5. Quick action buttons **[ Copy UPI ID ]** and **[ Share Payment Link ]** allow copy-pasting into manual VPA transfer or messaging apps.

---

## 4. How Easy Payment Mode Works

A dedicated accessibility-first mode designed for elderly citizens and users with low digital literacy:

- **Typography**: Text scaled to 24px–36px with high-contrast color pairings.
- **Touch Targets**: Massive buttons (height > 60px) that prevent accidental mis-clicks.
- **Step-by-Step Flow**:
  - **STEP 1: Check the Amount** — Displays large Rupee numerals (e.g. ₹250) and worker name.
  - **STEP 2: Choose Payment App** — Single high-contrast emerald green button: `[ PAY WITH ANY UPI APP ]`.
  - **STEP 3: Your UPI App Will Open** — Clear explanation reassuring the user that their bank app is taking over.
  - **STEP 4: Check Merchant Name & Amount** — Reminds user to double check payee before approving.
  - **STEP 5: Complete Payment Inside UPI App** — Reassures user that their bank app will ask for their PIN, and reminds them never to share their PIN with anyone.
- **Voice Guidance**: Speech synthesis reads instructions aloud in the user's chosen language with real-time visual subtitles.

---

## 5. Supported Languages

The module features a zero-dependency internationalization (`i18n`) architecture:

| Language | Code | Target Demographic |
|---|---|---|
| **English** | `en` | Standard national & urban users |
| **Telugu (తెలుగు)** | `te` | Andhra Pradesh & Telangana rural artisans & gig workers |
| **Hindi (हिन्दी)** | `hi` | Pan-India cooperative workers & customers |

- Extensible architecture: New regional languages (Tamil, Kannada, Marathi, Bengali) can be plugged in by adding a key to `/src/payment/i18n/translations.ts`.
- Simple conversational phrasing is prioritized over complex bureaucratic vocabulary (e.g., in Telugu: *"డబ్బు మొత్తం తనిఖీ చేయండి"* instead of difficult technical terms).

---

## 6. Security Precautions & NPCI Compliance

### ZERO PIN Exposure Rule (CRITICAL)
- **SahakarGig NEVER collects, stores, reads, or autofills a UPI PIN.**
- Neither web forms, inputs, nor backend services ever handle PINs, OTPs, or net-banking passwords.
- All authentication is delegated 100% to the official banking applications registered under NPCI guidelines.

### Input & Amount Validation
- Amount lower bound: ₹1.00; upper ceiling: ₹1,00,000.00.
- Maximum 2 decimal precision enforced.
- UPI ID format validated against NPCI VPA regex (`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$`).
- String sanitation strips script tags, HTML entities, and control characters to prevent URI injection.

### Duplicate Payment Protection
- Cryptographically sound `idempotencyKey` generated per transaction initiation.
- Prevents accidental multiple button presses while the UPI intent or payment app is launching.

---

## 7. Demo Mode Explanation (Prototype Simulation)

A dedicated **Judge Test Controls** harness is accessible via the top navigation bar:

1. **Order & Outcome Simulator**:
   - Switch between sample gig workers (Ramesh Kumar - Solar Pump Repair, Laxmi Devi Handlooms, Gopal Reddy Agri-Transport).
   - Test custom amount inputs.
   - 1-click simulation triggers:
     - **Simulate Success**: Displays completed receipt with bank UTR reference.
     - **Simulate Failure**: Displays error screen with clear next steps (Try QR, Copy UPI).
     - **Simulate Cancelled**: Simulates user cancellation in UPI app.
     - **Simulate Pending**: Simulates unconfirmed bank settlement.
2. **Raw Intent Inspector**:
   - Inspect live generated `upi://pay` URI string and individual query parameters.
3. **Automated Test Suite**:
   - Executes live automated validation tests directly in the browser (UPI format, amount constraints, URI spec compliance, idempotency checks, zero-PIN audit).
4. **All demo outcomes are clearly watermarked as "PROTOTYPE DEMO STATUS"** to avoid confusing judges with production bank receipts.

---

## 8. Production Integration Requirements

To transition this prototype into production handling real funds:

1. **Authorized Payment Aggregator / Bank Acquirer**:
   - Partner with an RBI/NPCI authorized entity (e.g. Razorpay, Cashfree, PayU, PhonePe PG, or direct Bank UPI Switch).
2. **Server-Side Verification (S2S Webhook)**:
   - Provide HTTPS webhook listener (e.g. `/api/payment/webhook`).
   - Validate HMAC SHA256 signature using the payment gateway secret.
   - Update order status to `PAID` *only* when the gateway webhook confirms `status: SUCCESS` with a valid Bank UTR.
3. **Merchant Onboarding (VPA Allocation)**:
   - Dynamic VPA or Sub-merchant VPA creation for each registered gig cooperative worker.
4. **Zero-Trust Rule**:
   - Client-side callbacks must never be trusted as proof of payment.

---

## 9. Environment Variables Required

In production, the following variables should be declared:

```env
# Optional production gateway keys (Not required for prototype evaluation)
UPI_GATEWAY_API_KEY=""
UPI_GATEWAY_SECRET=""
UPI_MERCHANT_VPA="sahakargig@bank"
UPI_WEBHOOK_SECRET=""
```

---

## 10. How to Run and Test the Feature

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the local dev server**:
   ```bash
   npm run dev
   ```
3. **Open the browser**:
   Navigate to `http://localhost:3000`.

---

## 11. Android Testing Instructions

1. Open the SahakarGig web application in **Chrome on an Android phone** (or scan the preview URL QR code).
2. Ensure you have at least one UPI app installed (Google Pay, PhonePe, Paytm, or BHIM).
3. On the payment screen, tap **[ PAY WITH ANY UPI APP ]**.
4. Observe Android's native intent resolver bottom sheet pop up with your installed UPI apps.
5. Select an app: the app will open pre-populated with the payee name and amount.
6. Return to SahakarGig to view the processing and outcome handling.

---

## 12. Known Limitations

- **Desktop Browsers**: Desktop operating systems (Windows/macOS/Linux) do not have a default handler registered for `upi://` schemes; users on desktop should use the **Show QR Code** option.
- **iOS Browsers**: On iOS Safari, generic `upi://` scheme support depends on installed apps that register the handler; the dedicated app buttons or QR code should be used.
- **Prototype Simulation**: Transaction status in this demo is simulated for hackathon evaluation and does not debit real bank funds.
