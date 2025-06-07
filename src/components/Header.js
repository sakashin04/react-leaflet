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
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <h1>練習用ページ</h1>
          </Link>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/">
            地図
          </Link>
          <Link href="/#fixed-articles">
            記事
          </Link>
          {/* <Link href="/news" className={pathname === '/news' ? styles.active : ''}>
            お知らせ
          </Link> */}
        </nav>
        {/* <div className={styles.language}>
          <button className={styles.active}>JP</button>
          <button>EN</button>
        </div> */}
      </div>
    </header>
  );
} 