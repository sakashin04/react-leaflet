/**
 * React Server Components版の記事一覧ページ
 * サーバサイドで記事データを取得してレンダリング
 */

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import Link from 'next/link';
import { getAllArticles } from '../../lib/getArticles';
import GlassPanel from '../../components/GlassPanel';

// Server Componentとして実装
export default async function ServerArticleList() {
  // サーバサイドで記事データを取得
  const articles = await getAllArticles();
  
  // タグ一覧をユニークで抽出
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags)));

  return (
    <Layout>
      <div className={styles.articleLayout}>
        <main className={styles.articleMain}>
          <h1 className={styles.title}>記事一覧</h1>
          
          {/* SVGフィルタ（ガラス歪み用） */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <filter id="glass-distortion">
              <feTurbulence type="turbulence" baseFrequency="0.08 0.12" numOctaves="2" result="turb" seed="2"/>
              <feDisplacementMap in2="turb" in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </svg>

          {/* クライアントコンポーネントとしてフィルタリング機能を分離 */}
          <ArticleFilter articles={articles} allTags={allTags} />
        </main>
      </div>
    </Layout>
  );
}

// フィルタリング機能はクライアントコンポーネントとして分離
function ArticleFilter({ articles, allTags }) {
  'use client';
  
  const [selectedTag, setSelectedTag] = useState('');
  
  // フィルタリング
  const filteredArticles = selectedTag
    ? articles.filter(article => article.tags.includes(selectedTag))
    : articles;

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'none', boxShadow: 'none', padding: 0, margin: 0 }}>
        <button
          className={selectedTag === '' ? styles.tagSelected : styles.tag}
          onClick={() => setSelectedTag('')}
          type="button"
        >
          すべて
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            className={selectedTag === tag ? styles.tagSelected : styles.tag}
            onClick={() => setSelectedTag(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className={styles.content}>
        {filteredArticles.length === 0 && (
          <p>該当する記事がありません。</p>
        )}
        {filteredArticles.map(article => (
          <Link href={`/article${article.id}`} key={article.id}>
            <article className={styles.article}>
              <h2>{article.title}</h2>
              <p>{article.subtitle}</p>
              <div className={styles.meta}>
                <span>{article.date}</span>
                {article.tags.map(tag => (
                  <span key={tag} className={styles.articleTag}>{tag}</span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}