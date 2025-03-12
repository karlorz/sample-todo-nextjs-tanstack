import { PrismaClient } from '@prisma/client';

// Create a standard db client
function createPrismaClient() {
  const datasourceUrl = process.env.POSTGRES_URL;
  
  if (!datasourceUrl) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: datasourceUrl,
      },
    },
  });
}

// Ensure we reuse the client in development to prevent too many connections
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// In production, don't use global object
const prismaClient = 
  process.env.NODE_ENV === 'production'
    ? createPrismaClient()
    : global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export { prismaClient as prisma };
