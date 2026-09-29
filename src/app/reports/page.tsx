import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Activity, Camera, Layers, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/');

  const userId = session.user.id;

  const [totalProjects, totalMedia, beforeAfterMedia] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.media.count({ where: { userId } }),
    prisma.media.count({ where: { userId, isBeforeAfter: true } })
  ]);

  const standardMedia = totalMedia - beforeAfterMedia;

  const standardPct = totalMedia > 0 ? Math.round((standardMedia / totalMedia) * 100) : 0;
  const baPct = totalMedia > 0 ? Math.round((beforeAfterMedia / totalMedia) * 100) : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Impact Reports</h1>
        <p className={styles.subtitle}>
          Analyze conservation progress, media upload trends, and AI tagging efficiency.
        </p>
      </header>

      <section className={styles.metricsGrid}>
        <div className={`glass-panel ${styles.metricCard}`}>
          <div className={styles.metricHeader}>
            <Activity size={20} color="var(--color-accent-teal)" />
            Active Projects
          </div>
          <div className={styles.metricValue}>{totalProjects}</div>
        </div>
        <div className={`glass-panel ${styles.metricCard}`}>
          <div className={styles.metricHeader}>
            <Camera size={20} color="var(--color-accent-blue)" />
            Total Captures
          </div>
          <div className={styles.metricValue}>{totalMedia}</div>
        </div>
        <div className={`glass-panel ${styles.metricCard}`}>
          <div className={styles.metricHeader}>
            <Layers size={20} color="var(--color-accent-teal)" />
            Before/After Pairs
          </div>
          <div className={styles.metricValue}>{beforeAfterMedia > 0 ? beforeAfterMedia / 2 : 0}</div>
        </div>
      </section>

      <section className={styles.chartSection}>
        <div className={styles.metricHeader}>
          <TrendingUp size={20} color="var(--color-text-primary)" />
          <h2 className={styles.chartTitle}>Media Composition</h2>
        </div>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Standard Field Captures</span>
              <span>{standardPct}% ({standardMedia} assets)</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${standardPct}%` }}
              />
            </div>
          </div>

          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Before & After Impact Validations</span>
              <span>{baPct}% ({beforeAfterMedia} assets)</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${baPct}%`, background: 'linear-gradient(90deg, var(--color-accent-blue) 0%, #a0aebc 100%)' }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
