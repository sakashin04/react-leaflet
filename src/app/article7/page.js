'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';
import GlassPanel from '../../components/GlassPanel';

export default function Article7() {
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
              <h1 className={styles.title}>国土地理院最適化ベクトルタイル実装ガイド</h1>
              <p className={styles.subtitle}>PMTiles形式による高速ベクトルタイル配信システムの構築</p>
              <div className={styles.meta}>
                <span>6月24日</span>
                <span className={styles.divider}></span>
                <span>地図技術</span>
                <span className={styles.divider}></span>
                <span>ベクトルタイル</span>
                <span className={styles.tag}>MapLibre</span>
                <span className={styles.tag}>PMTiles</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>
                この記事では、国土地理院が提供する最適化ベクトルタイル（optimal_bvmap）を活用した
                高速地図アプリケーションの構築方法について詳しく解説します。
                PMTiles形式とMapLibre GL JSを組み合わせた、次世代の地図表示技術を学びましょう。
              </p>
              
              <h2 id="overview">最適化ベクトルタイルの概要</h2>
              <p>
                国土地理院の最適化ベクトルタイルは、従来のラスタータイルに比べて大幅な性能向上を実現する
                革新的な地図配信システムです。PMTiles形式による効率的なデータ配信と、
                MapLibre GL JSによる高品質なレンダリングが特徴です。
              </p>
              
              <GlassPanel>
                <strong>主な特徴：</strong>
                <ul>
                  <li><strong>高速配信</strong>: PMTiles形式による効率的なタイル配信</li>
                  <li><strong>軽量化</strong>: ベクトルデータによるファイルサイズの削減</li>
                  <li><strong>高品質</strong>: 任意のズームレベルでの滑らかな表示</li>
                  <li><strong>カスタマイズ性</strong>: スタイルの自由な変更が可能</li>
                  <li><strong>国産データ</strong>: 国土地理院の正確な地理情報を使用</li>
                </ul>
              </GlassPanel>
              
              <h2 id="technical-foundation">技術的基盤</h2>
              <p>
                最適化ベクトルタイルシステムは、複数の先進技術を組み合わせて構築されています。
                各技術の役割と特徴を理解することが、効果的な実装への第一歩です。
              </p>
              
              <CodeBlock>{`// 技術スタック概要
const techStack = {
  // ベクトルタイル配信
  tileFormat: 'PMTiles',
  tileSource: 'https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/',
  
  // レンダリングエンジン
  renderer: 'MapLibre GL JS v2.4.0',
  
  // データソース
  dataSource: '数値地図（国土基本情報）-地図情報-',
  
  // 対応ズームレベル
  zoomLevels: {
    min: 4,
    max: 16
  },
  
  // スタイル設定
  styles: ['skeleton', 'colored', 'custom']
};`}</CodeBlock>
              
              <h2 id="pmtiles-integration">PMTilesの統合</h2>
              <p>
                PMTilesは、単一ファイルでベクトルタイルを効率的に配信する革新的な形式です。
                従来のXYZタイル配信と比較して、大幅な性能向上とサーバ負荷軽減を実現します。
              </p>
              
              <h3 id="performance-improvements">PMTilesによる大幅な性能向上</h3>
              <p>
                PMTiles形式の採用により、従来のタイル配信システムと比較して劇的な性能向上が実現されます。
                この革新的なアーキテクチャは、複数の技術的優位性を組み合わせることで、
                ユーザー体験を根本的に改善します。
              </p>
              
              <GlassPanel>
                <strong>性能向上の主要要因：</strong>
                <ul>
                  <li><strong>HTTP/2多重化</strong>: 単一接続での並列リクエスト処理により、レイテンシを最大70%削減</li>
                  <li><strong>スマートキャッシング</strong>: ブラウザとCDNレベルでの効率的なキャッシュにより、リピート訪問時の読み込み時間を90%短縮</li>
                  <li><strong>プリフェッチ機能</strong>: 予測アルゴリズムによる先読み読み込みで、ズーム・パン操作時の待機時間をほぼゼロに</li>
                  <li><strong>差分更新</strong>: 変更部分のみの更新により、データ転送量を60-80%削減</li>
                  <li><strong>適応的品質調整</strong>: ネットワーク速度とデバイス性能に応じた動的品質最適化</li>
                </ul>
              </GlassPanel>
              
              <h3 id="server-load-reduction">サーバ負荷軽減メカニズム</h3>
              <p>
                PMTiles形式の採用は、サーバインフラストラクチャにも大きな恩恵をもたらします。
                従来のタイル配信システムと比較して、サーバリソースの使用量を大幅に削減し、
                より効率的なスケーリングを可能にします。
              </p>
              
              <GlassPanel>
                <strong>サーバ負荷軽減の仕組み：</strong>
                <ul>
                  <li><strong>リクエスト数削減</strong>: 従来の数千リクエストを単一リクエストに集約、サーバ処理負荷を95%削減</li>
                  <li><strong>帯域幅最適化</strong>: gzip/brotli圧縮との相乗効果により、転送データ量を70-85%削減</li>
                  <li><strong>CDN効率化</strong>: 大きなファイル単位でのキャッシュにより、CDNヒット率を98%以上に向上</li>
                  <li><strong>オートスケーリング対応</strong>: 予測可能な負荷パターンにより、サーバの動的スケーリングを最適化</li>
                  <li><strong>エッジコンピューティング</strong>: エッジサーバでの効率的な配信により、オリジンサーバへの負荷を最小化</li>
                </ul>
              </GlassPanel>
              
              <CodeBlock>{`// PMTilesプロトコルの設定
import { Protocol } from 'pmtiles';

// PMTilesプロトコルの初期化
const initializePMTiles = () => {
  const protocol = new Protocol();
  maplibregl.addProtocol('pmtiles', protocol.tile);
};

// ベクトルタイルソースの設定
const vectorTileSource = {
  type: 'vector',
  minzoom: 4,
  maxzoom: 16,
  tiles: [
    'pmtiles://https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/optimal_bvmap-v1.pmtiles/{z}/{x}/{y}'
  ],
  attribution: '国土地理院最適化ベクトルタイル（試験公開）'
};

// MapLibre GL JSでの使用例
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'gsi-optimal': vectorTileSource
    },
    layers: [
      // レイヤー定義
    ]
  }
});`}</CodeBlock>
              
              <h2 id="layer-configuration">レイヤー構成とスタイリング</h2>
              <p>
                最適化ベクトルタイルには、日本の地理情報を網羅する豊富なレイヤーが含まれています。
                各レイヤーの特性を理解し、適切にスタイリングすることで、美しく実用的な地図を作成できます。
              </p>
              
              <CodeBlock>{`// 主要レイヤーの定義
const layerDefinitions = {
  // 水域（Water Areas）
  water: {
    id: 'water',
    type: 'fill',
    source: 'gsi-optimal',
    'source-layer': 'WA',
    paint: {
      'fill-color': '#e6f3ff',
      'fill-outline-color': '#1e90ff'
    }
  },
  
  // 海岸線（Coastline）
  coastline: {
    id: 'coastline',
    type: 'line',
    source: 'gsi-optimal',
    'source-layer': 'Cnst',
    paint: {
      'line-color': '#1e90ff',
      'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1, 14, 2]
    }
  },
  
  // 行政区域（Administrative Boundary）
  administrative: {
    id: 'administrative',
    type: 'line',
    source: 'gsi-optimal',
    'source-layer': 'AdmBdry',
    paint: {
      'line-color': '#ff6b6b',
      'line-width': 1,
      'line-dasharray': [2, 2]
    }
  },
  
  // 等高線（Contour）
  contour: {
    id: 'contour',
    type: 'line',
    source: 'gsi-optimal',
    'source-layer': 'Cntr',
    paint: {
      'line-color': '#8b4513',
      'line-width': ['case', ['==', ['get', 'type'], 2], 1, 0.5]
    }
  },
  
  // 道路（Roads）
  roads: {
    id: 'roads',
    type: 'line',
    source: 'gsi-optimal',
    'source-layer': 'Rd',
    paint: {
      'line-color': '#333333',
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 0.5,
        18, 4
      ]
    }
  },
  
  // 鉄道（Railway）
  railway: {
    id: 'railway',
    type: 'line',
    source: 'gsi-optimal',
    'source-layer': 'RailCL',
    paint: {
      'line-color': '#4a4a4a',
      'line-width': 1.5,
      'line-dasharray': [3, 3]
    }
  },
  
  // 建物（Buildings）
  buildings: {
    id: 'buildings',
    type: 'fill',
    source: 'gsi-optimal',
    'source-layer': 'BldA',
    minzoom: 14,
    paint: {
      'fill-color': '#f0f0f0',
      'fill-outline-color': '#cccccc'
    }
  },
  
  // 注記（Annotations）
  annotations: {
    id: 'place-labels',
    type: 'symbol',
    source: 'gsi-optimal',
    'source-layer': 'Anno',
    layout: {
      'text-field': ['get', 'knj'],
      'text-font': ['Noto Sans CJK JP Regular'],
      'text-size': [
        'interpolate',
        ['linear'],
        ['zoom'],
        8, 10,
        16, 14
      ],
      'text-anchor': 'center'
    },
    paint: {
      'text-color': '#333333',
      'text-halo-color': '#ffffff',
      'text-halo-width': 1
    }
  }
};`}</CodeBlock>
              
              <h2 id="dynamic-styling">動的スタイル変更</h2>
              <p>
                ベクトルタイルの大きな利点の一つは、リアルタイムでのスタイル変更が可能なことです。
                ユーザーの用途に応じて、地図の見た目を動的に調整する機能を実装しましょう。
              </p>
              
              <CodeBlock>{`// スタイルプリセットの定義
const stylePresets = {
  // スケルトンスタイル（線画）
  skeleton: {
    water: { 'fill-color': 'transparent', 'fill-outline-color': '#000000' },
    coastline: { 'line-color': '#000000', 'line-width': 1 },
    roads: { 'line-color': '#000000', 'line-width': 0.5 },
    buildings: { 'fill-color': 'transparent', 'fill-outline-color': '#000000' }
  },
  
  // カラースタイル（通常表示）
  colored: {
    water: { 'fill-color': '#e6f3ff', 'fill-outline-color': '#1e90ff' },
    coastline: { 'line-color': '#1e90ff', 'line-width': 1 },
    roads: { 'line-color': '#333333', 'line-width': 1 },
    buildings: { 'fill-color': '#f0f0f0', 'fill-outline-color': '#cccccc' }
  },
  
  // ダークスタイル（夜間モード）
  dark: {
    background: '#1a1a1a',
    water: { 'fill-color': '#2d4a6b', 'fill-outline-color': '#4a90e2' },
    coastline: { 'line-color': '#4a90e2', 'line-width': 1 },
    roads: { 'line-color': '#ffffff', 'line-width': 1 },
    buildings: { 'fill-color': '#333333', 'fill-outline-color': '#555555' }
  }
};

// スタイル変更機能の実装
const changeMapStyle = (map, styleName) => {
  const style = stylePresets[styleName];
  
  if (!style) {
    console.error('未定義のスタイル:', styleName);
    return;
  }
  
  // 背景色の変更
  if (style.background) {
    map.setPaintProperty('background', 'background-color', style.background);
  }
  
  // 各レイヤーのスタイル変更
  Object.entries(style).forEach(([layerId, paintProperties]) => {
    if (layerId === 'background') return;
    
    Object.entries(paintProperties).forEach(([property, value]) => {
      if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, property, value);
      }
    });
  });
};

// 使用例
document.getElementById('style-skeleton').addEventListener('click', () => {
  changeMapStyle(map, 'skeleton');
});

document.getElementById('style-colored').addEventListener('click', () => {
  changeMapStyle(map, 'colored');
});

document.getElementById('style-dark').addEventListener('click', () => {
  changeMapStyle(map, 'dark');
});`}</CodeBlock>
              
              <h2 id="performance-optimization">パフォーマンス最適化</h2>
              <p>
                最適化ベクトルタイルの性能を最大限に活用するためには、
                適切な設定とパフォーマンスチューニングが重要です。
                読み込み速度とレンダリング品質のバランスを取る方法を解説します。
              </p>
              
              <CodeBlock>{`// パフォーマンス最適化の設定
const optimizedMapConfig = {
  // 基本設定
  container: 'map',
  center: [139.767144, 35.680621],
  zoom: 15,
  minZoom: 4,
  maxZoom: 17.99,
  
  // パフォーマンス関連設定
  maxTileCacheSize: 1000,           // タイルキャッシュサイズ
  localIdeographFontFamily: 'sans-serif', // 日本語フォント最適化
  preserveDrawingBuffer: false,      // WebGLバッファ最適化
  antialias: true,                  // アンチエイリアス有効
  
  // 品質設定
  pixelRatio: Math.min(window.devicePixelRatio, 2), // 高DPI対応
  
  // レンダリング最適化
  renderWorldCopies: false,         // 世界地図の複製無効
  fadeDuration: 300,               // フェード時間短縮
  
  // ネットワーク最適化
  maxParallelImageRequests: 16,     // 並列リクエスト数
  
  style: {
    version: 8,
    glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
    sources: {
      'gsi-optimal': vectorTileSource
    },
    layers: optimizedLayers
  }
};

// レイヤーの動的制御
const adjustLayerVisibility = (map, zoom) => {
  // ズームレベルに応じてレイヤーの表示制御
  if (zoom < 10) {
    // 低ズーム時は主要レイヤーのみ表示
    map.setLayoutProperty('buildings', 'visibility', 'none');
    map.setLayoutProperty('place-labels', 'visibility', 'none');
  } else if (zoom < 14) {
    // 中ズーム時は建物以外を表示
    map.setLayoutProperty('buildings', 'visibility', 'none');
    map.setLayoutProperty('place-labels', 'visibility', 'visible');
  } else {
    // 高ズーム時は全レイヤーを表示
    map.setLayoutProperty('buildings', 'visibility', 'visible');
    map.setLayoutProperty('place-labels', 'visibility', 'visible');
  }
};

// ズーム変更時のイベントリスナー
map.on('zoom', () => {
  adjustLayerVisibility(map, map.getZoom());
});

// メモリ使用量監視
const monitorPerformance = (map) => {
  const stats = {
    loadedTiles: 0,
    loadedImages: 0,
    memoryUsage: 0
  };
  
  map.on('data', (e) => {
    if (e.dataType === 'tile') {
      stats.loadedTiles++;
    }
  });
  
  // パフォーマンス情報の定期出力
  setInterval(() => {
    console.log('Map Performance Stats:', stats);
  }, 10000);
};`}</CodeBlock>
              
              <h2 id="interaction-features">インタラクション機能</h2>
              <p>
                ベクトルタイルの利点を活かした、リッチなインタラクション機能を実装しましょう。
                クリックイベント、ポップアップ表示、フィーチャー情報の取得など、
                ユーザー体験を向上させる機能について解説します。
              </p>
              
              <CodeBlock>{`// フィーチャー情報の取得とポップアップ表示
const setupInteractions = (map) => {
  // クリックイベントの設定
  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point);
    
    if (features.length > 0) {
      const feature = features[0];
      const coordinates = e.lngLat;
      
      // フィーチャー情報の整理
      const featureInfo = extractFeatureInfo(feature);
      
      // ポップアップの表示
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(createPopupContent(featureInfo))
        .addTo(map);
    }
  });
  
  // ホバーエフェクトの設定
  map.on('mouseenter', 'buildings', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', 'buildings', () => {
    map.getCanvas().style.cursor = '';
  });
  
  // フィーチャーハイライト
  let hoveredFeatureId = null;
  
  map.on('mousemove', 'buildings', (e) => {
    if (e.features.length > 0) {
      if (hoveredFeatureId !== null) {
        map.setFeatureState(
          { source: 'gsi-optimal', sourceLayer: 'BldA', id: hoveredFeatureId },
          { hover: false }
        );
      }
      
      hoveredFeatureId = e.features[0].id;
      map.setFeatureState(
        { source: 'gsi-optimal', sourceLayer: 'BldA', id: hoveredFeatureId },
        { hover: true }
      );
    }
  });
};

// フィーチャー情報の抽出
const extractFeatureInfo = (feature) => {
  const { layer, properties, geometry } = feature;
  
  return {
    layerType: getLayerTypeName(layer.id),
    properties: formatProperties(properties),
    geometry: {
      type: geometry.type,
      coordinates: formatCoordinates(geometry.coordinates)
    }
  };
};

// レイヤータイプの日本語名取得
const getLayerTypeName = (layerId) => {
  const layerNames = {
    'water': '水域',
    'coastline': '海岸線',
    'administrative': '行政区域',
    'contour': '等高線',
    'roads': '道路',
    'railway': '鉄道',
    'buildings': '建物',
    'place-labels': '地名'
  };
  
  return layerNames[layerId] || layerId;
};

// ポップアップコンテンツの生成
const createPopupContent = (featureInfo) => {
  let html = \`<div class="popup-content">
    <h3>\${featureInfo.layerType}</h3>\`;
  
  if (featureInfo.properties) {
    html += '<div class="popup-properties">';
    Object.entries(featureInfo.properties).forEach(([key, value]) => {
      if (value) {
        html += \`<div><strong>\${key}:</strong> \${value}</div>\`;
      }
    });
    html += '</div>';
  }
  
  html += '</div>';
  return html;
};`}</CodeBlock>
              
              <h2 id="mobile-optimization">モバイル最適化</h2>
              <p>
                スマートフォンやタブレットでの快適な地図体験を提供するための
                モバイル最適化テクニックを紹介します。
                タッチ操作、レスポンシブデザイン、パフォーマンス調整など、
                モバイル環境特有の考慮事項について詳しく解説します。
              </p>
              
              <CodeBlock>{`// モバイル対応の設定
const setupMobileOptimizations = (map) => {
  // デバイス判定
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (isMobile) {
    // モバイル向け設定
    map.getCanvas().style.touchAction = 'pan-x pan-y';
    
    // ピンチズーム設定
    map.touchZoomRotate.disableRotation();
    map.scrollZoom.setWheelZoomRate(1/200);
    
    // モバイル向けパフォーマンス調整
    map.setRenderWorldCopies(false);
    map.setMaxPitch(0); // 3D回転無効
    
    // タッチイベントの最適化
    let touchStartTime = 0;
    
    map.on('touchstart', () => {
      touchStartTime = Date.now();
    });
    
    map.on('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;
      
      // 短いタップの場合のみクリックイベントを発火
      if (touchDuration < 200) {
        map.fire('click', e);
      }
    });
  }
  
  // レスポンシブコントロール配置
  const controls = {
    navigation: new maplibregl.NavigationControl({
      showCompass: !isMobile,
      showZoom: true,
      visualizePitch: false
    }),
    
    geolocate: new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    })
  };
  
  // コントロールの配置
  map.addControl(controls.navigation, 'top-right');
  
  if (isMobile) {
    map.addControl(controls.geolocate, 'top-left');
  }
};

// 画面サイズ変更対応
const handleResize = (map) => {
  const resizeObserver = new ResizeObserver(() => {
    map.resize();
  });
  
  resizeObserver.observe(map.getContainer());
};

// バッテリー最適化
const setupBatteryOptimization = (map) => {
  let isInBackground = false;
  
  // ページの可視性変更検知
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isInBackground = true;
      // バックグラウンド時はレンダリング頻度を下げる
      map.setMinZoom(map.getZoom() - 1);
    } else {
      isInBackground = false;
      map.setMinZoom(4);
    }
  });
  
  // バッテリー情報取得（対応ブラウザのみ）
  if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
      const adjustPerformanceForBattery = () => {
        if (battery.level < 0.2) {
          // バッテリー残量が少ない場合の省電力モード
          map.setLayoutProperty('buildings', 'visibility', 'none');
          map.setLayoutProperty('place-labels', 'visibility', 'none');
        }
      };
      
      battery.addEventListener('levelchange', adjustPerformanceForBattery);
      adjustPerformanceForBattery();
    });
  }
};`}</CodeBlock>
              
              <h2 id="deployment-considerations">デプロイメントと運用</h2>
              <p>
                最適化ベクトルタイルアプリケーションを本番環境にデプロイする際の
                重要な考慮事項について説明します。
                CDN設定、キャッシュ戦略、監視、セキュリティなど、
                安定した運用のためのベストプラクティスを紹介します。
              </p>
              
              <CodeBlock>{`// プロダクション環境設定
const productionConfig = {
  // CDN設定
  tileSource: {
    url: 'https://cdn.example.com/tiles/optimal_bvmap-v1.pmtiles',
    fallbackUrl: 'https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1/optimal_bvmap-v1.pmtiles'
  },
  
  // キャッシュ設定
  cache: {
    maxAge: 86400, // 24時間
    staleWhileRevalidate: true,
    compression: 'gzip'
  },
  
  // エラーハンドリング
  errorHandling: {
    retryAttempts: 3,
    retryDelay: 1000,
    fallbackToRaster: true
  },
  
  // 監視設定
  monitoring: {
    performanceTracking: true,
    errorReporting: true,
    usageAnalytics: true
  }
};

// エラーハンドリングの実装
const setupErrorHandling = (map) => {
  let retryCount = 0;
  const maxRetries = 3;
  
  map.on('error', (e) => {
    console.error('Map error:', e.error);
    
    if (retryCount < maxRetries) {
      retryCount++;
      setTimeout(() => {
        map.getSource('gsi-optimal').reload();
      }, 1000 * retryCount);
    } else {
      // フォールバック処理
      showErrorMessage('地図の読み込みに失敗しました。ページを再読み込みしてください。');
    }
  });
  
  map.on('sourcedata', (e) => {
    if (e.sourceId === 'gsi-optimal' && e.isSourceLoaded) {
      retryCount = 0; // 成功時はリトライカウントをリセット
    }
  });
};

// パフォーマンス監視
const setupPerformanceMonitoring = (map) => {
  const metrics = {
    loadTime: 0,
    tilesToLoad: 0,
    tilesLoaded: 0,
    errors: 0
  };
  
  const startTime = performance.now();
  
  map.on('load', () => {
    metrics.loadTime = performance.now() - startTime;
    sendMetrics(metrics);
  });
  
  map.on('data', (e) => {
    if (e.dataType === 'tile') {
      if (e.tile) {
        metrics.tilesLoaded++;
      }
    }
  });
  
  map.on('error', () => {
    metrics.errors++;
  });
  
  // 定期的なメトリクス送信
  setInterval(() => {
    sendMetrics(metrics);
  }, 60000); // 1分間隔
};

// メトリクス送信
const sendMetrics = (metrics) => {
  fetch('/api/metrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timestamp: Date.now(),
      ...metrics,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }).catch(console.error);
};

// セキュリティ設定
const setupSecurity = () => {
  // CSP設定の確認
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    console.warn('CSP設定が見つかりません。セキュリティリスクがあります。');
  }
  
  // HTTPS確認
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.warn('HTTPS接続を推奨します。');
  }
  
  // リファラー制御
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = 'strict-origin-when-cross-origin';
  document.head.appendChild(referrerMeta);
};`}</CodeBlock>
              
              <h2 id="best-practices">ベストプラクティスとトラブルシューティング</h2>
              <p>
                最適化ベクトルタイルを効果的に活用するためのベストプラクティスと、
                よくある問題の解決方法について解説します。
                開発から運用まで、実践的なノウハウを共有します。
              </p>
              
              <GlassPanel>
                <strong>開発時のベストプラクティス：</strong>
                <ul>
                  <li><strong>段階的ロード</strong>: 必要なレイヤーから順次読み込み、初期表示を高速化</li>
                  <li><strong>適応的品質</strong>: デバイス性能に応じてレンダリング品質を調整</li>
                  <li><strong>キャッシュ戦略</strong>: ブラウザキャッシュとCDNを効果的に活用</li>
                  <li><strong>フォールバック</strong>: ベクトルタイル読み込み失敗時のラスタータイル代替手段</li>
                  <li><strong>アクセシビリティ</strong>: スクリーンリーダー対応と色覚配慮</li>
                </ul>
              </GlassPanel>
              
              <CodeBlock>{`// よくある問題と解決方法

// 1. 日本語フォントの表示問題
const fixJapaneseFonts = (map) => {
  // フォント設定の確認と修正
  map.on('styleimagemissing', (e) => {
    // 不足しているフォントの代替設定
    console.warn('Missing font:', e.id);
  });
  
  // 日本語フォントスタックの設定
  const japaneseFontStack = [
    'Noto Sans CJK JP Regular',
    'Hiragino Kaku Gothic ProN',
    'Yu Gothic Medium',
    'Meiryo',
    'sans-serif'
  ];
  
  // レイヤーのフォント設定更新
  map.getStyle().layers.forEach(layer => {
    if (layer.type === 'symbol' && layer.layout && layer.layout['text-font']) {
      map.setLayoutProperty(layer.id, 'text-font', japaneseFontStack);
    }
  });
};

// 2. 大量データでのパフォーマンス問題
const optimizeForLargeDatasets = (map) => {
  // データ密度に応じた間引き処理
  const decimateFeatures = (zoom) => {
    const density = Math.pow(2, Math.max(0, 16 - zoom));
    
    map.setFilter('place-labels', [
      '==',
      ['%', ['get', 'id'], density],
      0
    ]);
  };
  
  map.on('zoom', () => {
    decimateFeatures(map.getZoom());
  });
};

// 3. メモリリーク対策
const preventMemoryLeaks = (map) => {
  // イベントリスナーの適切な削除
  const cleanup = () => {
    map.off('load');
    map.off('data');
    map.off('error');
    map.off('zoom');
    map.remove();
  };
  
  // ページ離脱時のクリーンアップ
  window.addEventListener('beforeunload', cleanup);
  
  // React/Vue等でのコンポーネント破棄時
  return cleanup;
};

// 4. ネットワーク問題対策
const handleNetworkIssues = (map) => {
  let isOnline = navigator.onLine;
  
  // オンライン状態の監視
  window.addEventListener('online', () => {
    isOnline = true;
    map.getSource('gsi-optimal').reload();
    showNotification('接続が復旧しました', 'success');
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    showNotification('オフラインモードです', 'warning');
  });
  
  // 低速接続時の品質調整
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    const adjustQualityForConnection = () => {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // 低品質モード
        map.setLayoutProperty('buildings', 'visibility', 'none');
        map.setLayoutProperty('place-labels', 'visibility', 'none');
      }
    };
    
    connection.addEventListener('change', adjustQualityForConnection);
    adjustQualityForConnection();
  }
};

// 5. デバッグ支援ツール
const setupDebugTools = (map) => {
  if (process.env.NODE_ENV === 'development') {
    // コンソールデバッグ機能
    window.mapDebug = {
      map,
      showTileBoundaries: () => {
        map.showTileBoundaries = true;
      },
      hideTileBoundaries: () => {
        map.showTileBoundaries = false;
      },
      getLoadedTiles: () => {
        return map.style.sourceCaches['gsi-optimal']._tiles;
      },
      getPerformanceStats: () => {
        return {
          zoom: map.getZoom(),
          center: map.getCenter(),
          loadedTiles: Object.keys(map.style.sourceCaches['gsi-optimal']._tiles).length
        };
      }
    };
    
    console.log('Map debug tools loaded. Use window.mapDebug');
  }
};`}</CodeBlock>
              
              <h2 id="future-developments">今後の発展と展望</h2>
              <p>
                最適化ベクトルタイル技術は急速に進歩しており、今後さらなる革新が期待されます。
                新しい標準規格、3D対応、AIを活用した最適化など、
                次世代の地図技術の動向について展望します。
              </p>
              
              <ul>
                <li><strong>3D地形表示</strong>: ベクトルタイルベースの3D地形レンダリング技術の発展</li>
                <li><strong>リアルタイム更新</strong>: WebSocketによるリアルタイム地図データ更新</li>
                <li><strong>AI最適化</strong>: 機械学習によるタイル配信とレンダリングの最適化</li>
                <li><strong>WebGPU対応</strong>: 次世代WebGPUによる高性能レンダリング</li>
                <li><strong>拡張現実統合</strong>: AR/VR環境での地図表示技術</li>
              </ul>
              
              <h2 id="conclusion">まとめ</h2>
              <p>
                国土地理院の最適化ベクトルタイルは、従来の地図表示技術を大きく上回る性能と柔軟性を提供します。
                PMTiles形式とMapLibre GL JSの組み合わせにより、高速で美しい地図アプリケーションの構築が可能になりました。
              </p>
              
              <p>
                この技術を効果的に活用するためには、適切な実装パターンの理解、パフォーマンス最適化、
                そして継続的な監視と改善が重要です。本記事で紹介した手法を参考に、
                ユーザーにとって価値ある地図体験を提供するアプリケーションを構築してください。
              </p>
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