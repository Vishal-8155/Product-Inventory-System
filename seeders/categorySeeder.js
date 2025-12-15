const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');

const categories = [
  { name: 'Electronics' },
  { name: 'Clothing' },
  { name: 'Food & Beverages' },
  { name: 'Home & Garden' },
  { name: 'Sports & Outdoors' },
  { name: 'Books & Media' },
  { name: 'Toys & Games' },
  { name: 'Health & Beauty' },
  { name: 'Automotive' },
  { name: 'Office Supplies' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    console.log('Cleared existing categories');

    const result = await Category.insertMany(categories);
    console.log(`${result.length} categories added successfully`);

    process.exit(0);
  } catch (error) {
    console.log('Error seeding categories');
    process.exit(1);
  }
};

seedCategories();

