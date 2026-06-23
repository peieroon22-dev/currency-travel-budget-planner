import CurrencyPill from '../CurrencyPill/CurrencyPill';
import './CurrencyInputCard.css';

/**
 * CurrencyInputCard component
 * The "From" or "To" card on the converter screen — shows a label,
 * an amount (editable or read-only), and a currency pill.
 *
 * variant: 'light' (used for "From" — editable input)
 *        | 'dark'  (used for "To" — read-only result)
 */
function CurrencyInputCard({
  label,
  amount,
  onAmountChange,
  countryCode,
  currencyCode,
  variant = 'light',
  readOnly = false,
  onCurrencyClick,
}) {
  return (
    <div className={`currency-input-card currency-input-card--${variant}`}>
      <p className="currency-input-card__label">{label}</p>
      <div className="currency-input-card__row">
        {readOnly ? (
          <p className="currency-input-card__amount">{amount}</p>
        ) : (
          <input
            className="currency-input-card__amount currency-input-card__amount--input"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0"
          />
        )}
        <CurrencyPill
          countryCode={countryCode}
          code={currencyCode}
          variant={variant}
          onClick={onCurrencyClick}
        />
      </div>
    </div>
  );
}

export default CurrencyInputCard;
