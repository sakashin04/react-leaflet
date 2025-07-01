'use client';

import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';

const SimpleCesiumTest = dynamic(() => import('../../components/SimpleCesiumTest'), {
  ssr: false,
  loading: () => <div>テストを読み込み中...</div>
});

export default function CesiumTestPage() {
  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h1>Cesium 読み込みテスト</h1>
        <p>シンプルなCesium読み込みテストです。ブラウザのコンソールもご確認ください。</p>
        <SimpleCesiumTest />
      </div>
    </Layout>
  );
}