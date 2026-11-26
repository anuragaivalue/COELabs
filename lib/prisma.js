import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

/**
 * Global singleton PrismaClient instance to avoid exhausting connection pools
 * in Next.js development hot-reloading.
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
