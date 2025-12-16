# Product Inventory System

## Features

- User authentication (Sign up/Login) (I add this additionally)
- Add, edit, and delete products
- Multi-category support for products
- Search products by name
- Filter products by categories
- Paginated product listing
- Responsive design for all devices

## Tech Stack

- **Frontend:** React.js, React-Select, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt

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

## Deployment

### Deploy to Render

This project is ready to deploy on Render. See the detailed deployment guides:

- **Quick Guide**: [RENDER_QUICK_GUIDE.md](RENDER_QUICK_GUIDE.md) - Deploy in 5 minutes
- **Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment documentation

**Quick Deploy:**
1. Create MongoDB Atlas database
2. Push code to GitHub
3. Connect GitHub repo to Render
4. Set environment variables (MONGODB_URI, JWT_SECRET, NODE_ENV)
5. Deploy!

Your app will be live at: `https://your-app-name.onrender.com`

## Environment Variables

For local development, create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/product_inventory
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

For production (Render), set these in the dashboard:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=generated_secure_secret_key
NODE_ENV=production
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run client` - Start React development server
- `npm run dev:full` - Run both backend and frontend concurrently
- `npm run seed` - Seed categories into database
- `npm run build` - Build React app for production
- `npm run deploy` - Install dependencies and build (used by Render)

