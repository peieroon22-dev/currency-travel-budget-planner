import { useState } from 'react';
import { IconChevronDown, IconMinus, IconPlus } from '@tabler/icons-react';
import Button from '../../components/Button/Button';
import './BudgetSetup.css';

const DESTINATIONS = [
  { code: 'jp', name: 'Japan', currency: 'JPY', symbol: '¥' },
  { code: 'au', name: 'Australia', currency: 'AUD', symbol: 'A$' },
  { code: 'gb', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { code: 'us', name: 'United States', currency: 'USD', symbol: '$' },
  { code: 'fr', name: 'France', currency: 'EUR', symbol: '€' },
  { code: 'sg', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { code: 'kr', name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { code: 'th', name: 'Thailand', currency: 'THB', symbol: '฿' },
  { code: 'id', name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },
  { code: 'tr', name: 'Turkey', currency: 'TRY', symbol: '₺' },
];

const BUDGET_CURRENCIES = ['MYR', 'USD', 'EUR', 'GBP', 'SGD'];

function BudgetSetup({ onNext, converterAmount, converterFromCurrency, rates }) {
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [budget, setBudget] = useState(converterAmount || '5000');
  const [budgetCurrency, setBudgetCurrency] = useState(converterFromCurrency || 'MYR');
  const [duration, setDuration] = useState(1);
  const [tripName, setTripName] = useState('');
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const numericBudget = parseFloat(String(budget).replace(/,/g, '')) || 0;

  // Convert budget to destination currency using rates
  const destRate = rates && rates[destination.currency];
  const budgetInDest = destRate ? numericBudget * destRate : null;

  // Base rate for display (1 budgetCurrency = X destCurrency)
  const baseRate = rates && rates[destination.currency] ? rates[destination.currency].toFixed(2) : '—';

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
      {/* Header */}
      <div className="budget-setup__header">
        <h1 className="text-h1">Trip Budget</h1>
        <p className="text-small">Set up your trip details</p>
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
                key={d.code}
                className={`budget-dropdown__item ${d.code === destination.code ? 'budget-dropdown__item--selected' : ''}`}
                onClick={() => { setDestination(d); setShowDestDropdown(false); }}
              >
                <span className={`fi fi-${d.code} budget-field__flag`}></span>
                <span>{d.name}</span>
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
