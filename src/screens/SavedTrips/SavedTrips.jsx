import React from 'react';
import { IconMapPin } from '@tabler/icons-react';
import './SavedTrips.css';

function SavedTrips({ savedTrips = [], onSelectTrip }) {
  return (
    <div className="saved-trips">
      
      {/* Screen Header Block */}
      <div className="saved-trips__header">
        <h1 className="saved-trips__title">Saved Trips</h1>
      </div>

      {/* Trips Content List Stack */}
      <div className="saved-trips__list">
        {savedTrips.length > 0 ? (
          savedTrips.map((trip) => {
            const formattedBudget = Number(trip.budget).toLocaleString();
            const formattedEst = Number(trip.totalEstimatedDest).toLocaleString();
            const formattedDiff = Number(trip.budgetDifference).toLocaleString();
            const destSymbol = trip.destination?.symbol || '¥';

            return (
              <div 
                key={trip.id} 
                className="trip-card"
                onClick={() => onSelectTrip && onSelectTrip(trip)}
                style={{ cursor: 'pointer' }}
              >
                <div className="trip-card__row">
                  <h3 className="trip-card__name">
                    {trip.tripName || `Trip to ${trip.destination?.name}`}
                  </h3>
                  <span className={`trip-card__badge ${trip.isOverBudget ? 'trip-card__badge--over' : 'trip-card__badge--under'}`}>
                    {trip.isOverBudget ? 'Over budget' : 'Under budget'}
                  </span>
                </div>

                <div className="trip-card__row trip-card__row--body">
                  <div className="trip-card__meta">
                    <p className="trip-card__text-muted">
                      {trip.duration} days · {trip.budgetCurrency} {formattedBudget}
                    </p>
                    <p className="trip-card__estimate">
                      Estimated: {destSymbol} {formattedEst}
                    </p>
                  </div>
                  
                  <div className="trip-card__financials">
                    {!trip.isOverBudget ? (
                      <p className="trip-card__diff trip-card__diff--spare">
                        Spare: {destSymbol} {formattedDiff}
                      </p>
                    ) : (
                      <p className="trip-card__diff trip-card__diff--over">
                        Over by: {destSymbol} {formattedDiff}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* 🛠️ FIXED: Empty State Box now ONLY renders when there are 0 items */
          <div className="saved-trips__empty-card">
            <div className="saved-trips__empty-icon-wrapper">
              <IconMapPin size={24} stroke={1.5} color="var(--color-ash, #666666)" />
            </div>
            <p className="saved-trips__empty-title">No saved trips yet</p>
            <p className="saved-trips__empty-subtitle">Plan a trip to save it here</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default SavedTrips;