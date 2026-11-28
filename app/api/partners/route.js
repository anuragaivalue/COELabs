import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { partnerApplicationSchema } from "@/lib/validations/partner";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = partnerApplicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please correct the highlighted errors.",
          errors: result.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { companyName, partnerTier, contactName, workEmail, phone, region } = result.data;

    // Generate a secure, deterministic verification handshake key
    const rawKey = crypto.randomBytes(12).toString("hex").toUpperCase();
    const handshakeKey = `IV-COE-${rawKey.slice(0, 4)}-${rawKey.slice(4, 8)}-${rawKey.slice(8, 12)}`;

    // Create partner application and associated handshake record in a single operation
    const application = await prisma.partnerApplication.create({
      data: {
        companyName,
        partnerTier: partnerTier || "standard",
        contactName,
        workEmail,
        phone: phone || null,
        region: region || null,
        status: "pending",
        handshakes: {
          create: {
            handshakeKey
          }
        }
      },
      include: {
        handshakes: true
      }
    });

    return NextResponse.json(
      {
        success: true,
        id: application.id,
        handshakeKey,
        partnerTier: application.partnerTier,
        message: "Partner registration application submitted successfully. Keep your handshake verification key secure."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating partner application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred while registering the partner. Please try again later."
      },
      { status: 500 }
    );
  }
}
