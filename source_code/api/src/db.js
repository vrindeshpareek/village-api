const { databaseUrl } = require("./config");

let prisma = null;

if (databaseUrl) {
  try {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
  } catch (error) {
    console.warn("Prisma client unavailable, falling back to mock data:", error.message);
  }
}

module.exports = { prisma, hasDatabase: Boolean(prisma) };
