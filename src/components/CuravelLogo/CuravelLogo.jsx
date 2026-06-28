function CuravelLogo({ height = 40 }) {
  // Center point of the 680px viewBox
  const centerX = 340; 
  // Adjust these offsets to shift the icon and text group towards the center
  const iconGroupX = -60; 
  const textGroupX = 40; 

  return (
    <svg 
      viewBox="0 0 680 280" 
      preserveAspectRatio="xMidYMid meet" 
      style={{ height, display: 'block', margin: '0 auto' }}
    >
      <title>Curavel app logo</title>

      {/* Icon Group - Translated to balance the left side */}
      <g transform={`translate(${iconGroupX}, 0)`}>
        <defs>
          <clipPath id="circle-clip">
            <circle cx="140" cy="140" r="72"/>
          </clipPath>
        </defs>
        <circle cx="140" cy="140" r="72" fill="#1A1A1A"/>
        <g clipPath="url(#circle-clip)" fill="none" stroke="#F7F6F3" strokeWidth="1" opacity="0.35">
          <ellipse cx="140" cy="140" rx="72" ry="22"/>
          <ellipse cx="140" cy="140" rx="72" ry="44"/>
          <ellipse cx="140" cy="140" rx="72" ry="64"/>
          <line x1="140" y1="68" x2="140" y2="212"/>
          <ellipse cx="140" cy="140" rx="24" ry="72"/>
          <ellipse cx="140" cy="140" rx="48" ry="72"/>
        </g>
        <circle cx="140" cy="140" r="72" fill="none" stroke="#F7F6F3" strokeWidth="1.5" opacity="0.5"/>
        <path d="M100 168 Q120 108 160 128 Q185 140 175 115" fill="none" stroke="#F7F6F3" strokeWidth="3" strokeLinecap="round" />
        <path d="M175 115 L168 108 M175 115 L182 110" fill="none" stroke="#F7F6F3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="100" cy="168" r="5" fill="#F7F6F3"/>
      </g>

      {/* Separator Line - Exactly at center */}
      <line x1={centerX} y1="90" x2={centerX} y2="190" stroke="#E8E6E0" strokeWidth="1"/>

      {/* Wordmark Group - Translated to balance the right side */}
      <g transform={`translate(${textGroupX}, 0)`}>
        <text x="240" y="126" fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif" fontSize="64" fontWeight="500" fill="#1A1A1A" letterSpacing="-2">
          Curavel
        </text>
        <text x="242" y="162" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="400" fill="#6B6B6B" letterSpacing="0.5">
          Currency · Travel · Budget
        </text>
      </g>
    </svg>
  );
}

export default CuravelLogo;