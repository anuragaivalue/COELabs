import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadOemLogoToGCS, resolveOemLogoUrl } from "@/lib/gcs";

/**
 * Verify if the requesting session belongs to an authenticated Admin
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
 * GET /api/admin/oems
 * Supports pagination, search, sorting, and live stats calculation
 */
export async function GET(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limitParam = searchParams.get("limit");
    const isAll = limitParam === "all";
    const limit = isAll ? 1000 : Math.max(1, parseInt(limitParam || "10", 10));
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();

    // Fetch all OEMs ordered by id descending
    const allOems = await prisma.oem.findMany({
      orderBy: { id: "desc" },
    });

    // Compute live stats
    const totalCount = allOems.length;
    const withLogoCount = allOems.filter((o) => Boolean(o.logo && o.logo.trim())).length;

    // Filter in-memory
    let filteredOems = allOems;
    if (search) {
      filteredOems = filteredOems.filter((o) => {
        const idMatch = String(o.id).includes(search);
        const nameMatch = (o.oemName || "").toLowerCase().includes(search);
        const logoMatch = (o.logo || "").toLowerCase().includes(search);
        return idMatch || nameMatch || logoMatch;
      });
    }

    // Pagination slice
    const totalFiltered = filteredOems.length;
    const totalPages = isAll ? 1 : Math.ceil(totalFiltered / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedOems = isAll ? filteredOems : filteredOems.slice(offset, offset + limit);

    // Attach resolved full logo URL for easy rendering in client
    const oemsWithUrls = paginatedOems.map((oem) => ({
      ...oem,
      resolvedLogoUrl: resolveOemLogoUrl(oem.logo),
    }));

    return NextResponse.json({
      success: true,
      oems: oemsWithUrls,
      pagination: {
        total: totalFiltered,
        totalUnfiltered: totalCount,
        page,
        limit,
        totalPages,
      },
      stats: {
        total: totalCount,
        withLogo: withLogoCount,
        withoutLogo: totalCount - withLogoCount,
      },
      cdnBaseUrl:
        process.env.NEXT_PUBLIC_GCP_STORAGE_BASE_URL ||
        "https://storage.googleapis.com/cdn.ivaluetv.com/oem",
    });
  } catch (error) {
    console.error("Admin OEMs GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/oems
 * Creates a new OEM. Supports multipart/form-data with file upload to GCP Bucket
 * and application/json with direct logo filename.
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

    let oemName = "";
    let logoFilename = "";
    let uploadResult = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      oemName = (formData.get("oemName") || "").toString().trim();
      const existingLogo = (formData.get("logo") || "").toString().trim();
      const logoFile = formData.get("logoFile");

      if (logoFile && typeof logoFile === "object" && logoFile.size > 0) {
        const arrayBuffer = await logoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        uploadResult = await uploadOemLogoToGCS(
          buffer,
          logoFile.name,
          logoFile.type || "image/png"
        );
        logoFilename = uploadResult.filename;
      } else if (existingLogo) {
        logoFilename = existingLogo;
      }
    } else {
      const body = await request.json();
      oemName = (body.oemName || "").trim();
      logoFilename = (body.logo || "").trim();
    }

    if (!oemName) {
      return NextResponse.json(
        { success: false, message: "OEM Name is a mandatory field." },
        { status: 400 }
      );
    }

    // Default logo filename if not provided
    if (!logoFilename) {
      logoFilename = `${oemName.toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
    }

    // Insert into MySQL oem table
    const createdOem = await prisma.oem.create({
      data: {
        oemName,
        logo: logoFilename,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `OEM "${oemName}" created successfully.`,
        oem: {
          ...createdOem,
          resolvedLogoUrl: resolveOemLogoUrl(createdOem.logo),
        },
        storage: uploadResult?.storage || "manual",
        warning: uploadResult?.warning,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin OEMs POST API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create OEM." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/oems
 * Updates an existing OEM. Supports file replacement to GCP Bucket.
 */
export async function PUT(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    let id = null;
    let oemName = "";
    let logoFilename = "";
    let hasNewFile = false;
    let uploadResult = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = Number(formData.get("id"));
      oemName = (formData.get("oemName") || "").toString().trim();
      const existingLogo = (formData.get("logo") || "").toString().trim();
      const logoFile = formData.get("logoFile");

      if (logoFile && typeof logoFile === "object" && logoFile.size > 0) {
        hasNewFile = true;
        const arrayBuffer = await logoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        uploadResult = await uploadOemLogoToGCS(
          buffer,
          logoFile.name,
          logoFile.type || "image/png"
        );
        logoFilename = uploadResult.filename;
      } else if (existingLogo) {
        logoFilename = existingLogo;
      }
    } else {
      const body = await request.json();
      id = Number(body.id);
      oemName = (body.oemName || "").trim();
      logoFilename = (body.logo || "").trim();
    }

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid OEM ID is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.oem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: `OEM with ID #${id} not found.` },
        { status: 404 }
      );
    }

    const updateData = {
      oemName: oemName || existing.oemName,
    };

    if (hasNewFile || logoFilename) {
      updateData.logo = logoFilename || existing.logo;
    }

    const updatedOem = await prisma.oem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `OEM #${id} (${updatedOem.oemName}) updated successfully.`,
      oem: {
        ...updatedOem,
        resolvedLogoUrl: resolveOemLogoUrl(updatedOem.logo),
      },
      storage: uploadResult?.storage,
      warning: uploadResult?.warning,
    });
  } catch (error) {
    console.error("Admin OEMs PUT API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update OEM." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/oems
 * Supports single deletion (?id=123 or { id: 123 }) and multi-select batch deletion ({ ids: [...] })
 */
export async function DELETE(request) {
  try {
    const authCheck = await verifyAdminSession();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: authCheck.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    let targetIds = [];

    if (idParam) {
      const parsed = Number(idParam);
      if (!isNaN(parsed) && parsed > 0) targetIds.push(parsed);
    }

    try {
      const body = await request.json();
      if (Array.isArray(body?.ids)) {
        for (const rawId of body.ids) {
          const num = Number(rawId);
          if (!isNaN(num) && num > 0 && !targetIds.includes(num)) {
            targetIds.push(num);
          }
        }
      } else if (body?.id) {
        const singleId = Number(body.id);
        if (!isNaN(singleId) && singleId > 0 && !targetIds.includes(singleId)) {
          targetIds.push(singleId);
        }
      }
    } catch {
      // Body may be empty if query params were used
    }

    if (targetIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Valid OEM ID or list of IDs is required for deletion." },
        { status: 400 }
      );
    }

    // Delete matching OEMs from MySQL database
    const deleteResult = await prisma.oem.deleteMany({
      where: { id: { in: targetIds } },
    });

    return NextResponse.json({
      success: true,
      count: deleteResult.count,
      message: `${deleteResult.count} OEM partner(s) permanently removed from database.`,
    });
  } catch (error) {
    console.error("Admin OEMs DELETE API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete OEM(s): " + error.message },
      { status: 500 }
    );
  }
}
