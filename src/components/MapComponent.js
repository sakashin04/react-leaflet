'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import styles from './MapComponent.module.css';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ onExpand, isExpanded = false }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={styles.mapWrapper}>
        <div className={styles.loadingContainer}>
          <p>地図を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[35.6895, 139.6917]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        />
      </MapContainer>
      <button 
        className={`${styles.expandButton} ${isExpanded ? styles.minimizeButton : ''}`}
        onClick={onExpand}
        aria-label={isExpanded ? "地図を縮小表示" : "地図を拡大表示"}
      >
        <span className={`${styles.expandIcon} ${isExpanded ? styles.minimizeIcon : ''}`} />
      </button>
    </div>
  );
} 