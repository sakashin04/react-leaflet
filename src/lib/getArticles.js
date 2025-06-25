// 記事データを動的に取得するユーティリティ関数

/**
 * 全記事のメタデータを取得
 * @returns {Promise<Array>} 記事データの配列
 */
export async function getAllArticles() {
  const articles = [];
  
  // 記事番号のリスト（手動で管理）
  const articleNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
  
  for (const num of articleNumbers) {
    try {
      // 動的インポートで各記事のメタデータを取得
      const articleModule = await import(`../app/article${num}/metadata.js`);
      if (articleModule.metadata) {
        articles.push(articleModule.metadata);
      }
    } catch (error) {
      console.warn(`記事${num}のメタデータを取得できませんでした:`, error);
    }
  }
  
  // IDで昇順ソート
  return articles.sort((a, b) => a.id - b.id);
}

/**
 * 特定IDの記事メタデータを取得
 * @param {number} id - 記事ID
 * @returns {Promise<Object|null>} 記事データまたはnull
 */
export async function getArticleById(id) {
  try {
    const articleModule = await import(`../app/article${id}/metadata.js`);
    return articleModule.metadata || null;
  } catch (error) {
    console.warn(`記事${id}が見つかりませんでした:`, error);
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
}