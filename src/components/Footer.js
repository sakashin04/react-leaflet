'use client';

import Link from 'next/link';
import styles from './Layout.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>連絡先</h3>
          <p>***-***-****</p>
        </div>
        {/* <div className={styles.footerLinks}>
          <div className={styles.footerColumn}>
            <h4>製品情報</h4>
            <Link href="/features">機能一覧</Link>
            <Link href="/pricing">料金プラン</Link>
            <Link href="/cases">導入事例</Link>
          </div>
          <div className={styles.footerColumn}>
            <h4>開発者向け</h4>
            <Link href="/docs">ドキュメント</Link>
            <Link href="/api">APIリファレンス</Link>
            <a href="https://github.com/example/react-leaflet" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <div className={styles.footerColumn}>
            <h4>サポート</h4>
            <Link href="/faq">よくある質問</Link>
            <Link href="/contact">お問い合わせ</Link>
            <Link href="/status">ステータス</Link>
          </div>
        </div> */}
      </div>
      <div className={styles.footerBottom}>
        {/* <p>&copy; 2025 NW係 All rights reserved.</p> */}
      </div>
    </footer>
  );
} 