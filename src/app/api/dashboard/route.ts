import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    return NextResponse.json({
      totalProjects,
      totalMedia,
      projects,
      estimatedTags
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
