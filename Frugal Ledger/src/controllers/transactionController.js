import { prisma } from '../config/db.js';
import { createTransactionSchema } from '../validators/transactionValidators.js';

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    // 1. Validasi Input Body (Multipart data)
    const validation = createTransactionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { amount, description, categoryId, date } = validation.data;

    // 2. Cek apakah ada file gambar yang diupload
    // req.file disediakan oleh multer
    let imageUrl = null;
    if (req.file) {
      // Kita simpan path relatifnya agar mudah diakses di frontend
      // Contoh: 'uploads/struk-123456.jpg'
      imageUrl = `uploads/${req.file.filename}`;
    }

    // 3. Pastikan Kategori milik user (Security check)
    const categoryExists = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id }
    });

    if (!categoryExists) {
      return res.status(400).json({ message: 'Kategori tidak valid atau bukan milik Anda' });
    }

    // 4. Simpan ke Database
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user.id,
        amount,
        description,
        categoryId,
        imageUrl,
        date: date || undefined, // Gunakan default DB jika undefined
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        date: 'desc', // Urutkan dari yang terbaru
      },
      include: {
        category: {
          select: { name: true, type: true } // Ambil nama & tipe kategori
        }
      }
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek kepemilikan
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Hapus data (File gambar dibiarkan saja dulu biar aman/simpel)
    await prisma.transaction.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get Transaction Detail (Optional, buat detail view)
// @route   GET /api/transactions/:id
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findFirst({
      where: { id: parseInt(id), userId: req.user.id },
      include: { category: true }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};