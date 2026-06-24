import { IconArrowLeft } from '@tabler/icons-react';
import Button from '../../components/Button/Button';
import './DailyBreakdown.css';

function DailyBreakdown({ tripData, onBack, onNext }) {
  const {
    destination,
    budget,
    budgetCurrency,
    duration,
    tripName,
    budgetInDest,
  } = tripData;

  const dailyAllowance = budgetInDest ? Math.round(budgetInDest / duration) : 0;
  const dailyAllowanceBase = budget ? Math.round(budget / duration) : 0;

  // 🛠️ CORRECTED ALLOCATION LOGIC:
  // 1. Reserve the last day first (if trip is longer than 1 day)
  const lastDays = duration > 1 ? 1 : 0;
  
  // 2. Cap first days at 3, but ensure we don't eat into the reserved last day
  const firstDays = Math.min(3, duration - lastDays);
  
  // 3. Middle days are whatever is left over
  const middleDays = duration - firstDays - lastDays;

  const firstDayRate = Math.round(dailyAllowance * 1.15);
  const lastDayRate = Math.round(dailyAllowance * 0.73);
  const middleDayRate = middleDays > 0
    ? Math.round((budgetInDest - firstDayRate * firstDays - lastDayRate * lastDays) / middleDays)
    : 0;

  const symbol = destination?.symbol || '';
  const formatNum = (n) => Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Use tripName if provided, otherwise "Trip to [country name]"
  const pageTitle = tripName ? tripName : `Trip to ${destination?.name}`;

  return (
    <div className="daily-breakdown">

      {/* Header — back arrow + title on same row, consistent with CurrencySelector */}
      <div className="daily-breakdown__header">
        <button className="daily-breakdown__back" onClick={onBack}>
          <IconArrowLeft size={20} />
        </button>
        <div className="daily-breakdown__header-text">
          <h2 className="text-h1">{pageTitle}</h2>
          <p className="text-small">
            {duration} {duration === 1 ? 'day' : 'days'} · {budgetCurrency} {formatNum(budget)}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="daily-breakdown__stats">
        <div className="stat-card stat-card--dark">
          <p className="stat-card__label">Total budget</p>
          <p className="stat-card__amount">{symbol} {formatNum(budgetInDest)}</p>
          <p className="stat-card__sub">{budgetCurrency} {formatNum(budget)}</p>
        </div>
        <div className="stat-card stat-card--light">
          <p className="stat-card__label">Daily allowance</p>
          <p className="stat-card__amount stat-card__amount--dark">{symbol} {formatNum(dailyAllowance)}</p>
          <p className="stat-card__sub">{budgetCurrency} {dailyAllowanceBase} / day</p>
        </div>
      </div>

      {/* How this is calculated */}
      <p className="text-label-uppercase daily-breakdown__section-label">
        How this is calculated
      </p>
      <div className="daily-breakdown__formula-card">
        <p className="daily-breakdown__formula-text">
          Budget ÷ trip duration = daily allowance
        </p>
      </div>

      {/* Suggested allocation */}
      <p className="text-label-uppercase daily-breakdown__section-label">
        Suggested allocation
      </p>
      <div className="daily-breakdown__allocation-card">
        <div className="allocation-row">
          <p className="allocation-row__label">First {firstDays} {firstDays === 1 ? 'day' : 'days'}</p>
          <p className="allocation-row__value">{symbol} {formatNum(firstDayRate)}/day</p>
        </div>
        
        {middleDays > 0 && (
          <div className="allocation-row">
            <p className="allocation-row__label">Middle days</p>
            <p className="allocation-row__value">{symbol} {formatNum(middleDayRate)}/day</p>
          </div>
        )}
        
        {lastDays > 0 && (
          <div className="allocation-row allocation-row--last">
            <p className="allocation-row__label">Last day</p>
            <p className="allocation-row__value">{symbol} {formatNum(lastDayRate)}/day</p>
          </div>
        )}
      </div>

      <Button
        variant="primary"
        size="default"
        className="daily-breakdown__cta"
        onClick={onNext}
      >
        Estimate my costs →
      </Button>

    </div>
  );
}

export default DailyBreakdown;