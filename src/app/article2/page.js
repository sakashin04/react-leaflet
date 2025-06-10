'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';

export default function Article2() {
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
              <h1 className={styles.title}>ReactでLeafletを使ってみる</h1>
              <p className={styles.subtitle}>Reactアプリで地図表示を実装する方法</p>
              <div className={styles.meta}>
                <span>6月4日</span>
                <span className={styles.divider}></span>
                <span>leaflet</span>
                <span className={styles.divider}></span>
                <span>react</span>
                <span className={styles.tag}>leaflet</span>
                <span className={styles.tag}>地図</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>Reactで地図を表示したい場合、Leafletとreact-leafletを使うのが便利です。ここでは基本的な導入方法とサンプルコードを紹介します。</p>
              <h2 id="install">インストール</h2>
              <p>npmでreact-leafletとleafletをインストールします。</p>
              <pre><code>npm install react-leaflet leaflet</code></pre>
              <h2 id="usage">基本的な使い方</h2>
              <p>MapContainerとTileLayerを使って地図を表示します。</p>
              <pre><code>{`import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

<MapContainer center={[35.681236, 139.767125]} zoom={13} style={{ height: '400px', width: '100%' }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap contributors"
  />
  <Marker position={[35.681236, 139.767125]}>
    <Popup>東京駅</Popup>
  </Marker>
</MapContainer>`}</code></pre>
              <h2 id="custom">カスタマイズ例</h2>
              <p>地理院地図や独自タイルも利用できます。ズームやマーカーも自由に追加可能です。</p>
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