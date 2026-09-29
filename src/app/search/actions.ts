'use server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function searchMedia(query: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  if (!query || query.trim() === '') {
    return [];
  }

  const formattedQuery = query.trim().split(/\s+/).join(' | ');

  const media = await prisma.media.findMany({
    where: {
      userId: session.user.id,
      aiTags: { search: formattedQuery }
    },
    include: {
      project: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return media;
}
