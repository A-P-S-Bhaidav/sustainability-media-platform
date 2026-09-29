'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { searchMedia } from './actions';
import styles from './page.module.css';

type SearchResult = {
  id: string;
  url: string;
  aiTags: string | null;
  project: { name: string } | null;
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          const res = await searchMedia(query);
          setResults(res as SearchResult[]);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Discovery</h1>
        <p className={styles.subtitle}>
          Search through your entire media library using AI-generated tags and project names.
        </p>
      </header>

      <div className={styles.searchBar}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for 'deforestation', 'wildlife', or project names..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isSearching ? (
        <div className={styles.loader}>
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <AnimatePresence>
          {query.trim() !== '' && results.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.emptyState}
            >
              No media found for &quot;{query}&quot;.
            </motion.div>
          ) : (
            <motion.div className={styles.resultsGrid} layout>
              {results.map((media) => {
                let tags: string[] = [];
                try {
                  if (media.aiTags) tags = JSON.parse(media.aiTags);
                } catch (e) {
                  // ignore
                }

                return (
                  <motion.div
                    key={media.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className={styles.mediaCard}
                  >
                    <div className={styles.mediaImageWrapper}>
                      <img src={media.url} alt="Media result" className={styles.mediaImage} />
                    </div>
                    <div className={styles.mediaInfo}>
                      {media.project && (
                        <div className={styles.projectName}>{media.project.name}</div>
                      )}
                      {tags.length > 0 && (
                        <div className={styles.tagsWrapper}>
                          {tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className={styles.tag}>{tag}</span>
                          ))}
                          {tags.length > 3 && <span className={styles.tag}>+{tags.length - 3}</span>}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
