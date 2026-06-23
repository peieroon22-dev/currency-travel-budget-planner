import { useState, useEffect } from 'react';
import { IconArrowLeft } from '@tabler/icons-react'; // For utility use if needed elsewhere
import CurrencyInputCard from '../../components/CurrencyInputCard/CurrencyInputCard';
import SwapButton from '../../components/SwapButton/SwapButton';
import Button from '../../components/Button/Button';
import './Converter.css';

const CURRENCY_TO_COUNTRY = {
  MYR: 'my', USD: 'us', JPY: 'jp', EUR: 'eu', GBP: 'gb', SGD: 'sg',
  AED: 'ae', AUD: 'au', BDT: 'bd', BHD: 'bh', BND: 'bn', CAD: 'ca',
  CHF: 'ch', CNY: 'cn', DKK: 'dk', EGP: 'eg', HKD: 'hk', IDR: 'id',
  INR: 'in', KRW: 'kr', KWD: 'kw', NOK: 'no', NZD: 'nz', PHP: 'ph',
  PKR: 'pk', QAR: 'qa', SAR: 'sa', SEK: 'se', THB: 'th', TRY: 'tr',
  TWD: 'tw', VND: 'vn', ZAR: 'za',
};

const COMPARISON_CURRENCIES = ['USD', 'EUR', 'GBP', 'SGD'];

function formatAmount(value) {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Updated just now';
  const minutes = Math.floor(seconds / 60);
  return `Updated ${minutes} min${minutes > 1 ? 's' : ''} ago`;
}

function Converter({ onOpenSelector, fromCurrency, toCurrency, onFromCurrencyChange, onToCurrencyChange, onRatesLoaded, onPlanTrip, amount, onAmountChange }) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [, forceTick] = useState(0);

  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;

  useEffect(() => {
    async function fetchRates() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
        );
        if (!res.ok) throw new Error('Failed to fetch rates');
        const data = await res.json();
        setRates(data.conversion_rates);
        onRatesLoaded && onRatesLoaded(data.conversion_rates);
        setFetchedAt(Date.now());
      } catch (err) {
        setError('Unable to fetch live rates. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, [fromCurrency, apiKey]);

  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const numericAmount = parseFloat(String(amount).replace(/,/g, '')) || 0;
  
  // Guard conversions safely: if toCurrency is empty, return null
  const convertedRaw = rates && toCurrency && rates[toCurrency] ? numericAmount * rates[toCurrency] : null;
  const convertedAmount = formatAmount(convertedRaw);

  const handleAmountChange = (value) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    onAmountChange(cleaned);
  };

  // Only allow currency swap if a destination selection exists
  const handleSwap = () => {
    if (!toCurrency) return; 
    onFromCurrencyChange(toCurrency);
    onToCurrencyChange(fromCurrency);
  };

  return (
    <div className="converter">
      <div className="converter__header">
        <h1 className="text-h1">Converter</h1>
        <span className="converter__badge">{loading ? '···' : '● Live'}</span>
      </div>

      <p className="converter__subtitle">
        {loading ? 'Loading rates...' : error ? 'Rate unavailable' : 'Live rates · Updated now'}
      </p>

      {error && <div className="converter__error-banner">{error}</div>}

      <CurrencyInputCard
        label="From"
        amount={formatAmount(numericAmount)}
        onAmountChange={handleAmountChange}
        countryCode={CURRENCY_TO_COUNTRY[fromCurrency]}
        currencyCode={fromCurrency}
        variant="light"
        onCurrencyClick={() => onOpenSelector('from')}
      />

      <SwapButton onClick={handleSwap} />

      <CurrencyInputCard
        label="To"
        amount={convertedAmount}
        countryCode={toCurrency ? CURRENCY_TO_COUNTRY[toCurrency] : ''}
        currencyCode={toCurrency || '—'}
        variant="dark"
        readOnly
        onCurrencyClick={() => onOpenSelector('to')}
      />

      {rates && toCurrency && rates[toCurrency] && (
        <div className="converter__rate-bar">
          1 {fromCurrency} = {rates[toCurrency].toFixed(2)} {toCurrency} · {formatTimeAgo(fetchedAt)}
        </div>
      )}

      <p className="text-label-uppercase converter__section-label">Also equal to</p>

      <div className="converter__comparison-grid">
        {COMPARISON_CURRENCIES.filter((c) => c !== fromCurrency && c !== toCurrency).map((currency) => (
          <div key={currency} className="converter__comparison-card">
            <span className={`fi fi-${CURRENCY_TO_COUNTRY[currency]} converter__comparison-flag`}></span>
            <div className="converter__comparison-info">
              <p className="converter__comparison-code">{currency}</p>
              <p className="converter__comparison-value">
                {rates && rates[currency] ? formatAmount(numericAmount * rates[currency]) : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="primary" 
        size="default" 
        className="converter__cta" 
        onClick={onPlanTrip}
        disabled={!toCurrency} // Disables navigation if destination currency is missing
      >
        Plan a trip with this budget →
      </Button>
    </div>
  );
}

export default Converter;