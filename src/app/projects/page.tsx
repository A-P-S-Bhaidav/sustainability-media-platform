"use client";

import Link from "next/link";
import { Search, MapPin, Calendar, Plus } from "lucide-react";
import styles from "./page.module.css";

export default function ProjectsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>All Projects</h1>
          <p className={styles.subtitle}>Manage and explore field projects and their impact.</p>
        </div>
        <Link href="/projects/new" className={`glass-panel ${styles.newButton}`}>
          <Plus size={18} /> New Project
        </Link>
      </header>

      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Search projects by name, location, or tag..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.projectsGrid}>
        {/* Mock Project 1 */}
        <Link href="/projects/1" className={`glass-panel ${styles.projectCard}`}>
          <div className={styles.projectImage}>
            <div className={styles.projectImagePlaceholder}>
              No cover image
            </div>
          </div>
          <div className={styles.projectContent}>
            <div className={styles.projectHeader}>
              <h3 className={styles.projectTitle}>Coastal Reforestation Initiative</h3>
              <span className={styles.statusBadge}>Active</span>
            </div>
            <p className={styles.projectDescription}>Restoring mangrove forests along the coast to prevent soil erosion and rebuild local marine ecosystems.</p>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}><MapPin size={14} /> Bali, Indonesia</span>
              <span className={styles.metaItem}><Calendar size={14} /> Oct 2026</span>
            </div>
          </div>
        </Link>

        {/* Mock Project 2 */}
        <Link href="/projects/2" className={`glass-panel ${styles.projectCard}`}>
          <div className={styles.projectImage}>
            <div className={styles.projectImagePlaceholder}>
              No cover image
            </div>
          </div>
          <div className={styles.projectContent}>
            <div className={styles.projectHeader}>
              <h3 className={styles.projectTitle}>Urban Solar Grid Expansion</h3>
              <span className={styles.statusBadge}>Planning</span>
            </div>
            <p className={styles.projectDescription}>Deploying decentralized solar panels across residential rooftops in the greater metropolitan area.</p>
            <div className={styles.projectMeta}>
              <span className={styles.metaItem}><MapPin size={14} /> Lisbon, Portugal</span>
              <span className={styles.metaItem}><Calendar size={14} /> Sep 2026</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
