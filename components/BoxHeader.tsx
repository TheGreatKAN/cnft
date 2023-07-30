import React from 'react';
import styles from '../styles/BoxHeader.module.css';

interface HeaderProps {
  selectedSection: string;
  onSectionSelect: (section: string) => void;
}

const BoxHeader: React.FC<HeaderProps> = ({ selectedSection, onSectionSelect }) => {
  return (
    <div className={styles.header}>
    <div
    id={styles.stake}
      className={`${styles.section} ${selectedSection === 'Stake' ? styles.selected : ''}`}
      onClick={() => onSectionSelect('Stake')}
    >
      STAKE
    </div>
    <div
      className={`${styles.section} ${selectedSection === 'Collect' ? styles.selected : ''}`}
      onClick={() => onSectionSelect('Collect')}
    >
      COLLECT
    </div>
    <div
     id={styles.unStake}
      className={`${styles.section} ${selectedSection === 'UnStake' ? styles.selected : ''}`}
      onClick={() => onSectionSelect('UnStake')}
    >
      UNSTAKE
    </div>
  </div>
);
};

export default BoxHeader;
