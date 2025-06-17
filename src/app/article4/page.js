'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';
import GlassPanel from '../../components/GlassPanel';

export default function Article4() {
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
              <h1 className={styles.title}>
                地図右上パネルの紹介
              </h1>
              <p className={styles.subtitle}>
                地図アプリケーションの情報表示パネルの実装解説
              </p>
              <div className={styles.meta}>
                <span>2025-06-17</span>
                <span className={styles.divider}></span>
                <span>編集中</span>
                <span className={styles.divider}></span>
                <span>実装解説</span>
                <span className={styles.tag}>react</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>
                この記事では、地図アプリケーションの右上に表示される情報パネル（CoordinatePanel）の実装について詳しく解説します。
                このパネルは、ズームレベル、座標、住所、標高などの地理情報をリアルタイムで表示する重要なコンポーネントです。
              </p>
              
              <h2 id="zoom-level">ズームレベル（ZL）</h2>
              <p>
                地図の現在のズームレベルを表示します。ズームレベルは地図の詳細度を表し、数値が大きいほど詳細な表示になります。
              </p>
              
              <CodeBlock>{`// ズームレベルの表示
<div>ZL: {zoom}</div>`}</CodeBlock>

              <GlassPanel>
                <strong>ポイント：</strong>
                ズームレベルは地図コンポーネントから props として受け取り、リアルタイムで更新されます。
                一般的に1〜18の範囲で表示され、数値が大きいほど拡大表示になります。
              </GlassPanel>
              
              <h2 id="coordinates">緯度・経度座標</h2>
              <p>
                地図中心点の緯度・経度を小数点6桁まで表示します。これにより、約1メートル精度での位置情報を提供できます。
              </p>
              
              <CodeBlock>{`// 緯度・経度の表示（小数点6桁）
<div>緯度: {center.lat.toFixed(6)}</div>
<div>経度: {center.lng.toFixed(6)}</div>

// center は以下のような形式のオブジェクト
// center = { lat: 35.123456, lng: 139.123456 }`}</CodeBlock>
              
              <h2 id="address">住所情報</h2>
              <p>
                地理院の逆ジオコーダーAPIを使用して、現在の座標から住所を取得・表示します。
                APIの呼び出しとエラーハンドリングを含む実装例です。
              </p>
              
              <CodeBlock>{`// 逆ジオコーダーAPIの呼び出し
const fetchAddress = async (lat, lng) => {
  try {
    const url = \`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=\${lat}&lon=\${lng}\`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      const addressParts = [
        result.muniCd ? municipalityNames[result.muniCd] : '',
        result.lv01Nm || ''
      ].filter(part => part);
      
      return addressParts.join('');
    }
    return '-';
  } catch (error) {
    console.error('住所取得エラー:', error);
    return '-';
  }
};

// 表示部分
<div>住所: {info.address}</div>`}</CodeBlock>

              <GlassPanel>
                <strong>API仕様：</strong>
                地理院の逆ジオコーダーAPIは無料で利用でき、緯度経度から市区町村レベルの住所情報を取得できます。
                レスポンスには市区町村コード（muniCd）と町名（lv01Nm）が含まれます。
              </GlassPanel>
              
              <h2 id="elevation">標高</h2>
              <p>
                地理院の標高APIを使用して、指定座標の標高をメートル単位で取得・表示します。
                標高データのソース情報も併せて表示されます。
              </p>
              
              <CodeBlock>{`// 標高APIの呼び出し
const fetchElevation = async (lat, lng) => {
  try {
    const url = \`https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=\${lng}&lat=\${lat}&outtype=JSON\`;
    const response = await fetch(url);
    const data = await response.json();
    
    const elevation = data.elevation !== null ? 
      Math.round(data.elevation * 10) / 10 : '-';
    const hsrc = data.hsrc || '-';
    
    return { elevation, hsrc };
  } catch (error) {
    console.error('標高取得エラー:', error);
    return { elevation: '-', hsrc: '-' };
  }
};

// 表示部分
<div>
  標高: {info.elevation} m 
  {info.hsrc !== '-' && (
    <span style={{fontSize:'0.9em', color:'#888'}}>
      （{info.hsrc}）
    </span>
  )}
</div>`}</CodeBlock>
              
              <h2 id="coordinate-system">平面直角座標系</h2>
              <p>
                日本の測量で使われる平面直角座標系への変換機能です。proj4ライブラリを使用して、
                緯度経度から適切な系番号とX・Y座標を計算します。
              </p>
              
              <CodeBlock>{`import proj4 from 'proj4';

// 平面直角座標系の定義（1系〜19系）
const projections = {
  1: '+proj=tmerc +lat_0=33 +lon_0=129.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs',
  2: '+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs',
  // ... 他の系の定義
};

// 座標変換の実行
const convertToProjectedCoord = (lat, lng, municipalities) => {
  // 市区町村データから適切な系番号を決定
  const system = determineCoordinateSystem(lat, lng, municipalities);
  
  if (system && projections[system]) {
    const [x, y] = proj4(projections[system], [lng, lat]);
    return {
      system: \`第\${system}系\`,
      x: x.toFixed(2),
      y: y.toFixed(2)
    };
  }
  
  return { system: '-', x: '-', y: '-' };
};

// 表示部分
<div>平面直角座標系: {info.system}</div>
<div>X: {info.x}</div>
<div>Y: {info.y}</div>`}</CodeBlock>

              <GlassPanel>
                <strong>平面直角座標系とは：</strong>
                日本全国を19の区域に分けて、各区域で平面上の直交座標として位置を表現するシステムです。
                測量や地図作成で広く使用されており、メートル単位での正確な距離計算が可能です。
              </GlassPanel>
              
              <h2 id="panel-styling">パネルのスタイリング</h2>
              <p>
                情報パネルは、グラスモーフィズムデザインを採用し、地図上で視認性を保ちながら
                美しい外観を実現しています。
              </p>
              
              <CodeBlock>{`.coordinatePanel {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  min-width: 200px;
  max-width: 90vw;
  white-space: nowrap;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  z-index: 1001;
  color: var(--text-third);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`}</CodeBlock>
              
              <h2 id="complete-component">完全なコンポーネント実装</h2>
              <p>
                以下は、上記の機能をすべて統合したCoordinatePanelコンポーネントの完全な実装例です。
              </p>
              
              <CodeBlock>{`function CoordinatePanel({ center, zoom, municipalities, panelRef }) {
  const [info, setInfo] = useState({
    address: '-',
    system: '-',
    x: '-',
    y: '-',
    elevation: '-',
    hsrc: '-',
  });

  useEffect(() => {
    async function fetchInfo() {
      try {
        // 住所情報の取得
        const addressRes = await fetch(
          \`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=\${center.lat}&lon=\${center.lng}\`
        );
        const addressData = await addressRes.json();
        
        // 標高情報の取得
        const elevRes = await fetch(
          \`https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=\${center.lng}&lat=\${center.lat}&outtype=JSON\`
        );
        const elevData = await elevRes.json();
        
        // 座標変換の実行
        const projectedCoord = convertToProjectedCoord(center.lat, center.lng, municipalities);
        
        setInfo({
          address: processAddress(addressData),
          system: projectedCoord.system,
          x: projectedCoord.x,
          y: projectedCoord.y,
          elevation: elevData.elevation !== null ? 
            Math.round(elevData.elevation * 10) / 10 : '-',
          hsrc: elevData.hsrc || '-'
        });
      } catch (error) {
        console.error('情報取得エラー:', error);
        setInfo({
          address: '-', system: '-', x: '-', y: '-',
          elevation: '-', hsrc: '-'
        });
      }
    }
    
    fetchInfo();
  }, [center, municipalities]);

  return (
    <div className={styles.coordinatePanel} ref={panelRef}>
      <div>ZL: {zoom}</div>
      <div>緯度: {center.lat.toFixed(6)}</div>
      <div>経度: {center.lng.toFixed(6)}</div>
      <div>住所: {info.address}</div>
      <div>
        標高: {info.elevation} m 
        {info.hsrc !== '-' && (
          <span style={{fontSize:'0.9em',color:'#888'}}>
            （{info.hsrc}）
          </span>
        )}
      </div>
      <div>平面直角座標系: {info.system}</div>
      <div>X: {info.x}</div>
      <div>Y: {info.y}</div>
    </div>
  );
}`}</CodeBlock>
              
              <h2 id="reference">参考</h2>
              <p>
                このコンポーネントの実装で使用しているAPIやライブラリの詳細情報については、
                以下のリソースを参照してください。
              </p>
              <ul>
                <li><a href="https://maps.gsi.go.jp/development/api.html" target="_blank" rel="noopener noreferrer">地理院地図API仕様</a></li>
                <li><a href="https://proj4js.org/" target="_blank" rel="noopener noreferrer">Proj4js - 座標変換ライブラリ</a></li>
                <li><a href="https://www.gsi.go.jp/sokuchikijun/jpc.html" target="_blank" rel="noopener noreferrer">平面直角座標系について（国土地理院）</a></li>
              </ul>
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