import { useState, useEffect } from 'react'; 
import Converter from './screens/Converter/Converter';
import CurrencySelector from './screens/CurrencySelector/CurrencySelector';
import BudgetSetup from './screens/BudgetSetup/BudgetSetup';
import DailyBreakdown from './screens/DailyBreakdown/DailyBreakdown';
import CostEstimator from './screens/CostEstimator/CostEstimator';
import SavedTrips from './screens/SavedTrips/SavedTrips'; 
import SplashScreen from './screens/SplashScreen/SplashScreen'; 
import { IconCurrencyDollar, IconWallet, IconMapPin, IconBookmark } from '@tabler/icons-react'; 
import './App.css';

function App() {
  const [screen, setScreen] = useState('converter');
  const [fromCurrency, setFromCurrency] = useState('MYR');
  const [toCurrency, setToCurrency] = useState(null);
  const [selectingFor, setSelectingFor] = useState(null);
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState('1');
  const [tripData, setTripData] = useState(null);
  
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  
  const [savedTrips, setSavedTrips] = useState(() => {
    const localData = localStorage.getItem('travel_app_saved_trips');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('travel_app_saved_trips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 2000);

    const unmountTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  const handleOpenSelector = (which) => {
    setSelectingFor(which);
    setScreen('selector');
  };

  const handleCurrencySelect = (currency) => {
    if (selectingFor === 'from') setFromCurrency(currency.code);
    else setToCurrency(currency.code);
    setScreen('converter');
  };

  const handleSaveTrip = (finalCalculatedTrip) => {
    const newSavedEntry = {
      ...finalCalculatedTrip,
      id: `trip-${Date.now()}`
    };
    setSavedTrips((prevTrips) => [newSavedEntry, ...prevTrips]);
    setScreen('saved'); 
  };

  const handleUnsaveTrip = (tripId) => {
    setSavedTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
  };

  const renderBottomNav = () => {
    if (screen === 'selector') return null;

    return (
      <div className="app-navigation-bar">
        <button 
          className={`nav-tab ${screen === 'converter' ? 'nav-tab--active' : ''}`} 
          onClick={() => setScreen('converter')}
        >
          <IconCurrencyDollar size={22} />
          <span>Converter</span>
        </button>
        <button 
          className={`nav-tab ${['budget', 'breakdown'].includes(screen) ? 'nav-tab--active' : ''}`} 
          onClick={() => setScreen(tripData ? 'breakdown' : 'budget')}
        >
          <IconWallet size={22} />
          <span>Budget</span>
        </button>
        <button 
          className={`nav-tab ${screen === 'estimator' ? 'nav-tab--active' : ''}`} 
          onClick={() => setScreen('estimator')}
          disabled={!tripData}
          style={{ opacity: tripData ? 1 : 0.4 }}
        >
          <IconMapPin size={22} />
          <span>Estimator</span>
        </button>
        <button 
          className={`nav-tab ${screen === 'saved' ? 'nav-tab--active' : ''}`} 
          onClick={() => setScreen('saved')}
        >
          <IconBookmark size={22} />
          <span>Saved</span>
        </button>
      </div>
    );
  };

  const renderScreenContent = () => {
    switch (screen) {
      case 'selector':
        return (
          <CurrencySelector
            selectedCode={selectingFor === 'from' ? fromCurrency : toCurrency}
            onSelect={handleCurrencySelect}
            onBack={() => setScreen('converter')}
          />
        );

      case 'breakdown':
        return (
          <DailyBreakdown
            tripData={tripData}
            onBack={() => setScreen('budget')}
            onNext={() => setScreen('estimator')}
          />
        );

      case 'estimator':
        return (
          <CostEstimator 
            tripData={tripData} 
            onBack={() => setScreen('breakdown')} 
            savedTrips={savedTrips}       
            onSaveTrip={handleSaveTrip}   
            onUnsaveTrip={handleUnsaveTrip} 
          />
        );

      case 'budget':
        return (
          <BudgetSetup
            rates={rates}
            converterAmount={amount}
            converterFromCurrency={fromCurrency}
            converterToCurrency={toCurrency}
            tripData={tripData} 
            onNext={(data) => {
              setTripData(data);
              setScreen('breakdown');
            }}
            onBack={() => setScreen('converter')}
          />
        );

      case 'saved':
        return (
          <SavedTrips 
            savedTrips={savedTrips} 
            onSelectTrip={(selectedTrip) => {
              setTripData(selectedTrip);
              setScreen('estimator'); 
            }}
          />
        );

      case 'converter':
      default:
        return (
          <Converter
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            onFromCurrencyChange={setFromCurrency}
            onToCurrencyChange={setToCurrency}
            onOpenSelector={handleOpenSelector}
            onRatesLoaded={setRates}
            /* 🛠️ FIXED: Reset tripData to null on a new initialization request */
            onPlanTrip={() => {
              setTripData(null); 
              setScreen('budget');
            }}
            amount={amount}
            onAmountChange={setAmount}
          />
        );
    }
  };

  return (
    <div className="app">
      {showSplash && <SplashScreen fadeOut={fadeSplash} />}

      <div className="app-main-viewport">
        {renderScreenContent()}
      </div>
      {renderBottomNav()}
    </div>
  );
}

export default App;