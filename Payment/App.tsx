import React from 'react';
import { Header } from './payment/components/Header';
import { SecurityBanner } from './payment/components/SecurityBanner';
import { GigOrderSummary } from './payment/components/GigOrderSummary';
import { PaymentCard } from './payment/components/PaymentCard';
import { EasyPaymentMode } from './payment/components/EasyPaymentMode';
import { QRCodeModal } from './payment/components/QRCodeModal';
import { PaymentStatusScreen } from './payment/components/PaymentStatusScreen';
import { DemoControls } from './payment/components/DemoControls';
import { usePayment } from './payment/hooks/usePayment';
import { AlertTriangle, ShieldCheck, Heart, Sparkles, Smartphone } from 'lucide-react';

export default function App() {
  const {
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
    isDemoControlsOpen,
    setIsDemoControlsOpen,
    t,
    stop,
    initiatePayment,
    handleCopyUpiId,
    handleSharePaymentLink,
    resetPayment,
    handleSelectOrder,
    simulateOutcome,
    sampleOrders,
  } = usePayment();

  const isStatusView =
    paymentStatus !== 'idle' &&
    (paymentStatus === 'processing' ||
      paymentStatus === 'success' ||
      paymentStatus === 'failed' ||
      paymentStatus === 'cancelled' ||
      paymentStatus === 'unconfirmed');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header with Language & Mode Switch */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        mode={mode}
        onToggleMode={() => {
          stop();
          const nextMode = mode === 'standard' ? 'easy' : 'standard';
          setMode(nextMode);
        }}
        onOpenDemo={() => setIsDemoControlsOpen(true)}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Error notification banner if any validation fails */}
        {errorMessage && (
          <div
            id="error-banner"
            className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start justify-between gap-3 text-rose-950 text-xs sm:text-sm shadow-sm"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Payment Error</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded bg-rose-100 hover:bg-rose-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Switch: Status Screen vs Payment Flow Screen */}
        {isStatusView ? (
          <PaymentStatusScreen
            status={paymentStatus}
            transaction={currentTransaction}
            onReset={resetPayment}
            onOpenQr={() => setIsQrModalOpen(true)}
            onCopyUpi={handleCopyUpiId}
            t={t}
          />
        ) : mode === 'easy' ? (
          /* Accessibility-First Easy Mode */
          <div className="space-y-6">
            <EasyPaymentMode
              request={paymentRequest}
              activeStep={easyStep}
              onSetStep={setEasyStep}
              onPayAnyUpi={() => initiatePayment()}
              onOpenQr={() => setIsQrModalOpen(true)}
              t={t}
            />
          </div>
        ) : (
          /* Standard Unified Flow */
          <div className="space-y-6">
            {/* Gig Worker & Order Overview */}
            <GigOrderSummary order={selectedOrder} t={t} />

            {/* Zero-PIN Reassurance Banner */}
            <SecurityBanner t={t} />

            {/* Core UPI Payment Card */}
            <PaymentCard
              request={paymentRequest}
              onPayAnyUpi={() => initiatePayment()}
              onPaySpecificApp={(appId) => initiatePayment(appId)}
              onOpenQr={() => setIsQrModalOpen(true)}
              onCopyUpi={handleCopyUpiId}
              onShareLink={handleSharePaymentLink}
              isSubmitting={isSubmitting}
              t={t}
            />
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        request={paymentRequest}
        upiUri={currentTransaction?.upiUri || ''}
        onCopyUpiId={handleCopyUpiId}
        onSharePaymentLink={handleSharePaymentLink}
        t={t}
      />

      {/* Judge Test Controls & Automated Test Suite Modal */}
      <DemoControls
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        sampleOrders={sampleOrders}
        selectedOrder={selectedOrder}
        onSelectOrder={handleSelectOrder}
        customAmount={customAmount}
        onAmountChange={setCustomAmount}
        paymentRequest={paymentRequest}
        currentTransaction={currentTransaction}
        onSimulateOutcome={simulateOutcome}
      />

      {/* Footer with safety & compliance statement */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-300">
              SahakarGig Cooperative Platform — Inclusive Digital Payments for Gig Workers
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Strict zero-PIN policy. All transactions authenticated by bank-grade UPI applications.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NPCI UPI Intent Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

