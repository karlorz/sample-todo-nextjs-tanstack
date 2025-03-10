import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';

// Check if we're running in an Edge environment
const isEdgeRuntime = () => {
  return (
    process.env.EDGE_RUNTIME === '1' || 
    process.env.NEXT_RUNTIME === 'edge' || 
    process.env.VERCEL_REGION === 'dev1'
  );
};

// Create a standard db client or an adapter-based one for Edge
function createPrismaClient() {
  if (isEdgeRuntime()) {
    // For Edge Runtime, use the LibSQL adapter
    const connectionString = process.env.DATABASE_URL || 'file:./dev.db';
    const authToken = process.env.DATABASE_AUTH_TOKEN;
    
    // Create the LibSQL client
    const libsql = createClient({ 
      url: connectionString,
      authToken: authToken
    });
    
    // Create the adapter
    const adapter = new PrismaLibSQL(libsql);
    
    // Return a PrismaClient that uses the adapter
    return new PrismaClient({ adapter });
  } else {
    // For regular Node.js environment, use the standard PrismaClient
    return new PrismaClient();
  }
}

// Ensure we reuse the client in development to prevent too many connections
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
