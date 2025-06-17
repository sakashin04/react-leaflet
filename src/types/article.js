/**
 * 記事関連の型定義（JSDocスタイル）
 * TypeScriptを使用する場合は .ts ファイルとして使用してください
 */

/**
 * 記事のメタデータ
 * @typedef {Object} ArticleMetadata
 * @property {number} id - 記事の一意識別子
 * @property {string} title - 記事のタイトル
 * @property {string} subtitle - 記事のサブタイトル
 * @property {string} date - 記事の作成日
 * @property {string[]} tags - 記事に関連するタグの配列
 * @property {string} [path] - 記事のURLパス（オプション）
 */

/**
 * 記事の統計情報
 * @typedef {Object} ArticleStats
 * @property {number} totalArticles - 総記事数
 * @property {number} totalTags - 総タグ数
 * @property {Object.<string, number>} articlesPerTag - タグごとの記事数
 * @property {ArticleMetadata|null} latestArticle - 最新の記事
 */

/**
 * 記事フィルタの設定
 * @typedef {Object} ArticleFilter
 * @property {string} [tag] - 絞り込み対象のタグ
 * @property {string} [searchQuery] - 検索クエリ
 * @property {'asc'|'desc'} [sortOrder] - ソート順
 * @property {'date'|'title'|'id'} [sortBy] - ソート基準
 */

/**
 * 記事取得の設定
 * @typedef {Object} ArticleFetchOptions
 * @property {boolean} [useCache] - キャッシュを使用するかどうか
 * @property {number} [limit] - 取得する記事の最大数
 * @property {number} [offset] - 取得開始位置
 * @property {ArticleFilter} [filter] - フィルタ設定
 */

// 型をエクスポート（ES Modules環境で使用）
export const ArticleMetadata = {};
export const ArticleStats = {};
export const ArticleFilter = {};
export const ArticleFetchOptions = {};