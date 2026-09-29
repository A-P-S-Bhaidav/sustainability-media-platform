'use client';

import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { Camera, MapPin, Calendar, Activity, Images, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

type ProjectData = {
  id: string;
  name: string;
  location: string | null;
  createdAt: Date;
  media: { url: string }[];
};

interface DashboardClientProps {
  totalProjects: number;
  totalMedia: number;
  estimatedTags: number;
  projects: ProjectData[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function DashboardClient({ totalProjects, totalMedia, estimatedTags, projects }: DashboardClientProps) {
  // Use SWR to poll for real-time updates every 5 seconds, starting with server-rendered data
  const { data } = useSWR('/api/dashboard', fetcher, { 
    fallbackData: { totalProjects, totalMedia, estimatedTags, projects },
    refreshInterval: 5000 
  });

  const { totalProjects: cProjects, totalMedia: cMedia, estimatedTags: cTags, projects: cList } = data;

  return (
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div>
          <h1 className={styles.title}>Welcome back, Impact Team</h1>
          <p className={styles.subtitle}>Here is the latest from your field projects.</p>
        </div>
        <Link href="/projects/new" className={styles.createButton}>
          <Plus size={18} />
          New Project
        </Link>
      </motion.header>

      <motion.section className={styles.statsGrid} variants={itemVariants}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Activity size={18} color="var(--color-accent-teal)" />
            Total Projects
          </div>
          <div className={styles.statValue}>{cProjects}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Images size={18} color="var(--color-accent-blue)" />
            Media Assets
          </div>
          <div className={styles.statValue}>{cMedia}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Camera size={18} color="var(--color-accent-teal)" />
            AI Tags Generated
          </div>
          <div className={styles.statValue}>{cTags}</div>
        </div>
      </motion.section>

      <motion.section className={styles.section} variants={itemVariants}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Projects</h2>
          <Link href="/projects" className={styles.viewAll}>
            View all &rarr;
          </Link>
        </div>
        
        <motion.div className={styles.projectsGrid} variants={containerVariants}>
          {cList.length === 0 ? (
            <motion.div className={`glass-panel ${styles.emptyState}`} variants={itemVariants}>
              <div className={styles.emptyStateIcon}>
                <Camera size={48} opacity={0.5} color="var(--color-accent-teal)" />
              </div>
              <h3>No projects yet</h3>
              <p>Get started by creating your first field project!</p>
              <Link href="/projects/new" className={styles.emptyStateButton}>
                Create Your First Project
              </Link>
            </motion.div>
          ) : (
            cList.map((project: any) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Link href={`/projects/${project.id}`} className={`glass-panel ${styles.projectCard}`}>
                  <div className={styles.projectImage}>
                    {project.media.length > 0 ? (
                       <Image 
                         src={project.media[0].url} 
                         alt={project.name} 
                         fill
                         style={{ objectFit: 'cover' }}
                         className={styles.realImage}
                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       />
                    ) : (
                      <div className={styles.projectImagePlaceholder}>
                        <Camera size={48} opacity={0.2} />
                      </div>
                    )}
                  </div>
                  <div className={styles.projectContent}>
                    <h3 className={styles.projectTitle}>{project.name}</h3>
                    <div className={styles.projectMeta}>
                      <span className={styles.metaItem}><MapPin size={14} /> {project.location || 'Unknown'}</span>
                      <span className={styles.metaItem}><Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
