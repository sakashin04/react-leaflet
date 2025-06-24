'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';
import GlassPanel from '../../components/GlassPanel';

export default function Article6() {
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
              <h1 className={styles.title}>React記事の目次自動生成システム</h1>
              <p className={styles.subtitle}>見出し要素から動的に目次を作成する実装方法</p>
              <div className={styles.meta}>
                <span>6月22日</span>
                <span className={styles.divider}></span>
                <span>React</span>
                <span className={styles.divider}></span>
                <span>JavaScript</span>
                <span className={styles.tag}>目次</span>
                <span className={styles.tag}>自動生成</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>
                この記事では、React アプリケーションで記事の見出し要素から自動的に目次を生成するシステムの実装方法について詳しく解説します。
                ユーザビリティの向上と記事の構造化に役立つ機能です。
              </p>
              
              <h2 id="overview">目次自動生成システムの概要</h2>
              <p>
                目次自動生成システムは、記事内の見出し要素（h2タグ）を自動的に検出し、ナビゲーション可能な目次を動的に作成します。
                以下の4つのステップで構成されています：
              </p>
              
              <GlassPanel>
                <strong>システム構成：</strong>
                <ol>
                  <li>ページ読み込み時の見出し要素自動検出</li>
                  <li>見出し情報（ID・テキスト）の抽出と保存</li>
                  <li>目次リストの動的生成と表示</li>
                  <li>スムーススクロール機能の実装</li>
                </ol>
              </GlassPanel>
              
              <h2 id="basic-implementation">基本的な実装方法</h2>
              <p>
                まず、React Hooksを使用した基本的な目次システムの実装から始めましょう。
                `useEffect`と`useState`を組み合わせて、動的な目次を実現します。
              </p>
              
              <CodeBlock>{`// 基本的な目次自動生成の実装
import { useEffect, useState } from 'react';

export default function ArticlePage() {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    // ページ内のh2要素をすべて取得
    const headings = Array.from(document.querySelectorAll('h2'));
    
    // 各見出しからIDとテキストを抽出
    const tocItems = headings.map(heading => ({
      id: heading.id,           // 見出しのID属性
      text: heading.textContent // 見出しのテキスト内容
    }));
    
    setToc(tocItems);
  }, []); // 空の依存配列でマウント時のみ実行

  return (
    <div>
      {/* 記事本文 */}
      <article>
        <h2 id="section1">セクション1</h2>
        <p>セクション1の内容...</p>
        
        <h2 id="section2">セクション2</h2>
        <p>セクション2の内容...</p>
      </article>
      
      {/* 目次サイドバー */}
      <aside>
        <h3>目次</h3>
        <ul>
          {toc.map(item => (
            <li key={item.id}>
              <a href={\`#\${item.id}\`}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}`}</CodeBlock>
              
              <h2 id="smooth-scroll">スムーススクロール機能の実装</h2>
              <p>
                デフォルトのアンカーリンクの挙動をオーバーライドして、スムーススクロールを実装します。
                この機能により、目次クリック時の画面遷移がより自然になります。
              </p>
              
              <CodeBlock>{`// スムーススクロール機能付き目次
const scrollToSection = (e, targetId) => {
  e.preventDefault(); // デフォルトのアンカー動作を無効化
  
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    targetElement.scrollIntoView({ 
      behavior: 'smooth',     // スムーススクロール
      block: 'start',         // 要素の上端に合わせる
      inline: 'nearest'       // 水平方向は最適な位置
    });
  }
};

// トップに戻る機能
const scrollToTop = (e) => {
  e.preventDefault();
  window.scrollTo({ 
    top: 0, 
    behavior: 'smooth' 
  });
};

// 目次の表示部分
<ul className={styles.tocList}>
  {toc.map(item => (
    <li key={item.id}>
      <a 
        href={\`#\${item.id}\`} 
        onClick={(e) => scrollToSection(e, item.id)}
      >
        {item.text}
      </a>
    </li>
  ))}
  
  {/* トップに戻るボタン */}
  <li>
    <a href="#top" onClick={scrollToTop}>
      ▲ 一番上に戻る
    </a>
  </li>
</ul>`}</CodeBlock>
              
              <h2 id="advanced-features">高度な機能とカスタマイズ</h2>
              <p>
                基本実装を拡張して、より柔軟で実用的な目次システムを構築する方法を説明します。
                複数レベルの見出し対応や、アクティブセクションのハイライト機能などを追加できます。
              </p>
              
              <CodeBlock>{`// 高度な目次システム（複数レベル対応）
export function AdvancedTOC() {
  const [toc, setToc] = useState([]);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // h2, h3, h4要素を取得して階層構造を作成
    const headings = Array.from(
      document.querySelectorAll('h2, h3, h4')
    );
    
    const tocStructure = headings.map(heading => ({
      id: heading.id,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)), // h2 → 2, h3 → 3
      element: heading
    }));
    
    setToc(tocStructure);
    
    // Intersection Observer で現在のアクティブセクションを追跡
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -70% 0px' // 画面上部20%の位置でアクティブ化
      }
    );
    
    // 各見出し要素を監視対象に追加
    headings.forEach(heading => observer.observe(heading));
    
    return () => observer.disconnect();
  }, []);

  const renderTocItem = (item) => (
    <li 
      key={item.id}
      className={\`
        \${styles.tocItem} 
        \${styles[\`level\${item.level}\`]}
        \${activeSection === item.id ? styles.active : ''}
      \`}
    >
      <a 
        href={\`#\${item.id}\`}
        onClick={(e) => scrollToSection(e, item.id)}
      >
        {item.text}
      </a>
    </li>
  );

  return (
    <nav className={styles.tocContainer}>
      <h3>目次</h3>
      <ul className={styles.tocList}>
        {toc.map(renderTocItem)}
      </ul>
    </nav>
  );
}`}</CodeBlock>
              
              <h2 id="css-styling">CSSスタイリングのベストプラクティス</h2>
              <p>
                目次の見栄えと使いやすさを向上させるためのCSSスタイリング手法を紹介します。
                レスポンシブデザインとアクセシビリティにも配慮した実装例です。
              </p>
              
              <CodeBlock>{`/* 目次のCSSスタイリング例 */
.tocContainer {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tocList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tocItem {
  margin: 0.5rem 0;
  position: relative;
}

/* 階層レベルによるインデント */
.level2 { margin-left: 0; }
.level3 { margin-left: 1rem; }
.level4 { margin-left: 2rem; }

.tocItem a {
  display: block;
  padding: 0.5rem 0.75rem;
  color: #4a5568;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.tocItem a:hover {
  background: #e2e8f0;
  color: #2d3748;
  transform: translateX(4px);
}

/* アクティブセクションのハイライト */
.tocItem.active a {
  background: #3182ce;
  color: white;
  font-weight: 600;
}

.tocItem.active a::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 100%;
  background: #3182ce;
  border-radius: 2px;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .tocContainer {
    position: relative;
    top: 0;
    max-height: none;
    margin-bottom: 2rem;
  }
  
  .level3, .level4 {
    margin-left: 0.5rem;
  }
}`}</CodeBlock>
              
              <h2 id="performance-optimization">パフォーマンス最適化</h2>
              <p>
                大きな記事や複雑な構造の文書でも快適に動作するよう、パフォーマンスを最適化する手法を解説します。
                メモ化やイベント最適化により、レンダリング効率を向上させます。
              </p>
              
              <CodeBlock>{`// パフォーマンス最適化版の実装
import { useEffect, useState, useMemo, useCallback } from 'react';

export function OptimizedTOC() {
  const [toc, setToc] = useState([]);
  const [activeSection, setActiveSection] = useState('');

  // 見出し検出処理をメモ化
  const detectHeadings = useCallback(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3, h4'));
    
    return headings.map(heading => ({
      id: heading.id,
      text: heading.textContent.trim(),
      level: parseInt(heading.tagName.charAt(1)),
      offsetTop: heading.offsetTop
    }));
  }, []);

  // TOC構造をメモ化
  const tocStructure = useMemo(() => {
    return toc.filter(item => item.id && item.text);
  }, [toc]);

  // スクロールイベントのスロットリング
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        const activeItem = tocStructure
          .slice()
          .reverse()
          .find(item => scrollTop >= item.offsetTop - 100);
          
        if (activeItem && activeItem.id !== activeSection) {
          setActiveSection(activeItem.id);
        }
      }, 100); // 100ms のスロットリング
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [tocStructure, activeSection]);

  // 初期化処理
  useEffect(() => {
    const headings = detectHeadings();
    setToc(headings);
  }, [detectHeadings]);

  // スクロール処理のメモ化
  const scrollToSection = useCallback((e, targetId) => {
    e.preventDefault();
    
    const element = document.getElementById(targetId);
    if (element) {
      // より正確なスクロール位置計算
      const headerOffset = 80; // ヘッダーの高さを考慮
      const elementPosition = element.offsetTop - headerOffset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <nav className="toc-container">
      <h3>目次</h3>
      <ul>
        {tocStructure.map(item => (
          <li 
            key={item.id}
            className={\`level-\${item.level} \${activeSection === item.id ? 'active' : ''}\`}
          >
            <a 
              href={\`#\${item.id}\`}
              onClick={(e) => scrollToSection(e, item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`}</CodeBlock>
              
              <h2 id="accessibility">アクセシビリティ対応</h2>
              <p>
                スクリーンリーダーやキーボードナビゲーションに対応した、アクセシブルな目次実装について説明します。
                WAI-ARIAラベルやキーボードイベントの適切な処理が重要です。
              </p>
              
              <CodeBlock>{`// アクセシビリティ対応版
export function AccessibleTOC() {
  const [toc, setToc] = useState([]);
  const [activeSection, setActiveSection] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // キーボードナビゲーション対応
  const handleKeyDown = useCallback((e, index, itemId) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = Math.max(0, index - 1);
        setFocusedIndex(prevIndex);
        // 前の項目にフォーカス
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = Math.min(toc.length - 1, index + 1);
        setFocusedIndex(nextIndex);
        // 次の項目にフォーカス
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        scrollToSection(e, itemId);
        break;
        
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
        
      case 'End':
        e.preventDefault();
        setFocusedIndex(toc.length - 1);
        break;
    }
  }, [toc.length]);

  return (
    <nav 
      className="toc-container"
      role="navigation"
      aria-label="記事の目次"
    >
      <h3 id="toc-heading">目次</h3>
      <ul 
        role="list"
        aria-labelledby="toc-heading"
      >
        {toc.map((item, index) => (
          <li key={item.id} role="listitem">
            <a 
              href={\`#\${item.id}\`}
              onClick={(e) => scrollToSection(e, item.id)}
              onKeyDown={(e) => handleKeyDown(e, index, item.id)}
              aria-current={activeSection === item.id ? 'location' : undefined}
              tabIndex={focusedIndex === index ? 0 : -1}
              className={\`
                toc-link level-\${item.level}
                \${activeSection === item.id ? 'active' : ''}
                \${focusedIndex === index ? 'focused' : ''}
              \`}
            >
              <span className="visually-hidden">
                レベル{item.level}の見出し: 
              </span>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}`}</CodeBlock>
              
              <h2 id="integration-tips">実装時のTipsとベストプラクティス</h2>
              <p>
                実際のプロジェクトで目次システムを導入する際の実用的なアドバイスと、
                よくある問題の解決方法について説明します。
              </p>
              
              <GlassPanel>
                <strong>実装のポイント：</strong>
                <ul>
                  <li><strong>見出しID の自動生成</strong>: 記事執筆時にIDを忘れがちなので、テキストから自動生成する仕組みを用意</li>
                  <li><strong>動的コンテンツ対応</strong>: MDX や CMS からの動的コンテンツでも動作するよう useEffect の依存関係を適切に設定</li>
                  <li><strong>SEO 配慮</strong>: 目次リンクがクロールされるよう、JavaScript 無効時でも基本的な動作を保証</li>
                  <li><strong>モバイル対応</strong>: 小画面では目次を折りたたみ式にするなど、レスポンシブな設計を心がける</li>
                  <li><strong>パフォーマンス</strong>: 大量の見出しがある場合は仮想化やページネーションを検討</li>
                </ul>
              </GlassPanel>
              
              <CodeBlock>{`// 実用的な統合例
import { useEffect, useState, useCallback } from 'react';

// 見出しテキストからID自動生成
const generateId = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\\u3040-\\u309f\\u30a0-\\u30ff\\u4e00-\\u9faf]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// 記事コンポーネントでの使用例
export function ArticleWithAutoTOC({ content }) {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    // 記事がレンダリングされた後に見出しを検出
    const timer = setTimeout(() => {
      const headings = Array.from(document.querySelectorAll('h2, h3'));
      
      // IDが未設定の見出しに自動でIDを付与
      headings.forEach(heading => {
        if (!heading.id) {
          heading.id = generateId(heading.textContent);
        }
      });
      
      const tocItems = headings.map(h => ({
        id: h.id,
        text: h.textContent,
        level: parseInt(h.tagName.charAt(1))
      }));
      
      setToc(tocItems);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [content]); // content が変更されたら再実行

  return (
    <div className="article-layout">
      <main className="article-content">
        {/* 動的コンテンツ */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </main>
      
      <aside className="toc-sidebar">
        {toc.length > 0 && (
          <TOCComponent 
            toc={toc} 
            className="sticky-toc"
          />
        )}
      </aside>
    </div>
  );
}`}</CodeBlock>
              
              <h2 id="conclusion">まとめ</h2>
              <p>
                React での目次自動生成システムは、記事の読みやすさとナビゲーション性を大幅に向上させる重要な機能です。
                基本的な実装から始めて、徐々に機能を拡張していくことで、ユーザーにとって使いやすいシステムを構築できます。
              </p>
              
              <ul>
                <li><strong>DOM 操作</strong>: querySelectorAll での見出し検出</li>
                <li><strong>React Hooks</strong>: useEffect と useState の効果的な活用</li>
                <li><strong>UX</strong>: スムーススクロールとアクティブ状態の表示</li>
                <li><strong>アクセシビリティ</strong>: ARIA ラベルとキーボード対応</li>
                <li><strong>パフォーマンス</strong>: メモ化とイベント最適化</li>
              </ul>
              
              <p>
                これらの要素を組み合わせることで、プロフェッショナルな記事サイトに相応しい目次システムを実現できます。
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