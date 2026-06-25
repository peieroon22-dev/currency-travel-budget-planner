import { useState } from 'react';
import { IconChevronDown, IconMinus, IconPlus, IconArrowLeft } from '@tabler/icons-react';
import Button from '../../components/Button/Button';
import './BudgetSetup.css';

const DESTINATIONS = [
  { code: 'ae', name: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ' },
  { code: 'au', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'bd', name: 'Bangladesh', currency: 'BDT', symbol: '৳' },
  { code: 'bh', name: 'Bahrain', currency: 'BHD', symbol: '.د.ب' },
  { code: 'bn', name: 'Brunei', currency: 'BND', symbol: 'B$' },
  { code: 'ca', name: 'Canada', currency: 'CAD', symbol: 'C$' },
  { code: 'ch', name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
  { code: 'cn', name: 'China', currency: 'CNY', symbol: '¥' },
  { code: 'dk', name: 'Denmark', currency: 'DKK', symbol: 'kr' },
  { code: 'eg', name: 'Egypt', currency: 'EGP', symbol: 'E£' },
  { code: 'eu', name: 'Eurozone', currency: 'EUR', symbol: '€' },
  { code: 'gb', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'hk', name: 'Hong Kong', currency: 'HKD', symbol: 'HK$' },
  { code: 'id', name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },
  { code: 'in', name: 'India', currency: 'INR', symbol: '₹' },
  { code: 'jp', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'kr', name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { code: 'kw', name: 'Kuwait', currency: 'KWD', symbol: 'د.ك' },
  { code: 'my', name: 'Malaysia', currency: 'MYR', symbol: 'RM' },
  { code: 'no', name: 'Norway', currency: 'NOK', symbol: 'kr' },
  { code: 'nz', name: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
  { code: 'ph', name: 'Philippines', currency: 'PHP', symbol: '₱' },
  { code: 'pk', name: 'Pakistan', currency: 'PKR', symbol: '₨' },
  { code: 'qa', name: 'Qatar', currency: 'ر.ق', symbol: 'ر.ق' },
  { code: 'sa', name: 'Saudi Arabia', currency: 'SAR', symbol: 'ر.س' },
  { code: 'se', name: 'Sweden', currency: 'SEK', symbol: 'kr' },
  { code: 'sg', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { code: 'th', name: 'Thailand', currency: 'THB', symbol: '฿' },
  { code: 'tr', name: 'Turkey', currency: 'TRY', symbol: '₺' },
  { code: 'tw', name: 'Taiwan', currency: 'TWD', symbol: 'NT$' },
  { code: 'us', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'vn', name: 'Vietnam', currency: 'VND', symbol: '₫' },
  { code: 'za', name: 'South Africa', currency: 'ZAR', symbol: 'R' },
];

const BUDGET_CURRENCIES = ['MYR', 'USD', 'EUR', 'GBP', 'SGD'];

function BudgetSetup({ onNext, onBack, converterAmount, converterFromCurrency, converterToCurrency, rates, tripData }) {
  
  const [destination, setDestination] = useState(() => {
    return tripData?.destination || DESTINATIONS.find((d) => d.currency === converterToCurrency) || DESTINATIONS[15]; 
  });
  
  const [budget, setBudget] = useState(() => {
    if (tripData?.budget !== undefined && tripData?.budget !== null) {
      return String(tripData.budget);
    }
    return converterAmount || '1';
  });

  const [budgetCurrency, setBudgetCurrency] = useState(() => {
    return tripData?.budgetCurrency || converterFromCurrency || 'MYR';
  });

  const [duration, setDuration] = useState(() => {
    return tripData?.duration !== undefined ? tripData.duration : 1;
  });

  const [tripName, setTripName] = useState(() => {
    return tripData?.tripName || '';
  });
  
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const numericBudget = parseFloat(String(budget).replace(/,/g, '')) || 0;

  const rateToSelectedBudget = rates && rates[budgetCurrency] ? rates[budgetCurrency] : 1;
  const rateToDestination = rates && rates[destination.currency] ? rates[destination.currency] : null;
  const crossRate = rateToDestination && rateToSelectedBudget ? (rateToDestination / rateToSelectedBudget) : null;
  
  const budgetInDest = crossRate ? numericBudget * crossRate : null;
  const baseRate = crossRate ? crossRate.toFixed(2) : '—';

  const handleDurationChange = (delta) => {
    setDuration((prev) => {
      const currentVal = parseInt(String(prev), 10) || 1;
      return Math.max(1, Math.min(90, currentVal + delta));
    });
  };

  const handleNext = () => {
    onNext({
      ...tripData, 
      destination,
      budget: numericBudget,
      budgetCurrency,
      duration: parseInt(String(duration), 10) || 1, 
      /* 🛠️ FIXED: Sets a default dynamic name if input is left blank */
      tripName: tripName.trim() || `${destination.name} Escape`, 
      budgetInDest,
    });
  };

  return (
    <div className="budget-setup">
      {/* Header Row */}
      <div className="budget-setup__header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            color: 'inherit'
          }}
          aria-label="Go back"
        >
          <IconArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-h1" style={{ margin: 0 }}>Trip Budget</h1>
          <p className="text-small" style={{ margin: 0 }}>Set up your trip details</p>
        </div>
      </div>

      {/* Field 1: Destination country */}
      <div className="budget-field">
        <p className="budget-field__label">Destination country</p>
        <div
          className="budget-field__row budget-field__row--clickable"
          onClick={() => setShowDestDropdown(!showDestDropdown)}
        >
          <div className="budget-field__row-left">
            <span className={`fi fi-${destination.code} budget-field__flag`}></span>
            <span className="budget-field__value">{destination.name}</span>
          </div>
          <IconChevronDown size={18} className="budget-field__chevron" />
        </div>
        {showDestDropdown && (
          <div className="budget-dropdown">
            {DESTINATIONS.map((d) => (
              <div
                key={d.currency}
                className={`budget-dropdown__item ${d.currency === destination.currency ? 'budget-dropdown__item--selected' : ''}`}
                onClick={() => { setDestination(d); setShowDestDropdown(false); }}
              >
                <span className={`fi fi-${d.code} budget-field__flag`}></span>
                <span>{d.name} ({d.currency})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field 2: Your budget */}
      <div className="budget-field">
        <p className="budget-field__label">Your budget</p>
        <div className="budget-field__row">
          <input
            className="budget-field__input"
            type="text"
            inputMode="decimal"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0"
          />
          <div className="budget-currency-pill" onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}>
            <span className="budget-currency-pill__code">{budgetCurrency}</span>
            <IconChevronDown size={13} />
          </div>
        </div>
        {showCurrencyDropdown && (
          <div className="budget-dropdown">
            {BUDGET_CURRENCIES.map((c) => (
              <div
                key={c}
                className={`budget-dropdown__item ${c === budgetCurrency ? 'budget-dropdown__item--selected' : ''}`}
                onClick={() => { setBudgetCurrency(c); setShowCurrencyDropdown(false); }}
              >
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field 3: Trip duration */}
      <div className="budget-field">
        <p className="budget-field__label">Trip duration</p>
        <div className="budget-field__row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              className="budget-field__input"
              type="text"
              inputMode="numeric"
              value={duration}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val === '') {
                  setDuration(''); 
                } else {
                  const num = parseInt(val, 10);
                  setDuration(Math.min(90, num)); 
                }
              }}
              onBlur={() => {
                if (!duration || parseInt(String(duration), 10) < 1) {
                  setDuration(1); 
                }
              }}
              style={{ width: '50px', textAlign: 'center', padding: '4px 0' }}
            />
            <span className="budget-field__value">days</span>
          </div>

          <div className="budget-stepper">
            <button
              className="budget-stepper__btn budget-stepper__btn--outline"
              onClick={() => handleDurationChange(-1)}
            >
              <IconMinus size={14} />
            </button>
            <button
              className="budget-stepper__btn budget-stepper__btn--filled"
              onClick={() => handleDurationChange(1)}
            >
              <IconPlus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Field 4: Trip name */}
      <div className="budget-field">
        <p className="budget-field__label">Trip name</p>
        <input
          className="budget-field__input budget-field__input--full"
          type="text"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          /* 🛠️ FIXED: Placeholder text is now dynamically built based on destination selection */
          placeholder={`e.g. ${destination.name} Escape`}
        />
      </div>

      {/* Preview card */}
      <div className="budget-preview">
        <p className="budget-preview__label">Budget in destination currency</p>
        <p className="budget-preview__amount">
          {destination.symbol} {budgetInDest ? budgetInDest.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}
        </p>
        <p className="budget-preview__rate">
          1 {budgetCurrency} = {baseRate} {destination.currency}
        </p>
      </div>

      <Button
        variant="primary"
        size="default"
        className="budget-setup__cta"
        onClick={handleNext}
        disabled={!numericBudget || !destination}
      >
        See daily breakdown →
      </Button>
    </div>
  );
}

export default BudgetSetup;