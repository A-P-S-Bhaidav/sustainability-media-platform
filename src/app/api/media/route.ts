import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Ensure user is authenticated
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Save media to Prisma
    const media = await prisma.media.create({
      data: {
        publicId: body.public_id,
        url: body.secure_url,
        format: body.format,
        width: body.width,
        height: body.height,
        bytes: body.bytes,
        projectId: body.projectId || null, // Optional if we link to project
        userId: session.user.id,
      }
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("[MEDIA_POST]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
