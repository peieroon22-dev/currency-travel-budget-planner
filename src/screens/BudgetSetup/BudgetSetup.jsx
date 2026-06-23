import { useState } from 'react';
import { IconChevronDown, IconMinus, IconPlus, IconArrowLeft } from '@tabler/icons-react';
import Button from '../../components/Button/Button';
import './BudgetSetup.css';

// Updated to perfectly match the unified list structure from CurrencySelector
const DESTINATIONS = [
  { code: 'ae', name: 'UAE Dirham', currency: 'AED', symbol: 'د.إ' },
  { code: 'au', name: 'Australian Dollar', currency: 'AUD', symbol: 'A$' },
  { code: 'bd', name: 'Bangladeshi Taka', currency: 'BDT', symbol: '৳' },
  { code: 'bh', name: 'Bahraini Dinar', currency: 'BHD', symbol: '.د.ب' },
  { code: 'bn', name: 'Brunei Dollar', currency: 'BND', symbol: 'B$' },
  { code: 'ca', name: 'Canadian Dollar', currency: 'CAD', symbol: 'C$' },
  { code: 'ch', name: 'Swiss Franc', currency: 'CHF', symbol: 'CHF' },
  { code: 'cn', name: 'Chinese Yuan', currency: 'CNY', symbol: '¥' },
  { code: 'dk', name: 'Danish Krone', currency: 'DKK', symbol: 'kr' },
  { code: 'eg', name: 'Egyptian Pound', currency: 'EGP', symbol: 'E£' },
  { code: 'eu', name: 'Euro', currency: 'EUR', symbol: '€' },
  { code: 'gb', name: 'British Pound', currency: 'GBP', symbol: '£' },
  { code: 'hk', name: 'Hong Kong Dollar', currency: 'HKD', symbol: 'HK$' },
  { code: 'id', name: 'Indonesian Rupiah', currency: 'IDR', symbol: 'Rp' },
  { code: 'in', name: 'Indian Rupee', currency: 'INR', symbol: '₹' },
  { code: 'jp', name: 'Japanese Yen', currency: 'JPY', symbol: '¥' },
  { code: 'kr', name: 'South Korean Won', currency: 'KRW', symbol: '₩' },
  { code: 'kw', name: 'Kuwaiti Dinar', currency: 'KWD', symbol: 'د.ك' },
  { code: 'my', name: 'Malaysian Ringgit', currency: 'MYR', symbol: 'RM' },
  { code: 'no', name: 'Norwegian Krone', currency: 'NOK', symbol: 'kr' },
  { code: 'nz', name: 'New Zealand Dollar', currency: 'NZD', symbol: 'NZ$' },
  { code: 'ph', name: 'Philippine Peso', currency: 'PHP', symbol: '₱' },
  { code: 'pk', name: 'Pakistani Rupee', currency: 'PKR', symbol: '₨' },
  { code: 'qa', name: 'Qatari Riyal', currency: 'QAR', symbol: 'ر.ق' },
  { code: 'sa', name: 'Saudi Riyal', currency: 'SAR', symbol: 'ر.س' },
  { code: 'se', name: 'Swedish Krona', currency: 'SEK', symbol: 'kr' },
  { code: 'sg', name: 'Singapore Dollar', currency: 'SGD', symbol: 'S$' },
  { code: 'th', name: 'Thai Baht', currency: 'THB', symbol: '฿' },
  { code: 'tr', name: 'Turkish Lira', currency: 'TRY', symbol: '₺' },
  { code: 'tw', name: 'Taiwan Dollar', currency: 'TWD', symbol: 'NT$' },
  { code: 'us', name: 'US Dollar', currency: 'USD', symbol: '$' },
  { code: 'vn', name: 'Vietnamese Dong', currency: 'VND', symbol: '₫' },
  { code: 'za', name: 'South African Rand', currency: 'ZAR', symbol: 'R' },
];

const BUDGET_CURRENCIES = ['MYR', 'USD', 'EUR', 'GBP', 'SGD'];

function BudgetSetup({ onNext, onBack, converterAmount, converterFromCurrency, converterToCurrency, rates }) {
  // Automatically match the initial destination component state to the currency from the home screen
  const [destination, setDestination] = useState(() => {
    return DESTINATIONS.find((d) => d.currency === converterToCurrency) || DESTINATIONS[15]; // Defaults to JPY if missing
  });
  
  const [budget, setBudget] = useState(converterAmount || '1');
  const [budgetCurrency, setBudgetCurrency] = useState(converterFromCurrency || 'MYR');
  const [duration, setDuration] = useState(1);
  const [tripName, setTripName] = useState('');
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const numericBudget = parseFloat(String(budget).replace(/,/g, '')) || 0;

  // Cross-rate calculation handling relative adjustments
  const rateToSelectedBudget = rates && rates[budgetCurrency] ? rates[budgetCurrency] : 1;
  const rateToDestination = rates && rates[destination.currency] ? rates[destination.currency] : null;
  const crossRate = rateToDestination && rateToSelectedBudget ? (rateToDestination / rateToSelectedBudget) : null;
  
  const budgetInDest = crossRate ? numericBudget * crossRate : null;
  const baseRate = crossRate ? crossRate.toFixed(2) : '—';

  const handleDurationChange = (delta) => {
    setDuration((prev) => Math.max(1, Math.min(90, prev + delta)));
  };

  const handleNext = () => {
    onNext({
      destination,
      budget: numericBudget,
      budgetCurrency,
      duration,
      tripName,
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
        <div className="budget-field__row">
          <span className="budget-field__value">{duration} days</span>
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
          placeholder="e.g. Japan Summer 2026"
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