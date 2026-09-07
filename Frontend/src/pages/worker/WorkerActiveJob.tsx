import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Camera, 
  Plus, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle,
  Play,
  RotateCcw,
  Receipt
} from 'lucide-react';

export const WorkerActiveJob: React.FC = () => {
  const { bookings, updateBookingStatus, addToast } = useApp();
  const navigate = useNavigate();

  // Find the active booking or fallback
  const activeBooking = bookings.find((b) => 
    b.status === 'Worker Assigned' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'In Progress'
  ) || bookings[0];

  const [currentStep, setCurrentStep] = useState<string>(activeBooking.status);
  const [timerSeconds, setTimerSeconds] = useState<number>(840); // 14 mins elapsed
  const [timerActive, setTimerActive] = useState<boolean>(currentStep === 'In Progress');
  const [extraPartsAmount, setExtraPartsAmount] = useState<number>(0);
  const [extraPartsDesc, setExtraPartsDesc] = useState<string>('');
  const [showExtraModal, setShowExtraModal] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('4819');
  const [customerOtpInput, setCustomerOtpInput] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStepAdvance = (newStatus: any) => {
    setCurrentStep(newStatus);
    updateBookingStatus(activeBooking.id, newStatus);

    if (newStatus === 'In Progress') {
      setTimerActive(true);
      addToast('success', 'Job Started', 'Service timer initialized. Customer has been alerted.');
    } else if (newStatus === 'Service Completed') {
      setTimerActive(false);
      addToast('success', 'Job Completed', 'Work marked complete. Bill presented to customer.');
    } else {
      addToast('info', 'Status Updated', `Status changed to ${newStatus}.`);
    }
  };

  const handleVerifyOtp = () => {
    if (customerOtpInput === otpCode || customerOtpInput === '4819') {
      setOtpVerified(true);
      addToast('success', 'OTP Verified', 'Customer identity verified under cooperative protocol.');
    } else {
      addToast('error', 'Invalid OTP', 'Please request customer to provide the 4-digit code shown in their SMS.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            Job Operations Console
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Active Job Step Tracker</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-sm font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
          <StatusBadge status={currentStep as any} />
        </div>
      </div>

      {/* Customer & Location Card */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gray-400">{activeBooking.id}</span>
              {activeBooking.isEmergency && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                  🚨 Urgent 15m
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">{activeBooking.serviceTitle}</h3>
            <p className="text-xs text-gray-500">Customer: {activeBooking.customerName}</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeBooking.customerPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Customer</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-gray-400 font-semibold block">Service Destination:</span>
            <div className="flex items-start gap-1.5 text-gray-800">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="font-semibold">{activeBooking.customerAddress}</p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-gray-400 font-semibold block">Customer Problem Description:</span>
            <p className="text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              {activeBooking.notes || 'Kitchen washbasin pipe has a sudden burst and is spilling water.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Lifecycle Progression Control Bar */}
      <Card className="p-6 space-y-6">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Execute Workflow Progression
        </h3>

        {/* Stepper Visualization */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          {[
            { id: 'Worker Assigned', label: '1. Assigned' },
            { id: 'On the Way', label: '2. En Route' },
            { id: 'Arrived', label: '3. Arrived' },
            { id: 'In Progress', label: '4. In Progress' },
            { id: 'Service Completed', label: '5. Completed' }
          ].map((st) => (
            <div
              key={st.id}
              className={`p-2.5 rounded-xl border font-bold transition-all ${
                currentStep === st.id
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}
            >
              {st.label}
            </div>
          ))}
        </div>

        {/* Dynamic Action Buttons depending on step */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">Current Stage Action</p>
            <p className="text-sm font-bold text-gray-900">
              {currentStep === 'Worker Assigned' && 'Depart for customer address'}
              {currentStep === 'On the Way' && 'Arrive at customer doorstep'}
              {currentStep === 'Arrived' && 'Perform tool check and commence repair'}
              {currentStep === 'In Progress' && 'Service in execution (Timer running)'}
              {currentStep === 'Service Completed' && 'Work finished. Bill ready.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentStep === 'Worker Assigned' && (
              <Button
                variant="primary"
                onClick={() => handleStepAdvance('On the Way')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                I'm on the Way
              </Button>
            )}

            {currentStep === 'On the Way' && (
              <Button
                variant="primary"
                onClick={() => handleStepAdvance('Arrived')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                I Have Arrived
              </Button>
            )}

            {currentStep === 'Arrived' && (
              <Button
                variant="primary"
                onClick={() => handleStepAdvance('In Progress')}
                rightIcon={<Play className="w-4 h-4" />}
              >
                Start Service
              </Button>
            )}

            {currentStep === 'In Progress' && (
              <Button
                variant="primary"
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() => handleStepAdvance('Service Completed')}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Service
              </Button>
            )}

            {currentStep === 'Service Completed' && (
              <Button
                variant="outline"
                onClick={() => {
                  updateBookingStatus(activeBooking.id, 'Payment Completed');
                  addToast('success', 'Settlement Finished', 'Payment received. Direct Benefit Transfer initiated.');
                  navigate('/worker/earnings');
                }}
              >
                Confirm Payment & Close Job
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Safety & OTP Verification Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer OTP */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Customer OTP Security Check</span>
          </div>
          <p className="text-xs text-gray-500">
            Ask customer for the 4-digit code to verify cooperative work authorization. (Demo code: <strong>4819</strong>)
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              maxLength={4}
              value={customerOtpInput}
              onChange={(e) => setCustomerOtpInput(e.target.value)}
              placeholder="4819"
              className="w-28 rounded-lg border border-gray-300 p-2 text-center text-base font-mono font-bold tracking-widest"
            />
            <Button
              size="sm"
              variant={otpVerified ? 'secondary' : 'primary'}
              onClick={handleVerifyOtp}
            >
              {otpVerified ? 'Verified ✓' : 'Verify OTP'}
            </Button>
          </div>
        </Card>

        {/* Additional Parts / Materials */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
              <Receipt className="w-4 h-4 text-teal-600" />
              <span>Parts & Materials</span>
            </div>
            <span className="text-xs font-bold text-gray-900">+₹{extraPartsAmount}</span>
          </div>

          <p className="text-xs text-gray-500">
            Added consumable materials (e.g. PVC pipe joint, Teflon tape) with customer consent.
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setExtraPartsAmount(80);
                setExtraPartsDesc('1/2 inch Brass elbow joint + Teflon tape');
                addToast('info', 'Parts Added', '₹80 added to invoice for brass elbow.');
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Material Charge (₹80)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
