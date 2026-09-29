'use client';
import { motion } from 'framer-motion';

export default function SearchPlaceholder() {
  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <motion.div 
        className="glass-panel"
        style={{ padding: '3rem', textAlign: 'center', borderRadius: '1rem', maxWidth: '500px' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>AI Discovery Search</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          We are currently fine-tuning our AI models to enable semantic search across your field media. Check back soon!
        </p>
      </motion.div>
    </div>
  );
}
