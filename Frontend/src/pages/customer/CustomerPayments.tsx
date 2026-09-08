import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { paymentService } from '../../services/paymentService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreditCard, QrCode, Building2, CheckCircle2, ArrowRight, Download, ShieldCheck, HeartHandshake, Receipt } from 'lucide-react';

export const CustomerPayments: React.FC = () => {
  const { bookings, payments, refreshData, addToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paidTxn, setPaidTxn] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  const pendingBooking = bookings.find((b) =>
    b.paymentStatus !== 'Paid' && b.status === 'Service Completed'
  );

  const amount = Number(pendingBooking?.totalAmount ?? pendingBooking?.finalPrice ?? pendingBooking?.estimatedPrice ?? 0);
  const base = Number(pendingBooking?.baseAmount ?? Math.round(amount * 0.85));
  const welfare = Number(pendingBooking?.welfareFee ?? Math.round(amount * 0.07));
  const platform = Number(pendingBooking?.platformFee ?? Math.round(amount * 0.03));
  const tax = Math.max(0, amount - base - welfare - platform);

  const handleProcessPayment = async () => {
    if (!pendingBooking) {
      addToast('warning', 'No Payment Due', 'A completed service with an unpaid invoice is required before payment.');
      return;
    }
    if (!amount || amount <= 0) {
      addToast('error', 'Invalid Amount', 'The booking does not contain a valid payment amount.');
      return;
    }
    if (selectedMethod === 'UPI' && !/^[-a-zA-Z0-9._]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
      addToast('error', 'Invalid UPI ID', 'Enter a valid UPI ID such as name@bank.');
      return;
    }

    setProcessing(true);
    try {
      const result = await paymentService.processPayment(
        pendingBooking.id,
        amount,
        selectedMethod === 'NetBanking' ? 'Net Banking' : selectedMethod,
        pendingBooking.customerName,
        pendingBooking.workerName,
        pendingBooking.serviceCategory
      );
      setPaidTxn(result.transactionId);
      setInvoiceId(result.invoiceId);
      addToast('success', 'Payment Recorded', `₹${amount} payment confirmed and invoice ${result.invoiceId} generated.`);
      await refreshData();
    } catch (error: any) {
      addToast('error', 'Payment Failed', error?.message || 'The payment could not be recorded. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDone = async () => {
    setPaidTxn(null);
    setInvoiceId(null);
    await refreshData();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Payments & Settlements</h1>
        <p className="text-xs sm:text-sm text-gray-500">Transparent cooperative billing with persisted invoices and payment records</p>
      </div>

      {paidTxn ? (
        <Card className="p-8 text-center space-y-6 border-emerald-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto"><CheckCircle2 className="w-10 h-10" /></div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Payment Confirmed</span>
            <h2 className="text-2xl font-black text-gray-900">₹{amount} Paid Successfully</h2>
            <p className="text-xs text-gray-500">Transaction: {paidTxn}</p>
            <p className="text-xs text-gray-500">Invoice: {invoiceId}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 max-w-md mx-auto space-y-2 text-left">
            <div className="flex justify-between"><span>Paid for:</span><span className="font-bold">{pendingBooking?.serviceTitle}</span></div>
            <div className="flex justify-between"><span>Artisan:</span><span className="font-bold">{pendingBooking?.workerName}</span></div>
            <div className="flex justify-between"><span>Payment Mode:</span><span className="font-bold uppercase">{selectedMethod}</span></div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => addToast('info', 'Invoice Ready', `Invoice ${invoiceId} is stored in PostgreSQL and available to the admin.`)} leftIcon={<Download className="w-4 h-4" />}>View Receipt</Button>
            <Button variant="primary" size="sm" onClick={handleDone}>Done</Button>
          </div>
        </Card>
      ) : !pendingBooking ? (
        <Card className="p-8 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
          <h2 className="text-lg font-black text-gray-900">No payment due</h2>
          <p className="text-sm text-gray-500">Payment becomes available after one of your services is marked completed.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select Payment Method</h3>
              <div className="space-y-2">
                {[
                  ['UPI', QrCode, 'Google Pay, PhonePe, Paytm, BHIM'],
                  ['Card', CreditCard, 'RuPay, Visa, Mastercard'],
                  ['NetBanking', Building2, 'Cooperative Banks, SBI, HDFC']
                ].map(([method, Icon, description]) => {
                  const selected = selectedMethod === method;
                  const PaymentIcon = Icon as React.ComponentType<{ className?: string }>;
                  return <div key={method as string} onClick={() => setSelectedMethod(method as typeof selectedMethod)} className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${selected ? 'border-emerald-600 bg-emerald-50/40' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3"><PaymentIcon className="w-5 h-5 text-emerald-700" /><div><p className="text-xs font-bold text-gray-900">{method === 'NetBanking' ? 'Cooperative / Commercial Net Banking' : method === 'UPI' ? 'UPI Instant Payment' : 'Credit / Debit Card'}</p><p className="text-[11px] text-gray-500">{description as string}</p></div></div>
                    <input type="radio" checked={selected} onChange={() => setSelectedMethod(method as typeof selectedMethod)} className="text-emerald-700" />
                  </div>;
                })}
              </div>
              {selectedMethod === 'UPI' && <div className="pt-2"><Input label="Virtual Payment Address (UPI ID)" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" /></div>}
              <Button variant="primary" size="lg" className="w-full mt-4" isLoading={processing} onClick={handleProcessPayment} rightIcon={<ArrowRight className="w-4 h-4" />}>Confirm Payment of ₹{amount}</Button>
            </Card>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500"><ShieldCheck className="w-4 h-4 text-emerald-700" /><span>Payment request is authenticated and recorded server-side</span></div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <Card className="p-6 space-y-4 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-700" /><span>Invoice Breakdown</span></h3>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between"><span>Base Work Rate</span><span className="font-semibold text-gray-900">₹{base}</span></div>
                <div className="flex justify-between"><span>Worker Welfare & Medical</span><span className="font-semibold text-gray-900">₹{welfare}</span></div>
                <div className="flex justify-between"><span>Cooperative Tech Maintenance</span><span className="font-semibold text-gray-900">₹{platform}</span></div>
                <div className="flex justify-between"><span>Other / Tax</span><span className="font-semibold text-gray-900">₹{tax}</span></div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-gray-900"><span>Total Amount</span><span>₹{amount}</span></div>
              </div>
              <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1"><p className="font-bold flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />Empowering Cooperative Workers</p><p className="text-[11px] text-emerald-900">The payment is validated by the backend against your completed booking before an invoice is created.</p></div>
            </Card>
          </div>
        </div>
      )}

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Payment History</h3>
        <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead className="text-gray-400 uppercase border-b border-gray-100"><tr><th className="pb-2">Transaction ID</th><th className="pb-2">Date</th><th className="pb-2">Service</th><th className="pb-2">Worker</th><th className="pb-2">Amount</th><th className="pb-2">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{payments.slice(0, 5).map((p) => <tr key={p.id}><td className="py-2.5 font-mono text-gray-700">{p.id}</td><td className="py-2.5 text-gray-600">{p.date}</td><td className="py-2.5 font-semibold text-gray-900">{p.serviceCategory}</td><td className="py-2.5 text-gray-700">{p.workerName}</td><td className="py-2.5 font-bold text-gray-900">₹{p.amount}</td><td className="py-2.5"><StatusBadge status={p.status === 'Successful' ? 'Payment Completed' : p.status} /></td></tr>)}</tbody></table></div>
        {payments.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No persisted payments yet.</p>}
      </Card>
    </div>
  );
};
