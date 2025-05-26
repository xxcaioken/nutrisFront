import React from 'react';
import styles from './spreadsheet.module.css';

export const Spreadsheet = () => {
  // Substitua a URL abaixo pela URL pública da sua planilha do Google
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1s5pTl4JPzRw3Slia1Ic30crirI61LhPP_C45l0Fl61I/edit?pli=1&gid=545623867#gid=545623867';

  return (
    <div className={styles.container}>
      <div className={styles.frameWrapper}>
        <iframe
          src={sheetUrl.replace('/edit?usp=sharing', '/preview')}
          className={styles.iframe}
          title="Google Planilhas"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
}; 