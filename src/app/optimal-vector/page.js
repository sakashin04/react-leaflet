'use client';

import { useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import styles from './optimal-vector.module.css';

export default function OptimalVectorPage() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTileBoundaries, setShowTileBoundaries] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('osm-only');

  useEffect(() => {
    // シンプルなライブラリ読み込みアプローチ
    const loadLibrariesAndInitMap = async () => {
      try {
        console.log('Initializing map...');

        // HTMLヘッドにライブラリを追加（存在チェック付き）
        if (!document.querySelector('link[href*="maplibre-gl"]')) {
          const maplibreCSS = document.createElement('link');
          maplibreCSS.rel = 'stylesheet';
          maplibreCSS.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
          document.head.appendChild(maplibreCSS);
        }

        if (!document.querySelector('script[src*="maplibre-gl"]')) {
          const maplibreScript = document.createElement('script');
          maplibreScript.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
          document.head.appendChild(maplibreScript);
        }

        // MapLibre GL JSが利用可能になるまで待機
        let attempts = 0;
        const maxAttempts = 50; // 5秒間の試行
        
        while (!window.maplibregl && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.maplibregl) {
          console.error('MapLibre GL JS could not be loaded');
          return;
        }

        console.log('MapLibre GL JS available');
        await initializeSimpleMap();

      } catch (error) {
        console.error('Library loading failed:', error);
      }
    };

    const initializeSimpleMap = async () => {
      try {
        // コンテナ要素の確認
        if (!mapContainer.current) {
          console.error('Map container not found');
          return;
        }

        console.log('Container dimensions:', {
          width: mapContainer.current.offsetWidth,
          height: mapContainer.current.offsetHeight
        });

        // シンプルなOpenStreetMapスタイル
        const mapStyle = {
          version: 8,
          name: 'Simple OSM Style',
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm'
            }
          ]
        };

        // 地図の初期化
        mapInstance.current = new window.maplibregl.Map({
          container: mapContainer.current,
          style: mapStyle,
          center: [139.767144, 35.680621], // 東京駅
          zoom: 12,
          minZoom: 1,
          maxZoom: 18
        });

        // ナビゲーションコントロールの追加
        mapInstance.current.addControl(new window.maplibregl.NavigationControl(), 'top-right');

        // イベントリスナーの設定
        mapInstance.current.on('load', () => {
          console.log('Map loaded successfully');
          setIsLoaded(true);
          
          // PMTilesライブラリを読み込んでセットアップ
          loadPMTilesAndSetup();
        });

        mapInstance.current.on('error', (e) => {
          console.error('Map error:', e);
        });

      } catch (error) {
        console.error('Map initialization failed:', error);
      }
    };

    // PMTilesライブラリの読み込みとセットアップ
    const loadPMTilesAndSetup = async () => {
      try {
        // PMTilesスクリプトが未読み込みの場合のみ追加
        if (!document.querySelector('script[src*="pmtiles"]')) {
          const pmtilesScript = document.createElement('script');
          pmtilesScript.src = 'https://unpkg.com/pmtiles@2.10.0/dist/index.js';
          document.head.appendChild(pmtilesScript);
        }

        // PMTilesが利用可能になるまで待機
        let attempts = 0;
        const maxAttempts = 30;
        
        while (!window.pmtiles && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (window.pmtiles && window.pmtiles.Protocol) {
          setupPMTiles();
        } else {
          console.log('PMTiles not available, using OSM only');
        }
      } catch (error) {
        console.warn('PMTiles loading failed:', error);
      }
    };

    // PMTilesセットアップ関数
    const setupPMTiles = () => {
      try {
        console.log('Setting up PMTiles...');
        const protocol = new window.pmtiles.Protocol();
        window.maplibregl.addProtocol('pmtiles', protocol.tile);

        // PMTilesソースを追加（より安全な形式）
        mapInstance.current.addSource('gsi-optimal', {
          type: 'vector',
          tiles: ['pmtiles://https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/optimal_bvmap-v1.pmtiles/{z}/{x}/{y}'],
          minzoom: 4,
          maxzoom: 16,
          attribution: '国土地理院最適化ベクトルタイル（試験公開）'
        });

        console.log('PMTiles source added');

        // ソースデータが読み込まれるのを待つ
        mapInstance.current.on('sourcedata', (e) => {
          if (e.sourceId === 'gsi-optimal' && e.isSourceLoaded) {
            console.log('GSI source loaded, adding layers...');
            addGSILayers();
          }
        });

      } catch (error) {
        console.warn('PMTiles setup failed:', error);
      }
    };

    // GSIレイヤーの追加
    const addGSILayers = () => {
      try {
        // ソースが存在するかチェック
        if (!mapInstance.current.getSource('gsi-optimal')) {
          console.warn('GSI source not available');
          return;
        }

        // 水域レイヤー
        if (!mapInstance.current.getLayer('gsi-water')) {
          mapInstance.current.addLayer({
            id: 'gsi-water',
            type: 'fill',
            source: 'gsi-optimal',
            'source-layer': 'WA',
            layout: { 'visibility': 'none' },
            paint: {
              'fill-color': '#a6cee3',
              'fill-opacity': 0.6
            }
          });
        }

        // 道路レイヤー
        if (!mapInstance.current.getLayer('gsi-roads')) {
          mapInstance.current.addLayer({
            id: 'gsi-roads',
            type: 'line',
            source: 'gsi-optimal',
            'source-layer': 'Rd',
            layout: { 'visibility': 'none' },
            paint: {
              'line-color': '#d62728',
              'line-width': 2
            }
          });
        }

        // 建物レイヤー
        if (!mapInstance.current.getLayer('gsi-buildings')) {
          mapInstance.current.addLayer({
            id: 'gsi-buildings',
            type: 'fill',
            source: 'gsi-optimal',
            'source-layer': 'BldA',
            minzoom: 14,
            layout: { 'visibility': 'none' },
            paint: {
              'fill-color': '#ff7f0e',
              'fill-opacity': 0.7,
              'fill-outline-color': '#d62728'
            }
          });
        }

        console.log('GSI layers added successfully');
      } catch (error) {
        console.warn('GSI layer addition failed:', error);
      }
    };

    loadLibrariesAndInitMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // タイル境界線の表示切り替え
  const toggleTileBoundaries = () => {
    if (!mapInstance.current || !isLoaded) return;

    if (showTileBoundaries) {
      mapInstance.current.showTileBoundaries = false;
    } else {
      mapInstance.current.showTileBoundaries = true;
    }
    setShowTileBoundaries(!showTileBoundaries);
  };

  // レイヤーの表示切り替え
  const toggleLayer = (layerId, visible) => {
    if (!mapInstance.current || !isLoaded) return;

    if (mapInstance.current.getLayer(layerId)) {
      mapInstance.current.setLayoutProperty(
        layerId,
        'visibility',
        visible ? 'visible' : 'none'
      );
    }
  };

  // スタイル切り替え
  const switchStyle = (styleName) => {
    if (!mapInstance.current || !isLoaded) return;
    setCurrentStyle(styleName);
    
    if (styleName === 'osm-only') {
      // OSMのみ表示
      toggleLayer('gsi-water', false);
      toggleLayer('gsi-roads', false);
      toggleLayer('gsi-buildings', false);
    } else if (styleName === 'gsi-overlay') {
      // GSIレイヤーをオーバーレイ
      toggleLayer('gsi-water', true);
      toggleLayer('gsi-roads', true);
      toggleLayer('gsi-buildings', true);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>国土地理院 最適化ベクトルタイル</h1>
          <p className={styles.subtitle}>
            PMTiles形式による高速ベクトルタイル配信デモ
          </p>
        </header>

        <div className={styles.mapWrapper}>
          {/* 地図表示エリア */}
          <div 
            ref={mapContainer} 
            className={styles.mapContainer}
            style={{ cursor: 'crosshair' }}
          />

          {/* コントロールパネル */}
          <div className={styles.controlPanel}>
            <div className={styles.controlGroup}>
              <h3>表示設定</h3>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={showTileBoundaries}
                  onChange={toggleTileBoundaries}
                  disabled={!isLoaded}
                />
                タイル境界線を表示
              </label>
            </div>

            <div className={styles.controlGroup}>
              <h3>表示モード</h3>
              <div className={styles.styleButtons}>
                <button
                  className={`${styles.styleButton} ${currentStyle === 'osm-only' ? styles.active : ''}`}
                  onClick={() => switchStyle('osm-only')}
                  disabled={!isLoaded}
                >
                  OSMのみ
                </button>
                <button
                  className={`${styles.styleButton} ${currentStyle === 'gsi-overlay' ? styles.active : ''}`}
                  onClick={() => switchStyle('gsi-overlay')}
                  disabled={!isLoaded}
                >
                  GSIオーバーレイ
                </button>
              </div>
            </div>

            <div className={styles.info}>
              <h3>技術情報</h3>
              <ul>
                <li>ベクトルタイル: PMTiles形式</li>
                <li>ズームレベル: 4-16</li>
                <li>レンダリング: MapLibre GL JS</li>
                <li>データソース: 国土地理院</li>
              </ul>
            </div>

            <div className={styles.attribution}>
              <p>
                <small>
                  この地図は国土地理院最適化ベクトルタイル（試験公開）を使用しています。<br/>
                  データは数値地図（国土基本情報）-地図情報-から取得されています。
                </small>
              </p>
            </div>
          </div>
        </div>

        {!isLoaded && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>地図を読み込んでいます...</p>
          </div>
        )}
      </div>
    </Layout>
  );
}