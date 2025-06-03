'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Layout.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <Link href="/">
            <h1>react練習用ページ</h1>
          </Link>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <Link href="/" className={pathname === '/' ? styles.active : ''}>
              ホーム
            </Link>
            <Link href="/article" className={pathname === '/usage' ? styles.active : ''}>
              記事
            </Link>
            {/* <Link href="/news" className={pathname === '/news' ? styles.active : ''}>
              お知らせ
            </Link> */}
          </div>
          {/* <div className={styles.language}>
            <button className={styles.active}>JP</button>
            <button>EN</button>
          </div> */}
        </nav>
      </div>
    </header>
  );
} 