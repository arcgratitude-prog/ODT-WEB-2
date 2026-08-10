import React from 'react';

interface AiUrbanoLogoProps {
  className?: string;
  size?: number | string;
  color?: string;
  glow?: boolean;
}

export const AiUrbanoLogo: React.FC<AiUrbanoLogoProps> = ({
  className = "w-24 h-24",
  color = "currentColor",
  glow = true
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 240 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full transition-all duration-300 ${glow ? 'drop-shadow-[0_0_20px_rgba(220,38,38,0.7)]' : ''}`}
      >
        <g filter={glow ? "url(#glow-filter)" : undefined}>
          {/* DEFINITIONS FOR NEON RED GLOW */}
          <defs>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* DRIPPING LETTER 'A' (LEFT EYE) */}
          <path
            d="M 65 30 
               L 88 30 
               C 92 30 95 33 96 38 
               L 112 110 
               C 114 118 108 125 100 125 
               L 95 125 
               C 92 125 90 122 89 118 
               L 83 92 
               L 60 92 
               L 55 116 
               C 54 122 51 125 45 125 
               C 42 125 40 122 41 115 
               L 41 128
               C 41 133 37 136 33 133
               C 30 131 31 125 32 115
               L 56 38 
               C 58 33 61 30 65 30 Z 
               M 72 48 
               L 64 78 
               L 79 78 
               L 72 48 Z"
            fill="none"
            stroke="url(#logo-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* A DRIPS */}
          <path
            d="M 41 125 Q 41 142 39 148 Q 37 154 35 146 Q 34 135 35 125
               M 62 125 Q 62 138 60 143 Q 58 147 57 140 Q 56 130 57 125
               M 98 125 Q 98 140 96 147 Q 94 152 92 144 Q 91 135 93 125"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* DRIPPING LETTER 'I' (RIGHT EYE) */}
          <path
            d="M 160 28 
               L 182 28 
               C 187 28 190 32 190 37 
               L 188 120 
               C 188 125 186 132 186 142
               C 186 150 182 155 178 150
               C 175 146 176 135 176 125
               L 174 158
               C 174 168 168 172 165 162
               C 163 154 165 138 165 125
               L 165 37 
               C 165 32 160 28 160 28 Z"
            fill="none"
            stroke="url(#logo-grad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DRIPPING SMILE CURVE (MOUTH) */}
          <path
            d="M 45 158 
               C 42 165 48 178 62 192 
               C 85 215 135 220 178 188 
               C 192 178 202 162 205 155 
               C 208 148 200 144 195 150 
               C 188 160 178 175 162 185 
               C 128 208 88 200 68 182 
               C 56 171 52 160 48 152 
               C 45 147 42 150 45 158 Z"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DRIPS EXTENDING FROM SMILE */}
          {/* Drip 1 - Left */}
          <path
            d="M 85 200 Q 85 220 83 232 Q 81 240 78 230 Q 77 215 80 198"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Drip 2 - Center Left */}
          <path
            d="M 110 206 Q 110 228 108 242 Q 106 250 104 238 Q 103 220 107 205"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Drip 3 - Center Right Long */}
          <path
            d="M 145 200 Q 145 240 144 265 Q 142 278 139 262 Q 138 235 141 198"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Drip 4 - Right Mid Long */}
          <path
            d="M 165 190 Q 165 230 164 260 Q 162 275 159 255 Q 158 225 161 188"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Drip 5 - Far Right Drop */}
          <path
            d="M 195 168 Q 196 200 195 235 Q 194 255 192 238 Q 191 200 193 162"
            fill="url(#logo-grad)"
            stroke="url(#logo-grad)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Splatter dot */}
          <circle cx="35" cy="150" r="3.5" fill="url(#logo-grad)" />
          <circle cx="140" cy="274" r="2.5" fill="url(#logo-grad)" />
        </g>
      </svg>
    </div>
  );
};
