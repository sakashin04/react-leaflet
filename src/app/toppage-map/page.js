'use client';

import dynamic from "next/dynamic";
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import styles from './toppage-map.module.css';

// MapModalコンポーネントを動的にインポート
const MapModal = dynamic(
  () => import('../../components/MapModal'),
  { ssr: false }
);

// MapComponentを動的にインポート
const MapComponent = dynamic(
  () => import("../../components/MapComponent"),
  { 
    loading: () => (
      <div className={styles.mapLoading}>
        <p>地図を読み込み中...</p>
      </div>
    ),
    ssr: false
  }
);

// MapErrorBoundaryを動的にインポート
const MapErrorBoundary = dynamic(
  () => import("../../components/MapErrorBoundary"),
  { ssr: false }
);

export default function ToppageMap() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      const container = document.querySelectorAll('.leaflet-tile-pane img');
      container.forEach(img => {
        if (img.src.includes('/shade/')) {
          img.style.mixBlendMode = 'multiply';
        }
      });
    }, 300); // 300ms遅延
    return () => {
      clearTimeout(timer);
      const container = document.querySelectorAll('.leaflet-tile-pane img');
      container.forEach(img => {
        if (img.src.includes('/shade/')) {
          img.style.mixBlendMode = '';
        }
      });
    };
  }, [visible, map]);

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>React-Leaflet</h1>
          {/* <p className={styles.subtitle}>
            React Leafletを使用した基本的な地図表示
          </p> */}
        </header>

        <main className={styles.main}>
          <div className={styles.mapContainer}>
            <MapErrorBoundary>
              <MapComponent onExpand={() => setIsMapModalOpen(true)} />
            </MapErrorBoundary>
          </div>
        </main>
      </div>

      <MapModal 
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </Layout>
  );
}