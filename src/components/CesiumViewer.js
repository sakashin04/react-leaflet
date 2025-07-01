'use client';

import { useEffect, useRef, useState } from 'react';

export default function CesiumViewer({ onLoad, onError }) {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const loadAndInitializeCesium = async () => {
      try {
        console.log('Starting Cesium initialization...');
        
        // Cesium スクリプトが既に読み込まれているかチェック
        if (!window.Cesium) {
          console.log('Loading Cesium scripts...');
          
          // CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Widgets/widgets.css';
          document.head.appendChild(link);
          console.log('Cesium CSS loaded');

          // JS
          const script = document.createElement('script');
          script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Cesium.js';
          
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Cesium script loading timeout (30s)'));
            }, 30000);
            
            script.onload = () => {
              clearTimeout(timeout);
              console.log('Cesium script loaded successfully');
              // もう少し長く待つ
              setTimeout(resolve, 500);
            };
            script.onerror = (error) => {
              clearTimeout(timeout);
              console.error('Cesium script load error:', error);
              reject(new Error('Failed to load Cesium script'));
            };
            document.head.appendChild(script);
          });
        } else {
          console.log('Cesium already loaded');
        }

        if (!window.Cesium) {
          throw new Error('Cesium library not available after loading');
        }

        console.log('Cesium object available:', !!window.Cesium);
        console.log('Cesium version:', window.Cesium.VERSION);

        // Ion完全無効化
        if (window.Cesium.Ion) {
          window.Cesium.Ion.defaultAccessToken = undefined;
          window.Cesium.Ion.defaultServer = undefined;
        }

        // コンテナチェック
        if (!cesiumContainerRef.current) {
          throw new Error('Container not found');
        }

        console.log('Creating Cesium viewer...');
        console.log('Container element:', cesiumContainerRef.current);
        
        // 最小限のCesium Viewer作成
        const viewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
          animation: false,
          timeline: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          navigationHelpButton: false,
          baseLayerPicker: false,
          sceneModePicker: false,
          selectionIndicator: false,
          infoBox: false,
          vrButton: false,
          contextOptions: {
            webgl: {
              alpha: false,
              depth: true,
              stencil: false,
              antialias: true,
              premultipliedAlpha: true,
              preserveDrawingBuffer: false,
              failIfMajorPerformanceCaveat: false
            }
          },
          terrainProvider: new window.Cesium.EllipsoidTerrainProvider(),
          skyBox: false,
          skyAtmosphere: false
        });

        // Ion関連の機能を完全に無効化
        if (viewer.cesiumWidget && viewer.cesiumWidget.creditContainer) {
          const creditContainer = viewer.cesiumWidget.creditContainer;
          creditContainer.style.display = 'none';
        }

        // 既存のImageryLayerを削除してから新しいものを追加
        viewer.imageryLayers.removeAll();
        
        // シンプルなOpenStreetMapを確実に動作するベースマップとして使用
        try {
          const osmProvider = new window.Cesium.UrlTemplateImageryProvider({
            url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            credit: 'OpenStreetMap contributors',
            maximumLevel: 19
          });
          
          viewer.imageryLayers.addImageryProvider(osmProvider);
          console.log('OpenStreetMap base layer added');
        } catch (osmError) {
          console.error('Failed to add OSM layer:', osmError);
          // フォールバック: 単色背景
          const singleColorProvider = new window.Cesium.SingleTileImageryProvider({
            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==',
            rectangle: window.Cesium.Rectangle.MAX_VALUE
          });
          viewer.imageryLayers.addImageryProvider(singleColorProvider);
        }

        console.log('Cesium viewer created:', viewer);

        viewerRef.current = viewer;

        // タイル読み込み状況をログ出力
        viewer.scene.globe.tileLoadProgressEvent.addEventListener((queuedTileCount) => {
          if (queuedTileCount === 0) {
            console.log('All tiles loaded');
          } else {
            console.log(`Loading tiles: ${queuedTileCount} remaining`);
          }
        });

        // 日本にカメラを向ける
        viewer.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(140.08, 36.1, 1000000)
        });

        // 基本的な3Dオブジェクトを直接追加（Ion不要）
        addBasic3DObjects(viewer);
        
        // 東京エリアに移動
        viewer.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(139.7, 35.7, 50000),
          orientation: {
            heading: window.Cesium.Math.toRadians(0),
            pitch: window.Cesium.Math.toRadians(-45),
            roll: 0.0
          }
        });

        // 基本的な3Dオブジェクトを追加する関数
        function addBasic3DObjects(viewer) {
          // 東京タワーの位置に赤いボックス
          viewer.entities.add({
            name: '東京タワー',
            position: window.Cesium.Cartesian3.fromDegrees(139.7454, 35.6586, 200),
            box: {
              dimensions: new window.Cesium.Cartesian3(100.0, 100.0, 400.0),
              material: window.Cesium.Color.RED.withAlpha(0.8)
            }
          });

          // 東京スカイツリーの位置に青いシリンダー
          viewer.entities.add({
            name: '東京スカイツリー',
            position: window.Cesium.Cartesian3.fromDegrees(139.8107, 35.7101, 300),
            cylinder: {
              length: 600.0,
              topRadius: 50.0,
              bottomRadius: 50.0,
              material: window.Cesium.Color.BLUE.withAlpha(0.8)
            }
          });

          // 富士山の位置に大きなコーン
          viewer.entities.add({
            name: '富士山',
            position: window.Cesium.Cartesian3.fromDegrees(138.7274, 35.3606, 1900),
            cylinder: {
              length: 3800.0,
              topRadius: 10.0,
              bottomRadius: 2000.0,
              material: window.Cesium.Color.BROWN.withAlpha(0.7)
            }
          });

          // 新宿エリアの超高層ビル群
          const shinjukuBuildings = [
            { lon: 139.6917, lat: 35.6895, height: 243 }, // 都庁
            { lon: 139.6973, lat: 35.6898, height: 202 }, // パークハイアット
            { lon: 139.7006, lat: 35.6907, height: 234 }, // NTTドコモ
          ];
          
          shinjukuBuildings.forEach((building, index) => {
            viewer.entities.add({
              name: `新宿ビル${index + 1}`,
              position: window.Cesium.Cartesian3.fromDegrees(building.lon, building.lat, building.height / 2),
              box: {
                dimensions: new window.Cesium.Cartesian3(100.0, 100.0, building.height),
                material: window.Cesium.Color.SILVER.withAlpha(0.8)
              }
            });
          });

          // 渋谷エリア
          viewer.entities.add({
            name: '渋谷スクランブル交差点',
            position: window.Cesium.Cartesian3.fromDegrees(139.7016, 35.6580, 25),
            ellipse: {
              semiMajorAxis: 100.0,
              semiMinorAxis: 100.0,
              material: window.Cesium.Color.YELLOW.withAlpha(0.6),
              height: 50.0
            }
          });

          // お台場エリア
          viewer.entities.add({
            name: 'レインボーブリッジ',
            polyline: {
              positions: window.Cesium.Cartesian3.fromDegreesArrayHeights([
                139.7638, 35.6458, 50,
                139.7745, 35.6297, 50
              ]),
              width: 20,
              material: window.Cesium.Color.RAINBOW
            }
          });

          // 複数のランダムな建物を追加
          for (let i = 0; i < 30; i++) {
            const longitude = 139.7 + (Math.random() - 0.5) * 0.2;
            const latitude = 35.7 + (Math.random() - 0.5) * 0.2;
            const height = 30 + Math.random() * 150;
            
            viewer.entities.add({
              position: window.Cesium.Cartesian3.fromDegrees(longitude, latitude, height / 2),
              box: {
                dimensions: new window.Cesium.Cartesian3(
                  20 + Math.random() * 40,
                  20 + Math.random() * 40,
                  height
                ),
                material: window.Cesium.Color.fromRandom({ alpha: 0.7 })
              }
            });
          }
          
          console.log('3D objects added successfully');
        }

        console.log('Cesium viewer created successfully');
        
        // ビューアーの準備完了フラグを設定
        setViewerReady(true);
        
        onLoad?.(viewer);

      } catch (error) {
        console.error('Error loading Cesium:', error);
        onError?.(error);
      }
    };

    // 少し遅らせて実行
    const timer = setTimeout(loadAndInitializeCesium, 300);

    return () => {
      clearTimeout(timer);
      setViewerReady(false);
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
    };
  }, [mounted, onLoad, onError]);

  // ベースマップ変更用の関数をビューアーに追加
  const changeBaseMap = (baseMapType) => {
    if (!viewerRef.current || !viewerReady) {
      console.log('Viewer not ready for base map change');
      return;
    }
    
    const viewer = viewerRef.current;
    
    // 動作確認済みのタイルプロバイダー
    const imageryProviders = {
      'std': () => new window.Cesium.UrlTemplateImageryProvider({
        url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        credit: 'OpenStreetMap contributors',
        maximumLevel: 19
      }),
      'pale': () => new window.Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        credit: 'Esri',
        maximumLevel: 16
      }),
      'blank': () => new window.Cesium.SingleTileImageryProvider({
        url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==',
        rectangle: window.Cesium.Rectangle.MAX_VALUE,
        credit: '白地図'
      }),
      'ort': () => new window.Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        credit: 'Esri',
        maximumLevel: 19
      }),
      'relief': () => new window.Cesium.UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        credit: 'Esri',
        maximumLevel: 13
      })
    };

    try {
      console.log('Changing base map to:', baseMapType);
      
      // 既存のベースマップを削除
      viewer.imageryLayers.removeAll();
      
      // 新しいベースマップを追加
      const providerFunction = imageryProviders[baseMapType] || imageryProviders['std'];
      const newImageryProvider = providerFunction();
      viewer.imageryLayers.addImageryProvider(newImageryProvider);
      console.log('Base map changed successfully to:', baseMapType);
    } catch (error) {
      console.error('Error changing base map:', error);
    }
  };

  // ビューアーが準備できたらベースマップ変更関数を公開
  useEffect(() => {
    if (viewerReady && viewerRef.current) {
      viewerRef.current.changeBaseMap = changeBaseMap;
    }
  }, [viewerReady]);

  return (
    <div 
      ref={cesiumContainerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        background: '#000'
      }}
    />
  );
}