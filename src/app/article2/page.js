'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';
// import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ScaleControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import GlassPanel from '../../components/GlassPanel';

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

  // Map部分を動的import
  const DynamicMap = dynamic(() => import('./_MapSample'), { ssr: false });
  const DynamicGsimap = dynamic(() => import('./_GSIMap'), { ssr: false }); 
  return (
    <Layout>
      <div className={styles.articleLayout}>
        <main className={styles.articleMain}>
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <h1 className={styles.title}>ReactでLeafletを使ってみる</h1>
              <p className={styles.subtitle}>Reactアプリで地図表示を実装する方法</p>
              <div className={styles.meta}>
                <span>6月11日</span>
                <span className={styles.divider}></span>
                <span>編集中</span>
   
                <span className={styles.tag}>leaflet</span>
                <span className={styles.tag}>地図</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>Reactで地図を表示したい場合、react-leafletというreactでleafletを使えるライブラリを使うのが便利です。ここでは基本的な導入方法とサンプルコードを紹介します。</p>
              <h2 id="install">インストール</h2>
              <p>npmでreact-leafletとleafletをインストールします。</p>
              <CodeBlock>{`npm install react-leaflet leaflet`}</CodeBlock>
              <h2 id="usage">基本的な使い方</h2>
              <p>試しにOpenStreetMapを表示します。以下のようなコードを挿入すれば実現できます。</p>
                  <CodeBlock>{`import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

<MapContainer center={[35.681236, 139.767125]} zoom={13} style={{ height: '400px', width: '100%' }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="&copy; OpenStreetMap contributors"
  />
</MapContainer>`}</CodeBlock>
              <DynamicMap />
              <h2 id="custom">地理院タイル導入</h2>
              <p>ソースのところを地理院地図の標準タイルに変更するだけで、地理院地図を表示できます。なお、地理院地図の標準タイルは、<a href="https://maps.gsi.go.jp/development/sample.html" target="_blank" rel="noopener noreferrer">地理院タイルサイトを用いた構築サンプル集</a>にある通り出典の記載が必要です。</p>
              <GlassPanel>
                構築したサイトには、出典の記載をお願いします。<br />
                ソース例：<CodeBlock>{`<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>`}</CodeBlock> 
              </GlassPanel>
              <CodeBlock>{`import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

<MapContainer center={[35.681236, 139.767125]} zoom={13} style={{ height: '400px', width: '100%' }}>
  <TileLayer
    url="https://maps.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
    attribution="&copy; 地理院タイル"
  />
</MapContainer>`}</CodeBlock>
              <DynamicGsimap />
              <h2 id="reference">参考</h2>
              <p><a href="https://qiita.com/studio_haneya/items/fbb52fa03ab4f212ced0" target="_blank" rel="noopener noreferrer">React-leafletの使い方メモ</a></p>
              <p><a href="https://react-leaflet.js.org/" target="_blank" rel="noopener noreferrer">React-leaflet公式ドキュメント</a></p>
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