import React, { useState, useRef, useEffect } from 'react';
import { 
  IconBed, 
  IconToolsKitchen2, 
  IconTrain, 
  IconBookmark, 
  IconShare,
  IconArrowLeft,
  IconAlertTriangle,
  IconDownload,
  IconDeviceMobileShare
} from '@tabler/icons-react';
import html2canvas from 'html2canvas'; 
import { jsPDF } from 'jspdf';         
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

function CostEstimator({ tripData, onBack, savedTrips = [], onSaveTrip, onUnsaveTrip }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); 
  
  // 🛠️ FIX 1: Hold the compiled layout metrics globally in a single snapshot payload
  const [preparedSnapshot, setPreparedSnapshot] = useState(null); 
  
  const shareMenuRef = useRef(null);
  const estimatorRef = useRef(null); 

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

  const existingSavedTrip = savedTrips.find(t => 
    t.id === tripData?.id || 
    (t.destination?.name === destination.name && t.duration === duration && t.budget === homeBudget)
  );
  const isSaved = !!existingSavedTrip;

  const handleSaveToggle = () => {
    if (isSaved) {
      if (onUnsaveTrip) onUnsaveTrip(existingSavedTrip.id);
    } else {
      if (onSaveTrip) {
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🛠️ FIX 2: Generate base assets ahead of time to satisfy gesture token windows
  const handleToggleShareMenu = async () => {
    const willOpen = !showShareMenu;
    setShowShareMenu(willOpen);

    if (willOpen && !preparedSnapshot) {
      setIsGenerating(true);
      try {
        if (!estimatorRef.current) return;

        const canvas = await html2canvas(estimatorRef.current, {
          scale: 2, 
          useCORS: true,
          backgroundColor: '#F9F9F8',
          windowHeight: estimatorRef.current.scrollHeight,
          
          onclone: (clonedDoc) => {
            const clonedEstimator = clonedDoc.querySelector('.cost-estimator');
            if (clonedEstimator) {
              clonedEstimator.classList.add('rendering-pdf');
            }
          }
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Compile a clean binary blob signature out of the active canvas layer
        const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

        setPreparedSnapshot({
          canvas,
          imgData,
          imageBlob
        });
      } catch (err) {
        console.error('Error pre-rendering sharing workspace hooks:', err);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // 📱 🛠️ FIX 3: Natively pass an image file instead of a blocked PDF document stream
  const handleShareAsImage = async () => {
    setShowShareMenu(false);
    if (!preparedSnapshot) return;

    const fileName = `${destination.name}_Travel_Budget.png`;
    const file = new File([preparedSnapshot.imageBlob], fileName, { type: 'image/png' });

    // Validate if Android / iOS allows standard structural image parsing matrices
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${destination.name} Budget Breakdown`,
          text: `Check out my travel calculations report for ${destination.name}!`,
        });
        return; 
      } catch (err) {
        console.warn('Native social matrix share sheet dismissed:', err);
      }
    }

    // Direct platform fallback: open link canvas if everything else breaks
    const blobURL = URL.createObjectURL(preparedSnapshot.imageBlob);
    window.open(blobURL, '_blank');
  };

  // 📄 🛠️ FIX 4: Re-route formal PDF Generation down to a clean local file compiler
  const handleDownloadPDF = () => {
    setShowShareMenu(false);
    if (!preparedSnapshot) return;

    const { canvas, imgData } = preparedSnapshot;
    const fileName = `${destination.name}_Travel_Budget.pdf`;
    
    const imgWidth = 210; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);
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
    <div className="cost-estimator" ref={estimatorRef}>
      
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

      <div className="estimator-actions" ref={shareMenuRef}>
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
        
        <button 
          className="estimator-btn estimator-btn--filled"
          onClick={handleToggleShareMenu} 
          disabled={isGenerating}
        >
          <IconShare size={20} stroke={1.5} />
          {isGenerating ? 'Preparing Layout...' : 'Share'}
        </button>

        {showShareMenu && (
          <div className="share-dropdown">
            <button className="share-dropdown__item" onClick={handleShareAsImage} disabled={!preparedSnapshot}>
              <IconDeviceMobileShare size={18} stroke={1.5} />
              <span>Share Card via Apps...</span>
            </button>
            <button className="share-dropdown__item" onClick={handleDownloadPDF} disabled={!preparedSnapshot}>
              <IconDownload size={18} stroke={1.5} />
              <span>Download PDF File</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default CostEstimator;