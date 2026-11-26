import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

/**
 * Generate a cryptographically robust idKey matching existing format
 * (e.g. 16-char random alphanumeric + timestamp + 16-char random alphanumeric)
 */
function generateIdKey() {
  const p1 = crypto.randomBytes(8).toString("hex");
  const ts = Math.floor(Date.now() / 1000);
  const p2 = crypto.randomBytes(10).toString("base64url").slice(0, 16);
  return `${p1}${ts}${p2}`;
}

/**
 * Verify admin session
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
 * GET /api/admin/content
 * Returns paginated content list, or single content entity with relations if ?id= is specified.
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
    const idParam = searchParams.get("id");

    // 1. Single content detail request
    if (idParam) {
      const targetId = Number(idParam);
      if (isNaN(targetId)) {
        return NextResponse.json({ success: false, message: "Invalid content ID." }, { status: 400 });
      }

      const item = await prisma.content.findUnique({
        where: { id: targetId },
      });

      if (!item) {
        return NextResponse.json({ success: false, message: "Content not found." }, { status: 404 });
      }

      const strId = String(item.id);

      // Fetch related records in parallel
      const [ytList, cdnList, catList, playbooks, resources] = await Promise.all([
        prisma.ytvideos.findMany({ where: { contentID: strId } }),
        prisma.cdnvideos.findMany({ where: { contentID: strId } }),
        prisma.contentcategory.findMany({ where: { contentID: strId } }),
        prisma.contentplaybooks.findMany({ where: { contentID: strId } }),
        prisma.contentresources.findMany({ where: { contentID: strId } }),
      ]);

      return NextResponse.json({
        success: true,
        content: {
          ...item,
          ytvideos: ytList,
          cdnvideos: cdnList,
          categories: catList,
          playbooks,
          resources,
        },
      });
    }

    // 2. Listing with filters & pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limitParam = searchParams.get("limit");
    const isAll = limitParam === "all";
    const limit = isAll ? 1000 : Math.max(1, parseInt(limitParam || "10", 10));
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
    const statusFilter = (searchParams.get("status") || "all").trim().toLowerCase();
    const oemFilter = (searchParams.get("oem") || "all").trim().toLowerCase();

    // Fetch all content items
    const allContents = await prisma.content.findMany({
      orderBy: { id: "desc" },
    });

    // Also fetch available OEMs and Categories for the form dropdowns
    const [availableOems, availableCategories] = await Promise.all([
      prisma.oem.findMany({
        orderBy: { oemName: "asc" },
        select: { id: true, oemName: true, logo: true },
      }),
      prisma.category.findMany({
        orderBy: { category: "asc" },
      }),
    ]);

    // Live statistics
    const totalCount = allContents.length;
    const publishedCount = allContents.filter((c) => c.contentStatus === "published").length;
    const draftCount = allContents.filter((c) => c.contentStatus === "draft").length;
    const privateCount = allContents.filter((c) => c.contentStatus === "private").length;
    const comingSoonCount = allContents.filter((c) => c.comingSoon === "Yes").length;

    // Apply filtering
    let filtered = allContents;

    if (search) {
      filtered = filtered.filter((c) => {
        const idMatch = String(c.id).includes(search);
        const headMatch = (c.head || "").toLowerCase().includes(search);
        const oemMatch = (c.oem || "").toLowerCase().includes(search);
        const detailsMatch = (c.headDetails || "").toLowerCase().includes(search);
        return idMatch || headMatch || oemMatch || detailsMatch;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => (c.contentStatus || "").toLowerCase() === statusFilter);
    }

    if (oemFilter !== "all") {
      filtered = filtered.filter((c) => (c.oem || "").toLowerCase() === oemFilter);
    }

    // Pagination slice
    const totalFiltered = filtered.length;
    const totalPages = isAll ? 1 : Math.ceil(totalFiltered / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = isAll ? filtered : filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      contents: paginated,
      pagination: {
        total: totalFiltered,
        totalUnfiltered: totalCount,
        page,
        limit,
        totalPages,
      },
      stats: {
        total: totalCount,
        published: publishedCount,
        draft: draftCount,
        private: privateCount,
        comingSoon: comingSoonCount,
      },
      availableOems,
      availableCategories,
    });
  } catch (error) {
    console.error("Admin Content GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query error: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Creates a new OEM content package with support for publish, draft, or private status.
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

    const body = await request.json();
    const {
      head = "",
      headDetails = "",
      oem = "",
      oemImage = "",
      overView = "",
      howToAccess = "",
      supportContent = "",
      accessSteps,
      accessCredentials,
      comingSoon = "No",
      contentStatus = "draft", // "published" | "draft" | "private"
      ytvideos = [],
      cdnvideos = [],
      categories = [],
      playbooks = [],
      resources = [],
    } = body;

    if (!head.trim()) {
      return NextResponse.json(
        { success: false, message: "Solution Heading is required." },
        { status: 400 }
      );
    }

    if (!oem.trim()) {
      return NextResponse.json(
        { success: false, message: "OEM selection is required." },
        { status: 400 }
      );
    }

    // Validate enum fields
    const validStatus = ["published", "draft", "private"].includes(contentStatus)
      ? contentStatus
      : "draft";
    const validComingSoon = comingSoon === "Yes" ? "Yes" : "No";

    // Auto-resolve OEM logo if not provided
    let resolvedOemImage = oemImage;
    if (!resolvedOemImage) {
      const matchOem = await prisma.oem.findFirst({
        where: { oemName: oem },
      });
      if (matchOem?.logo) {
        resolvedOemImage = matchOem.logo;
      }
    }

    const newIdKey = generateIdKey();

    // Serialize access steps and credentials as JSON strings if they are objects/arrays
    const serializedSteps = Array.isArray(accessSteps)
      ? JSON.stringify(accessSteps)
      : typeof accessSteps === "string"
      ? accessSteps
      : null;

    const serializedCredentials = Array.isArray(accessCredentials)
      ? JSON.stringify(accessCredentials)
      : typeof accessCredentials === "string"
      ? accessCredentials
      : null;

    // Create primary content record
    const created = await prisma.content.create({
      data: {
        idKey: newIdKey,
        oem: oem.trim(),
        oemImage: resolvedOemImage || "",
        head: head.trim(),
        headDetails: headDetails.trim(),
        overView: overView || "",
        howToAccess: howToAccess || "",
        supportContent: supportContent || "",
        accessSteps: serializedSteps,
        accessCredentials: serializedCredentials,
        comingSoon: validComingSoon,
        contentStatus: validStatus,
      },
    });

    const contentID = String(created.id);
    const contentIdKey = created.idKey;

    // Batch insert related sub-records
    const insertTasks = [];

    // YouTube videos
    if (Array.isArray(ytvideos) && ytvideos.length > 0) {
      for (const yt of ytvideos) {
        if (yt.ytCode?.trim()) {
          insertTasks.push(
            prisma.ytvideos.create({
              data: {
                contentID,
                contentIdKey,
                ytCode: yt.ytCode.trim(),
                ytType: yt.ytType || "single",
              },
            })
          );
        }
      }
    }

    // CDN videos
    if (Array.isArray(cdnvideos) && cdnvideos.length > 0) {
      for (const cdn of cdnvideos) {
        if (cdn.cdnUrl?.trim()) {
          insertTasks.push(
            prisma.cdnvideos.create({
              data: {
                contentID,
                contentIdKey,
                cdnUrl: cdn.cdnUrl.trim(),
                videoName: cdn.videoName || "",
                videoDescription: cdn.videoDescription || "",
              },
            })
          );
        }
      }
    }

    // Categories
    if (Array.isArray(categories) && categories.length > 0) {
      for (const cat of categories) {
        const catName = typeof cat === "string" ? cat : cat.category || "";
        const subCatName = typeof cat === "object" ? cat.subCategory || "" : "";
        if (catName.trim() || subCatName.trim()) {
          insertTasks.push(
            prisma.contentcategory.create({
              data: {
                contentID,
                contentIdKey,
                category: catName,
                subCategory: subCatName,
              },
            })
          );
        }
      }
    }

    // Playbooks
    if (Array.isArray(playbooks) && playbooks.length > 0) {
      for (const pb of playbooks) {
        const fileName = typeof pb === "string" ? pb : pb.fileName || "";
        if (fileName.trim()) {
          insertTasks.push(
            prisma.contentplaybooks.create({
              data: {
                contentID,
                contentIdKey,
                fileName: fileName.trim(),
              },
            })
          );
        }
      }
    }

    // Resources
    if (Array.isArray(resources) && resources.length > 0) {
      for (const res of resources) {
        const fileName = typeof res === "string" ? res : res.fileName || "";
        if (fileName.trim()) {
          insertTasks.push(
            prisma.contentresources.create({
              data: {
                contentID,
                contentIdKey,
                fileName: fileName.trim(),
              },
            })
          );
        }
      }
    }

    if (insertTasks.length > 0) {
      await Promise.all(insertTasks);
    }

    const statusLabels = {
      published: "Published Live",
      draft: "Saved as Draft",
      private: "Saved as Private",
    };

    return NextResponse.json(
      {
        success: true,
        message: `Content "${head}" ${statusLabels[validStatus] || validStatus} successfully.`,
        content: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin Content POST API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create content." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content
 * Updates an existing content item and synchronizes sub-records.
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

    const body = await request.json();
    const {
      id,
      head,
      headDetails,
      oem,
      oemImage,
      overView,
      howToAccess,
      supportContent,
      accessSteps,
      accessCredentials,
      comingSoon,
      contentStatus,
      ytvideos,
      cdnvideos,
      categories,
      playbooks,
      resources,
    } = body;

    const targetId = Number(id);
    if (!targetId || isNaN(targetId)) {
      return NextResponse.json({ success: false, message: "Valid content ID is required." }, { status: 400 });
    }

    const existing = await prisma.content.findUnique({
      where: { id: targetId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: `Content #${targetId} not found.` }, { status: 404 });
    }

    const contentID = String(existing.id);
    const contentIdKey = existing.idKey;

    // Prepare update data
    const updateData = {};
    if (head !== undefined) updateData.head = head.trim();
    if (headDetails !== undefined) updateData.headDetails = headDetails.trim();
    if (oem !== undefined) updateData.oem = oem.trim();
    if (oemImage !== undefined) updateData.oemImage = oemImage.trim();
    if (overView !== undefined) updateData.overView = overView;
    if (howToAccess !== undefined) updateData.howToAccess = howToAccess;
    if (supportContent !== undefined) updateData.supportContent = supportContent;
    if (comingSoon !== undefined) updateData.comingSoon = comingSoon === "Yes" ? "Yes" : "No";
    if (contentStatus !== undefined) {
      updateData.contentStatus = ["published", "draft", "private"].includes(contentStatus)
        ? contentStatus
        : existing.contentStatus;
    }

    if (accessSteps !== undefined) {
      updateData.accessSteps = Array.isArray(accessSteps)
        ? JSON.stringify(accessSteps)
        : typeof accessSteps === "string"
        ? accessSteps
        : null;
    }

    if (accessCredentials !== undefined) {
      updateData.accessCredentials = Array.isArray(accessCredentials)
        ? JSON.stringify(accessCredentials)
        : typeof accessCredentials === "string"
        ? accessCredentials
        : null;
    }

    // Update primary record
    const updated = await prisma.content.update({
      where: { id: targetId },
      data: updateData,
    });

    // Synchronize YouTube videos if passed
    if (Array.isArray(ytvideos)) {
      await prisma.ytvideos.deleteMany({ where: { contentID } });
      for (const yt of ytvideos) {
        if (yt.ytCode?.trim()) {
          await prisma.ytvideos.create({
            data: {
              contentID,
              contentIdKey,
              ytCode: yt.ytCode.trim(),
              ytType: yt.ytType || "single",
            },
          });
        }
      }
    }

    // Synchronize CDN videos if passed
    if (Array.isArray(cdnvideos)) {
      await prisma.cdnvideos.deleteMany({ where: { contentID } });
      for (const cdn of cdnvideos) {
        if (cdn.cdnUrl?.trim()) {
          await prisma.cdnvideos.create({
            data: {
              contentID,
              contentIdKey,
              cdnUrl: cdn.cdnUrl.trim(),
              videoName: cdn.videoName || "",
              videoDescription: cdn.videoDescription || "",
            },
          });
        }
      }
    }

    // Synchronize categories if passed
    if (Array.isArray(categories)) {
      await prisma.contentcategory.deleteMany({ where: { contentID } });
      for (const cat of categories) {
        const catName = typeof cat === "string" ? cat : cat.category || "";
        const subCatName = typeof cat === "object" ? cat.subCategory || "" : "";
        if (catName.trim() || subCatName.trim()) {
          await prisma.contentcategory.create({
            data: {
              contentID,
              contentIdKey,
              category: catName,
              subCategory: subCatName,
            },
          });
        }
      }
    }

    // Synchronize playbooks if passed
    if (Array.isArray(playbooks)) {
      await prisma.contentplaybooks.deleteMany({ where: { contentID } });
      for (const pb of playbooks) {
        const fileName = typeof pb === "string" ? pb : pb.fileName || "";
        if (fileName.trim()) {
          await prisma.contentplaybooks.create({
            data: {
              contentID,
              contentIdKey,
              fileName: fileName.trim(),
            },
          });
        }
      }
    }

    // Synchronize resources if passed
    if (Array.isArray(resources)) {
      await prisma.contentresources.deleteMany({ where: { contentID } });
      for (const res of resources) {
        const fileName = typeof res === "string" ? res : res.fileName || "";
        if (fileName.trim()) {
          await prisma.contentresources.create({
            data: {
              contentID,
              contentIdKey,
              fileName: fileName.trim(),
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Content #${targetId} updated successfully.`,
      content: updated,
    });
  } catch (error) {
    console.error("Admin Content PUT API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update content." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content
 * Supports single (?id=123 or { id: 123 }) and batch deletion ({ ids: [...] })
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
        { success: false, message: "Valid content ID or list of IDs is required." },
        { status: 400 }
      );
    }

    const strIds = targetIds.map(String);

    // Clean up all related sub-tables
    await Promise.all([
      prisma.ytvideos.deleteMany({ where: { contentID: { in: strIds } } }),
      prisma.cdnvideos.deleteMany({ where: { contentID: { in: strIds } } }),
      prisma.contentcategory.deleteMany({ where: { contentID: { in: strIds } } }),
      prisma.contentplaybooks.deleteMany({ where: { contentID: { in: strIds } } }),
      prisma.contentresources.deleteMany({ where: { contentID: { in: strIds } } }),
    ]);

    // Delete primary records from content table
    const result = await prisma.content.deleteMany({
      where: { id: { in: targetIds } },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} content item(s) permanently removed.`,
    });
  } catch (error) {
    console.error("Admin Content DELETE API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete content." },
      { status: 500 }
    );
  }
}
