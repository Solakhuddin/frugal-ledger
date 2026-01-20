import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.coerce.number().min(1, "Jumlah harus lebih dari 0"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  categoryId: z.coerce.number().int("Kategori tidak valid"),
  date: z.coerce.date().optional(), // Jika kosong, pakai default now()
});