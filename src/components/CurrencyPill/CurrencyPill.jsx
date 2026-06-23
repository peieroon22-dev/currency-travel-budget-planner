import { IconChevronDown } from '@tabler/icons-react';
import './CurrencyPill.css';

/**
 * CurrencyPill component
 * Displays a flag icon, currency code, and chevron — used to trigger currency selection.
 *
 * variant: 'light' (default, used for base/"From" currency)
 *        | 'dark'  (used for target/"To" currency, sits on dark cards)
 *
 * countryCode: two-letter ISO country code, lowercase (e.g. "my", "jp", "us")
 *              see https://flagicons.lipis.dev/ for the full list
 */
function CurrencyPill({ countryCode, code, variant = 'light', onClick }) {
  return (
    <button
      type="button"
      className={`currency-pill currency-pill--${variant}`}
      onClick={onClick}
    >
      <span className={`fi fi-${countryCode} currency-pill__flag`}></span>
      <span className="currency-pill__code">{code}</span>
      <IconChevronDown size={13} className="currency-pill__chevron" />
    </button>
  );
}

export default CurrencyPill;
