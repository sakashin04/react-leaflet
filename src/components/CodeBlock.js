import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './CodeBlock.module.css';

export default function CodeBlock({ children, language = 'javascript' }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // childrenはstringなので、そのままコピー
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      return;
    }
    // fallback: refから取得（行番号が混じる場合は除去）
    if (codeRef.current) {
      // 行番号を除外してコピー
      const codeLines = Array.from(codeRef.current.querySelectorAll('span'))
        .filter(span => !span.className.includes('react-syntax-highlighter-line-number'))
        .map(span => span.textContent)
        .join('\n');
      navigator.clipboard.writeText(codeLines);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <button className={styles.copyButton} onClick={handleCopy} title="コピー">
        {copied ? '✓' : <Image src="/copy.svg" alt="copy" width={16} height={16} style={{ filter: 'invert(1)' }} />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 8,
          fontSize: 15,
          padding: '1.2em 1.5em',
          background: '#23272e',
        }}
        codeTagProps={{ ref: codeRef }}
        showLineNumbers
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
} 