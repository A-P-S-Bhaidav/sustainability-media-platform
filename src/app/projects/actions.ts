'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;

  if (!name) throw new Error('Name is required');

  const project = await prisma.project.create({
    data: {
      name,
      description,
      location,
      userId: session.user.id,
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/projects');
  redirect(`/projects/${project.id}`);
}

export async function saveBeforeAfterPair(projectId: string, beforeMediaData: any, afterMediaData: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Create Before Media
  const beforeMedia = await prisma.media.create({
    data: {
      publicId: beforeMediaData.public_id,
      url: beforeMediaData.secure_url,
      format: beforeMediaData.format,
      width: beforeMediaData.width,
      height: beforeMediaData.height,
      bytes: beforeMediaData.bytes,
      projectId,
      userId: session.user.id,
      isBeforeAfter: true,
      aiTags: JSON.stringify(beforeMediaData.tags || []),
    }
  });

  // Create After Media and Link to Before
  const afterMedia = await prisma.media.create({
    data: {
      publicId: afterMediaData.public_id,
      url: afterMediaData.secure_url,
      format: afterMediaData.format,
      width: afterMediaData.width,
      height: afterMediaData.height,
      bytes: afterMediaData.bytes,
      projectId,
      userId: session.user.id,
      isBeforeAfter: true,
      pairedMediaId: beforeMedia.id,
      aiTags: JSON.stringify(afterMediaData.tags || []),
    }
  });

  // Update Before Media to link to After
  await prisma.media.update({
    where: { id: beforeMedia.id },
    data: { pairedMediaId: afterMedia.id }
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/reports');
  redirect(`/projects/${projectId}`);
}
