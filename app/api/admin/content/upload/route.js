import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uploadFileToGCS } from "@/lib/gcs";

/**
 * Verify admin privileges
 */
async function verifyAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { authorized: false, status: 401, message: "Unauthorized: Please sign in." };
  }
  const role = session.user.userType || session.user.role;
  if (role !== "admin") {
    return { authorized: false, status: 403, message: "Forbidden: Admin privileges required." };
  }
  return { authorized: true, session };
}

/**
 * POST /api/admin/content/upload
 * Uploads a document (playbook, resource, step image, video) to Google Cloud Storage
 */
export async function POST(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") || "public").toString().trim();

    if (!file || typeof file !== "object" || file.size === 0) {
      return NextResponse.json(
        { success: false, message: "No valid file uploaded." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFileToGCS(
      buffer,
      file.name,
      folder,
      file.type || "application/octet-stream"
    );

    return NextResponse.json({
      success: true,
      filename: result.filename,
      fullGcsPath: result.fullGcsPath,
      publicUrl: result.publicUrl,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error("Content upload API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file to Cloud Storage." },
      { status: 500 }
    );
  }
}
