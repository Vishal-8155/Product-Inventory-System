# Product Inventory System

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Vishal-8155/Product-Inventory-System.git
cd Product-Inventory-System
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/product_inventory
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

**Important:** Replace `your_secure_jwt_secret_key_here` with a strong, random secret key.

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**macOS/Linux:**
```bash
sudo systemctl start mongod
```

Or use MongoDB Compass to start MongoDB.

### 6. Seed Categories (Optional but Recommended)

This will populate your database with default categories:

```bash
npm run seed
```

**Default Categories:** Electronics, Clothing, Food & Beverages, Home & Garden, Sports & Outdoors, Books & Media, Toys & Games, Health & Beauty, Automotive, Office Supplies

### 7. Run the Application

**Development Mode (Both Backend & Frontend):**
```bash
npm run dev:full
```

This will start:
- Backend server on: `http://localhost:5000`
- Frontend server on: `http://localhost:3000`

**Run Backend Only:**
```bash
npm run dev
```

**Run Frontend Only:**
```bash
npm run client
```

**Production Mode:**
```bash
npm run build
npm start
```

