'use client';

import styles from './MapCard.module.css';
import { useState, useRef, useEffect } from 'react';

export default function MapCard({ map, onOpen }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  const handleClick = () => {
    if (map.link) {
      window.location.href = map.link;
    }
  };

  return (
    <div 
      ref={cardRef}
      className={styles.mapCard} 
      onClick={handleClick}
      data-map-id={map.id}
    >
      <div className={styles.cardContent}>
        <div className={styles.imageContainer}>
          {!imageLoaded && <div className={styles.imagePlaceholder} />}
          <img
            src={map.thumbnail}
            alt={map.title}
            className={styles.cardImage}
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          <div className={styles.overlay}>
            <div className={styles.playButton}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 6v12l9-6z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardTitle}>{map.title}</h3>
          <p className={styles.cardDescription}>{map.description}</p>
        </div>
      </div>
    </div>
  );
}