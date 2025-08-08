import React from 'react';
import { Eye, Headphones, Hand } from 'lucide-react';

interface BLSOptionBoxProps {
  type: 'visual' | 'auditory' | 'tapping';
  onClick: () => void;
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function BLSOptionBox({ type, onClick, isSelected = false, size = 'medium' }: BLSOptionBoxProps) {
  const getConfig = () => {
    switch (type) {
      case 'visual':
        return {
          backgroundColor: '#E6F0FF',
          borderColor: isSelected ? '#3B82F6' : '#E6F0FF',
          icon: <Eye className="h-8 w-8 text-blue-600" />,
          label: 'Visual',
          subtitle: 'Follow moving ball'
        };
      case 'auditory':
        return {
          backgroundColor: '#E6FFEC', 
          borderColor: isSelected ? '#10B981' : '#E6FFEC',
          icon: <Headphones className="h-8 w-8 text-green-600" />,
          label: 'Auditory',
          subtitle: 'Stereo sound tones'
        };
      case 'tapping':
        return {
          backgroundColor: '#F7E6FF',
          borderColor: isSelected ? '#8B5CF6' : '#F7E6FF', 
          icon: <Hand className="h-8 w-8 text-purple-600" />,
          label: 'Tapping',
          subtitle: 'Self-administered'
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          borderColor: '#E5E7EB',
          icon: <div className="h-8 w-8" />,
          label: 'Unknown',
          subtitle: 'Unknown method'
        };
    }
  };

  const config = getConfig();
  
  const sizeClasses = {
    small: 'p-3 min-h-[120px]',
    medium: 'p-4 min-h-[140px]', 
    large: 'p-6 min-h-[160px]'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const subtitleSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm', 
    large: 'text-base'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        w-full
        rounded-lg
        border-2
        transition-all
        duration-200
        hover:scale-105
        hover:shadow-md
        flex
        flex-col
        items-center
        justify-center
        space-y-2
        ${isSelected ? 'shadow-lg transform scale-105' : 'shadow-sm'}
      `}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      
      {/* Label */}
      <div className={`font-bold text-slate-800 ${textSizeClasses[size]}`}>
        {config.label}
      </div>
      
      {/* Subtitle */}
      <div className={`text-slate-600 text-center ${subtitleSizeClasses[size]}`}>
        {config.subtitle}
      </div>
    </button>
  );
}