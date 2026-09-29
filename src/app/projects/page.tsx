import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardClient from '../dashboard/DashboardClient';

// For now, re-use the DashboardClient but pass all projects to avoid a 404.
// In the future, this can be expanded with pagination or a specific projects view.
export default async function ProjectsPage() {
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
      include: {
        media: {
          take: 1
        }
      }
    })
  ]);

  const mediaWithTags = await prisma.media.count({
    where: { userId: session.user.id, aiTags: { not: null } }
  });
  const estimatedTags = mediaWithTags * 4;

  return (
    <DashboardClient 
      totalProjects={totalProjects}
      totalMedia={totalMedia}
      estimatedTags={estimatedTags}
      projects={projects}
    />
  );
}
