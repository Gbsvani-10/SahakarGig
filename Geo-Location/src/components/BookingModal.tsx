import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  Receipt, 
  Building2, 
  ArrowRight,
  User,
  Check
} from 'lucide-react';
import { CooperativeWorker, CustomerLocation } from '../types';
import { SKILL_ICONS_MAP } from '../data/mockData';

interface BookingModalProps {
  worker: CooperativeWorker | null;
  customerLocation: CustomerLocation;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (bookingDetails: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  worker,
  customerLocation,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState('Today (Immediate)');
  const [selectedTime, setSelectedTime] = useState('Slot 1: Next 30 Mins');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: string;
    workerName: string;
    service: string;
    location: string;
    arrivalTime: string;
    amount: number;
  } | null>(null);

  if (!isOpen || !worker) return null;

  const baseServiceFee = worker.hourlyRate;
  const cooperativeWelfareFund = 15; // Fair wage cooperative fund
  const platformFee = 0; // Cooperative has 0% predatory commission!
  const totalAmount = baseServiceFee + cooperativeWelfareFund;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking = {
        id: `SHK-BOOK-${Math.floor(10000 + Math.random() * 90000)}`,
        workerName: worker.name,
        service: worker.skill,
        location: customerLocation.address,
        arrivalTime: `~${worker.estimatedArrivalMin} minutes (${selectedTime})`,
        amount: totalAmount,
      };
      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
      onBookingSuccess(newBooking);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-2xl">
              {SKILL_ICONS_MAP[worker.skill]}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-purple-950/60 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide uppercase text-purple-200 border border-purple-400/30">
                Cooperative Fair-Wage Contract
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mt-0.5">
                Book Verified Worker
              </h2>
              <p className="text-xs text-purple-200">
                Direct dispatch from Labour Cooperative Federation
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {!confirmedBooking ? (
            <>
              {/* Worker Profile Card summary */}
              <div className="flex items-start gap-3.5 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-13 h-13 rounded-2xl object-cover border border-purple-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-base">{worker.name}</span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-purple-700 bg-white px-1.5 py-0.2 rounded-full border border-purple-200">
                      <ShieldCheck className="w-3 h-3 text-purple-600" /> Verified
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-purple-900 mt-0.5">
                    {worker.skill} • {worker.experienceYears} yrs experience
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {worker.cooperativeSociety}
                  </div>
                </div>
              </div>

              {/* Service Details Grid */}
              <div className="space-y-3 text-xs">
                {/* Location */}
                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-purple-700 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Service Location</span>
                    <span className="font-semibold text-slate-800">{customerLocation.address}</span>
                  </div>
                </div>

                {/* Distance & Arrival */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Distance</span>
                    <span className="font-extrabold text-slate-900 text-sm">{worker.distanceKm} km away</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Estimated Arrival</span>
                    <span className="font-extrabold text-emerald-700 text-sm">~{worker.estimatedArrivalMin} minutes</span>
                  </div>
                </div>

                {/* Date & Time Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Service Date</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                    >
                      <option>Today (Immediate)</option>
                      <option>Tomorrow Morning</option>
                      <option>Tomorrow Afternoon</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Time Slot</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-purple-600"
                    >
                      <option>Slot 1: Next 30 Mins</option>
                      <option>Slot 2: 11:00 AM - 01:00 PM</option>
                      <option>Slot 3: 03:00 PM - 05:00 PM</option>
                      <option>Slot 4: 05:00 PM - 07:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Transparent Cooperative Rate Card */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-3 rounded-xl border border-purple-200 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Receipt className="w-3.5 h-3.5 text-purple-700" />
                      Transparent Cooperative Tariff
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                      0% Corporate Commission
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Base Service Wage (Cooperative Standard Rate):</span>
                    <span className="font-semibold text-slate-900">₹{baseServiceFee}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Worker Health & Social Security Welfare Fund:</span>
                    <span className="font-semibold text-slate-900">₹{cooperativeWelfareFund}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Corporate Intermediary Cut:</span>
                    <span className="font-bold">₹0.00 (Cooperative Benefit)</span>
                  </div>

                  <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t border-purple-200/80 pt-1.5 mt-1">
                    <span>Total Estimated Service Cost:</span>
                    <span className="text-purple-900">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-2 py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Registering with Cooperative...</span>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Booking Confirmed State (Section 22) */
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  ✅ Booking Confirmed
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Dispatched to {confirmedBooking.workerName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Booking Reference: <strong className="font-mono text-purple-900">{confirmedBooking.id}</strong>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-extrabold text-slate-900">{confirmedBooking.service}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Service Address:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[240px]">{confirmedBooking.location}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Expected Arrival Time:</span>
                  <span className="font-extrabold text-emerald-700">{confirmedBooking.arrivalTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Authorized Rate:</span>
                  <span className="font-extrabold text-purple-900">₹{confirmedBooking.amount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                Track Live Worker on Map
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
