import React from 'react';
import styles from './GlassPanel.module.css';

export default function GlassPanel({ children }) {
  return <div className={styles.glassPanel}>{children}</div>;
} 