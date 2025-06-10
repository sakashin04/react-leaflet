'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import Link from 'next/link';
import { useState } from 'react';
import GlassPanel from '../../components/GlassPanel';

export default function ArticleList() {
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
    {
      id: 3,
      title: '画面中心の経緯度から平面直角座標系への変換',
      subtitle: '地図アプリでよく使う座標変換の基礎',
      date: '6月5日', 
      tags: ['座標', '地図']
    }
  ];

  // タグ一覧をユニークで抽出
  const allTags = Array.from(new Set(articles.flatMap(a => a.tags)));
  const [selectedTag, setSelectedTag] = useState('');

  // フィルタリング
  const filteredArticles = selectedTag
    ? articles.filter(article => article.tags.includes(selectedTag))
    : articles;

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
        </main>
      </div>
    </Layout>
  );
}
