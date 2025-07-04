'use client';

import styles from './Layout.module.css';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
} 