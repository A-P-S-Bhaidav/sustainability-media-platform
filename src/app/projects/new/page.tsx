'use client';
import { motion } from 'framer-motion';
import { createProject } from '../actions';
import styles from './page.module.css';

export default function NewProject() {
  return (
    <div className={styles.container}>
      <motion.div 
        className={`glass-panel ${styles.formCard}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>New Field Project</h1>
          <p className={styles.subtitle}>Initialize a new environmental tracking project.</p>
        </div>

        <form action={createProject} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Project Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              className={styles.input} 
              placeholder="e.g. Amazon Reforestation Sector 4"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="location">Location</label>
            <input 
              type="text" 
              id="location" 
              name="location" 
              className={styles.input} 
              placeholder="e.g. Manaus, Brazil"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              className={styles.input} 
              placeholder="Brief description of the conservation goals..."
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Generate Project
          </button>
        </form>
      </motion.div>
    </div>
  );
}
