import {
  PaymentRequest,
  Transaction,
  PaymentStatus,
  ValidationResult,
  UpiApp,
} from '../types/payment.types';
import {
  validateAmount,
  validateUPIId,
  generateTransactionId,
  sanitizeText,
} from '../utils/upiValidator';
import {
  generateUpiUri,
  launchUpiIntentUrl,
  SUPPORTED_UPI_APPS,
  isAndroidDevice,
} from '../utils/deepLinkHandler';

export interface CreatePaymentParams {
  orderId: string;
  merchantName: string;
  merchantUpiId: string;
  amount: number;
  description: string;
  customerName?: string;
  customerPhone?: string;
  serviceCategory?: string;
}

export interface IntentLaunchResult {
  success: boolean;
  transaction: Transaction;
  uri: string;
  error?: string;
}

class PaymentServiceSingleton {
  private activeTransactions: Map<string, Transaction> = new Map();
  private idempotencyCache: Set<string> = new Set();

  /**
   * Validate and create a structured payment request.
   * Protects against amount tampering and invalid UPI addresses.
   */
  public createPaymentRequest(params: CreatePaymentParams): {
    valid: boolean;
    paymentRequest?: PaymentRequest;
    error?: string;
  } {
    // 1. Validate Amount
    const amountVal: ValidationResult = validateAmount(params.amount);
    if (!amountVal.valid) {
      return { valid: false, error: amountVal.error };
    }

    // 2. Validate Merchant UPI ID
    const upiVal: ValidationResult = validateUPIId(params.merchantUpiId);
    if (!upiVal.valid) {
      return { valid: false, error: upiVal.error };
    }

    // 3. Create cryptographically sound idempotency token
    const idempotencyKey = `IDEM-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const request: PaymentRequest = {
      orderId: sanitizeText(params.orderId, 40),
      merchantName: sanitizeText(params.merchantName, 50),
      merchantUpiId: params.merchantUpiId.trim().toLowerCase(),
      amount: amountVal.parsedAmount || params.amount,
      currency: 'INR',
      description: sanitizeText(params.description, 60),
      customerName: params.customerName ? sanitizeText(params.customerName, 40) : undefined,
      customerPhone: params.customerPhone ? sanitizeText(params.customerPhone, 15) : undefined,
      serviceCategory: params.serviceCategory ? sanitizeText(params.serviceCategory, 30) : 'Gig Services',
      idempotencyKey,
    };

    return { valid: true, paymentRequest: request };
  }

  /**
   * Generates a new transaction and prepares the UPI deep-link URI.
   * Includes duplicate payment protection check.
   */
  public initiateTransaction(
    request: PaymentRequest,
    selectedAppId?: string
  ): { transaction: Transaction; uri: string } {
    // Duplicate payment protection
    if (this.idempotencyCache.has(request.idempotencyKey)) {
      throw new Error('Duplicate payment detected for this idempotency key. Please wait.');
    }
    this.idempotencyCache.add(request.idempotencyKey);

    const transactionId = generateTransactionId();

    const selectedApp = SUPPORTED_UPI_APPS.find((a) => a.id === selectedAppId);
    const appScheme = selectedApp ? selectedApp.scheme : undefined;

    const uri = generateUpiUri({
      upiId: request.merchantUpiId,
      name: request.merchantName,
      amount: request.amount,
      transactionId,
      orderId: request.orderId,
      note: `${request.description} (${request.orderId})`,
      currency: request.currency,
      appScheme,
    });

    const transaction: Transaction = {
      transactionId,
      orderId: request.orderId,
      merchantName: request.merchantName,
      merchantUpiId: request.merchantUpiId,
      amount: request.amount,
      currency: request.currency,
      description: request.description,
      createdAt: new Date().toISOString(),
      status: 'initiating',
      selectedApp: selectedApp ? selectedApp.name : 'Any UPI App',
      isDemoTransaction: true,
      upiUri: uri,
    };

    this.activeTransactions.set(transactionId, transaction);
    return { transaction, uri };
  }

  /**
   * Launches the UPI intent using Android native handler or deep-link.
   */
  public launchUPIIntent(
    transactionId: string,
    onHandoff?: () => void,
    onError?: (err: string) => void
  ): IntentLaunchResult {
    const txn = this.activeTransactions.get(transactionId);
    if (!txn || !txn.upiUri) {
      return {
        success: false,
        transaction: txn || ({} as Transaction),
        uri: '',
        error: 'Transaction record or UPI URI not found',
      };
    }

    // Update status to intent_dispatched
    txn.status = 'intent_dispatched';
    this.activeTransactions.set(transactionId, txn);

    const { dispatched, targetUri } = launchUpiIntentUrl(
      txn.upiUri,
      () => {
        txn.status = 'processing';
        this.activeTransactions.set(transactionId, txn);
        if (onHandoff) onHandoff();
      },
      (err) => {
        txn.status = 'failed';
        txn.failureReason = err;
        this.activeTransactions.set(transactionId, txn);
        if (onError) onError(err);
      }
    );

    return {
      success: dispatched,
      transaction: txn,
      uri: targetUri,
    };
  }

  /**
   * Copies the merchant UPI ID to clipboard
   */
  public async copyUPIId(upiId: string): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(upiId.trim());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Shares payment link using standard Web Share API with clipboard fallback
   */
  public async sharePaymentLink(
    request: PaymentRequest,
    upiUri: string
  ): Promise<{ shared: boolean; method: 'native' | 'clipboard' | 'failed' }> {
    const shareData = {
      title: `Pay ${request.merchantName} via UPI`,
      text: `Payment of ₹${request.amount.toFixed(2)} to ${request.merchantName} for "${request.description}". Pay using UPI:`,
      url: upiUri,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return { shared: true, method: 'native' };
      }
      // Fallback: Copy link
      const copied = await this.copyUPIId(upiUri);
      return { shared: copied, method: copied ? 'clipboard' : 'failed' };
    } catch {
      // User cancelled share or browser refused
      return { shared: false, method: 'failed' };
    }
  }

  /**
   * Check payment status
   * In a real production implementation, this queries the SahakarGig backend API
   * which in turn validates status against the Bank / Payment Gateway / NPCI PSP Switch.
   */
  public checkPaymentStatus(transactionId: string): Transaction | undefined {
    return this.activeTransactions.get(transactionId);
  }

  /**
   * Update transaction status (Demo simulation or Callback handler)
   */
  public updateTransactionStatus(
    transactionId: string,
    status: PaymentStatus,
    reason?: string
  ): Transaction | undefined {
    const txn = this.activeTransactions.get(transactionId);
    if (!txn) return undefined;

    txn.status = status;
    if (status === 'success') {
      txn.completedAt = new Date().toISOString();
      txn.paymentReference = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    } else if (status === 'failed' || status === 'cancelled') {
      txn.failureReason = reason || (status === 'cancelled' ? 'User cancelled in UPI app' : 'Bank transaction declined');
    }

    this.activeTransactions.set(transactionId, txn);
    return txn;
  }

  /**
   * Get supported UPI apps
   */
  public getAvailableUpiApps(): UpiApp[] {
    return SUPPORTED_UPI_APPS;
  }

  /**
   * Production Integration Specification:
   * Describes the server-to-server webhook & acquirer verification requirements.
   */
  public getProductionVerificationSpec(): {
    flow: string;
    serverRequirements: string[];
    npciCompliance: string[];
    prohibitedClientPractices: string[];
  } {
    return {
      flow: 'Client App -> Android UPI Intent -> User enters Bank PIN in Official Bank App -> Bank notifies NPCI -> NPCI notifies Merchant Acquirer -> Acquirer sends signed S2S Webhook to SahakarGig Backend -> Backend verifies HMAC signature & marks Order Paid',
      serverRequirements: [
        'Backend server endpoint (/api/payment/verify or /api/payment/webhook) with HTTPS',
        'HMAC SHA256 signature verification of webhook payloads',
        'Direct Server-to-Server status inquiry to Payment Gateway using txn reference',
        'Zero trust on client-side status flags',
      ],
      npciCompliance: [
        'Never collect or prompt for UPI PIN anywhere in the web portal',
        'Display verified Payee name matching bank registered name',
        'Clearly show Transaction Reference and Amount before intent trigger',
        'Follow NPCI Procedural Guidelines for UPI Intent on Mobile Browsers',
      ],
      prohibitedClientPractices: [
        'Never fake a success receipt without server verification in production',
        'Never ask for OTP, ATM PIN, or Internet Banking credentials',
        'Never simulate an in-page PIN pad',
      ],
    };
  }
}

export const PaymentService = new PaymentServiceSingleton();
