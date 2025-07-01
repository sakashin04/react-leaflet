'use client';

import Layout from '../../components/Layout';
import styles from '../article.module.css';
import { useEffect, useState } from 'react';
import CodeBlock from '../../components/CodeBlock';
import GlassPanel from '../../components/GlassPanel';

export default function Article1() {
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
              <h1 className={styles.title}>
                ReactをNext.jsでデプロイする
              </h1>
              <p className={styles.subtitle}>
                vscodeのターミナルからgithubにpushとvercelにデプロイが同時に
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
              今までほとんど生のhtmlやcssしか触ってこなかったのでこれを機にモダンな技術に触れてみたくReactを始めてみました。javascritptといえばjqueryだった私にとってはガラケーからスマホに変わったような気持ちです。React環境でネットにデータをあげるまでの概要をまとめてみました。
              </p>
              <h2 id="1">前提知識</h2>
              <p>※htmlとcssについては触ったことある前提で話を進めます。</p>
              <GlassPanel>
                htmlとcssについては以下のリンクのページを読んである程度手を動かしていただければ感覚が掴めるのではないかと思います。<a href="https://saruwakakun.com/html-css/basic" target="_blank" rel="noopener noreferrer">https://saruwakakun.com/html-css/basic</a><br />

              </GlassPanel>
              <h3>Reactとは</h3>
              <p>Reactは、Facebookが開発したオープンソースのJavaScriptライブラリです。ユーザーインターフェース（UI）の構築に特化しており、コンポーネントベースのアプローチを採用しています。各UIパーツを再利用可能なコンポーネントとして開発でき、それらを組み合わせることで複雑なアプリケーションを構築できます。特徴的な「仮想DOM」という技術により、実際のDOM操作を最小限に抑え、高いパフォーマンスを実現しています。また、単方向データフローを採用することで、データの流れが追跡しやすく、デバッグが容易になっています。大規模なアプリケーション開発にも適しており、豊富なエコシステムと活発なコミュニティの支援により、多くの企業で採用されています。</p>
              <p><span className={styles['highlight-third']}>コンポーネントがとにかく便利です。</span></p>
              <h3>Node.jsとは</h3>
              <p>Node.jsは、ChromeのV8 JavaScriptエンジンを基盤としたサーバサイドJavaScript実行環境です。従来ブラウザでしか動作しなかったJavaScriptをサーバサイドでも実行可能にし、Webアプリケーション開発の可能性を大きく広げました。特徴的な非同期I/O処理により、高いスケーラビリティを実現し、リアルタイムアプリケーションの開発に適しています。また、npmという世界最大のパッケージエコシステムを持ち、豊富なライブラリやツールを利用できます。シングルスレッドでイベント駆動型のアーキテクチャを採用しており、効率的なリソース利用が可能です。WebサーバからAPI、CLIツールまで、様々な用途で活用されています。</p>
              <p><span className={styles['highlight-third']}>2022年ごろの解説動画を見るとyarnが推奨されていたりしましたが、最近はnpmもyarnもどちらでも良いのではないかと思います。</span></p>
              <h3>GitHubとは</h3>
              <p>GitHubは、世界最大のソフトウェア開発プラットフォームです。Gitというバージョン管理システムをベースに、コードの共有、バージョン管理、コラボレーション機能を提供しています。開発者は自身のコードをリポジトリとして保存し、変更履歴を追跡できます。また、他の開発者のコードを「フォーク」して改変したり、「プルリクエスト」を通じて元のプロジェクトに貢献したりすることができます。IssuesやWikiなどのプロジェクト管理機能も備えており、チーム開発を効率化します。オープンソースソフトウェアの開発拠点としても広く利用されており、技術的な知識の共有や学習の場としても重要な役割を果たしています。</p>
              <p>バージョン管理システムとしてGitを使用します。</p>
              <h3>Next.jsとは</h3>
              <p>Next.jsは、Reactベースのフルスタックフレームワークです。Vercelが開発を主導しており、モダンなWebアプリケーション開発に必要な機能を包括的に提供します。サーバサイドレンダリング（SSR）と静的サイト生成（SSG）の両方をサポートし、SEOとパフォーマンスの最適化を実現します。ファイルシステムベースのルーティング、自動的なコード分割、画像最適化などの機能が組み込まれており、開発効率を大きく向上させます。また、APIルートを通じてサーバサイド機能も実装可能で、フロントエンドとバックエンドを統合的に開発できます。Vercelへの簡単なデプロイメントや、豊富な開発者ツールも特徴です。</p>
              <h2 id="2">開発環境の構築</h2>
              <p>以下の手順で開発環境を構築します。</p>
              <GlassPanel>
                <ol>
                  <li>Node.jsのインストール (https://nodejs.org/)</li>
                  <li>GitHubアカウントの作成 (https://github.com/)</li>
                  <li>Git for Windowsのインストール (https://gitforwindows.org/)</li>
                  <li>Vercelアカウントの作成 (https://vercel.com/)</li>
                </ol>
              </GlassPanel>
              <h2 id="3">プロジェクトの作成</h2>
              <p>以下のコマンドでNext.jsプロジェクトを作成します。</p>
              <CodeBlock>{`npx create-next-app@latest my-app
cd my-app`}</CodeBlock>
              <h2 id="4">開発サーバの起動</h2>
              <p>以下のコマンドで開発サーバを起動します。</p>
              <CodeBlock>{`npm run dev`}</CodeBlock>
              <p>http://localhost:3000 （他に立ち上げていればポート番号は変わります）でアプリケーションにアクセスして挙動を確認できます。</p>
              <h2 id="5">GitHubへpush</h2>
              <p>以下の手順でGitHubにコードをプッシュします。</p>
              <h3>1. リポジトリの作成</h3>
              <p>GitHubで新しいリポジトリを作成します。</p>
              <h3>2. リポジトリのクローン</h3>
              <p>リポジトリをクローンします。新規で一から作るなら不要。</p>
              <h3>3. コードの変更</h3>
              <p>コードを変更します。</p>
              <h3>4. コードのコミット</h3>
              <img src="/1-1.png" alt="コードのコミット" width="100%" style={{display: 'block', margin: '0 auto'}} />
              <h2 id="6">vercelでデプロイ</h2>
              <p>Vercelを使用したデプロイ手順：</p>
              <p>pushした時点でvercelにも反映されるのでこのままステージングすれば本番環境にアップロードできます。</p>
              <GlassPanel>
                <ol>
                  <li>Vercel (https://vercel.com) にアクセス</li>
                  <li>ログインしてdeploymentをクリック</li>
                  <li>ステージングを押して本番環境に反映</li>
                </ol>
              </GlassPanel>
              <img src="/1-2.png" alt="vercelのデプロイ" width="100%" style={{display: 'block', margin: '0 auto'}} />
              <h2 id="reference">参考</h2>
              <p><a href="https://zenn.dev/keitakn/articles/nextjs-vercel-create-staging" target="_blank" rel="noopener noreferrer">Next.js + Vercelでステージング環境を構築</a></p>
              <p><a href="https://www.youtube.com/watch?v=15WLMqnkPsE&list=PLwM1-TnN_NN6fUhOoZyU4iZiwhLyISopO" target="_blank" rel="noopener noreferrer">しまぶーのIT大学　Nextjsで学ぶReact講座（Youtube）</a><small>（正直これを見れば大体分かると思います）</small></p>
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