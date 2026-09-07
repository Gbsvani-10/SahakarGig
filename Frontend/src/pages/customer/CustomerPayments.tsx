import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  HeartHandshake,
  Receipt
} from 'lucide-react';

export const CustomerPayments: React.FC = () => {
  const { bookings, payments, updatePaymentStatus, addToast } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash'>('UPI');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [processing, setProcessing] = useState(false);
  const [paidTxn, setPaidTxn] = useState<string | null>(null);

  // Find a pending booking
  const pendingBooking = bookings.find((b) => b.paymentStatus === 'Pending' || b.status === 'Service Completed') || bookings[0];

  const amount = pendingBooking ? pendingBooking.totalAmount : 480;
  const base = pendingBooking ? pendingBooking.baseAmount : 400;
  const welfare = pendingBooking ? pendingBooking.welfareFee : 28;
  const platform = pendingBooking ? pendingBooking.platformFee : 12;
  const tax = Math.round(base * 0.05);

  const handleProcessPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const fakeTxnId = `TXN-SG-${Date.now().toString().slice(-6)}`;
      setPaidTxn(fakeTxnId);
      if (pendingBooking) {
        updatePaymentStatus(pendingBooking.id, 'Paid');
      }
      addToast('success', 'Payment Successful', `Transaction ${fakeTxnId} completed. ₹${amount} credited.`);
    }, 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Payments & Settlements</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Transparent cooperative billing with direct benefit disbursement to artisans
        </p>
      </div>

      {paidTxn ? (
        /* Payment Success Confirmation */
        <Card className="p-8 text-center space-y-6 border-emerald-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Transaction Successful
            </span>
            <h2 className="text-2xl font-black text-gray-900">₹{amount} Paid Successfully</h2>
            <p className="text-xs text-gray-500">Reference ID: {paidTxn}</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 max-w-md mx-auto space-y-2 text-left">
            <div className="flex justify-between">
              <span>Paid to Artisan:</span>
              <span className="font-bold">{pendingBooking?.workerName || 'Ravi Kumar'}</span>
            </div>
            <div className="flex justify-between">
              <span>Cooperative Society:</span>
              <span className="font-bold">{pendingBooking?.cooperativeName || 'Delhi Labour Cooperative'}</span>
            </div>
            <div className="flex justify-between border-t border-emerald-200 pt-1.5">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{selectedMethod} Instant DBT</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addToast('info', 'Invoice Downloaded', 'Official GST invoice downloaded to your device.');
              }}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Cooperative Receipt
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPaidTxn(null)}
            >
              Done
            </Button>
          </div>
        </Card>
      ) : (
        /* Payment Form */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Methods Selection */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Select Digital Payment Method
              </h3>

              <div className="space-y-2">
                {/* UPI */}
                <div
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedMethod === 'UPI' ? 'border-emerald-600 bg-emerald-50/40' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">UPI Instant Payment</p>
                      <p className="text-[11px] text-gray-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedMethod === 'UPI'}
                    onChange={() => setSelectedMethod('UPI')}
                    className="text-emerald-700"
                  />
                </div>

                {/* Credit / Debit Card */}
                <div
                  onClick={() => setSelectedMethod('Card')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedMethod === 'Card' ? 'border-emerald-600 bg-emerald-50/40' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-700" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Credit / Debit Card</p>
                      <p className="text-[11px] text-gray-500">RuPay, Visa, Mastercard</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedMethod === 'Card'}
                    onChange={() => setSelectedMethod('Card')}
                    className="text-emerald-700"
                  />
                </div>

                {/* Net Banking */}
                <div
                  onClick={() => setSelectedMethod('NetBanking')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedMethod === 'NetBanking' ? 'border-emerald-600 bg-emerald-50/40' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-purple-700" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Cooperative / Commercial Net Banking</p>
                      <p className="text-[11px] text-gray-500">State Cooperative Banks, SBI, HDFC</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedMethod === 'NetBanking'}
                    onChange={() => setSelectedMethod('NetBanking')}
                    className="text-emerald-700"
                  />
                </div>
              </div>

              {/* Dynamic Input based on method */}
              {selectedMethod === 'UPI' && (
                <div className="pt-2">
                  <Input
                    label="Virtual Payment Address (VPA / UPI ID)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                  />
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-4"
                isLoading={processing}
                onClick={handleProcessPayment}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Authorize Payment of ₹{amount}
              </Button>
            </Card>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>PCI-DSS Level 1 Encrypted • 0% Surcharge on UPI & RuPay</span>
            </div>
          </div>

          {/* Pricing & Transparency Math */}
          <div className="md:col-span-5 space-y-4">
            <Card className="p-6 space-y-4 bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-700" />
                <span>Invoice Breakdown</span>
              </h3>

              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Base Work Rate (Direct to Worker)</span>
                  <span className="font-semibold text-gray-900">₹{base}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worker Welfare & Medical (7%)</span>
                  <span className="font-semibold text-gray-900">₹{welfare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cooperative Tech Maint (3%)</span>
                  <span className="font-semibold text-gray-900">₹{platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-gray-900">₹{tax}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{amount}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Empowering Cooperative Workers</span>
                </p>
                <p className="text-[11px] text-emerald-900">
                  ₹{base} is transferred via Direct Benefit Transfer (DBT) directly to the worker's bank within 2 hours.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Historic Payments Table */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Recent Payment History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-gray-400 uppercase border-b border-gray-100">
              <tr>
                <th className="pb-2">Transaction ID</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Worker</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.slice(0, 3).map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 font-mono text-gray-700">{p.id}</td>
                  <td className="py-2.5 text-gray-600">{p.date}</td>
                  <td className="py-2.5 font-semibold text-gray-900">{p.serviceCategory || 'Cooperative Service'}</td>
                  <td className="py-2.5 text-gray-700">{p.workerName}</td>
                  <td className="py-2.5 font-bold text-gray-900">₹{p.amount}</td>
                  <td className="py-2.5">
                    <StatusBadge status="Payment Completed" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
