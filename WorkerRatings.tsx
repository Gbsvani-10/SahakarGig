import React from 'react';
import { Card } from '../../components/common/Card';
import { Star, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const WorkerRatings: React.FC = () => {
  const reviews = [
    {
      id: 'rev-1',
      customer: 'Priya Sharma (Noida Sector 110)',
      rating: 5,
      date: '04 Sep 2026',
      text: 'Ravi was outstanding! Replaced our cracked sink pipe in 20 minutes, carried all professional tools, and charged the transparent cooperative rate.',
      categoryRatings: { quality: 5, punctuality: 5, behavior: 5 }
    },
    {
      id: 'rev-2',
      customer: 'Amitabh Sen (Mayur Vihar)',
      rating: 5,
      date: '29 Aug 2026',
      text: 'Prompt response during evening emergency. Very polite, clean workmanship. Glad to support cooperative labour directly.',
      categoryRatings: { quality: 5, punctuality: 4.8, behavior: 5 }
    },
    {
      id: 'rev-3',
      customer: 'Sunita Mehra (Indirapuram)',
      rating: 4.8,
      date: '18 Aug 2026',
      text: 'Skillful diagnosis of bathroom drainage issue. Cleared blockage without any wall damage.',
      categoryRatings: { quality: 5, punctuality: 4.5, behavior: 5 }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Customer Ratings & Cooperative Reviews</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Direct consumer ratings that build your merit standing for institutional tenders and cooperative bonus pools
        </p>
      </div>

      {/* Aggregate Score Card */}
      <Card className="p-6 bg-slate-900 text-white border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-center sm:text-left">
            <span className="text-4xl font-black text-amber-400">4.9</span>
            <div className="flex text-amber-400 mt-1">
              {'★★★★★'}
            </div>
            <p className="text-xs text-slate-400 mt-1">42 verified ratings</p>
          </div>

          <div className="border-l border-slate-800 pl-6 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between gap-4">
              <span>Workmanship Quality:</span>
              <span className="font-bold text-teal-400">4.9 / 5.0</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Punctuality:</span>
              <span className="font-bold text-teal-400">4.8 / 5.0</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Safety & Etiquette:</span>
              <span className="font-bold text-teal-400">5.0 / 5.0</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1 max-w-xs">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Cooperative Merit Tier: Diamond</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Top 5% in Delhi NCR Labour Federation. Eligible for annual profit-share bonus.
          </p>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-gray-900">{r.customer}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-amber-500 font-bold text-xs">⭐ {r.rating} / 5</span>
                  <span className="text-[11px] text-gray-400">• {r.date}</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Verified Job ✓
              </span>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed italic">
              "{r.text}"
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
