import React from 'react';
import { 
  IconBed, 
  IconToolsKitchen2, 
  IconTrain, 
  IconBookmark, 
  IconShare,
  IconArrowLeft,
  IconAlertTriangle
} from '@tabler/icons-react';
import './CostEstimator.css';

const REAL_WORLD_PROFILES = {
  TWD: { accommodation: 2200, food: 600, transport: 150 },    
  JPY: { accommodation: 11000, food: 5500, transport: 1500 }, 
  text: { accommodation: 140, food: 60, transport: 22 },      
  EUR: { accommodation: 110, food: 50, transport: 15 },      
  GBP: { accommodation: 100, food: 45, transport: 18 },      
  SGD: { accommodation: 150, food: 48, transport: 12 },      
  KRW: { accommodation: 90000, food: 38000, transport: 8500 }, 
  THB: { accommodation: 1600, food: 650, transport: 200 },    
  MYR: { accommodation: 220, food: 70, transport: 25 }       
};

// 🛠️ Destructure savedTrips, onSaveTrip, and onUnsaveTrip down from App context
function CostEstimator({ tripData, onBack, savedTrips = [], onSaveTrip, onUnsaveTrip }) {
  const destination = tripData?.destination || { name: 'Taiwan', currency: 'TWD', symbol: 'NT$' };
  const duration = parseInt(tripData?.duration || 1, 10);
  const homeCurrency = tripData?.budgetCurrency || 'MYR';
  
  const targetBudget = parseFloat(tripData?.budgetInDest || 76);
  const homeBudget = parseFloat(tripData?.budget || 10); 

  const homeToDestExchangeRate = targetBudget / homeBudget;
  const currencyKey = destination.currency;
  let activeRates = REAL_WORLD_PROFILES[currencyKey];

  if (!activeRates) {
    const fallbackAccommodationMYR = 250; 
    const fallbackFoodMYR = 75;
    const fallbackTransportMYR = 30;

    activeRates = {
      accommodation: fallbackAccommodationMYR * homeToDestExchangeRate,
      food: fallbackFoodMYR * homeToDestExchangeRate,
      transport: fallbackTransportMYR * homeToDestExchangeRate
    };
  }

  const accommodationTotalDest = activeRates.accommodation * duration;
  const foodTotalDest = activeRates.food * duration;
  const transportTotalDest = activeRates.transport * duration;

  const totalEstimatedDest = accommodationTotalDest + foodTotalDest + transportTotalDest;
  const isOverBudget = totalEstimatedDest > targetBudget;
  const budgetDifference = Math.abs(targetBudget - totalEstimatedDest);

  const formatDest = (val) => `${destination.symbol}${Math.round(val).toLocaleString()}`;
  const formatHome = (val) => `${homeCurrency} ${Math.round(val / homeToDestExchangeRate).toLocaleString()}`;

  // 🛠️ Dynamic check: See if this specific trip structure already lives inside the saved matching context
  const existingSavedTrip = savedTrips.find(t => 
    t.id === tripData?.id || 
    (t.destination?.name === destination.name && t.duration === duration && t.budget === homeBudget)
  );
  const isSaved = !!existingSavedTrip;

  // 🛠️ Event Toggle Handler logic for executing Save vs Unsave actions
  const handleSaveToggle = () => {
    if (isSaved) {
      if (onUnsaveTrip) onUnsaveTrip(existingSavedTrip.id);
    } else {
      if (onSaveTrip) {
        // Construct the payload with calculation calculations included for the Saved list layout
        onSaveTrip({
          ...tripData,
          tripName: tripData?.tripName || `${destination.name} Getaway`,
          destination,
          duration,
          budgetCurrency: homeCurrency,
          budget: homeBudget,
          budgetInDest: targetBudget,
          totalEstimatedDest,
          isOverBudget,
          budgetDifference
        });
      }
    }
  };

  const categories = [
    {
      id: 'accommodation',
      name: 'Accommodation',
      icon: IconBed,
      rateText: `${formatDest(activeRates.accommodation)} / night`,
      totalDest: formatDest(accommodationTotalDest),
      totalHome: formatHome(accommodationTotalDest)
    },
    {
      id: 'food',
      name: 'Food & drinks',
      icon: IconToolsKitchen2,
      rateText: `${formatDest(activeRates.food)} / day`,
      totalDest: formatDest(foodTotalDest),
      totalHome: formatHome(foodTotalDest)
    },
    {
      id: 'transport',
      name: 'Transport',
      icon: IconTrain,
      rateText: `${formatDest(activeRates.transport)} / day`,
      totalDest: formatDest(transportTotalDest),
      totalHome: formatHome(transportTotalDest)
    }
  ];

  return (
    <div className="cost-estimator">
      
      <div className="cost-estimator__header">
        <button className="cost-estimator__back" onClick={onBack} aria-label="Go back">
          <IconArrowLeft size={20} />
        </button>
        <div className="cost-estimator__header-text">
          <h1 className="cost-estimator__title">Cost Estimator</h1>
          <p className="cost-estimator__subtitle">
            {destination.name} · {duration} {duration === 1 ? 'day' : 'days'} · {formatDest(targetBudget)}
          </p>
        </div>
      </div>

      {isOverBudget && (
        <div className="estimator-alert">
          <IconAlertTriangle size={20} stroke={2} className="estimator-alert__icon" />
          <p className="estimator-alert__text">
            Your estimate is {formatDest(budgetDifference)} over budget
          </p>
        </div>
      )}

      <p className="cost-estimator__section-label">ESTIMATED COSTS BY CATEGORY</p>

      <div className="estimator-card">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <div className="estimator-row" key={cat.id}>
              <div className="estimator-row__icon">
                <IconComponent size={24} stroke={1.5} color="var(--color-ink)" />
              </div>
              
              <div className="estimator-row__details">
                <p className="estimator-row__title">{cat.name}</p>
                <p className="estimator-row__rate">{cat.rateText}</p>
              </div>

              <div className="estimator-row__totals">
                <p className="estimator-row__total-dest">{cat.totalDest}</p>
                <p className="estimator-row__total-home">{cat.totalHome}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`estimator-summary ${isOverBudget ? 'estimator-summary--over' : ''}`}>
        <div className="summary-row">
          <p className="summary-row__label">Estimated total</p>
          <p className="summary-row__value">{formatDest(totalEstimatedDest)}</p>
        </div>
        
        <div className="summary-row">
          <p className="summary-row__label">Your budget</p>
          <p className="summary-row__value">{formatDest(targetBudget)}</p>
        </div>

        <div className="summary-divider"></div>

        {!isOverBudget ? (
          <div className="summary-row summary-row--spare">
            <p className="summary-row__label">Spare</p>
            <p className="summary-row__value">{formatDest(budgetDifference)}</p>
          </div>
        ) : (
          <div className="summary-row summary-row--over">
            <p className="summary-row__label">Over by</p>
            <p className="summary-row__value">{formatDest(budgetDifference)}</p>
          </div>
        )}
      </div>

      <div className="estimator-actions">
        {/* 🛠️ Dynamic Button Variant styling classes and Icon Fill triggers applied */}
        <button 
          className={`estimator-btn ${isSaved ? 'estimator-btn--saved' : 'estimator-btn--outline'}`}
          onClick={handleSaveToggle}
        >
          <IconBookmark 
            size={20} 
            stroke={1.5} 
            fill={isSaved ? 'var(--color-ink, #111111)' : 'transparent'} 
          />
          {isSaved ? 'Saved' : 'Save trip'}
        </button>
        
        <button className="estimator-btn estimator-btn--filled">
          <IconShare size={20} stroke={1.5} />
          Share
        </button>
      </div>

    </div>
  );
}

export default CostEstimator;