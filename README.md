# Frugal Ledger 💰

Frugal Ledger is a full-stack personal finance application designed to help users track their income and expenses with intentionality. Inspired by the "frugal living" philosophy, this app allows users to categorize transactions, upload receipt proofs, and visualize their financial health through an intuitive dashboard.

![Dashboard Screenshot](./screenshots/dashboard-preview.png)
*(Note: Place your screenshot here)*

## 🚀 Features

- **User Authentication:** Secure Registration and Login using JWT (JSON Web Tokens).
- **Transaction Tracking:** Record income and expenses with detailed descriptions.
- **Receipt Upload:** Upload transaction proofs (images) using local storage handling.
- **Category Management:** Create custom categories for better financial organization.
- **Visual Dashboard:** Real-time summary with Doughnut charts and balance calculation.
- **Responsive UI:** Built with React & Bootstrap for a clean experience on any device.

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (v5.0)
- **Database:** PostgreSQL
- **ORM:** Prisma (v6.0)
- **Validation:** Zod
- **File Handling:** Multer
- **Security:** Bcryptjs, JWT, CORS

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Bootstrap 5 & React-Bootstrap
- **HTTP Client:** Axios
- **Visualization:** Chart.js & React-Chartjs-2

## 📂 Project Structure

```bash
frugal-ledger/
├── prisma/              # Database schema & migrations
├── public/uploads/      # Stored receipt images
├── src/                 # Backend source code
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth & Upload middleware
│   ├── routes/          # API endpoints
│   └── utils/           # Helper functions
├── frontend/            # React Frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
└── ...
