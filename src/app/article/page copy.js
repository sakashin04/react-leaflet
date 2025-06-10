'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';

export default function Article() {
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

  return (
    <Layout>
      <div className={styles.articleLayout}>
        <main className={styles.articleMain}>
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <h1 className={styles.title}>
                reactをnextjsでデプロイする
              </h1>
              <p className={styles.subtitle}>
                コマンドプロンプトよりUI使う方が楽にデプロイできる
              </p>
              <div className={styles.meta}>
                <span>6月3日</span>
                <span className={styles.divider}></span>
                <span>編集中</span>
                <span className={styles.divider}></span>
                <span>--</span>
                <span className={styles.tag}>react</span>
                <span className={styles.tag}>nextjs</span>
              </div>
            </header>
            <div className={styles.content}>
              <p>
                nextjsはreactのフレームワークです。
              </p>
              <p>
                Reactは、WebサイトやWebアプリのUI（ユーザーインターフェース）を構築するために使用されるJavaScriptライブラリです。コンポーネントベースのアーキテクチャを採用しており、小さな部品（コンポーネント）を組み合わせて複雑なUIを構築できるため、高い再利用性と保守性を誇ります。﻿
              </p>
              <h2 id="1">前提知識</h2>
              <p>前提知識は以下の通りです。</p>
              <ul>
                <li>reactとは</li>
                <li>nextjsとは</li>
              </ul>
              <h2 id="2">nextjsのデメリット</h2>
              <p>デメリットは以下の通りです。</p>
              <ul>
                <li>buildに時間がかかる</li>
              </ul>
            </div>
          </article>
        </main>
        <aside className={styles.tocSidebar}>
          <div className={styles.tocSidebarInner}>
            <h3 className={styles.tocTitle}>目次</h3>
            <ul className={styles.tocList}>
              {toc.map(item => (
                <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>
              ))}
              <li><a href="#top" onClick={scrollToTop}>▲ 一番上に戻る</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
} 