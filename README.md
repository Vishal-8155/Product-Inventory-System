# Product Inventory System

## Features

- User authentication (Sign up/Login) (I add this additionally)
- Add, edit, and delete products
- Multi-category support for products
- Search products by name
- Filter products by categories
- Paginated product listing
- Responsive design for all devices

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. Clone the repository
```bash
git clone https://github.com/Vishal-8155/Product-Inventory-System.git
cd Product-Inventory-System
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

4. Create `.env` file in root directory
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product_inventory
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

5. Seed categories into database
```bash
npm run seed
```

6. Run the application
```bash
npm run dev:full
```

The backend will run on `http://localhost:5000` and frontend on `http://localhost:3000`

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run client` - Start React development server
- `npm run dev:full` - Run both backend and frontend concurrently
- `npm run seed` - Seed categories into database
- `npm run build` - Build React app for production
- `npm run deploy` - Install dependencies and build (used by Render)

