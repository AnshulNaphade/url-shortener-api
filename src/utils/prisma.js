const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:password@localhost:5432/urlshortener?schema=public"
    }
  }
});

module.exports = prisma;