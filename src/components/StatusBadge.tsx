import { STATUS_CONFIG } from '../data/constants';
import type { AppointmentStatus } from '../types';

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${config.bg} ${config.color} ${config.border}`}>
      {config.label}
    </span>
  );
}
