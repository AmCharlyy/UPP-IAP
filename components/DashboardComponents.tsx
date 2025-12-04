import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ScheduleItem, NotificationItem } from '../types';

// --- Stat Card ---
interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  iconBgColor: string;
  iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, iconBgColor, iconColor }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${iconBgColor}`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// --- Schedule List Item ---
export const ScheduleListItem: React.FC<{ item: ScheduleItem }> = ({ item }) => (
  <div className="flex border-l-4 border-blue-500 pl-4 py-1 relative">
    <div className="flex flex-col w-20 flex-shrink-0 text-xs text-blue-600 font-semibold">
      <span>{item.startTime} -</span>
      <span>{item.endTime}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-900 font-semibold text-sm">{item.subject}</span>
      <span className="text-gray-500 text-xs">{item.details}</span>
    </div>
  </div>
);

// --- Notification List Item ---
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react';

export const NotificationListItem: React.FC<{ item: NotificationItem }> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'danger': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTextColor = () => {
    switch (item.type) {
        case 'danger': return 'text-red-600';
        case 'warning': return 'text-amber-600';
        case 'success': return 'text-green-600';
        case 'info': return 'text-blue-600';
    }
  }

  return (
    <div className="flex space-x-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-0.5 flex-shrink-0">
        {getIcon()}
      </div>
      <div>
        <p className={`text-sm font-semibold ${getTextColor()}`}>{item.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.message}</p>
      </div>
    </div>
  );
};

// --- Section Header ---
export const SectionHeader: React.FC<{ title: string; actionText?: string; onAction?: () => void }> = ({ title, actionText, onAction }) => (
  <div className="flex justify-between items-end mb-4">
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {actionText && (
      <button onClick={onAction} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
        {actionText}
      </button>
    )}
  </div>
);