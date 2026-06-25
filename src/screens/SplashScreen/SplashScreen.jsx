import CuravelLogo from '../../components/CuravelLogo/CuravelLogo';
import './SplashScreen.css';

function SplashScreen({ fadeOut }) {
  return (
    <div className={`splash-screen ${fadeOut ? 'splash-screen--fade-out' : ''}`}>
      <div className="splash-screen__container">
        <CuravelLogo height={80} />
      </div>
    </div>
  );
}

export default SplashScreen;
