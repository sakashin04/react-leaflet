'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';

export default function Article() {
  return (
    <Layout>
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h1 className={styles.title}>
            View Transitions API入門 - 連続性のある画面遷移アニメーションを実現するウェブの新技術
          </h1>
          <p className={styles.subtitle}>
            シンプルでスムーズな連続性のあるアニメーションを実装できます
          </p>
          <div className={styles.meta}>
            <span>3月24日</span>
            <span className={styles.divider}></span>
            <span>メンテナンス済み</span>
            <span className={styles.divider}></span>
            <span>--</span>
            <span className={styles.tag}>CSS</span>
          </div>
        </header>

        <div className={styles.content}>
          <p>
            View Transitions APIを使うと、シンプルでスムーズな連続性のあるアニメーションを実装できます。
          </p>

          <p>
            ウェブ技術でのアニメーションはさまざまな手段が存在します。CSSの transition や 
            animation 、JavaScriptでのWeb Animations APIなど利用されている方も多いでしょう。View 
            Transitions APIは、これらのアニメーション手段だけでは実現が困難だった新しい遷移アニメーションを実現できます。
          </p>

          <h2>本記事で紹介すること</h2>
          <p>
            本記事では「どのようなことができるか」「使い方」「使用上の注意点」を紹介します。
          </p>

          <h2>View Transitions APIで実現できるのは新しい遷移アニメーション</h2>
          <p>
            JavaScriptとCSSの指定で容易に利用できます。
            JSフレームワークでの対応も進んでいます。
          </p>
        </div>

        <aside className={styles.tableOfContents}>
          <h3>目次</h3>
          <ul className={styles.tocList}>
            <li><a href="#what-is-vta">View Transitions APIで何ができるか？</a></li>
            <li><a href="#multiple-pages">複数ページの遷移</a></li>
            <li><a href="#modal">モーダル表示</a></li>
            <li><a href="#slideshow">スライドショー</a></li>
            <li><a href="#ui">UI要素の演出</a></li>
            <li><a href="#sound">サウンドメディアの切り替え</a></li>
            <li><a href="#how-to-use">View Transitions APIの使い方</a></li>
          </ul>
        </aside>
      </article>
    </Layout>
  );
} 