import { prisma } from '../config/db.js';
import { createCategorySchema } from '../validators/categoryValidators.js';

// @desc    Get all categories for logged in user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: req.user.id, // Filter user dari middleware protect
      },
      orderBy: {
        id: 'desc', // Yang baru dibuat ada di atas
      },
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    // 1. Validasi Input
    const validation = createCategorySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const { name, type } = validation.data;

    // 2. Cek apakah kategori dengan nama sama sudah ada (case sensitive biasanya)
    // Kita gunakan findFirst karena constraint unique kita majemuk [name, userId]
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: req.user.id,
      },
    });

    if (existingCategory) {
      return res.status(400).json({ message: `Kategori '${name}' sudah ada` });
    }

    // 3. Buat Kategori
    const category = await prisma.category.create({
      data: {
        name,
        type,
        userId: req.user.id,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Cek dulu apakah kategori ini ada dan MILIK user yang login
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found or access denied' });
    }

    // 2. Hapus
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Category removed' });
  } catch (error) {
    // Error handling khusus jika kategori sudah dipakai di transaksi (Foreign Key Constraint)
    if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Tidak bisa menghapus kategori yang sudah memiliki transaksi' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};