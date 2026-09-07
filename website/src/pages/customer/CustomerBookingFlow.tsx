import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Star, 
  AlertTriangle, 
  ShieldCheck, 
  Phone, 
  FileText, 
  ArrowLeft, 
  ArrowRight,
  User,
  HeartHandshake
} from 'lucide-react';

export const CustomerBookingFlow: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { services, workers, createBooking, addToast } = useApp();
  const { user } = useAuth();

  const preselectedServiceId = searchParams.get('serviceId');
  const preselectedWorkerId = searchParams.get('workerId');

  // Multi-step state: 1: Service, 2: Worker, 3: Slot & Address, 4: Review & Welfare, 5: Confirmed
  const [step, setStep] = useState<number>(preselectedWorkerId ? 3 : preselectedServiceId ? 2 : 1);

  // Form selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (preselectedWorkerId ? (workers.find(w => w.id === preselectedWorkerId)?.primaryCategory === 'Electrician' ? 'srv-002' : 'srv-001') : services[0]?.id || '')
  );
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(preselectedWorkerId || '');
  const [selectedDate, setSelectedDate] = useState('2026-09-08');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [address, setAddress] = useState('Flat 402, Lotus Panache, Sector 110');
  const [city, setCity] = useState('Noida');
  const [pincode, setPincode] = useState('201304');
  const [notes, setNotes] = useState('Kitchen sink pipe has a crack and is dripping water.');
  const [isEmergency, setIsEmergency] = useState(false);

  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const activeService = services.find((s) => s.id === selectedServiceId) || services[0];
  
  // Available workers for this service category
  const matchingWorkers = workers.filter((w) => 
    !activeService || w.primaryCategory === activeService.category
  );

  const activeWorker = workers.find((w) => w.id === selectedWorkerId) || matchingWorkers[0] || workers[0];

  // Pricing math
  const basePrice = isEmergency ? 450 : 350;
  const welfareFee = Math.round(basePrice * 0.07); // 7% welfare fund
  const platformFee = Math.round(basePrice * 0.03); // 3% tech maintenance
  const tax = Math.round(basePrice * 0.05); // 5% GST
  const totalPrice = basePrice + welfareFee + platformFee + tax;

  const handleConfirmBooking = async () => {
    const newBooking = await createBooking({
      customerId: user?.id || 'cust-101',
      customerName: user?.name || 'Priya Sharma',
      customerPhone: user?.phone || '+91 98765 43210',
      customerAddress: `${address}, ${city} - ${pincode}`,
      workerId: activeWorker.id,
      workerName: activeWorker.name,
      workerPhone: activeWorker.phone,
      workerAvatar: activeWorker.avatarUrl,
      cooperativeName: activeWorker.cooperativeName,
      serviceCategory: activeService?.category || activeWorker.primaryCategory,
      serviceTitle: activeService?.name || `${activeWorker.primaryCategory} Service`,
      date: selectedDate,
      timeSlot: isEmergency ? 'Immediate 15-Minute Dispatch' : selectedTimeSlot,
      isEmergency: isEmergency,
      baseAmount: basePrice,
      welfareFee: welfareFee,
      platformFee: platformFee,
      totalAmount: totalPrice,
      notes: notes
    });

    setConfirmedBookingId(newBooking.id);
    setStep(5); // Confirmed screen
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper Indicator */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, label: 'Service' },
            { num: 2, label: 'Worker' },
            { num: 3, label: 'Schedule' },
            { num: 4, label: 'Fair Pricing' },
            { num: 5, label: 'Confirmed' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className={`hidden sm:inline ${step === s.num ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Step 1: Select Required Trade Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((srv) => (
              <div
                key={srv.id}
                onClick={() => {
                  setSelectedServiceId(srv.id);
                  // pick first matching worker
                  const match = workers.find((w) => w.primaryCategory === srv.category);
                  if (match) setSelectedWorkerId(match.id);
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedServiceId === srv.id
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase">{srv.category}</span>
                  <span className="text-xs font-bold text-gray-900">{srv.priceRange}</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 mt-1">{srv.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{srv.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Choose Worker
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Select Worker */}
      {step === 2 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Step 2: Choose Verified Cooperative Artisan</h2>
            <span className="text-xs text-emerald-800 font-semibold">{matchingWorkers.length} Artisans Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(matchingWorkers.length > 0 ? matchingWorkers : workers).map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWorkerId(w.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedWorkerId === w.id
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <img
                      src={w.avatarUrl}
                      alt={w.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-sm text-gray-900 truncate">{w.name}</h4>
                        <span className="text-emerald-700 text-xs font-bold">✓</span>
                      </div>
                      <p className="text-xs text-emerald-800 font-semibold">{w.primaryCategory} • {w.experienceYears} yrs</p>
                      <p className="text-[11px] text-gray-700 truncate">{w.cooperativeName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                    <span className="text-amber-500 font-bold">⭐ {w.rating} ({w.completedJobsCount})</span>
                    <span className="text-gray-700">📍 {w.distanceKm} km away</span>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">{w.priceRange}</span>
                  <span className={`text-xs font-bold ${selectedWorkerId === w.id ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {selectedWorkerId === w.id ? 'Selected ✓' : 'Select'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Schedule & Address
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Choose Date, Time Slot & Address */}
      {step === 3 && (
        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Step 3: Schedule & Service Location</h2>

          {/* Emergency Dispatch Option */}
          <div className={`p-4 rounded-xl border-2 transition-all ${
            isEmergency ? 'border-red-500 bg-red-50/50' : 'border-gray-200 bg-white'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="mt-1 rounded border-red-400 text-red-600 focus:ring-red-500"
              />
              <div>
                <span className="text-xs font-bold uppercase text-red-600 tracking-wider block">
                  🚨 Request 15-Minute Emergency Dispatch
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  Overwrites regular scheduling. The closest cooperative rapid-response worker is alerted immediately (+₹100 emergency surge).
                </p>
              </div>
            </label>
          </div>

          {!isEmergency && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Time Slot
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 px-3 text-sm bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>
          )}

          {/* Address Fields */}
          <div className="space-y-3 pt-2">
            <Input
              label="House / Flat / Street Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. House No. 44, Block C, Mayur Vihar"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="Pincode"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Work Description & Notes for Artisan
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention specific issue (e.g. pipe leakage under sink, tool requirements)..."
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Review Pricing Breakdown
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Pricing Breakdown & Cooperative Welfare Transparency */}
      {step === 4 && (
        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Step 4: Fair Cooperative Wage & Bill Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Summary */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 text-xs">
              <h4 className="font-bold text-sm text-gray-900">Service Particulars</h4>
              <div className="flex items-center gap-3">
                <img
                  src={activeWorker.avatarUrl}
                  alt={activeWorker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                />
                <div>
                  <p className="font-bold text-gray-900">{activeWorker.name}</p>
                  <p className="text-emerald-700 font-semibold">{activeService.name}</p>
                  <p className="text-gray-500">{activeWorker.cooperativeName}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2 space-y-1">
                <p><strong>Timing:</strong> {isEmergency ? 'Immediate Emergency' : `${selectedDate} (${selectedTimeSlot})`}</p>
                <p><strong>Location:</strong> {address}, {city} - {pincode}</p>
              </div>
            </div>

            {/* Price Transparency Math */}
            <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Item</span>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Amount</span>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-900">
                <div className="flex justify-between">
                  <span>Base Service Charge (Direct to Worker)</span>
                  <span className="font-semibold">₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cooperative Welfare Fund (7%)</span>
                  <span className="font-semibold">₹{welfareFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Operations (3%)</span>
                  <span className="font-semibold">₹{platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Tax (5%)</span>
                  <span className="font-semibold">₹{tax}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-300 flex justify-between text-sm font-black text-emerald-950">
                <span>Total Amount Due</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-white/90 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                <HeartHandshake className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong>Ethical Guarantee:</strong> 90% of your payment is credited directly to the worker's bank account, and 7% secures their medical insurance.
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirmBooking}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Booking & Request Artisan
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 5: Booking Confirmation & Action Screen */}
      {step === 5 && (
        <Card className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Cooperative Dispatch Confirmed
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Booking {confirmedBookingId || 'BK-2026-901'} Created!
            </h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Your job request has been assigned to <strong>{activeWorker.name}</strong> from {activeWorker.cooperativeName}.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Service:</span>
              <span className="font-bold text-gray-900">{activeService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Scheduled Time:</span>
              <span className="font-bold text-gray-900">{isEmergency ? 'Immediate 15-min Dispatch' : `${selectedDate} (${selectedTimeSlot})`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Artisan Contact:</span>
              <span className="font-bold text-emerald-700">{activeWorker.phone}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-500">Estimated Total:</span>
              <span className="font-bold text-gray-900">₹{totalPrice}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/customer/bookings')}
            >
              Track Live Progress on My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/customer/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
