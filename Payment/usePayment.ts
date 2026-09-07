import { useState, useCallback, useEffect } from 'react';
import {
  PaymentRequest,
  Transaction,
  PaymentStatus,
  Language,
  PaymentMode,
  DemoGigOrder,
} from '../types/payment.types';
import { PaymentService } from '../services/PaymentService';
import { translations } from '../i18n/translations';
import { useSpeechSynthesis } from './useSpeechSynthesis';

export const SAMPLE_GIG_ORDERS: DemoGigOrder[] = [
  {
    id: 'SG-ORD-9021',
    workerName: 'Ramesh Kumar',
    serviceName: 'Rural Solar Pump Inverter Repair',
    cooperativeUnit: 'Warangal Renewable Energy Cooperative',
    upiId: 'ramesh.solar@upi',
    amount: 250,
    category: 'Electrical & Solar',
    verifiedWorker: true,
  },
  {
    id: 'SG-ORD-9022',
    workerName: 'Laxmi Devi Handlooms',
    serviceName: 'Handwoven Ikat Cotton Fabric (3m)',
    cooperativeUnit: 'Pochampally Weavers Sahakari Sangham',
    upiId: 'laxmi.ikat@oksbi',
    amount: 780,
    category: 'Handloom & Crafts',
    verifiedWorker: true,
  },
  {
    id: 'SG-ORD-9023',
    workerName: 'Gopal Reddy Agri-Transport',
    serviceName: 'Farm-to-Mandi Organic Produce Haulage',
    cooperativeUnit: 'Kisan Mitra Agro Cooperative',
    upiId: 'gopal.kisan@icici',
    amount: 1450,
    category: 'Logistics & Haulage',
    verifiedWorker: true,
  },
];

export function usePayment() {
  const [language, setLanguage] = useState<Language>('en');
  const [mode, setMode] = useState<PaymentMode>('standard');
  const [selectedOrder, setSelectedOrder] = useState<DemoGigOrder>(SAMPLE_GIG_ORDERS[0]);
  const [customAmount, setCustomAmount] = useState<number>(SAMPLE_GIG_ORDERS[0].amount);
  
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Easy Mode Step tracker (1 to 5)
  const [easyStep, setEasyStep] = useState<number>(1);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  
  // Demo Mode Switch
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState<boolean>(false);

  const t = translations[language];
  const { isSpeaking, hasSpeechSupport, speak, stop, currentCaption } = useSpeechSynthesis();

  // Create payment request when order changes or amount updates
  const refreshPaymentRequest = useCallback(
    (order: DemoGigOrder, amountToUse: number) => {
      const res = PaymentService.createPaymentRequest({
        orderId: order.id,
        merchantName: order.workerName,
        merchantUpiId: order.upiId,
        amount: amountToUse,
        description: order.serviceName,
        customerName: 'Suresh Rao',
        serviceCategory: order.category,
      });

      if (res.valid && res.paymentRequest) {
        setPaymentRequest(res.paymentRequest);
        setErrorMessage(null);
      } else {
        setErrorMessage(res.error || 'Invalid payment parameters');
      }
    },
    []
  );

  useEffect(() => {
    refreshPaymentRequest(selectedOrder, customAmount);
  }, [selectedOrder, customAmount, refreshPaymentRequest]);

  // Voice narration when Easy Mode step changes
  useEffect(() => {
    if (mode === 'easy' && isVoiceEnabled) {
      let voiceText = '';
      switch (easyStep) {
        case 1:
          voiceText = `${t.voiceStep1} ₹${customAmount}.`;
          break;
        case 2:
          voiceText = t.voiceStep2;
          break;
        case 3:
          voiceText = t.voiceStep3;
          break;
        case 4:
          voiceText = `${t.voiceStep4}: ${selectedOrder.workerName}, ₹${customAmount}.`;
          break;
        case 5:
          voiceText = t.voiceStep5;
          break;
      }
      speak(voiceText, language);
    }
  }, [mode, easyStep, isVoiceEnabled, language, customAmount, selectedOrder, speak, t]);

  /**
   * Initiate UPI payment (Unified "Pay with any UPI app" or specific app)
   */
  const initiatePayment = useCallback(
    (appId?: string) => {
      if (!paymentRequest) {
        setErrorMessage(t.errUnknown);
        return;
      }

      if (isSubmitting) {
        setErrorMessage(t.errDuplicatePayment);
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const { transaction, uri } = PaymentService.initiateTransaction(paymentRequest, appId);
        setCurrentTransaction(transaction);
        setPaymentStatus('initiating');

        // Play voice prompt
        if (isVoiceEnabled) {
          speak(t.voiceStep3, language);
        }

        // Handoff to Android native intent or web protocol
        setTimeout(() => {
          PaymentService.launchUPIIntent(
            transaction.transactionId,
            () => {
              setPaymentStatus('processing');
              setIsSubmitting(false);
              // In easy mode, advance to step 3 & 4
              setEasyStep(3);
            },
            (err) => {
              setPaymentStatus('failed');
              setErrorMessage(`${t.errLaunchFailed}: ${err}`);
              setIsSubmitting(false);
            }
          );
        }, 300);
      } catch (err: any) {
        setErrorMessage(err.message || t.errUnknown);
        setIsSubmitting(false);
      }
    },
    [paymentRequest, isSubmitting, isVoiceEnabled, language, speak, t]
  );

  /**
   * Copy UPI ID
   */
  const handleCopyUpiId = useCallback(async (): Promise<boolean> => {
    if (!paymentRequest) return false;
    const success = await PaymentService.copyUPIId(paymentRequest.merchantUpiId);
    return success;
  }, [paymentRequest]);

  /**
   * Share Payment Link
   */
  const handleSharePaymentLink = useCallback(async (): Promise<boolean> => {
    if (!paymentRequest) return false;
    const tempTxnId = `SG${Date.now()}`;
    const uri = currentTransaction?.upiUri || `upi://pay?pa=${paymentRequest.merchantUpiId}&pn=${encodeURIComponent(paymentRequest.merchantName)}&am=${paymentRequest.amount.toFixed(2)}&cu=INR&tr=${tempTxnId}&tn=${encodeURIComponent(paymentRequest.description)}`;
    const res = await PaymentService.sharePaymentLink(paymentRequest, uri);
    return res.shared;
  }, [paymentRequest, currentTransaction]);

  /**
   * Reset payment to initial state
   */
  const resetPayment = useCallback(() => {
    stop();
    setPaymentStatus('idle');
    setCurrentTransaction(null);
    setErrorMessage(null);
    setIsSubmitting(false);
    setEasyStep(1);
    setIsQrModalOpen(false);
    refreshPaymentRequest(selectedOrder, customAmount);
  }, [selectedOrder, customAmount, refreshPaymentRequest, stop]);

  /**
   * Select a sample gig order for demo
   */
  const handleSelectOrder = useCallback((order: DemoGigOrder) => {
    setSelectedOrder(order);
    setCustomAmount(order.amount);
  }, []);

  /**
   * Demo Simulation Triggers for SIH Judges
   */
  const simulateOutcome = useCallback(
    (outcome: 'success' | 'failed' | 'cancelled' | 'unconfirmed') => {
      if (!currentTransaction) {
        // Create quick transaction if judge clicks simulate directly
        if (paymentRequest) {
          const { transaction } = PaymentService.initiateTransaction(paymentRequest);
          setCurrentTransaction(transaction);
        }
      }

      setPaymentStatus('processing');

      setTimeout(() => {
        const txnId = currentTransaction ? currentTransaction.transactionId : '';
        const updated = PaymentService.updateTransactionStatus(
          txnId,
          outcome,
          outcome === 'failed' ? 'Bank simulation: Insufficient funds / network timeout' : undefined
        );

        if (updated) {
          setCurrentTransaction({ ...updated });
        }
        setPaymentStatus(outcome);

        if (isVoiceEnabled) {
          if (outcome === 'success') speak(t.voiceSuccess, language);
          if (outcome === 'failed' || outcome === 'cancelled') speak(t.voiceFailed, language);
        }
      }, 700);
    },
    [currentTransaction, paymentRequest, isVoiceEnabled, language, speak, t]
  );

  return {
    language,
    setLanguage,
    mode,
    setMode,
    selectedOrder,
    customAmount,
    setCustomAmount,
    paymentRequest,
    currentTransaction,
    paymentStatus,
    isQrModalOpen,
    setIsQrModalOpen,
    errorMessage,
    setErrorMessage,
    isSubmitting,
    easyStep,
    setEasyStep,
    isVoiceEnabled,
    setIsVoiceEnabled,
    isDemoControlsOpen,
    setIsDemoControlsOpen,
    t,
    isSpeaking,
    hasSpeechSupport,
    currentCaption,
    speak,
    stop,
    initiatePayment,
    handleCopyUpiId,
    handleSharePaymentLink,
    resetPayment,
    handleSelectOrder,
    simulateOutcome,
    sampleOrders: SAMPLE_GIG_ORDERS,
  };
}
