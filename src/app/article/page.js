'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';

export default function Article() {
  return (
    <Layout>
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

          <h2 id="nextjsのメリット">nextjsのメリット</h2>
          <p>メリットは以下の通りです。</p>
          <ul>
            <li>パフォーマンスが向上する</li>
          </ul>

          <h2 id="nextjsのデメリット">nextjsのデメリット</h2>
          <p>デメリットは以下の通りです。</p>
          <ul>
            <li>buildに時間がかかる</li>
          </ul>
        </div>

        <aside className={styles.tableOfContents}>
          <h3>目次</h3>
          <ul className={styles.tocList}>
            <li><a href="#nextjsのメリット">nextjsのメリット</a></li>
            <li><a href="#nextjsのデメリット">nextjsのデメリット</a></li>
          </ul>
        </aside>
      </article>
    </Layout>
  );
} 