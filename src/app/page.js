'use client';

import Image from "next/image";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useState } from 'react';
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

  return (
    <div className={styles.container}>
      <Layout>
        <main className={styles.main}>
          <section className={styles.map}>
            <div className={styles.mapContainer}>
              <MapComponent onExpand={() => setIsMapModalOpen(true)} />
            </div>
          </section>

          <section className={styles.fixedArticles}>
            <h2>固定記事</h2>
            <div className={styles.fixedArticlesGrid}>
              <div className={styles.fixedArticleCard}>
                <div className={styles.fixedArticleImage}>
                  <Link href="/article">
                    <Image
                      src="/nextjs.png"
                      alt="reactをnextjsでデプロイする"
                      width={300}
                      height={200}
                    />
                  </Link>
                </div>
                <p>reactをnextjsでデプロイする</p>
              </div>
              {/* <div className={styles.fixedArticleCard}>
                <div className={styles.fixedArticleImage}>
                  <Image
                    src="/map-placeholder.jpg"
                    alt="地図の例"
                    width={300}
                    height={200}
                  />
                </div>
                <p>地図データの更新：最新の地理情報に対応</p>
              </div>
              <div className={styles.fixedArticleCard}>
                <div className={styles.fixedArticleImage}>
                  <Image
                    src="/map-placeholder.jpg"
                    alt="地図の例"
                    width={300}
                    height={200}
                  />
                </div>
                <p>パフォーマンス改善：描画速度が50%向上</p>
              </div> */}
            </div>
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.newsSection}>
              <h2>新着・更新</h2>
              <div className={styles.newsList}>
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
              <h2>サービス<br />（全て作成予定で何も着手していません）</h2>
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
