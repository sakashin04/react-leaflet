'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';

export default function Article3() {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    setToc(headings.map(h => ({ id: h.id, text: h.textContent })));
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className={styles.articleLayout}>
        <main className={styles.articleMain}>
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <h1 className={styles.title}>画面中心の経緯度から平面直角座標系への変換</h1>
              <p className={styles.subtitle}>地図アプリでよく使う座標変換の基礎</p>
              <div className={styles.meta}>
                <span>6月5日</span>
                <span className={styles.divider}></span>
                <span>座標変換</span>
                <span className={styles.divider}></span>
                <span>leaflet</span>
                <span className={styles.tag}>座標</span>
                <span className={styles.tag}>地図</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>地図アプリでは、緯度経度から平面直角座標系（例：日本の第IX系など）への変換がよく必要になります。ここではその基本的な考え方とサンプルコードを紹介します。</p>
              <h2 id="about">平面直角座標系とは</h2>
              <p>日本の測量で使われる座標系で、地図上の位置をメートル単位で表現できます。</p>
              <h2 id="convert">変換の基本式</h2>
              <p>実際の変換には測地系ごとのパラメータが必要ですが、ライブラリを使うと簡単です。</p>
              <pre><code>{`import { xy } from 'some-japan-coords-lib';
const [x, y] = xy(lat, lng, 9); // 第IX系
`}</code></pre>
              <h2 id="usecase">活用例</h2>
              <p>地図の中心座標を取得し、平面直角座標に変換してAPIに送信するなど。</p>
            </div>
          </article>
        </main>
        <aside className={styles.tocSidebar}>
          <div className={styles.tocSidebarInner}>
            <h3 className={styles.tocTitle}>目次</h3>
            <ul className={styles.tocList}>
              {toc.map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)}>
                    {item.text}
                  </a>
                </li>
              ))}
              <li><a href="#top" onClick={scrollToTop}>▲ 一番上に戻る</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
} 