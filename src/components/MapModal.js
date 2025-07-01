'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MapModal.module.css';

export default function MapModal({ map, isOpen, onClose }) {
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // モーダルが開いた時のView Transition名を設定
      if (modalRef.current && window.document.startViewTransition) {
        modalRef.current.style.viewTransitionName = `map-modal-${map?.id}`;
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, map?.id]);

  const handleClose = () => {
    if (window.document.startViewTransition) {
      const transition = document.startViewTransition(() => {
        onClose();
      });

      transition.finished.finally(() => {
        if (modalRef.current) {
          modalRef.current.style.viewTransitionName = '';
        }
      });
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleViewMap = () => {
    if (map?.link) {
      router.push(map.link);
    }
  };

  if (!isOpen || !map) return null;

  return (
    <div 
      className={styles.modalBackdrop} 
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={styles.modalContent}
        data-map-id={map.id}
      >
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="モーダルを閉じる"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.imageContainer}>
            <img
              src={map.thumbnail}
              alt={map.title}
              className={styles.modalImage}
            />
            <div className={styles.imageOverlay}>
              <button 
                className={styles.viewMapButton}
                onClick={handleViewMap}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                地図を表示
              </button>
            </div>
          </div>
        </div>

        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>{map.title}</h2>
          <p className={styles.modalDescription}>{map.description}</p>
          
          <div className={styles.detailSection}>
            <h3>技術仕様</h3>
            <ul className={styles.specList}>
              <li><strong>タイル形式:</strong> {map.tileFormat}</li>
              <li><strong>ズームレベル:</strong> {map.zoomRange}</li>
              <li><strong>レンダリング:</strong> {map.renderer}</li>
              <li><strong>データソース:</strong> {map.dataSource}</li>
            </ul>
          </div>

          <div className={styles.featureSection}>
            <h3>主な機能</h3>
            <div className={styles.featureGrid}>
              {map.features?.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <div className={styles.featureIcon}>✨</div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.primaryButton}
            onClick={handleViewMap}
          >
            地図を開く
          </button>
          <button 
            className={styles.secondaryButton}
            onClick={handleClose}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
} 