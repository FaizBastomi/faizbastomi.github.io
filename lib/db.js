import { PrismaClient } from '@prisma/client';

// Keeps one client across dev hot-reloads instead of leaking a connection per reload.
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
