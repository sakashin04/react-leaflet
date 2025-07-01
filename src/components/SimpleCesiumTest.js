'use client';

import { useEffect, useRef, useState } from 'react';

export default function SimpleCesiumTest() {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('初期化中...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const initCesium = async () => {
      try {
        setStatus('Cesiumスクリプトを読み込み中...');
        
        // Cesiumが既にロードされているかチェック
        if (!window.Cesium) {
          // CSS読み込み
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Widgets/widgets.css';
          document.head.appendChild(link);

          // JS読み込み
          const script = document.createElement('script');
          script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Cesium.js';
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          // 少し待つ
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!window.Cesium) {
          throw new Error('Cesium読み込み失敗');
        }

        setStatus('Cesiumビューアを作成中...');

        // Ion無効化
        window.Cesium.Ion.defaultAccessToken = undefined;

        // 最小構成でビューア作成（Ionなし）
        const viewer = new window.Cesium.Viewer(containerRef.current, {
          terrainProvider: new window.Cesium.EllipsoidTerrainProvider(),
          imageryProvider: new window.Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
          })
        });

        // 日本に移動
        viewer.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(139.7, 35.7, 10000000)
        });

        setStatus('読み込み完了！');
        
      } catch (err) {
        console.error('Cesium初期化エラー:', err);
        setError(err.message);
        setStatus('エラーが発生しました');
      }
    };

    if (containerRef.current) {
      initCesium();
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#ffe6e6', border: '1px solid #ff9999', borderRadius: '4px' }}>
        <h3>エラー</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>再読み込み</button>
      </div>
    );
  }

  return (
    <div style={{ height: '500px', position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '4px',
        zIndex: 1000
      }}>
        {status}
      </div>
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', background: '#000' }}
      />
    </div>
  );
}