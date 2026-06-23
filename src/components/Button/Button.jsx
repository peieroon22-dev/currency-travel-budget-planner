import './Button.css';

/**
 * Reusable Button component
 *
 * variant: 'primary' | 'secondary' | 'ghost'
 * size: 'default' | 'small'
 */
function Button({ children, variant = 'primary', size = 'default', onClick, disabled = false, icon = null, type = 'button' }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;
