import { MapPin, Calendar, Users, Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BeforeAfter from "@/components/ui/BeforeAfter";
import ProjectActions from "./ProjectActions";
import styles from "./page.module.css";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/');
  }

  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      media: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!project) {
    notFound();
  }

  // Find a before/after pair if any exists
  const beforeAfterPair = project.media.find(m => m.isBeforeAfter && m.pairedMediaId);
  const afterMedia = beforeAfterPair ? project.media.find(m => m.id === beforeAfterPair.pairedMediaId) : null;

  return (
    <div className={styles.container}>
      <Link href="/projects" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>
      
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>{project.name}</h1>
          <span className={styles.statusBadge}>Active</span>
        </div>
        <p className={styles.description}>{project.description || 'No description provided.'}</p>
        
        <div className={styles.metaInfo}>
          <span className={styles.metaItem}><MapPin size={16} /> {project.location || 'Unknown'}</span>
          <span className={styles.metaItem}><Calendar size={16} /> {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        
        <ProjectActions projectId={project.id} />
      </header>

      {beforeAfterPair && afterMedia && (
        <section className={styles.section} style={{ pageBreakInside: 'avoid' }}>
          <h2 className={styles.sectionTitle}>Impact Visualization: Before & After</h2>
          <div className={styles.beforeAfterWrapper}>
            <BeforeAfter 
              beforeImage={beforeAfterPair.url} 
              afterImage={afterMedia.url} 
            />
          </div>
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Media Assets Timeline</h2>
        <div className={styles.timeline}>
          {project.media.length === 0 ? (
            <p className={styles.emptyState}>No media uploaded for this project yet.</p>
          ) : (
            project.media.map(media => (
              <div key={media.id} className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <h3>Media Uploaded</h3>
                    <span>{new Date(media.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.timelineMedia}>
                    <Image 
                      src={media.url} 
                      alt="Project Media" 
                      width={800}
                      height={600}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '1rem' }} 
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
