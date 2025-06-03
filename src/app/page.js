'use client';

import Image from "next/image";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import { useState } from 'react';

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
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <h1>地理院地図</h1>
          </div>
          <nav className={styles.nav}>
            <div className={styles.navLinks}>
              <a href="#" className={styles.active}>ホーム</a>
              <a href="#">使い方</a>
              <a href="#">お知らせ</a>
            </div>
            <div className={styles.language}>
              <span className={styles.active}>JP</span>
              <span>EN</span>
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.important}>
          <h2>重要なお知らせ</h2>
          <ul>
            <li>React Leafletの最新バージョンがリリースされました</li>
            <li>セキュリティアップデートのお知らせ</li>
          </ul>
        </section>

        <section className={styles.map}>
          <div className={styles.mapContainer}>
            <MapComponent onExpand={() => setIsMapModalOpen(true)} />
          </div>
        </section>

        <section className={styles.topics}>
          <h2>トピックス</h2>
          <div className={styles.topicsGrid}>
            <div className={styles.topicCard}>
              <div className={styles.topicImage}>
                <Image
                  src="/map-placeholder.jpg"
                  alt="地図の例"
                  width={300}
                  height={200}
                  layout="responsive"
                />
              </div>
              <p>新機能：カスタムマーカー機能が追加されました</p>
            </div>
            <div className={styles.topicCard}>
              <div className={styles.topicImage}>
                <Image
                  src="/map-placeholder.jpg"
                  alt="地図の例"
                  width={300}
                  height={200}
                  layout="responsive"
                />
              </div>
              <p>地図データの更新：最新の地理情報に対応</p>
            </div>
            <div className={styles.topicCard}>
              <div className={styles.topicImage}>
                <Image
                  src="/map-placeholder.jpg"
                  alt="地図の例"
                  width={300}
                  height={200}
                  layout="responsive"
                />
              </div>
              <p>パフォーマンス改善：描画速度が50%向上</p>
            </div>
          </div>
        </section>

        <div className={styles.contentGrid}>
          <section className={styles.newsSection}>
            <h2>新着・更新</h2>
            <div className={styles.newsList}>
              <a href="#" className={styles.newsItem}>
                <span className={styles.newsDate}>2024年6月3日</span>
                <span className={styles.newsTag}>リリース</span>
                <span className={styles.newsTitle}>バージョン4.0.0をリリースしました</span>
              </a>
              <a href="#" className={styles.newsItem}>
                <span className={styles.newsDate}>2024年6月2日</span>
                <span className={styles.newsTag}>お知らせ</span>
                <span className={styles.newsTitle}>ドキュメントを更新しました</span>
              </a>
              <a href="#" className={styles.newsItem}>
                <span className={styles.newsDate}>2024年6月1日</span>
                <span className={styles.newsTag}>メンテナンス</span>
                <span className={styles.newsTitle}>定期メンテナンスのお知らせ</span>
              </a>
            </div>
            <a href="#" className={styles.moreLink}>一覧を見る</a>
          </section>

          <section className={styles.serviceSection}>
            <h2>サービス</h2>
            <div className={styles.serviceGrid}>
              <a href="#" className={styles.serviceCard}>
                <h3>マップエディタ</h3>
                <p>オンラインで地図をカスタマイズできるツールです。</p>
              </a>
              <a href="#" className={styles.serviceCard}>
                <h3>データポータル</h3>
                <p>地理データの検索・ダウンロードができます。</p>
              </a>
              <a href="#" className={styles.serviceCard}>
                <h3>API管理</h3>
                <p>APIキーの発行・管理ができます。</p>
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>React Leaflet</h3>
            <p>インタラクティブな地図機能を実装するためのReactライブラリ</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>製品情報</h4>
              <a href="#">機能一覧</a>
              <a href="#">料金プラン</a>
              <a href="#">導入事例</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>開発者向け</h4>
              <a href="#">ドキュメント</a>
              <a href="#">APIリファレンス</a>
              <a href="#">GitHub</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>サポート</h4>
              <a href="#">よくある質問</a>
              <a href="#">お問い合わせ</a>
              <a href="#">ステータス</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 React Leaflet. All rights reserved.</p>
        </div>
      </footer>

      <MapModal 
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </div>
  );
}
