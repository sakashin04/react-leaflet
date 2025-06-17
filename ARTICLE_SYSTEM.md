# 記事データ自動取得システム

このシステムは、各記事ファイルから自動的にメタデータを取得し、記事一覧ページで使用するためのものです。

## 機能概要

- 各記事ファイル（article1/page.js, article2/page.js等）からメタデータを自動取得
- 記事一覧ページでの動的データ表示
- タグベースのフィルタリング
- エラーハンドリングとローディング状態の管理

## ファイル構成

```
src/
├── app/
│   ├── article/
│   │   ├── page.js                 # 記事一覧ページ（更新済み）
│   │   └── server-page.js          # Server Components版
│   ├── article1/page.js            # 記事1（メタデータ追加済み）
│   ├── article2/page.js            # 記事2（メタデータ追加済み）
│   ├── article3/page.js            # 記事3（メタデータ追加済み）
│   └── article4/page.js            # 記事4（メタデータ追加済み）
├── lib/
│   ├── getArticles.js              # 基本的なデータ取得機能
│   └── getArticlesAdvanced.js      # 高度なデータ取得機能
├── types/
│   └── article.js                  # 型定義
└── test/
    └── testArticles.js             # テストスクリプト
```

## 使用方法

### 1. 新しい記事の追加

新しい記事を追加する際は、記事ファイルの先頭にメタデータをexportしてください：

```javascript
'use client';

// 記事メタデータ
export const metadata = {
  id: 5,                    // 一意の記事ID
  title: '記事のタイトル',
  subtitle: 'サブタイトル',
  date: '6月18日',
  tags: ['tag1', 'tag2']    // タグの配列
};

import Layout from '../../components/Layout';
// ... 以下記事の内容
```

### 2. 記事データの取得

```javascript
import { getAllArticles, getArticleById, getAllTags } from '../lib/getArticles';

// 全記事の取得
const articles = await getAllArticles();

// 特定記事の取得
const article = await getArticleById(1);

// 全タグの取得
const tags = await getAllTags();
```

### 3. 高度な機能の使用

```javascript
import { getArticlesAdvanced, articleCache } from '../lib/getArticlesAdvanced';

// キャッシュ機能付きで記事を取得
const articles = await articleCache.getArticles();

// より柔軟な記事検出
const advancedArticles = await getArticlesAdvanced();
```

## メタデータの構造

各記事ファイルでexportするメタデータの構造：

```javascript
{
  id: number,           // 記事の一意識別子
  title: string,        // 記事のタイトル
  subtitle: string,     // 記事のサブタイトル
  date: string,         // 記事の作成日
  tags: string[]        // 記事に関連するタグの配列
}
```

## 利点

1. **自動化**: 手動での記事リスト管理が不要
2. **一貫性**: 各記事ファイルでメタデータを管理するため整合性が保たれる
3. **拡張性**: 新しい記事を追加するだけで自動的に一覧に反映
4. **型安全性**: JSDocまたはTypeScriptでの型チェック
5. **パフォーマンス**: キャッシュ機能による高速化
6. **エラーハンドリング**: 記事が見つからない場合の適切な処理

## 従来の方法との比較

### 従来の方法（手動管理）
```javascript
const articles = [
  { id: 1, title: '...', ... },  // 手動で管理
  { id: 2, title: '...', ... },  // 記事ファイルと重複
  // 新しい記事を追加する度に手動更新が必要
];
```

### 新しい方法（自動取得）
```javascript
// 記事ファイルから自動取得
const articles = await getAllArticles();
// 新しい記事を追加するだけで自動的に反映
```

## トラブルシューティング

### 記事が表示されない場合
1. 記事ファイルに `metadata` が正しくexportされているか確認
2. メタデータの構造が正しいか確認
3. ブラウザのコンソールでエラーメッセージを確認

### パフォーマンスの問題
- `getArticlesAdvanced.js` のキャッシュ機能を活用
- Server Components版（`server-page.js`）の使用を検討

## 今後の拡張案

1. **検索機能**: タイトルや内容での全文検索
2. **ソート機能**: 日付、タイトル、人気度でのソート
3. **ページネーション**: 大量の記事への対応
4. **カテゴリ機能**: タグとは別のカテゴリ分類
5. **関連記事**: タグベースでの関連記事の自動提案