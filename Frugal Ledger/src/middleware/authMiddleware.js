import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Cek apakah ada header Authorization dengan format "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Ambil tokennya saja (hilangkan kata "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifikasi Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Cari user di DB (tanpa password) & simpan di req.user
      // Ini penting agar di controller nanti kita bisa pakai req.user.id
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true }, // Select field yg perlu saja
      });

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Lanjut ke controller berikutnya
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};