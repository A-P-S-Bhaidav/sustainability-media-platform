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
