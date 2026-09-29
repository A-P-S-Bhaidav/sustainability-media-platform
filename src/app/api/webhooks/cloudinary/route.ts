import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-cld-signature");
    const timestamp = req.headers.get("x-cld-timestamp");
    const secret = process.env.CLOUDINARY_API_SECRET;

    if (!signature || !timestamp || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 401 });
    }

    // Cloudinary signature validation: SHA-1(body + timestamp + secret)
    const expectedSignature = crypto
      .createHash("sha1")
      .update(body + timestamp + secret)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);

    // If it's a notification about resource tags being added by AI
    if (data.notification_type === 'upload' || data.notification_type === 'resource_tags_changed') {
      
      const publicId = data.public_id;
      if (!publicId) return NextResponse.json({ success: true });

      const existingMedia = await prisma.media.findUnique({
        where: { publicId }
      });

      // Update if exists (e.g. AI tags came in late)
      if (existingMedia) {
        await prisma.media.update({
          where: { publicId },
          data: {
            aiTags: data.tags ? JSON.stringify(data.tags) : existingMedia.aiTags
          }
        });
      } else {
        // We received the webhook before the client saved it (or client died).
        // Since we don't have the userId or projectId natively in standard payload unless passed via context,
        // we extract it from context or folder structure.
        // Assuming context contains userId and projectId.
        const userId = data.context?.custom?.userId;
        const projectId = data.context?.custom?.projectId;

        if (userId) {
          await prisma.media.create({
            data: {
              publicId,
              url: data.secure_url,
              format: data.format,
              width: data.width,
              height: data.height,
              bytes: data.bytes,
              aiTags: JSON.stringify(data.tags || []),
              userId,
              projectId: projectId || null,
            }
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CLOUDINARY_WEBHOOK]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
