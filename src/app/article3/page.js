'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';
import GlassPanel from '../../components/GlassPanel';

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
              <p>
                この記事では、地図の中心座標（緯度・経度）から日本の平面直角座標系の系番号とその座標を自動的に導出するプロセスについて詳しく解説します。
                地図アプリケーションにおいて、測量や位置情報の正確な管理に必要な技術です。
              </p>
              
              <h2 id="overview">平面直角座標系変換の全体フロー</h2>
              <p>
                地図中心座標から平面直角座標系への変換は、以下の7つのステップで実現されます：
              </p>
              
              <GlassPanel>
                <strong>変換プロセス：</strong>
                <ol>
                  <li>地図の中心座標取得（緯度・経度）</li>
                  <li>逆ジオコーダーAPIで市区町村コード取得</li>
                  <li>市区町村辞書で地名変換</li>
                  <li>都道府県名の判定</li>
                  <li>地域に応じた系番号の決定</li>
                  <li>proj4ライブラリによる座標変換</li>
                  <li>平面直角座標（X・Y）の出力</li>
                </ol>
              </GlassPanel>
              
              <h2 id="coordinate-acquisition">Step 1: 地図中心座標の取得</h2>
              <p>
                まず、現在表示されている地図の中心座標を緯度・経度で取得します。
                React Leafletでは、地図の状態変化を監視してリアルタイムで座標を取得できます。
              </p>
              
              <CodeBlock>{`// 地図中心座標の取得例
const center = { lat: 35.681236, lng: 139.767125 }; // 東京駅付近

// React Leafletでの実装
function MapComponent() {
  const [center, setCenter] = useState({ lat: 35.681236, lng: 139.767125 });
  
  const handleMapMove = (e) => {
    const newCenter = e.target.getCenter();
    setCenter({ lat: newCenter.lat, lng: newCenter.lng });
  };
  
  return (
    <MapContainer center={center} onMoveEnd={handleMapMove}>
      {/* 地図コンポーネント */}
    </MapContainer>
  );
}`}</CodeBlock>
              
              <h2 id="reverse-geocoding">Step 2: 逆ジオコーダーAPIで市区町村情報取得</h2>
              <p>
                取得した座標から、国土地理院の逆ジオコーダーAPIを使用して市区町村コードを取得します。
                このAPIは緯度経度から行政区域情報を返してくれます。
              </p>
              
              <CodeBlock>{`// 逆ジオコーダーAPI呼び出し
const fetchMunicipalityCode = async (lat, lng) => {
  const apiUrl = \`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=\${lat}&lon=\${lng}\`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        muniCd: result.muniCd,     // 市区町村コード（例: "13101"）
        lv01Nm: result.lv01Nm     // 町名（例: "千代田区丸の内"）
      };
    }
  } catch (error) {
    console.error('逆ジオコーダーAPIエラー:', error);
  }
  
  return null;
};

// 使用例
const result = await fetchMunicipalityCode(35.681236, 139.767125);
// 結果: { muniCd: "13101", lv01Nm: "千代田区丸の内" }`}</CodeBlock>
              
              <h2 id="municipality-lookup">Step 3: 市区町村辞書での地名変換</h2>
              <p>
                取得した市区町村コードを、事前に用意された辞書ファイル（municipalities.json）で地名に変換します。
                このファイルには全国の市区町村コードと名称の対応関係が格納されています。
              </p>
              
              <CodeBlock>{`// municipalities.jsonの構造例
{
  "01100": "札幌市",
  "13101": "千代田区",
  "13102": "中央区",
  "27100": "大阪市",
  "47382": "与那国町"
}

// 市区町村コードの正規化と地名取得
function getMunicipalityName(muniCd, municipalities) {
  // 4桁コードの場合は先頭に"0"を追加（例: "1101" → "01101"）
  const normalizedMuniCd = muniCd?.length === 4 ? '0' + muniCd : muniCd;
  
  // 辞書から市区町村名を取得
  const cityName = municipalities[normalizedMuniCd] || '';
  
  // 都道府県コード（最初の2桁）を抽出
  const prefCode = normalizedMuniCd?.substring(0, 2);
  
  return {
    cityName,      // 市区町村名
    prefCode       // 都道府県コード
  };
}

// 使用例
const { cityName, prefCode } = getMunicipalityName("13101", municipalities);
// 結果: cityName = "千代田区", prefCode = "13"`}</CodeBlock>
              
              <h2 id="prefecture-determination">Step 4: 都道府県名の判定</h2>
              <p>
                都道府県コードから都道府県名を判定します。これは後の系番号決定で重要な情報となります。
              </p>
              
              <CodeBlock>{`// 都道府県コードから都道府県名を取得
function getPrefName(prefCode) {
  const prefCodeMap = {
    '01': '北海道', '02': '青森県', '03': '岩手県', '04': '宮城県',
    '05': '秋田県', '06': '山形県', '07': '福島県', '08': '茨城県',
    '09': '栃木県', '10': '群馬県', '11': '埼玉県', '12': '千葉県',
    '13': '東京都', '14': '神奈川県', '15': '新潟県', '16': '富山県',
    '17': '石川県', '18': '福井県', '19': '山梨県', '20': '長野県',
    '21': '岐阜県', '22': '静岡県', '23': '愛知県', '24': '三重県',
    '25': '滋賀県', '26': '京都府', '27': '大阪府', '28': '兵庫県',
    '29': '奈良県', '30': '和歌山県', '31': '鳥取県', '32': '島根県',
    '33': '岡山県', '34': '広島県', '35': '山口県', '36': '徳島県',
    '37': '香川県', '38': '愛媛県', '39': '高知県', '40': '福岡県',
    '41': '佐賀県', '42': '長崎県', '43': '熊本県', '44': '大分県',
    '45': '宮崎県', '46': '鹿児島県', '47': '沖縄県'
  };
  
  return prefCodeMap[prefCode] || '';
}

// 使用例
const prefName = getPrefName("13"); // "東京都"`}</CodeBlock>
              
              <h2 id="system-determination">Step 5: 地域に応じた系番号の決定</h2>
              <p>
                日本の平面直角座標系は第1系から第19系まで存在し、地域によって使用する系が決まっています。
                都道府県と市区町村の組み合わせから適切な系番号を決定します。
              </p>
              
              <CodeBlock>{`// 平面直角座標系の系番号判定テーブル
const municipalityToSystem = {
  '北海道': {
    '函館市': 11, '小樽市': 11,        // 第11系
    '旭川市': 12, '釧路市': 13,        // 第12系・第13系
    'その他': 12                       // 北海道の他の地域は第12系
  },
  '青森県': 10,    // 青森県全域は第10系
  '岩手県': 10,    // 岩手県全域は第10系
  '宮城県': 10,    // 宮城県全域は第10系
  // ... 中略 ...
  '東京都': {
    '小笠原村': {
      '南鳥島': 19,        // 南鳥島は第19系
      '沖ノ鳥島': 18,      // 沖ノ鳥島は第18系
      'その他': 14         // 小笠原村の他の地域は第14系
    },
    'その他': 9            // 東京都の他の地域は第9系
  },
  // ... 中略 ...
  '沖縄県': {
    '石垣市': 16, '宮古島市': 16,     // 第16系
    '北大東村': 17, '南大東村': 17,   // 第17系
    'その他': 15                      // 沖縄県の他の地域は第15系
  }
};

// 系番号判定関数
function getSystemNumber(prefecture, city, detail) {
  const systemInfo = municipalityToSystem[prefecture];
  let systemNumber;
  
  if (typeof systemInfo === 'object') {
    // 複雑な判定が必要な都道府県
    if (prefecture === '東京都' && city === '小笠原村') {
      // 小笠原村の特殊判定
      if (detail.includes('南鳥島')) {
        systemNumber = 19;  // 第19系
      } else if (detail.includes('沖ノ鳥島')) {
        systemNumber = 18;  // 第18系
      } else {
        systemNumber = 14;  // 第14系
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

// 使用例
const systemNum = getSystemNumber('東京都', '千代田区', '丸の内');
// 結果: 9（第9系）`}</CodeBlock>
              
              <h2 id="coordinate-transformation">Step 6: proj4ライブラリによる座標変換</h2>
              <p>
                決定した系番号を使用して、proj4ライブラリで実際の座標変換を実行します。
                各系の測地パラメータを定義し、WGS84座標系から平面直角座標系に変換します。
              </p>
              
              <CodeBlock>{`// 平面直角座標系の定義（第1系〜第19系）
const planeCoordDefs = {
  1: '+proj=tmerc +lat_0=33 +lon_0=129.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs',
  2: '+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs',
  3: '+proj=tmerc +lat_0=36 +lon_0=132.166667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs',
  // ... 第4系〜第8系 ...
  9: '+proj=tmerc +lat_0=36 +lon_0=139.833333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs',
  // ... 第10系〜第18系 ...
  19: '+proj=tmerc +lat_0=26 +lon_0=154 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs'
};

// proj4を使用した座標変換
import proj4 from 'proj4';

function convertToPlaneCoord(lat, lng, systemNumber) {
  if (!systemNumber || !planeCoordDefs[systemNumber]) {
    return { x: '-', y: '-', system: '-' };
  }
  
  try {
    // 選択された系の定義を設定
    const definition = planeCoordDefs[systemNumber];
    proj4.defs('PLANE_COORD', definition);
    
    // WGS84から平面直角座標系に変換
    // 注意: proj4では [経度, 緯度] の順序で入力
    const [yVal, xVal] = proj4('WGS84', 'PLANE_COORD', [lng, lat]);
    
    return {
      x: xVal.toFixed(2),           // X座標（メートル）
      y: yVal.toFixed(2),           // Y座標（メートル）
      system: \`第\${systemNumber}系\`  // 系番号
    };
  } catch (error) {
    console.error('座標変換エラー:', error);
    return { x: '-', y: '-', system: '-' };
  }
}

// 使用例
const result = convertToPlaneCoord(35.681236, 139.767125, 9);
// 結果: { x: "-17541.23", y: "-36582.48", system: "第9系" }`}</CodeBlock>
              
              <h2 id="coordinate-system-details">各平面直角座標系の詳細</h2>
              <p>
                日本の平面直角座標系の各系について、適用地域と座標系パラメータを整理します：
              </p>
              
              <GlassPanel>
                <strong>主要な系の適用地域：</strong>
                <ul>
                  <li><strong>第9系</strong>: 東京都（島嶼部除く）、福島県、栃木県、茨城県、埼玉県、千葉県、群馬県、神奈川県</li>
                  <li><strong>第10系</strong>: 青森県、岩手県、宮城県、秋田県、山形県、福島県</li>
                  <li><strong>第11系</strong>: 北海道（小樽市、函館市など道南地区）</li>
                  <li><strong>第12系</strong>: 北海道（札幌市、旭川市など道央・道北地区）</li>
                  <li><strong>第13系</strong>: 北海道（釧路市、帯広市など道東地区）</li>
                  <li><strong>第14系</strong>: 小笠原諸島（南鳥島・沖ノ鳥島除く）</li>
                  <li><strong>第15系</strong>: 沖縄県（石垣市、宮古島市、大東諸島除く）</li>
                  <li><strong>第18系</strong>: 沖ノ鳥島</li>
                  <li><strong>第19系</strong>: 南鳥島</li>
                </ul>
              </GlassPanel>
              
              <h2 id="complete-implementation">Step 7: 完全な実装例</h2>
              <p>
                以下は、上記のすべてのステップを統合した完全な実装例です：
              </p>
              
              <CodeBlock>{`// 完全な座標変換システムの実装
class CoordinateConverter {
  constructor(municipalities) {
    this.municipalities = municipalities;
    this.initializeProj4Definitions();
  }
  
  // 地図中心座標から平面直角座標系への変換
  async convertMapCenterToPlaneCoord(lat, lng) {
    try {
      // Step 1: 逆ジオコーダーAPI呼び出し
      const geoInfo = await this.fetchGeocodingInfo(lat, lng);
      if (!geoInfo) {
        return this.getDefaultResult();
      }
      
      // Step 2-4: 地名情報の取得と整理
      const locationInfo = this.parseLocationInfo(geoInfo);
      
      // Step 5: 系番号の決定
      const systemNumber = this.getSystemNumber(
        locationInfo.prefecture,
        locationInfo.city,
        locationInfo.detail
      );
      
      // Step 6: 座標変換
      const planeCoord = this.convertToPlaneCoord(lat, lng, systemNumber);
      
      return {
        ...planeCoord,
        address: locationInfo.fullAddress,
        prefecture: locationInfo.prefecture,
        city: locationInfo.city
      };
      
    } catch (error) {
      console.error('座標変換処理エラー:', error);
      return this.getDefaultResult();
    }
  }
  
  // 逆ジオコーダーAPI呼び出し
  async fetchGeocodingInfo(lat, lng) {
    const apiUrl = \`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=\${lat}&lon=\${lng}\`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return data.results?.[0] || null;
  }
  
  // 地名情報の解析
  parseLocationInfo(geoInfo) {
    const muniCd = geoInfo.muniCd;
    const normalizedMuniCd = muniCd?.length === 4 ? '0' + muniCd : muniCd;
    const city = this.municipalities[normalizedMuniCd] || '';
    const prefCode = normalizedMuniCd?.substring(0, 2);
    const prefecture = this.getPrefName(prefCode);
    const detail = geoInfo.lv01Nm || '';
    
    return {
      prefecture,
      city,
      detail,
      fullAddress: prefecture + city + detail
    };
  }
  
  // 系番号判定（前述のgetSystemNumber関数と同じ）
  getSystemNumber(prefecture, city, detail) {
    // 実装は前述のコードと同じ
  }
  
  // proj4による座標変換（前述のconvertToPlaneCoord関数と同じ）
  convertToPlaneCoord(lat, lng, systemNumber) {
    // 実装は前述のコードと同じ
  }
  
  // その他のヘルパー関数...
}

// 使用例
const converter = new CoordinateConverter(municipalities);

// 東京駅の座標を変換
const result = await converter.convertMapCenterToPlaneCoord(35.681236, 139.767125);
console.log(result);
/*
出力例:
{
  x: "-17541.23",
  y: "-36582.48", 
  system: "第9系",
  address: "東京都千代田区丸の内",
  prefecture: "東京都",
  city: "千代田区"
}
*/`}</CodeBlock>
              
              <h2 id="reference">参考</h2>
              <p>
                この実装で使用している技術とAPIについて、さらに詳しく学習するためのリソースです：
              </p>
              <ul>
                <li><a href="https://www.gsi.go.jp/sokuchikijun/jpc.html" target="_blank" rel="noopener noreferrer">平面直角座標系について（国土地理院）</a></li>
                <li><a href="https://maps.gsi.go.jp/development/api.html" target="_blank" rel="noopener noreferrer">地理院地図API仕様</a></li>
                <li><a href="https://proj4js.org/" target="_blank" rel="noopener noreferrer">Proj4js公式ドキュメント</a></li>
                <li><a href="https://epsg.io/" target="_blank" rel="noopener noreferrer">EPSG座標系データベース</a></li>
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