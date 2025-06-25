'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';

export default function Article8() {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    // h2要素を取得して目次配列を作成
    const headings = Array.from(document.querySelectorAll('h2'));
    setToc(headings.map(h => ({ id: h.id, text: h.textContent })));
  }, []);

  // ページトップに戻る関数
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // スムーズスクロール関数
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
              <h1 className={styles.title}>Leaflet地図のパフォーマンス最適化</h1>
              <p className={styles.subtitle}>デバウンス処理による高速地図アプリケーションの実現</p>
              <div className={styles.meta}>
                <span>6月25日</span>
                <span className={styles.divider}></span>
                <span>Leaflet</span>
                <span className={styles.divider}></span>
                <span>パフォーマンス</span>
                <span className={styles.tag}>最適化</span>
                <span className={styles.tag}>デバウンス</span>
                <span className={styles.tag}>React</span>
              </div>
            </header>
          
          <div className={styles.content}>
            <h2 id="problem-occurrence">問題の発生</h2>
            <p>
              React LeafletでWebマップアプリケーションを開発していた際、ローカル環境で以下の問題が発生しました：
            </p>
            <ul>
              <li>ページの読み込みが異常に遅い</li>
              <li>白い画面が長時間表示される</li>
              <li>CPU使用率が100%を超える</li>
              <li>地図操作時のレスポンスが悪い</li>
            </ul>

            <h2 id="problem-investigation">問題の原因調査</h2>
            <p>
              <code>ps aux</code>コマンドでプロセスを確認したところ、Next.jsサーバーのCPU使用率が102.9%と異常に高いことが判明しました。
            </p>

            <CodeBlock language="bash">
{`$ ps aux | grep -E "(node|next)" | grep -v grep
sakashin04    5388 102.9  1.3 490040304 218640 s006  R+  next-server (v15.3.2)`}
            </CodeBlock>

            <h3 id="root-cause">根本原因の特定</h3>
            <p>
              詳細な調査により、地図コンポーネントの<code>CoordinatePanel</code>で以下の処理が原因であることが分かりました：
            </p>
            <ul>
              <li>地図の中心座標が変わるたびに逆ジオコーダーAPIを呼び出し</li>
              <li>同時に標高取得APIも呼び出し</li>
              <li>地図をドラッグするたびに大量のAPIリクエストが発生</li>
              <li>これによりCPUリソースが枯渇</li>
            </ul>

            <h2 id="optimization-implementation">最適化の実装</h2>
            
            <h3 id="debounce-implementation">1. デバウンス処理の導入</h3>
            <p>
              APIリクエストの頻度を制限するため、デバウンス処理を実装しました。
            </p>

            <h4>修正前のコード（問題のあるコード）</h4>
            <CodeBlock language="javascript">
{`useEffect(() => {
  async function fetchInfo() {
    try {
      // 逆ジオコーダー
      const res = await fetch(\`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=\${center.lat}&lon=\${center.lng}\`);
      const data = await res.json();
      // ... 処理
      
      // 標高API
      const elevRes = await fetch(\`https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=\${center.lng}&lat=\${center.lat}&outtype=JSON\`);
      const elevData = await elevRes.json();
      // ... 処理
    } catch (error) {
      // エラーハンドリング
    }
  }
  fetchInfo(); // 座標が変わるたびに即座に実行
}, [center, municipalities]);`}
            </CodeBlock>

            <h4>修正後のコード（最適化済み）</h4>
            <CodeBlock language="javascript">
{`useEffect(() => {
  // デバウンス処理を追加して、APIリクエストを制限
  const timer = setTimeout(async () => {
    try {
      // 逆ジオコーダー
      const res = await fetch(\`https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=\${center.lat}&lon=\${center.lng}\`);
      const data = await res.json();
      // ... 処理
      
      // 標高API
      const elevRes = await fetch(\`https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=\${center.lng}&lat=\${center.lat}&outtype=JSON\`);
      const elevData = await elevRes.json();
      // ... 処理
    } catch (error) {
      // エラーハンドリング
    }
  }, 500); // 500msのデバウンス

  return () => clearTimeout(timer); // クリーンアップ
}, [center, municipalities]);`}
            </CodeBlock>

            <h3 id="dom-optimization">2. DOM操作の最適化</h3>
            <p>
              Leafletタイルレイヤーの操作も最適化しました。
            </p>

            <h4>修正前</h4>
            <CodeBlock language="javascript">
{`useEffect(() => {
  // 即座に実行
  document.querySelectorAll('.leaflet-layer img[src*="std"]').forEach(img => {
    if (img.parentElement) img.parentElement.style.zIndex = 100;
  });
  // ... その他の処理
}, [showShading]);`}
            </CodeBlock>

            <h4>修正後</h4>
            <CodeBlock language="javascript">
{`useEffect(() => {
  const timer = setTimeout(() => {
    // バッチ処理で実行
    document.querySelectorAll('.leaflet-layer img[src*="std"]').forEach(img => {
      if (img.parentElement) img.parentElement.style.zIndex = 100;
    });
    // ... その他の処理
  }, 100);
  
  return () => clearTimeout(timer); // クリーンアップ
}, [showShading]);`}
            </CodeBlock>

            <h2 id="debounce-explanation">デバウンス処理とは</h2>
            <p>
              デバウンス（Debounce）は、関数の呼び出しを遅延させ、短時間での連続実行を防ぐ手法です。
            </p>
            
            <h3 id="debounce-mechanism">デバウンスの仕組み</h3>
            <ul>
              <li>関数呼び出し時に、指定した遅延時間分待機</li>
              <li>遅延時間内に再度呼び出された場合、前のタイマーをキャンセル</li>
              <li>最後の呼び出しから遅延時間経過後に実際の処理を実行</li>
            </ul>

            <CodeBlock language="javascript">
{`// デバウンスの基本的な実装例
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // 前のタイマーをクリア
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 使用例
const debouncedSearch = debounce((query) => {
  console.log('検索実行:', query);
}, 500);

// 連続で呼び出しても、最後の呼び出しから500ms後に1回だけ実行される
debouncedSearch('a');
debouncedSearch('ab');
debouncedSearch('abc'); // これだけが実行される`}
            </CodeBlock>

            <h2 id="optimization-effects">最適化の効果</h2>
            <p>
              今回の最適化により、以下の効果が得られました：
            </p>
            
            <h3 id="performance-improvement">パフォーマンス改善</h3>
            <ul>
              <li><strong>CPU使用率</strong>: 102.9% → 正常レベル（10%以下）</li>
              <li><strong>APIリクエスト数</strong>: 大幅削減（地図ドラッグ時）</li>
              <li><strong>レスポンス性</strong>: スムーズな地図操作を実現</li>
              <li><strong>読み込み速度</strong>: 白い画面の表示時間を短縮</li>
            </ul>

            <h3 id="ux-improvement">ユーザーエクスペリエンス向上</h3>
            <ul>
              <li>地図操作時のカクつきがなくなった</li>
              <li>座標情報の更新が適切なタイミングで行われる</li>
              <li>ページ読み込み時のストレスが軽減</li>
            </ul>

            <h2 id="other-optimization-methods">他の最適化手法</h2>
            
            <h3 id="throttling">1. スロットリング（Throttling）</h3>
            <p>
              デバウンスとは異なり、一定間隔で確実に処理を実行する手法です。
            </p>
            <CodeBlock language="javascript">
{`function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}`}
            </CodeBlock>

            <h3 id="react-memo">2. React.memo()の活用</h3>
            <p>
              不要な再レンダリングを防ぐためのReactの最適化機能です。
            </p>
            <CodeBlock language="javascript">
{`import React from 'react';

const CoordinatePanel = React.memo(({ center, zoom, municipalities }) => {
  // コンポーネントの実装
}, (prevProps, nextProps) => {
  // カスタム比較関数（オプション）
  return prevProps.center.lat === nextProps.center.lat &&
         prevProps.center.lng === nextProps.center.lng;
});`}
            </CodeBlock>

            <h3 id="use-callback">3. useCallback()の活用</h3>
            <p>
              関数の再生成を防ぐことで、子コンポーネントの不要な再レンダリングを防止します。
            </p>
            <CodeBlock language="javascript">
{`import { useCallback } from 'react';

const MapComponent = () => {
  const handleMapMove = useCallback((newCenter) => {
    // 地図移動時の処理
  }, []); // 依存配列が空なので、関数は初回のみ生成

  return <MapContainer onMove={handleMapMove} />;
};`}
            </CodeBlock>

            <h2 id="summary">まとめ</h2>
            <p>
              Webマップアプリケーションのパフォーマンス問題は、多くの場合APIリクエストの頻度や不適切なDOM操作が原因です。
              今回の事例では、以下のポイントが重要でした：
            </p>
            <ul>
              <li><strong>問題の特定</strong>: システムリソースの監視とプロファイリング</li>
              <li><strong>デバウンス処理</strong>: APIリクエストの適切な制御</li>
              <li><strong>DOM操作の最適化</strong>: バッチ処理による効率化</li>
              <li><strong>クリーンアップ</strong>: メモリリークの防止</li>
            </ul>
            
            <p>
              これらの最適化手法は、Leafletに限らず他のWebアプリケーションでも応用可能です。
              パフォーマンス問題に直面した際は、まず原因を正確に特定し、適切な最適化手法を選択することが重要です。
            </p>

            <h2 id="references">参考資料</h2>
            <ul>
              <li><a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener noreferrer">React.memo() - React公式ドキュメント</a></li>
              <li><a href="https://react.dev/reference/react/useCallback" target="_blank" rel="noopener noreferrer">useCallback() - React公式ドキュメント</a></li>
              <li><a href="https://leafletjs.com/reference.html" target="_blank" rel="noopener noreferrer">Leaflet API Reference</a></li>
              <li><a href="https://web.dev/debouncing-throttling-explained/" target="_blank" rel="noopener noreferrer">Debouncing and Throttling Explained - web.dev</a></li>
            </ul>
          </div>
            </article>
        </main>
        
        {/* 目次パネル */}
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