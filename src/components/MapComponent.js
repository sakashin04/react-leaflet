'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents, ScaleControl } from 'react-leaflet';
import styles from './MapComponent.module.css';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';

function Crosshair() {
  // クロスヘアを中央に絶対配置
  return (
    <div className={styles.crosshair}>
      <span className={styles.crosshairV}></span>
      <span className={styles.crosshairH}></span>
    </div>
  );
}

// =========================
// 平面直角座標系のproj4定義
// =========================
const planeCoordDefs = {
  1: '+proj=tmerc +lat_0=33 +lon_0=129.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  2: '+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  3: '+proj=tmerc +lat_0=36 +lon_0=132.1666666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  4: '+proj=tmerc +lat_0=33 +lon_0=133.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  5: '+proj=tmerc +lat_0=36 +lon_0=134.3333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  6: '+proj=tmerc +lat_0=36 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  7: '+proj=tmerc +lat_0=36 +lon_0=137.1666666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  8: '+proj=tmerc +lat_0=36 +lon_0=138.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  9: '+proj=tmerc +lat_0=36 +lon_0=139.8333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  10: '+proj=tmerc +lat_0=40 +lon_0=140.8333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  11: '+proj=tmerc +lat_0=44 +lon_0=140.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  12: '+proj=tmerc +lat_0=44 +lon_0=142.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  13: '+proj=tmerc +lat_0=44 +lon_0=144.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  14: '+proj=tmerc +lat_0=26 +lon_0=142 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  15: '+proj=tmerc +lat_0=26 +lon_0=127.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  16: '+proj=tmerc +lat_0=26 +lon_0=124 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  17: '+proj=tmerc +lat_0=26 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  18: '+proj=tmerc +lat_0=20 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  19: '+proj=tmerc +lat_0=26 +lon_0=154 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
};

// =====================================================
// 市区町村ごとの平面直角座標系の系番号対応表（全定義）
// =====================================================
const municipalityToSystem = {
  '北海道': {
    '小樽市': 11,
    '函館市': 11,
    '釧路市': 13,
    '根室市': 13,
    '帯広市': 13,
    '網走市': 13,
    '北見市': 13,
    '伊達市': 11,
    '北斗市': 11,
    '松前町': 11,
    '福島町': 11,
    '知内町': 11,
    '木古内町': 11,
    '七飯町': 11,
    '鹿部町': 11,
    '森町': 11,
    '八雲町': 11,
    '長万部町': 11,
    '江差町': 11,
    '上ノ国町': 11,
    '厚沢部町': 11,
    '乙部町': 11,
    '奥尻町': 11,
    '今金町': 11,
    'せたな町': 11,
    '豊浦町': 11,
    '壮瞥町': 11,
    '洞爺湖町': 11,
    '島牧村': 11,
    '寿都町': 11,
    '黒松内町': 11,
    '蘭越町': 11,
    'ニセコ町': 11,
    '真狩村': 11,
    '留寿都村': 11,
    '喜茂別町': 11,
    '京極町': 11,
    '倶知安町': 11,
    '共和町': 11,
    '岩内町': 11,
    '古宇郡泊村': 11,
    '神恵内村': 11,
    '積丹町': 11,
    '古平町': 11,
    '仁木町': 11,
    '余市町': 11,
    '赤井川村': 11,
    '美幌町': 13,
    '津別町': 13,
    '斜里町': 13,
    '清里町': 13,
    '小清水町': 13,
    '訓子府町': 13,
    '置戸町': 13,
    '佐呂間町': 13,
    '大空町': 13,
    '音更町': 13,
    '士幌町': 13,
    '上士幌町': 13,
    '鹿追町': 13,
    '新得町': 13,
    '清水町': 13,
    '芽室町': 13,
    '中札内村': 13,
    '更別村': 13,
    '大樹町': 13,
    '広尾町': 13,
    '幕別町': 13,
    '池田町': 13,
    '豊頃町': 13,
    '本別町': 13,
    '足寄町': 13,
    '陸別町': 13,
    '浦幌町': 13,
    '釧路町': 13,
    '厚岸町': 13,
    '浜中町': 13,
    '標茶町': 13,
    '弟子屈町': 13,
    '鶴居村': 13,
    '白糠町': 13,
    '標津町': 13,
    '中標津町': 13,
    '別海町': 13,
    '蘂取村': 13,
    '沙那村': 13,
    '留別村': 13,
    '留夜別村': 13,
    '色丹村': 13,
    '国後郡泊村': 13,
    'その他': 12 // 北海道の他の地域
  },
  '青森県': 10,
  '岩手県': 10,
  '宮城県': 10,
  '秋田県': 10,
  '山形県': 10,
  '福島県': 9,
  '東京都': {
    '小笠原村': {
      '南鳥島': 19,
      '沖ノ鳥島': 18,
      'その他': 14 // その他の小笠原村
    },
    'その他': 9 // 東京都の他の地域
  },
  '神奈川県': 9,
  '埼玉県': 9,
  '千葉県': 9,
  '茨城県': 9,
  '栃木県': 9,
  '群馬県': 9,
  '山梨県': 8,
  '静岡県': 8,
  '新潟県': 8,
  '長野県': 8,
  '富山県': 7,
  '石川県': 7,        
  '愛知県': 7,
  '岐阜県': 7,
  '福井県': 6,
  '大阪府': 6,
  '京都府': 6,
  '奈良県': 6,
  '滋賀県': 6,
  '和歌山県': 6,
  '三重県': 6,
  '兵庫県': 5,
  '岡山県': 5,
  '鳥取県': 5,
  '島根県': 3,
  '広島県': 3,
  '山口県': 3,
  '徳島県': 4,
  '香川県': 4,
  '愛媛県': 4,
  '高知県': 4,
  '福岡県': 2,
  '佐賀県': 2,
  '長崎県': 1,
  '熊本県': 2,
  '大分県': 2,
  '宮崎県': 2,
  '鹿児島県': {
    '西之表市': 1,
    '中種子町': 1,
    '南種子町': 1,
    '屋久島町': 1,
    '三島村': 1,
    '十島村': 1,
    '龍郷町': 1,
    '大和村': 1,
    '奄美市': 1,
    '宇検村': 1,
    '瀬戸内町': 1,
    '喜界町': 1,
    '伊仙町': 1,
    '天城町': 1,
    '和泊町': 1,
    '知名町': 1,
    '与論町': 1,
    'その他': 2 // 鹿児島県の他の地域
  },
  '沖縄県': {
    '石垣市': 16,
    '宮古島市': 16,
    '多良間村': 16,
    '竹富町': 16,
    '与那国町': 16,
    '北大東村': 17,
    '南大東村': 17,
    'その他': 15 // 沖縄県の他の地域
  }
};

// =========================
// 系番号判定ロジック
// =========================
function getSystemNumber(prefecture, city, detail) {
  // 都道府県ごとの系番号判定
  const systemInfo = municipalityToSystem[prefecture];
  let systemNumber;
  if (typeof systemInfo === 'object') {
    if (prefecture === '東京都' && city === '小笠原村') {
      // 小笠原村の特殊判定
      if (detail.includes('南鳥島')) {
        systemNumber = systemInfo[city]['南鳥島'];
      } else if (detail.includes('沖ノ鳥島')) {
        systemNumber = systemInfo[city]['沖ノ鳥島'];
      } else {
        systemNumber = systemInfo[city]['その他'];
      }
    } else if (prefecture === '北海道' && city.includes('泊村')) {
      // 北海道の泊村の特殊判定
      if (city.includes('古宇郡')) {
        systemNumber = 11;
      } else if (city.includes('国後郡')) {
        systemNumber = 13;
      }
    } else {
      // その他の市区町村別定義
      systemNumber = systemInfo[city] || systemInfo['その他'] || null;
    }
  } else {
    // 都道府県一律定義
    systemNumber = systemInfo;
  }
  return systemNumber;
}

function CoordinatePanel({ center, zoom, municipalities, panelRef }) {
  const [info, setInfo] = useState({
    address: '-',
    system: '-',
    x: '-',
    y: '-',
    elevation: '-',
    hsrc: '-',
  });
  
  useEffect(() => {
    // デバウンス処理を追加して、APIリクエストを制限
    const timer = setTimeout(async () => {
      try {
        // 逆ジオコーダー
        const res = await fetch(`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=${center.lat}&lon=${center.lng}`);
        const data = await res.json();
        const muniCd = data.results?.muniCd;
        let normalizedMuniCd = muniCd?.length === 4 ? '0' + muniCd : muniCd;
        const city = municipalities[normalizedMuniCd] || '';
        const prefCode = normalizedMuniCd?.substring(0, 2);
        const prefName = getPrefName(prefCode);
        const detail = data.results?.lv01Nm || '';
        const address = prefName + city + detail;
        // 系番号判定
        const systemNumber = getSystemNumber(prefName, city, detail);
        let x = '-', y = '-', system = '-';
        if (systemNumber && planeCoordDefs[systemNumber]) {
          const def = planeCoordDefs[systemNumber];
          proj4.defs('CUSTOM', def);
          const [yVal, xVal] = proj4('WGS84', 'CUSTOM', [center.lng, center.lat]);
          x = xVal.toFixed(2);
          y = yVal.toFixed(2);
          system = `${systemNumber}系`;
        }
        // 標高API
        let elevation = '-', hsrc = '-';
        try {
          const elevRes = await fetch(`https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${center.lng}&lat=${center.lat}&outtype=JSON`);
          const elevData = await elevRes.json();
          elevation = elevData.elevation !== undefined ? elevData.elevation : '-';
          hsrc = elevData.hsrc !== undefined ? elevData.hsrc : '-';
        } catch (e) {
          console.log('Elevation API error:', e);
        }
        setInfo({ address, system, x, y, elevation, hsrc });
      } catch {
        setInfo({ address: '-', system: '-', x: '-', y: '-', elevation: '-', hsrc: '-' });
      }
    }, 500); // 500msのデバウンス

    return () => clearTimeout(timer);
  }, [center, municipalities]);
  return (
    <div className={styles.coordinatePanel} ref={panelRef}>
      <div>ZL: {zoom}</div>
      <div>緯度: {center.lat.toFixed(6)}</div>
      <div>経度: {center.lng.toFixed(6)}</div>
      <div>住所: {info.address}</div>
      <div>標高: {info.elevation} m {info.hsrc !== '-' && <span style={{fontSize:'0.9em',color:'#888'}}>（{info.hsrc}）</span>}</div>
      <div>平面直角座標系: {info.system}</div>
      <div>X: {info.x}</div>
      <div>Y: {info.y}</div>
    </div>
  );
}

function getPrefName(code) {
  const map = {
    '01': '北海道', '02': '青森県', '03': '岩手県', '04': '宮城県', '05': '秋田県', '06': '山形県', '07': '福島県',
    '08': '茨城県', '09': '栃木県', '10': '群馬県', '11': '埼玉県', '12': '千葉県', '13': '東京都', '14': '神奈川県',
    '15': '新潟県', '16': '富山県', '17': '石川県', '18': '福井県', '19': '山梨県', '20': '長野県', '21': '岐阜県',
    '22': '静岡県', '23': '愛知県', '24': '三重県', '25': '滋賀県', '26': '京都府', '27': '大阪府', '28': '兵庫県',
    '29': '奈良県', '30': '和歌山県', '31': '鳥取県', '32': '島根県', '33': '岡山県', '34': '広島県', '35': '山口県',
    '36': '徳島県', '37': '香川県', '38': '愛媛県', '39': '高知県', '40': '福岡県', '41': '佐賀県', '42': '長崎県',
    '43': '熊本県', '44': '大分県', '45': '宮崎県', '46': '鹿児島県', '47': '沖縄県',
  };
  return map[code] || '';
}

function MapEvents({ setCenter, setZoom }) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      setCenter(map.getCenter());
      setZoom(map.getZoom());
    },
    zoomend: (e) => {
      const map = e.target;
      setCenter(map.getCenter());
      setZoom(map.getZoom());
    },
  });
  return null;
}

export default function MapComponent({ onExpand, isExpanded = false }) {
  const [isMounted, setIsMounted] = useState(false);
  const [showShading, setShowShading] = useState(false);
  const [center, setCenter] = useState({ lat: 35.6895, lng: 139.6917 });
  const [zoom, setZoom] = useState(13);
  const [municipalities, setMunicipalities] = useState({});
  const panelRef = useRef(null);
  const [panelBottom, setPanelBottom] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    // DOMが完全に準備されてからマウント状態を設定
    const timer = setTimeout(() => {
      // DOM要素が存在するかチェック
      if (typeof window !== 'undefined' && document.body) {
        setIsMounted(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 標準地図タイルの親divにz-index:100
      document.querySelectorAll('.leaflet-layer img[src*="std"]').forEach(img => {
        if (img.parentElement) img.parentElement.style.zIndex = 100;
      });
      // 陰影起伏図タイルのimgにmix-blend-mode, z-index, pointer-eventsを強制適用
      document.querySelectorAll('.leaflet-layer img[src*="hillshademap"]').forEach(img => {
        img.style.mixBlendMode = 'multiply';
        img.style.pointerEvents = 'none';
        img.style.zIndex = 200;
        if (img.parentElement) img.parentElement.style.zIndex = 200;
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [showShading]);

  useEffect(() => {
    fetch('/municipalities.json').then(r => r.json()).then(setMunicipalities);
  }, []);

  useLayoutEffect(() => {
    function updatePanelBottom() {
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        setPanelBottom(rect.height + 20);
      }
    }
    updatePanelBottom();
    window.addEventListener('resize', updatePanelBottom);
    return () => window.removeEventListener('resize', updatePanelBottom);
  }, [center, zoom, municipalities]);

  if (!isMounted || typeof window === 'undefined') {
    return (
      <div className={styles.mapWrapper}>
        <div className={styles.loadingContainer}>
          <p>地図を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper} ref={mapRef}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        wheelPxPerZoomLevel={120}
        whenCreated={(mapInstance) => {
          // MapContainerが作成された時の処理
          console.log('Map instance created:', mapInstance);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
          url="https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png"
        />
        {showShading && (
          <TileLayer className={styles.shadingLayer} 
            url="https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png"
            // attribution="&copy; 国土地理院 陰影起伏図"
            
          />
        )}
        <MapEvents setCenter={setCenter} setZoom={setZoom} />
        <ScaleControl position="bottomleft" metric={true} imperial={false} />
        <Crosshair />
      </MapContainer>
      <CoordinatePanel center={center} zoom={zoom} municipalities={municipalities} panelRef={panelRef} />
      <button
        className={styles.shadingButton}
        onClick={() => setShowShading(s => !s)}
        aria-pressed={showShading}
        style={{
          position: 'absolute',
          right: window.innerWidth <= 768 ? 5 : 10,
          top: panelBottom,
          width: window.innerWidth <= 768 ? 'auto' : 200,
          minWidth: window.innerWidth <= 768 ? 150 : undefined,
          maxWidth: window.innerWidth <= 768 ? 'calc(100vw - 40px)' : undefined,
          zIndex: 1001,
          display: panelBottom === 0 ? 'none' : undefined
        }}
      >
        {showShading ? '陰影起伏図を非表示' : '陰影起伏図を合成'}
      </button>
    </div>
  );
} 