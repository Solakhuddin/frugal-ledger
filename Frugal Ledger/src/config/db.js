
import { PrismaClient } from "@prisma/client";

// Inisialisasi Prisma Client
export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Matikan proses jika DB gagal connect di awal
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("Database disconnected");
};