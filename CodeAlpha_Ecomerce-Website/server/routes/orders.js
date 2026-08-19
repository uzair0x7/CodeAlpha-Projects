const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  const { items } = req.body; 
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }
  try {
    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      const price = product.price;
      const quantity = item.quantity;
      if (quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
      total += price * quantity;
      orderItems.push({ product: product._id, quantity, price });
    }
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;