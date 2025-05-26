import React, { useEffect, useState } from 'react';
import styles from './SpreadsheetModal.module.css';

interface SpreadsheetModalProps {
  spreadsheetUrl: string;
}

export const SpreadsheetModal: React.FC<SpreadsheetModalProps> = ({ spreadsheetUrl }) => {
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    // Força o iframe a recarregar quando o URL mudar
    setIframeKey(prev => prev + 1);
  }, [spreadsheetUrl]);

  return (
    <div className={styles.container}>
      <iframe
        key={iframeKey}
        src={spreadsheetUrl}
        className={styles.spreadsheet}
        title="Planilha"
        allowFullScreen
      />
    </div>
  );
}; 