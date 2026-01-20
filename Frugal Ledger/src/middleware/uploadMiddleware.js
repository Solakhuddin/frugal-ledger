import multer from 'multer';
import path from 'path';

// 1. Konfigurasi Penyimpanan (Storage)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Simpan di folder public/uploads
    cb(null, 'public/uploads/');
  },
  filename(req, file, cb) {
    // Format nama: fieldname-timestamp.extensi
    // Contoh: struk-1709882233.jpg
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. Filter File (Hanya Gambar)
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  // Cek ekstensi
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  // Cek mime type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png)'));
  }
};

// 3. Inisialisasi Multer
export const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB (Opsional)
});