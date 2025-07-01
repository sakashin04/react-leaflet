'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import styles from './pointcloud.module.css';

const CesiumViewer = dynamic(() => import('../../components/CesiumViewer'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>3D地図を読み込み中...</div>
});

export default function PointCloudPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [cesiumViewer, setCesiumViewer] = useState(null);
  const [settings, setSettings] = useState({
    baseMap: 'std',
    elevationEnabled: true,
    pointSize: 1.0,
    transparency: 1.0,
    colorMode: 'elevation'
  });

  const handleCesiumLoad = (viewer) => {
    console.log('Cesium loaded successfully');
    setCesiumViewer(viewer);
    setIsLoaded(true);
    setLoadError(null);
  };

  const handleCesiumError = (error) => {
    console.error('Cesium load error:', error);
    setLoadError(error.message);
    setIsLoaded(false);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // ベースマップ変更の処理
    if (key === 'baseMap' && cesiumViewer && cesiumViewer.changeBaseMap) {
      cesiumViewer.changeBaseMap(value);
    }
  };

  if (loadError) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <h2>読み込みエラー</h2>
            <p>{loadError}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isLoaded) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>3D地図を読み込み中...</p>
            <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
              初回読み込み時は時間がかかる場合があります
            </p>
            {/* デバッグ用の表示 */}
            <div style={{ marginTop: '20px', fontSize: '10px', opacity: 0.5 }}>
              <p>デバッグ情報: ブラウザの開発者ツールのコンソールで詳細をご確認ください</p>
            </div>
          </div>
          {/* 非表示でCesiumViewerを読み込む */}
          <div style={{ visibility: 'hidden', position: 'absolute', width: '100%', height: '100%' }}>
            <CesiumViewer 
              onLoad={handleCesiumLoad}
              onError={handleCesiumError}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>3Dポイントクラウド可視化</h1>
          <button 
            className={styles.toggleControls}
            onClick={() => setShowControls(!showControls)}
          >
            {showControls ? '設定を隠す' : '設定を表示'}
          </button>
        </div>

        <div className={styles.viewer}>
          <CesiumViewer 
            onLoad={handleCesiumLoad}
            onError={handleCesiumError}
          />

          {showControls && (
            <div className={styles.controlPanel}>
              <div className={styles.controlGroup}>
                <h3>ベースマップ</h3>
                <select 
                  value={settings.baseMap}
                  onChange={(e) => handleSettingChange('baseMap', e.target.value)}
                  className={styles.select}
                >
                  <option value="std">OpenStreetMap</option>
                  <option value="pale">淡色地図 (Esri)</option>
                  <option value="blank">白地図</option>
                  <option value="ort">衛星画像 (Bing)</option>
                  <option value="relief">地形図 (Esri)</option>
                </select>
              </div>

              <div className={styles.controlGroup}>
                <h3>透明度</h3>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={settings.transparency}
                  onChange={(e) => handleSettingChange('transparency', parseFloat(e.target.value))}
                  className={styles.slider}
                />
                <span>{Math.round(settings.transparency * 100)}%</span>
              </div>

              <div className={styles.controlGroup}>
                <h3>表示オプション</h3>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={settings.elevationEnabled}
                    onChange={(e) => handleSettingChange('elevationEnabled', e.target.checked)}
                  />
                  標高表示
                </label>
              </div>
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h2>3Dポイントクラウドについて</h2>
          <p>
            この3D可視化ツールは、地理空間データをインタラクティブな3D環境で表示します。
            マウスやタッチで視点を自由に変更でき、様々な角度から地形やデータを観察できます。
          </p>
          <ul>
            <li><strong>回転:</strong> 左クリック + ドラッグ</li>
            <li><strong>ズーム:</strong> マウスホイールまたは右クリック + ドラッグ</li>
            <li><strong>パン:</strong> 中クリック + ドラッグ</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}