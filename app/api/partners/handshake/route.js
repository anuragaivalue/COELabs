import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { partnerHandshakeSchema } from "@/lib/validations/partner";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = partnerHandshakeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid handshake request parameters.",
          errors: result.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { partnerId, handshakeKey } = result.data;

    const handshake = await prisma.partnerHandshake.findFirst({
      where: {
        partnerId,
        handshakeKey
      },
      include: {
        partner: true
      }
    });

    if (!handshake) {
      return NextResponse.json(
        {
          success: false,
          message: "Handshake verification failed: No matching partner record found with provided credentials."
        },
        { status: 404 }
      );
    }

    if (handshake.verifiedAt) {
      return NextResponse.json(
        {
          success: true,
          verified: true,
          alreadyVerified: true,
          verifiedAt: handshake.verifiedAt,
          partnerId,
          companyName: handshake.partner?.companyName,
          partnerTier: handshake.partner?.partnerTier,
          message: "Security handshake was previously verified and remains active."
        },
        { status: 200 }
      );
    }

    const now = new Date();
    await prisma.$transaction([
      prisma.partnerHandshake.update({
        where: { id: handshake.id },
        data: { verifiedAt: now }
      }),
      prisma.partnerApplication.update({
        where: { id: partnerId },
        data: { status: "verified" }
      })
    ]);

    return NextResponse.json(
      {
        success: true,
        verified: true,
        partnerId,
        verifiedAt: now,
        companyName: handshake.partner?.companyName,
        partnerTier: handshake.partner?.partnerTier,
        message: "Partner security handshake verified successfully."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying partner handshake:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred during handshake verification."
      },
      { status: 500 }
    );
  }
}
