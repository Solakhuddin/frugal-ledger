# Frugal Ledger 💰

Frugal Ledger is a full-stack personal finance application designed to help users track their income and expenses with intentionality. Inspired by the "frugal living" philosophy, this app allows users to categorize transactions, upload receipt proofs, and visualize their financial health through an intuitive dashboard.

![Dashboard Screenshot](./Dashboard.png)

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
```
=========================================================
⚙️ Installation & Setup
Follow these steps to run the project locally.

1. Prerequisites
Node.js installed

PostgreSQL installed and running

2. Backend Setup
Navigate to the root directory:

```Bash

# Install dependencies
npm install

# Create .env file
cp .env.example .env
Configure your .env file:

Cuplikan kode

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/frugal_ledger_db?schema=public"
JWT_SECRET="your_super_secret_key"
PORT=5000
Run Database Migration:
```
```Bash

npx prisma migrate dev --name init
Start the Server:
```
```Bash

npm run dev
3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```
```Bash

cd frontend
```
# Install dependencies
```
npm install
````
# Start React app
````
npm run dev
````
Access the application at http://localhost:5173.

============================================================================
🔌 API Endpoints
Method,    Endpoint,              Description
POST,      /api/auth/register,    Register a new user
POST,      /api/auth/login,       Login user & get Token
GET,       /api/categories,       Get all categories
POST,      /api/categories,       Create a new category
GET,       /api/transactions,     Get transaction history
POST,      /api/transactions,     Create transaction (w/ image)
DELETE,    /api/transactions/:id, Delete a transaction
