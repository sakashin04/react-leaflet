'use client';

import Layout from '../../components/Layout';
import MapCard from '../../components/MapCard';
import styles from './maps.module.css';

// 地図データの定義
const mapsData = [
  {
    id: 'toppage-map',
    title: 'トップページと同じ地図',
    description: 'React Leafletを使用したベーシックな地図表示。陰影起伏図とのブレンド表示に対応。',
    thumbnail: '/api/placeholder/400/300',
    link: '/toppage-map',
    tileFormat: 'ラスタータイル',
    zoomRange: '3-18',
    renderer: 'React Leaflet v4.2.1',
    dataSource: '国土地理院',
  },
  {
    id: 'optimal-vector',
    title: '国土地理院最適化ベクトルタイル',
    description: 'PMTiles形式による高速ベクトルタイル配信システム。MapLibre GL JSを使用。',
    thumbnail: '/api/placeholder/400/300',
    link: '/optimal-vector',
    tileFormat: 'PMTiles (ベクトルタイル)',
    zoomRange: '4-16',
    renderer: 'MapLibre GL JS v2.4.0',
    dataSource: '国土地理院',
  }
];

export default function MapsList() {

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>地図一覧</h1>
        </header>

        <main className={styles.main}>
          <div className={styles.grid}>
            {mapsData.map((map) => (
              <MapCard 
                key={map.id} 
                map={map} 
              />
            ))}
          </div>

          {/* <div className={styles.comingSoon}>
            <div className={styles.comingSoonCard}>
              <div className={styles.comingSoonIcon}>🚧</div>
              <h3>さらなる地図を準備中</h3>
              <p>
                より多くの地図技術とデモンストレーションを追加予定です。
                OpenStreetMap、衛星画像、3D地形など、様々な地図表示技術をお楽しみください。
              </p>
            </div>
          </div> */}
        </main>

      </div>
    </Layout>
  );
}