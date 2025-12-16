const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('../models/Category');

const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Food & Beverages', slug: 'food-beverages' },
  { name: 'Home & Garden', slug: 'home-garden' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
  { name: 'Books & Media', slug: 'books-media' },
  { name: 'Toys & Games', slug: 'toys-games' },
  { name: 'Health & Beauty', slug: 'health-beauty' },
  { name: 'Automotive', slug: 'automotive' },
  { name: 'Office Supplies', slug: 'office-supplies' }
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
    console.log('Error seeding categories:', error.message);
    process.exit(1);
  }
};

seedCategories();

