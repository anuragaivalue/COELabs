import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/user/products
 * Retrieves published OEM products for standard authenticated users.
 * Supports:
 *  - ?id=123 (full details with relations)
 *  - ?limit=5 (e.g. for dashboard featured products preview)
 *  - ?search=keyword
 *  - ?oem=Akamai
 *  - ?page=1
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    // 1. Single product detail request
    if (idParam) {
      const targetId = Number(idParam);
      if (isNaN(targetId)) {
        return NextResponse.json(
          { success: false, message: "Invalid product ID." },
          { status: 400 }
        );
      }

      const item = await prisma.content.findUnique({
        where: { id: targetId },
      });

      if (!item) {
        return NextResponse.json(
          { success: false, message: "Product solution not found." },
          { status: 404 }
        );
      }

      const strId = String(item.id);

      // Fetch related collaterals in parallel
      const [ytList, cdnList, catList, playbooks, resources, publicfiles] = await Promise.all([
        prisma.ytvideos.findMany({ where: { contentID: strId } }),
        prisma.cdnvideos.findMany({ where: { contentID: strId } }),
        prisma.contentcategory.findMany({ where: { contentID: strId } }),
        prisma.contentplaybooks.findMany({ where: { contentID: strId } }),
        prisma.contentresources.findMany({ where: { contentID: strId } }),
        prisma.publicfile.findMany({ where: { contentID: strId } }),
      ]);

      return NextResponse.json({
        success: true,
        product: {
          ...item,
          ytvideos: ytList,
          cdnvideos: cdnList,
          categories: catList,
          playbooks,
          resources,
          publicfiles,
        },
      });
    }

    // 2. Filtered list request
    const search = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
    const oemFilter = (searchParams.get("oem") || "all").trim().toLowerCase();
    const limitParam = searchParams.get("limit");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const isAll = limitParam === "all";
    const limit = isAll ? 1000 : Math.max(1, parseInt(limitParam || "10", 10));

    // Fetch published products (and products ready for user exploration)
    const allProducts = await prisma.content.findMany({
      where: {
        contentStatus: "published",
      },
      orderBy: { id: "desc" },
    });

    // Also fetch available OEMs for filter dropdown
    const availableOems = await prisma.oem.findMany({
      orderBy: { oemName: "asc" },
      select: { id: true, oemName: true, logo: true },
    });

    // Filter by search and oem
    let filtered = allProducts;

    if (search) {
      filtered = filtered.filter((p) => {
        const idMatch = String(p.id).includes(search);
        const headMatch = (p.head || "").toLowerCase().includes(search);
        const oemMatch = (p.oem || "").toLowerCase().includes(search);
        const detailsMatch = (p.headDetails || "").toLowerCase().includes(search);
        return idMatch || headMatch || oemMatch || detailsMatch;
      });
    }

    if (oemFilter !== "all") {
      filtered = filtered.filter((p) => (p.oem || "").toLowerCase() === oemFilter);
    }

    const totalFiltered = filtered.length;
    const totalPages = isAll ? 1 : Math.ceil(totalFiltered / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = isAll ? filtered : filtered.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      products: paginated,
      pagination: {
        total: totalFiltered,
        totalUnfiltered: allProducts.length,
        page,
        limit,
        totalPages,
      },
      availableOems,
    });
  } catch (error) {
    console.error("User Products API Error:", error);
    return NextResponse.json(
      { success: false, message: "Database error: " + error.message },
      { status: 500 }
    );
  }
}
