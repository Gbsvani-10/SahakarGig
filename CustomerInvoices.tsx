import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FileText, Download, Building2, CheckCircle2 } from 'lucide-react';

export const CustomerInvoices: React.FC = () => {
  const { bookings, addToast } = useApp();

  const completedBookings = bookings.filter((b) => b.paymentStatus === 'Paid' || b.status === 'Payment Completed');

  const handleDownload = (invoiceNo: string) => {
    addToast('success', 'Invoice Downloaded', `Tax invoice ${invoiceNo} downloaded successfully.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Cooperative Tax Invoices</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Official GST & Cooperative Society receipts for audit and household reimbursement
        </p>
      </div>

      <div className="space-y-4">
        {completedBookings.map((b, index) => {
          const invoiceNo = `INV-NCCT-2026-00${index + 1}`;
          return (
            <Card key={b.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-900">{invoiceNo}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      Paid ✓
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mt-0.5">{b.serviceTitle}</h4>
                  <p className="text-xs text-gray-500">
                    Artisan: {b.workerName} • {b.cooperativeName}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">Date of Service: {b.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">Total Paid</span>
                  <span className="text-base font-black text-gray-900">₹{b.totalAmount}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(invoiceNo)}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download PDF
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
