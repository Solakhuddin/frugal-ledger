// src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from "./config/db.js"; 
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Konfigurasi __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files (gambar upload)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API Routes akuh
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Frugal Ledger API is running...');
});


// --- Start Server (Ditampung ke variabel server) ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// --- KODE ERROR HANDLING & SHUTDOWN ---

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // Tutup server dulu, baru database
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown (misal: Ctrl+C)
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  }
});