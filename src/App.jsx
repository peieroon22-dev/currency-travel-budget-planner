import { useState } from 'react';
import Converter from './screens/Converter/Converter';
import CurrencySelector from './screens/CurrencySelector/CurrencySelector';
import BudgetSetup from './screens/BudgetSetup/BudgetSetup';
import './App.css';

function App() {
  const [screen, setScreen] = useState('converter');
  const [fromCurrency, setFromCurrency] = useState('MYR');
  const [toCurrency, setToCurrency] = useState(null);
  const [selectingFor, setSelectingFor] = useState(null);
  const [rates, setRates] = useState(null);
  
  // Added the global amount state here (set to '1' by default)
  const [amount, setAmount] = useState('1'); 

  const handleOpenSelector = (which) => {
    setSelectingFor(which);
    setScreen('selector');
  };

  const handleCurrencySelect = (currency) => {
    if (selectingFor === 'from') setFromCurrency(currency.code);
    else setToCurrency(currency.code);
    setScreen('converter');
  };

  // SCREEN: Currency Selector
  if (screen === 'selector') {
    return (
      <div className="app">
        <CurrencySelector
          selectedCode={selectingFor === 'from' ? fromCurrency : toCurrency}
          onSelect={handleCurrencySelect}
          onBack={() => setScreen('converter')}
        />
      </div>
    );
  }

  // SCREEN: Budget Setup
  if (screen === 'budget') {
    return (
      <div className="app">
        <BudgetSetup
          rates={rates}
          converterAmount={amount} 
          converterFromCurrency={fromCurrency}
          converterToCurrency={toCurrency} // 👈 NEW: Passes 'JPY' (or whatever is selected) to the budget screen
          onNext={(data) => console.log('Budget data:', data)}
          onBack={() => setScreen('converter')}
        />
      </div>
    );
  }

  // SCREEN: Default Converter
  return (
    <div className="app">
      <Converter
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        onFromCurrencyChange={setFromCurrency}
        onToCurrencyChange={setToCurrency}
        onOpenSelector={handleOpenSelector}
        onRatesLoaded={setRates}
        onPlanTrip={() => setScreen('budget')}
        amount={amount}             
        onAmountChange={setAmount} 
      />
    </div>
  );
}

export default App;