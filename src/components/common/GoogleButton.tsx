import React from 'react';
import styles from './GoogleButton.module.css';

interface GoogleButtonProps {
  onClick: () => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      className={styles.googleButton}
      onClick={onClick}
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className={styles.googleIcon}
      />
      Entrar com Google
    </button>
  );
}; 