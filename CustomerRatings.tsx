import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { 
  Star, 
  CheckCircle2, 
  HeartHandshake, 
  Send,
  MessageSquare
} from 'lucide-react';

export const CustomerRatings: React.FC = () => {
  const { bookings, addToast } = useApp();
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[1]?.id || bookings[0]?.id || '');
  const [overallRating, setOverallRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [behaviorRating, setBehaviorRating] = useState(5);
  const [coopRating, setCoopRating] = useState(5);
  const [reviewText, setReviewText] = useState('Excellent craftsmanship! Arrived promptly with standard cooperative rate card. Very polite and thorough clean up afterwards.');
  const [submitted, setSubmitted] = useState(false);

  const booking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('success', 'Rating Submitted', 'Thank you! Your verified rating directly helps the worker receive higher cooperative dividends.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Rate & Review Artisan Service</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Your reviews directly determine annual cooperative member dividends and merit allocation
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">Review Published to Cooperative Roster</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              5 stars credited to {booking?.workerName || 'the artisan'}. Their cooperative bonus score has been updated.
            </p>
            <Button size="sm" variant="outline" onClick={() => setSubmitted(false)}>
              Submit Another Review
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Summary */}
            {booking && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                <img
                  src={booking.workerAvatar}
                  alt={booking.workerName}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{booking.serviceTitle}</h4>
                  <p className="text-emerald-700 font-semibold">{booking.workerName} • {booking.cooperativeName}</p>
                  <p className="text-gray-500">Completed on {booking.date}</p>
                </div>
              </div>
            )}

            {/* Overall Star Rating */}
            <div className="text-center space-y-2 py-2 border-y border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Overall Workmanship Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setOverallRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= overallRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-emerald-700">
                {overallRating === 5 ? 'Exceptional Performance (5/5)' : `${overallRating} / 5 Stars`}
              </p>
            </div>

            {/* Category Ratings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Detailed Performance Metrics
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Punctuality */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="font-medium text-gray-700">Punctuality & Arrival:</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        onClick={() => setPunctualityRating(s)}
                        className="cursor-pointer"
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quality */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="font-medium text-gray-700">Work Quality & Tools:</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} onClick={() => setQualityRating(s)} className="cursor-pointer">
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Behavior */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="font-medium text-gray-700">Politeness & Safety:</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} onClick={() => setBehaviorRating(s)} className="cursor-pointer">
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cooperative Satisfaction */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                  <span className="font-medium text-gray-700">Fair Rate Satisfaction:</span>
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} onClick={() => setCoopRating(s)} className="cursor-pointer">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Written Review */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Detailed Feedback for the Cooperative Committee
              </label>
              <textarea
                rows={3}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with the artisan's skills, rates, and cooperative service..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Cooperative Equity Note:</strong> Your rating feeds into the NCCT performance ledger. Highly-rated artisans gain first preference in district institutional tenders!
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<Send className="w-4 h-4" />}
            >
              Submit Official Review
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
