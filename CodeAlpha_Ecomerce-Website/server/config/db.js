const mongoose = require('mongoose');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);

    await seedProducts();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        price: 99.99,
        imageUrl: 'https://picsum.photos/seed/headphones/400/300',
        category: 'Electronics',
        stock: 20,
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracker and smartwatch with heart rate monitor.',
        price: 149.99,
        imageUrl: 'https://picsum.photos/seed/smartwatch/400/300',
        category: 'Electronics',
        stock: 15,
      },
      {
        name: 'Running Shoes',
        description: 'Comfortable running shoes for daily training.',
        price: 79.99,
        imageUrl: 'https://picsum.photos/seed/shoes/400/300',
        category: 'Fashion',
        stock: 30,
      },
      {
        name: 'Backpack',
        description: 'Durable backpack with laptop compartment.',
        price: 49.99,
        imageUrl: 'https://picsum.photos/seed/backpack/400/300',
        category: 'Accessories',
        stock: 25,
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer.',
        price: 59.99,
        imageUrl: 'https://picsum.photos/seed/coffee/400/300',
        category: 'Home',
        stock: 10,
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness.',
        price: 29.99,
        imageUrl: 'https://picsum.photos/seed/lamp/400/300',
        category: 'Home',
        stock: 40,
      },
    ];
    await Product.insertMany(products);
    console.log('Sample products seeded');
  }
};

module.exports = connectDB;