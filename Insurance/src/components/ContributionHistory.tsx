import React, { useState } from 'react';
import { ContributionHistoryItem } from '../types';
import { History, CheckCircle2, Download, Receipt, Calendar, AlertCircle } from 'lucide-react';

interface ContributionHistoryProps {
  history: ContributionHistoryItem[];
  isLoading?: boolean;
}

export const ContributionHistory: React.FC<ContributionHistoryProps> = ({
  history = [],
  isLoading = false,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<ContributionHistoryItem | null>(null);

  return (
    <section id="contribution-history-section" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                Contribution History
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified Ledger
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Verified daily micro-deductions recorded from active wage days.
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="text-xs text-stone-500 self-start sm:self-auto flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Showing {history.length} recorded period{history.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
          Loading contribution history...
        </div>
      ) : history.length === 0 ? (
        /* Real-world Empty State when no history exists */
        <div
          id="empty-contribution-history"
          className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center space-y-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-800">No contribution history yet.</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Your verified daily micro-deductions will appear here after your first active wage day.
          </p>
        </div>
      ) : (
        /* History Cards / Table */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-stone-100">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-stone-900">{item.monthYear}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap">
                      <span>{item.daysContributed} active workdays</span>
                      <span>•</span>
                      <span>Processed on {item.date}</span>
                      <span>•</span>
                      <span className="font-mono text-stone-400">{item.receiptNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-black text-stone-900">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-stone-500">Cumulative Monthly</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(item)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-stone-500" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-stone-50/70 border-t border-stone-100 text-center text-xs text-stone-500">
            Historical records are maintained for tax exemption under welfare trust norms.
          </div>
        </div>
      )}

      {/* Verified Receipt Modal */}
      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-stone-900 text-base">Welfare Contribution Receipt</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                Reconciled
              </span>
            </div>

            <div className="space-y-2 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono">
              <div className="flex justify-between">
                <span>Receipt Ref:</span>
                <span className="font-bold text-stone-900">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Period:</span>
                <span className="font-bold text-stone-900">{selectedReceipt.monthYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Working Days Count:</span>
                <span className="text-stone-900">{selectedReceipt.daysContributed} days</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="text-emerald-700 font-bold">Paid & Reconciled</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                <span>Total Contribution:</span>
                <span>₹{selectedReceipt.amount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedReceipt(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-800 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
