'use client';

import { useEffect } from 'react';
import styles from './MapModal.module.css';
import MapComponent from './MapComponent';

export default function MapModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.mapWrapper}>
          <MapComponent isExpanded={true} onExpand={onClose} />
        </div>
      </div>
    </div>
  );
} 