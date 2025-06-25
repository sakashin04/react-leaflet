'use client';

import Image from "next/image";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

// MapModalコンポーネントを動的にインポート
const MapModal = dynamic(
  () => import('../components/MapModal'),
  { ssr: false }
);

// MapComponentを動的にインポート
const MapComponent = dynamic(
  () => import("../components/MapComponent"),
  { 
    loading: () => (
      <div className={styles.mapLoading}>
        <p>地図を読み込み中...</p>
      </div>
    ),
    ssr: false
  }
);

export default function Home() {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const articlesRef = useRef(null);

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

  // スクロール吸着ロジック
  useEffect(() => {
    let ticking = false;
    let isMapTouched = false; // 地図タッチ中フラグ
    // PC: wheel
    const handleWheel = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mapTop = mapRef.current?.getBoundingClientRect().top + window.scrollY;
        const articlesTop = articlesRef.current?.getBoundingClientRect().top + window.scrollY;
        const scrollY = window.scrollY;
        const direction = e.deltaY > 0 ? 'down' : 'up';
        // 下方向: 地図→記事一覧
        if (direction === 'down' && scrollY < articlesTop - 50 && scrollY < mapTop + 100) {
          window.scrollTo({ top: articlesTop - 20, behavior: 'smooth' });
        }
        // 上方向: 記事一覧→地図
        if (direction === 'up' && scrollY > mapTop + 50 && scrollY > articlesTop - 100) {
          window.scrollTo({ top: mapTop, behavior: 'smooth' });
        }
        ticking = false;
      });
    };
    // スマホ: touchend
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        // 地図内でのタッチかチェック
        const mapContainer = mapRef.current?.querySelector('.mapContainer, [class*="mapWrapper"]');
        if (mapContainer && mapContainer.contains(e.target)) {
          isMapTouched = true;
        } else {
          isMapTouched = false;
        }
      }
    };
    const handleTouchEnd = (e) => {
      // 地図内でのタッチの場合はスクロール吸着を無効
      if (isMapTouched) {
        isMapTouched = false;
        return;
      }
      const mapRect = mapRef.current?.getBoundingClientRect();
      const articlesRect = articlesRef.current?.getBoundingClientRect();
      if (!mapRect || !articlesRect) return;
      const vh = window.innerHeight;
      // 地図が画面の半分以上上に消えたら記事一覧に吸着
      if (mapRect.bottom < vh / 2) {
        window.scrollTo({ top: window.scrollY + articlesRect.top - 20, behavior: 'smooth' });
      }
      // 記事一覧が画面の半分以上下に消えたら地図に吸着
      else if (articlesRect.top > vh / 2) {
        window.scrollTo({ top: window.scrollY + mapRect.top, behavior: 'smooth' });
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Layout>
      <main className={styles.main}>
          <section className={styles.map} ref={mapRef}>
            <div className={styles.mapContainer}>
              <MapComponent onExpand={() => setIsMapModalOpen(true)} />
            </div>
          </section>

          <section className={styles.fixedArticles} ref={articlesRef}>
            <h2 id="fixed-articles">固定記事</h2>
            <div className={styles.fixedArticlesGrid}>
              <Link href="/article1" className={styles.fixedArticleCard}>
                <div className={styles.fixedArticleImage}>
                  <Image
                    src="/nextjs.png"
                    alt="reactをnextjsでデプロイする"
                    width={300}
                    height={200}
                  />
                </div>
                <p>reactをnextjsでデプロイする</p>
              </Link>
              <Link href="/article2" className={styles.fixedArticleCard}>
                <div className={styles.fixedArticleImage}>
                  <Image
                    src="/leaflet.png"
                    alt="reactでleafletを使ってみる"
                    width={300}
                    height={200}
                  />
                </div>
                <p>reactでleafletを使ってみる</p>
              </Link>
              <Link href="/article3" className={styles.fixedArticleCard}>
                <div className={styles.fixedArticleImage}>
                  <Image
                    src="/12-13.png"
                    alt="画面中心の経緯度から平面直角座標系への変換"
                    width={300}
                    height={200}
                  />
                </div>
                <p>画面中心の経緯度から平面直角座標系への変換をしてみる</p>
              </Link>
              <Link href="/article4" className={styles.fixedArticleCard}>
                <div className={styles.fixedArticleImage}>
                  <Image
                    src="/nextjs.png"
                    alt="部品紹介"
                    width={300}
                    height={200}
                  />
                </div>
                <p>Reactコンポーネントの基本的な部品について学ぼう</p>
              </Link>
            </div>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <Link href="/article" className={styles.moreLink}>
                記事一覧を見る →
              </Link>
            </div>
          </section>



          <div className={styles.contentGrid}>
            <section className={styles.newsSection}>
              <h2>新着・更新</h2>
              <div className={styles.newsList}>
                <Link href="/article8" className={styles.newsItem}>
                  <span className={styles.newsDate}>2025年6月25日</span>
                  <span className={styles.newsTag}>新記事</span>
                  <span className={styles.newsTitle}>Leaflet地図のパフォーマンス最適化について追加</span>
                </Link>
                <a href="#" className={styles.newsItem}>
                  <span className={styles.newsDate}>2025年6月3日</span>
                  <span className={styles.newsTag}>リリース</span>
                  <span className={styles.newsTitle}>バージョン0.0.1をリリースしました</span>
                </a>
                {/* <a href="#" className={styles.newsItem}>
                  <span className={styles.newsDate}>2024年6月2日</span>
                  <span className={styles.newsTag}>お知らせ</span>
                  <span className={styles.newsTitle}>ドキュメントを更新しました</span>
                </a>
                <a href="#" className={styles.newsItem}>
                  <span className={styles.newsDate}>2024年6月1日</span>
                  <span className={styles.newsTag}>メンテナンス</span>
                  <span className={styles.newsTitle}>定期メンテナンスのお知らせ</span>
                </a> */}
              </div>
              {/* <a href="#" className={styles.moreLink}>一覧を見る</a> */}
            </section>

            <section className={styles.serviceSection}>
              <h2>サービス（全て未着手）</h2>
              <div className={styles.serviceGrid}>
                <a href="#" className={styles.serviceCard}>
                  <h3>マップエディタ</h3>
                  <p>オンラインで地図をカスタマイズできるツールです。</p>
                </a>
                <a href="#" className={styles.serviceCard}>
                  <h3>データポータル</h3>
                  <p>地理データの検索・ダウンロードができます。</p>
                </a>
              </div>
            </section>
          </div>
        </main>
      </Layout>

      <MapModal 
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </div>
  );
}
