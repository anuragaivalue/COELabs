import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactInquirySchema } from "@/lib/validations/contact";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = contactInquirySchema.safeParse(body);

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

    const { fullName, workEmail, company, title, interestArea, message } = result.data;

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName,
        workEmail,
        company,
        title: title || null,
        interestArea: interestArea || null,
        message,
        status: "pending"
      }
    });

    return NextResponse.json(
      {
        success: true,
        id: inquiry.id,
        message: "Your contact inquiry has been received. Our solutions team will review and respond within 1 business day."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contact inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred while processing your request. Please try again later."
      },
      { status: 500 }
    );
  }
}
