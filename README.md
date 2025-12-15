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

## Project Structure

```
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       └── App.js
├── controllers/           # Request handlers
├── middleware/           # Custom middleware
├── models/              # Database models
├── routes/             # API routes
├── seeders/           # Database seeders
└── server.js         # Express server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with pagination, search, filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories

## License

MIT

