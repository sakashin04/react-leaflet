'use client';

import Layout from '../../components/Layout';
import MapCard from '../../components/MapCard';
import styles from './maps.module.css';

// 地図データの定義
const mapsData = [
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
  },
  {
    id: '3d-pointcloud',
    title: '3Dポイントクラウド可視化',
    description: 'Cesium.jsを使用した3D地理空間データの可視化。インタラクティブな3D環境で地形を探索。',
    thumbnail: '/api/placeholder/400/300',
    link: '/3d-pointcloud',
    tileFormat: '3D Tiles',
    zoomRange: '全地球対応',
    renderer: 'Cesium.js v1.110',
    dataSource: '3D Tiles データセット',
  }
];

export default function MapsList() {

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>地図一覧</h1>
          <p className={styles.subtitle}>
            ウェブ地図テストページ一覧
          </p>
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