import { IconArrowsUpDown } from '@tabler/icons-react';
import './SwapButton.css';

/**
 * SwapButton component
 * The circular button between the "From" and "To" cards on the converter screen.
 * Swaps the base and target currencies when clicked.
 */
function SwapButton({ onClick }) {
  return (
    <button
      type="button"
      className="swap-button"
      onClick={onClick}
      aria-label="Swap currencies"
    >
      <IconArrowsUpDown size={16} className="swap-button__icon" />
    </button>
  );
}

export default SwapButton;
