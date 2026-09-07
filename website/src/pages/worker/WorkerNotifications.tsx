import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';

export const WorkerNotifications: React.FC = () => {
  const { notifications } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Notifications & Alerts</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Cooperative dispatches, customer updates, and DBT disbursement alerts
        </p>
      </div>

      <Card className="p-6 space-y-3 divide-y divide-gray-100">
        {notifications.map((n) => (
          <div key={n.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900">{n.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-gray-400 mt-1 block">{n.timestamp}</span>
              </div>
            </div>

            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase font-bold">
              {n.type}
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
};
