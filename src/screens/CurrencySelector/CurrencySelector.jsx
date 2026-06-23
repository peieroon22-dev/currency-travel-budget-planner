import { useState } from 'react';
import { IconArrowLeft, IconSearch, IconCheck } from '@tabler/icons-react';
import './CurrencySelector.css';

const POPULAR_CURRENCIES = [
  { code: 'MYR', name: 'Malaysian Ringgit', country: 'my' },
  { code: 'USD', name: 'US Dollar', country: 'us' },
  { code: 'JPY', name: 'Japanese Yen', country: 'jp' },
  { code: 'EUR', name: 'Euro', country: 'eu' },
  { code: 'GBP', name: 'British Pound', country: 'gb' },
];

const ALL_CURRENCIES = [
  { code: 'AED', name: 'UAE Dirham', country: 'ae' },
  { code: 'AUD', name: 'Australian Dollar', country: 'au' },
  { code: 'BDT', name: 'Bangladeshi Taka', country: 'bd' },
  { code: 'BHD', name: 'Bahraini Dinar', country: 'bh' },
  { code: 'BND', name: 'Brunei Dollar', country: 'bn' },
  { code: 'CAD', name: 'Canadian Dollar', country: 'ca' },
  { code: 'CHF', name: 'Swiss Franc', country: 'ch' },
  { code: 'CNY', name: 'Chinese Yuan', country: 'cn' },
  { code: 'DKK', name: 'Danish Krone', country: 'dk' },
  { code: 'EGP', name: 'Egyptian Pound', country: 'eg' },
  { code: 'EUR', name: 'Euro', country: 'eu' },
  { code: 'GBP', name: 'British Pound', country: 'gb' },
  { code: 'HKD', name: 'Hong Kong Dollar', country: 'hk' },
  { code: 'IDR', name: 'Indonesian Rupiah', country: 'id' },
  { code: 'INR', name: 'Indian Rupee', country: 'in' },
  { code: 'JPY', name: 'Japanese Yen', country: 'jp' },
  { code: 'KRW', name: 'South Korean Won', country: 'kr' },
  { code: 'KWD', name: 'Kuwaiti Dinar', country: 'kw' },
  { code: 'MYR', name: 'Malaysian Ringgit', country: 'my' },
  { code: 'NOK', name: 'Norwegian Krone', country: 'no' },
  { code: 'NZD', name: 'New Zealand Dollar', country: 'nz' },
  { code: 'PHP', name: 'Philippine Peso', country: 'ph' },
  { code: 'PKR', name: 'Pakistani Rupee', country: 'pk' },
  { code: 'QAR', name: 'Qatari Riyal', country: 'qa' },
  { code: 'SAR', name: 'Saudi Riyal', country: 'sa' },
  { code: 'SEK', name: 'Swedish Krona', country: 'se' },
  { code: 'SGD', name: 'Singapore Dollar', country: 'sg' },
  { code: 'THB', name: 'Thai Baht', country: 'th' },
  { code: 'TRY', name: 'Turkish Lira', country: 'tr' },
  { code: 'TWD', name: 'Taiwan Dollar', country: 'tw' },
  { code: 'USD', name: 'US Dollar', country: 'us' },
  { code: 'VND', name: 'Vietnamese Dong', country: 'vn' },
  { code: 'ZAR', name: 'South African Rand', country: 'za' },
];

function CurrencyRow({ currency, isSelected, onSelect }) {
  return (
    <div
      className={`currency-row ${isSelected ? 'currency-row--selected' : ''}`}
      onClick={() => onSelect(currency)}
    >
      <span className={`fi fi-${currency.country} currency-row__flag`}></span>
      <div className="currency-row__info">
        <p className="currency-row__code">{currency.code}</p>
        <p className="currency-row__name">{currency.name}</p>
      </div>
      {isSelected && (
        <IconCheck size={18} className="currency-row__check" />
      )}
    </div>
  );
}

function CurrencySelector({ selectedCode = 'MYR', onSelect, onBack }) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? ALL_CURRENCIES.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div className="currency-selector">
      {/* Header */}
      <div className="currency-selector__header">
        <button className="currency-selector__back" onClick={onBack}>
          <IconArrowLeft size={20} />
        </button>
        <h1 className="text-h1">Select Currency</h1>
      </div>

      {/* Search bar */}
      <div className="currency-selector__search">
        <IconSearch size={16} className="currency-selector__search-icon" />
        <input
          className="currency-selector__search-input"
          type="text"
          placeholder="Search currency or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results when searching */}
      {filtered && (
        <div className="currency-selector__list">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <CurrencyRow
                key={c.code}
                currency={c}
                isSelected={c.code === selectedCode}
                onSelect={onSelect}
              />
            ))
          ) : (
            <p className="currency-selector__empty">No currencies found</p>
          )}
        </div>
      )}

      {/* Default view — popular + all */}
      {!filtered && (
        <>
          <p className="text-label-uppercase currency-selector__section-label">Popular</p>
          <div className="currency-selector__list">
            {POPULAR_CURRENCIES.map((c) => (
              <CurrencyRow
                key={c.code}
                currency={c}
                isSelected={c.code === selectedCode}
                onSelect={onSelect}
              />
            ))}
          </div>

          <p className="text-label-uppercase currency-selector__section-label">All currencies (A–Z)</p>
          <div className="currency-selector__list">
            {ALL_CURRENCIES.map((c) => (
              <CurrencyRow
                key={c.code}
                currency={c}
                isSelected={c.code === selectedCode}
                onSelect={onSelect}
              />
            ))}
            {/* 🛠️ Removed the "+ 150 more currencies" container block from here */}
          </div>
        </>
      )}
    </div>
  );
}

export default CurrencySelector;