import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBg = 'bg-emerald-50 text-emerald-700'
}) => {
  return (
    <Card className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">{title}</p>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1.5 pt-0.5 text-xs">
            {trend && (
              <span className={`font-medium ${trend.isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {subtitle && <span className="text-gray-700">{subtitle}</span>}
          </div>
        )}
      </div>
      {icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      )}
    </Card>
  );
};
