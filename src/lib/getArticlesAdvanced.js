/**
 * より高度な記事データ取得システム
 * ファイルシステムベースで記事を自動検出
 */

/**
 * 記事ディレクトリパターンに基づいて記事を自動検出
 * @returns {Promise<Array>} 記事データの配列
 */
export async function getArticlesAdvanced() {
  const articles = [];
  
  // 予期される記事の最大数（必要に応じて調整）
  const maxArticles = 10;
  
  for (let i = 1; i <= maxArticles; i++) {
    try {
      // 動的にモジュールをインポート
      const module = await import(`../app/article${i}/page.js`);
      
      if (module.metadata) {
        articles.push({
          ...module.metadata,
          // URLパスを自動生成
          path: `/article${i}`
        });
      }
    } catch (error) {
      // 記事が存在しない場合は無視
      if (!error.message.includes('Cannot resolve module')) {
        console.warn(`記事${i}の読み込みに失敗:`, error);
      }
    }
  }
  
  // IDでソート
  return articles.sort((a, b) => a.id - b.id);
}

/**
 * 記事のメタデータ構造を検証
 * @param {Object} metadata - 検証するメタデータ
 * @returns {boolean} 有効かどうか
 */
export function validateArticleMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') {
    return false;
  }
  
  const requiredFields = ['id', 'title', 'subtitle', 'date', 'tags'];
  
  for (const field of requiredFields) {
    if (!(field in metadata)) {
      console.warn(`必須フィールド '${field}' が見つかりません`);
      return false;
    }
  }
  
  // タグが配列かどうかチェック
  if (!Array.isArray(metadata.tags)) {
    console.warn('tags フィールドは配列である必要があります');
    return false;
  }
  
  return true;
}

/**
 * 記事の統計情報を取得
 * @returns {Promise<Object>} 統計情報
 */
export async function getArticleStats() {
  const articles = await getArticlesAdvanced();
  const allTags = articles.flatMap(article => article.tags);
  const uniqueTags = Array.from(new Set(allTags));
  
  return {
    totalArticles: articles.length,
    totalTags: uniqueTags.length,
    articlesPerTag: uniqueTags.reduce((acc, tag) => {
      acc[tag] = articles.filter(article => article.tags.includes(tag)).length;
      return acc;
    }, {}),
    latestArticle: articles.reduce((latest, current) => {
      // 簡単な日付比較（実際の用途では日付パーサーを使用することを推奨）
      return current.id > latest.id ? current : latest;
    }, articles[0] || null)
  };
}

/**
 * 記事データをキャッシュ機能付きで取得
 */
class ArticleCache {
  constructor(ttl = 5 * 60 * 1000) { // 5分のTTL
    this.cache = null;
    this.lastFetch = null;
    this.ttl = ttl;
  }
  
  async getArticles() {
    const now = Date.now();
    
    // キャッシュが有効な場合は返す
    if (this.cache && this.lastFetch && (now - this.lastFetch) < this.ttl) {
      return this.cache;
    }
    
    // 新しいデータを取得
    try {
      this.cache = await getArticlesAdvanced();
      this.lastFetch = now;
      return this.cache;
    } catch (error) {
      console.error('記事データの取得に失敗:', error);
      // キャッシュがある場合は古いデータを返す
      return this.cache || [];
    }
  }
  
  clearCache() {
    this.cache = null;
    this.lastFetch = null;
  }
}

// シングルトンインスタンス
export const articleCache = new ArticleCache();