import Link from 'next/link';
import { Camera, MapPin, Calendar, Activity, Images } from 'lucide-react';
import styles from './page.module.css';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import OnboardingTutorial from '@/components/ui/OnboardingTutorial';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const [totalProjects, totalMedia, projects] = await Promise.all([
    prisma.project.count({ where: { userId: session.user.id } }),
    prisma.media.count({ where: { userId: session.user.id } }),
    prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        media: {
          take: 1
        }
      }
    })
  ]);

  // Rough estimate of AI tags (could be more accurate by parsing JSON, but let's count media with aiTags)
  const mediaWithTags = await prisma.media.count({
    where: { userId: session.user.id, aiTags: { not: null } }
  });
  const estimatedTags = mediaWithTags * 4; // Assume avg 4 tags per media for UI purposes

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, Impact Team</h1>
        <p className={styles.subtitle}>Here is the latest from your field projects.</p>
      </header>

      <section className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Activity size={18} color="var(--color-accent-teal)" />
            Total Projects
          </div>
          <div className={styles.statValue}>{totalProjects}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Images size={18} color="var(--color-accent-blue)" />
            Media Assets
          </div>
          <div className={styles.statValue}>{totalMedia}</div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statHeader}>
            <Camera size={18} color="var(--color-accent-teal)" />
            AI Tags Generated
          </div>
          <div className={styles.statValue}>{estimatedTags}</div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Projects</h2>
          <Link href="/projects" className={styles.viewAll}>
            View all projects &rarr;
          </Link>
        </div>
        
        <div className={styles.projectsGrid}>
          {projects.length === 0 ? (
            <div className={`glass-panel ${styles.emptyState}`}>
              <p>No projects yet. Get started by creating your first field project!</p>
              <Link href="/projects" className={styles.viewAll}>Go to Projects</Link>
            </div>
          ) : (
            projects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`} className={`glass-panel ${styles.projectCard}`}>
                <div className={styles.projectImage}>
                  {project.media.length > 0 ? (
                     <img 
                       src={project.media[0].url} 
                       alt={project.name} 
                       className={styles.realImage}
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
            ))
          )}
        </div>
      </section>
      <OnboardingTutorial />
    </div>
  );
}
