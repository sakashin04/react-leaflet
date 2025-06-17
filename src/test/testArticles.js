/**
 * 記事データ取得機能のテストスクリプト
 * Node.js環境で実行してテストできます
 */

import { getAllArticles, getArticleById, getAllTags } from '../lib/getArticles.js';

async function testArticleSystem() {
  console.log('=== 記事データ取得システムのテスト ===\n');
  
  try {
    // 全記事取得のテスト
    console.log('1. 全記事データの取得テスト');
    const articles = await getAllArticles();
    console.log(`取得した記事数: ${articles.length}`);
    console.log('記事一覧:');
    articles.forEach(article => {
      console.log(`  - ID: ${article.id}, タイトル: ${article.title}`);
    });
    
    console.log('\n2. 特定記事の取得テスト');
    const article1 = await getArticleById(1);
    if (article1) {
      console.log(`記事1の詳細:`);
      console.log(`  - タイトル: ${article1.title}`);
      console.log(`  - サブタイトル: ${article1.subtitle}`);
      console.log(`  - 日付: ${article1.date}`);
      console.log(`  - タグ: ${article1.tags.join(', ')}`);
    }
    
    console.log('\n3. 全タグの取得テスト');
    const tags = await getAllTags();
    console.log(`取得したタグ: ${tags.join(', ')}`);
    
    console.log('\n4. メタデータ構造の検証');
    articles.forEach(article => {
      const requiredFields = ['id', 'title', 'subtitle', 'date', 'tags'];
      const missingFields = requiredFields.filter(field => !(field in article));
      if (missingFields.length === 0) {
        console.log(`  ✓ 記事${article.id}: すべての必須フィールドが存在`);
      } else {
        console.log(`  ✗ 記事${article.id}: 不足フィールド: ${missingFields.join(', ')}`);
      }
    });
    
    console.log('\n=== テスト完了 ===');
    
  } catch (error) {
    console.error('テスト中にエラーが発生しました:', error);
  }
}

// テスト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  testArticleSystem();
}

export default testArticleSystem;