import { useEffect } from 'react';

export default function Alert({ message, type = 'error', onClose }) {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose}>&times;</button>
      )}
    </div>
  );
}
