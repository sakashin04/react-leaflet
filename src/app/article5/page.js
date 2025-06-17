'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';
import GlassPanel from '../../components/GlassPanel';

export default function Article5() {
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
                記事メタデータ自動取得システムの実装
              </h1>
              <p className={styles.subtitle}>
                Next.jsで記事一覧を動的に管理する方法
              </p>
              <div className={styles.meta}>
                <span>2025-06-17</span>
                <span className={styles.divider}></span>
                <span>完成</span>
                <span className={styles.divider}></span>
                <span>システム解説</span>
                <span className={styles.tag}>nextjs</span>
                <span className={styles.tag}>system</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>
                この記事では、記事一覧ページで手動管理していた記事データを、
                各記事ファイルから自動取得するシステムの実装について詳しく解説します。
                Next.jsの動的インポート機能を活用した効率的なコンテンツ管理システムです。
              </p>
              
              <h2 id="problem">解決すべき課題</h2>
              <p>
                従来の記事管理では、新しい記事を追加するたびに記事一覧ページの配列を手動で更新する必要がありました。
                これは以下の問題を引き起こします：
              </p>
              
              <CodeBlock>{`// 従来の手動管理方式（問題のある実装）
const articles = [
  {
    id: 1,
    title: 'ReactをNext.jsでデプロイする',
    subtitle: 'vscodeのターミナルからgithubにpushとvercelにデプロイが同時に',
    date: '6月3日',
    tags: ['react', 'nextjs']
  },
  {
    id: 2, 
    title: 'ReactでLeafletを使ってみる',
    subtitle: 'Reactアプリで地図表示を実装する方法',
    date: '6月4日',
    tags: ['leaflet', '地図']
  },
  // 新しい記事を追加するたびに手動で更新が必要...
];`}</CodeBlock>

              <GlassPanel>
                <strong>問題点：</strong>
                <ul>
                  <li>記事追加時の更新作業が必要</li>
                  <li>データの不整合が発生しやすい</li>
                  <li>メンテナンス性が低い</li>
                  <li>記事とメタデータが分離している</li>
                </ul>
              </GlassPanel>
              
              <h2 id="metadata-files">Step 1: メタデータファイルの作成</h2>
              <p>
                各記事ディレクトリに独立した`metadata.js`ファイルを作成します。
                これにより、記事の内容とメタデータを同じ場所で管理できます。
              </p>
              
              <CodeBlock>{`// src/app/article1/metadata.js
export const metadata = {
  id: 1,
  title: 'ReactをNext.jsでデプロイする',
  subtitle: 'vscodeのターミナルからgithubにpushとvercelにデプロイが同時に',
  date: '6月3日',
  tags: ['react', 'nextjs']
};

// src/app/article2/metadata.js
export const metadata = {
  id: 2,
  title: 'ReactでLeafletを使ってみる',
  subtitle: 'Reactアプリで地図表示を実装する方法',
  date: '6月4日',
  tags: ['leaflet', '地図']
};`}</CodeBlock>

              <GlassPanel>
                <strong>なぜ別ファイルにするのか：</strong>
                Next.jsでは'use client'コンポーネントからのexportが制限されているため、
                メタデータを別ファイルに分離する必要があります。これにより、
                サーバーサイドとクライアントサイドの両方でメタデータを利用できます。
              </GlassPanel>
              
              <h2 id="data-fetcher">Step 2: データ取得ライブラリの実装</h2>
              <p>
                各記事のメタデータを動的に取得するためのユーティリティ関数を作成します。
                Next.jsの動的インポート機能を活用します。
              </p>
              
              <CodeBlock>{`// src/lib/getArticles.js
/**
 * 全記事のメタデータを取得
 * @returns {Promise<Array>} 記事データの配列
 */
export async function getAllArticles() {
  const articles = [];
  
  // 記事番号のリスト（手動で管理）
  const articleNumbers = [1, 2, 3, 4, 5];
  
  for (const num of articleNumbers) {
    try {
      // 動的インポートで各記事のメタデータを取得
      const articleModule = await import(\`../app/article\${num}/metadata.js\`);
      if (articleModule.metadata) {
        articles.push(articleModule.metadata);
      }
    } catch (error) {
      console.warn(\`記事\${num}のメタデータを取得できませんでした:\`, error);
    }
  }
  
  // IDで昇順ソート
  return articles.sort((a, b) => a.id - b.id);
}`}</CodeBlock>
              
              <h2 id="dynamic-import">動的インポートの仕組み</h2>
              <p>
                Next.jsの動的インポートは、実行時にモジュールを読み込む機能です。
                これにより、記事の数が変わっても柔軟に対応できます。
              </p>
              
              <CodeBlock>{`/**
 * 特定IDの記事メタデータを取得
 * @param {number} id - 記事ID
 * @returns {Promise<Object|null>} 記事データまたはnull
 */
export async function getArticleById(id) {
  try {
    // テンプレートリテラルを使った動的パス生成
    const articleModule = await import(\`../app/article\${id}/metadata.js\`);
    return articleModule.metadata || null;
  } catch (error) {
    console.warn(\`記事\${id}が見つかりませんでした:\`, error);
    return null;
  }
}

/**
 * 全記事から一意のタグを取得
 * @returns {Promise<Array>} タグの配列
 */
export async function getAllTags() {
  const articles = await getAllArticles();
  const allTags = articles.flatMap(article => article.tags || []);
  return Array.from(new Set(allTags));
}`}</CodeBlock>

              <GlassPanel>
                <strong>動的インポートの利点：</strong>
                <ul>
                  <li>必要な時にのみモジュールを読み込み</li>
                  <li>バンドルサイズの最適化</li>
                  <li>条件付きでのモジュール読み込み</li>
                  <li>非同期での安全な読み込み</li>
                </ul>
              </GlassPanel>
              
              <h2 id="list-page-update">Step 3: 記事一覧ページの更新</h2>
              <p>
                記事一覧ページを、静的配列から動的データ取得に変更します。
                React Hooksを使用してローディング状態とエラーハンドリングも実装します。
              </p>
              
              <CodeBlock>{`// src/app/article/page.js
'use client';

import { useState, useEffect } from 'react';
import { getAllArticles } from '../../lib/getArticles';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 記事データを動的に取得
  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const articlesData = await getAllArticles();
        setArticles(articlesData);
      } catch (err) {
        console.error('記事データの取得に失敗しました:', err);
        setError('記事データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // ローディング状態の表示
  if (loading) {
    return <div>記事データを読み込み中...</div>;
  }

  // エラー状態の表示
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  // 正常な記事一覧の表示
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}`}</CodeBlock>
              
              <h2 id="error-handling">エラーハンドリング</h2>
              <p>
                堅牢なシステムには適切なエラーハンドリングが不可欠です。
                記事が見つからない場合や読み込みに失敗した場合の処理を実装します。
              </p>
              
              <CodeBlock>{`// エラーハンドリングの例
try {
  const articleModule = await import(\`../app/article\${num}/metadata.js\`);
  if (articleModule.metadata) {
    articles.push(articleModule.metadata);
  }
} catch (error) {
  // 記事が存在しない場合は警告を出すだけで処理を継続
  console.warn(\`記事\${num}のメタデータを取得できませんでした:\`, error);
  
  // 必要に応じてフォールバックデータを提供
  articles.push({
    id: num,
    title: '記事が見つかりません',
    subtitle: 'この記事は現在利用できません',
    date: '-',
    tags: []
  });
}`}</CodeBlock>
              
              <h2 id="benefits">システムの利点</h2>
              <p>
                実装したメタデータ自動取得システムには以下の利点があります：
              </p>
              
              <CodeBlock>{`// 新しい記事を追加する場合の手順

// 1. 新しい記事ディレクトリを作成
mkdir src/app/article6

// 2. メタデータファイルを作成
// src/app/article6/metadata.js
export const metadata = {
  id: 6,
  title: '新しい記事のタイトル',
  subtitle: 'サブタイトル',
  date: '6月18日',
  tags: ['tag1', 'tag2']
};

// 3. 記事コンポーネントを作成
// src/app/article6/page.js
export default function Article6() {
  return <div>記事の内容</div>;
}

// 4. getArticles.jsの記事番号リストに追加
const articleNumbers = [1, 2, 3, 4, 5, 6]; // 6を追加するだけ

// これで記事一覧に自動的に反映される！`}</CodeBlock>

              <GlassPanel>
                <strong>システムの利点：</strong>
                <ul>
                  <li><strong>自動化：</strong> 記事一覧の手動更新が不要</li>
                  <li><strong>一貫性：</strong> 記事とメタデータが同じ場所に</li>
                  <li><strong>拡張性：</strong> 新記事の追加が簡単</li>
                  <li><strong>保守性：</strong> データの整合性が保たれる</li>
                  <li><strong>型安全性：</strong> TypeScriptとの相性も良好</li>
                </ul>
              </GlassPanel>
              
              <h2 id="advanced-features">発展的な機能</h2>
              <p>
                基本システムをベースに、さらに高度な機能を追加できます：
              </p>
              
              <CodeBlock>{`// キャッシュ機能付きの高度な実装
const articleCache = new Map();

export async function getAllArticlesWithCache() {
  const cacheKey = 'all-articles';
  
  // キャッシュから取得を試行
  if (articleCache.has(cacheKey)) {
    return articleCache.get(cacheKey);
  }
  
  // キャッシュにない場合は新規取得
  const articles = await getAllArticles();
  
  // キャッシュに保存（5分間）
  articleCache.set(cacheKey, articles);
  setTimeout(() => {
    articleCache.delete(cacheKey);
  }, 5 * 60 * 1000);
  
  return articles;
}

// ファイルシステムベースの自動検出
export async function getArticlesFromFileSystem() {
  // Node.js環境でのみ利用可能
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    
    const articlesDir = path.join(process.cwd(), 'src/app');
    const articleDirs = fs.readdirSync(articlesDir)
      .filter(dir => dir.startsWith('article'))
      .filter(dir => {
        const metadataPath = path.join(articlesDir, dir, 'metadata.js');
        return fs.existsSync(metadataPath);
      });
    
    return articleDirs;
  }
}`}</CodeBlock>
              
              <h2 id="best-practices">ベストプラクティス</h2>
              <p>
                このシステムを効果的に運用するためのベストプラクティスを紹介します：
              </p>
              
              <CodeBlock>{`// メタデータの型定義（TypeScript使用時）
interface ArticleMetadata {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  published?: boolean;
  author?: string;
  category?: string;
}

// バリデーション機能
function validateMetadata(metadata: any): metadata is ArticleMetadata {
  return (
    typeof metadata.id === 'number' &&
    typeof metadata.title === 'string' &&
    typeof metadata.subtitle === 'string' &&
    typeof metadata.date === 'string' &&
    Array.isArray(metadata.tags)
  );
}

// 公開状態の管理
export const metadata: ArticleMetadata = {
  id: 5,
  title: '記事メタデータ自動取得システムの実装',
  subtitle: 'Next.jsで記事一覧を動的に管理する方法',
  date: '6月17日',
  tags: ['nextjs', 'system'],
  published: true, // 公開/非公開の制御
  author: 'システム管理者',
  category: 'technical'
};`}</CodeBlock>
              
              <h2 id="reference">参考</h2>
              <p>
                この実装で使用した技術やパターンについて、さらに詳しく学習するためのリソースです：
              </p>
              <ul>
                <li><a href="https://nextjs.org/docs/advanced-features/dynamic-import" target="_blank" rel="noopener noreferrer">Next.js Dynamic Imports</a></li>
                <li><a href="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/import" target="_blank" rel="noopener noreferrer">JavaScript動的インポート - MDN</a></li>
                <li><a href="https://reactjs.org/docs/hooks-effect.html" target="_blank" rel="noopener noreferrer">React useEffect Hook</a></li>
                <li><a href="https://www.typescriptlang.org/docs/handbook/modules.html" target="_blank" rel="noopener noreferrer">TypeScript Modules</a></li>
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