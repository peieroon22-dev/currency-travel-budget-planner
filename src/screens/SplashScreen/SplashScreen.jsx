import React from 'react';
import CuravelLogo from '../../components/CuravelLogo/CuravelLogo';
import './SplashScreen.css';

function SplashScreen({ fadeOut }) {
  return (
    <div className={`splash-screen ${fadeOut ? 'splash-screen--fade-out' : ''}`}>
      <div className="splash-screen__container">
        {/* 🔥 FIX 3: Scaled up to 110 for better prominence and presence on mobile frames */}
        <CuravelLogo height={110} />
      </div>
    </div>
  );
}

export default SplashScreen;