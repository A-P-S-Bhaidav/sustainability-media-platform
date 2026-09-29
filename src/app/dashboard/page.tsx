import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
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

  const mediaWithTags = await prisma.media.count({
    where: { userId: session.user.id, aiTags: { not: null } }
  });
  const estimatedTags = mediaWithTags * 4;

  return (
    <>
      <DashboardClient 
        totalProjects={totalProjects}
        totalMedia={totalMedia}
        estimatedTags={estimatedTags}
        projects={projects}
      />
      <OnboardingTutorial />
    </>
  );
}
