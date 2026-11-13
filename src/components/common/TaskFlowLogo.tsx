import React from 'react';

interface TaskFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const TaskFlowLogo: React.FC<TaskFlowLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const dimensionMap = {
    sm: { box: 'w-7 h-7', px: 28, text: 'text-sm' },
    md: { box: 'w-9 h-9', px: 36, text: 'text-base' },
    lg: { box: 'w-11 h-11', px: 44, text: 'text-lg' },
    xl: { box: 'w-14 h-14', px: 56, text: 'text-xl' },
  };

  const currentSize = dimensionMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Logo Emblem Icon */}
      <div className={`relative ${currentSize.box} flex-shrink-0 group`}>
        {/* Ambient Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl opacity-60 blur-sm group-hover:opacity-90 transition duration-300" />

        {/* Squircle Glass Canvas */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#0F222D] to-[#081219] border border-teal-400/30 p-1.5 flex items-center justify-center shadow-lg overflow-hidden">
          {/* Subtle glossy top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-xl" />

          {/* Precision SVG Vector Mark */}
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              {/* Primary Teal to Emerald Gradient */}
              <linearGradient id="tf-grad-primary" x1="4" y1="6" x2="32" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="50%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              {/* Accent Cyan Gradient */}
              <linearGradient id="tf-grad-accent" x1="8" y1="20" x2="28" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>

              {/* Deep Shadow Gradient for 3D Overlap */}
              <linearGradient id="tf-grad-depth" x1="10" y1="14" x2="22" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#042F2E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#064E3B" stopOpacity="0.4" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="tf-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#2DD4BF" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Background layered card ribbon */}
            <path
              d="M7 23.5L14 30.5L29 15.5"
              stroke="url(#tf-grad-accent)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />

            {/* Top 'T' Bar with Streamlined Rounded Flow */}
            <path
              d="M6 10.5C6 8.567 7.567 7 9.5 7H26.5C28.433 7 30 8.567 30 10.5C30 12.433 28.433 14 26.5 14H9.5C7.567 14 6 12.433 6 10.5Z"
              fill="url(#tf-grad-primary)"
              filter="url(#tf-glow)"
            />

            {/* Dynamic Forward Check & 'F' Stem */}
            <path
              d="M17 12V24C17 25.657 15.657 27 14 27C12.343 27 11 25.657 11 24V19"
              stroke="url(#tf-grad-primary)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Energetic Flowing Checkmark Ribbon */}
            <path
              d="M11 20.5L16.2 25.7C16.6 26.1 17.2 26.1 17.6 25.7L29 14.3"
              stroke="url(#tf-grad-primary)"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#tf-glow)"
            />

            {/* Energy Particle Sparkle in top right */}
            <circle cx="27" cy="9.5" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Optional Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-white font-sans text-base">
              Task<span className="text-teal-400">Flow</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border border-teal-400/30">
              PRO
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
