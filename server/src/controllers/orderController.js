import { Order } from '../models/order.js';
import { Product } from '../models/product.js';

// Helper to generate order number
const generateOrderNumber = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'VRM-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @desc    Create a new order (simulated payment; no real money is charged)
// @route   POST /api/orders
// @access  Public (Guest) or Protected (Logged in user)
// Prices, names and totals are ALWAYS calculated on the server from the database.
// Anything the client sends about price or total is ignored.
export const createOrder = async (req, res) => {
  const reserved = []; // stock reservations, rolled back if the order fails
  try {
    const { orderItems, shippingAddress, paymentMethod = 'Credit/Debit Card' } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0 || orderItems.length > 20) {
      return res.status(400).json({ message: 'Invalid order items' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email || !shippingAddress.address) {
      return res.status(400).json({ message: 'Incomplete shipping address' });
    }

    let orderNumber = generateOrderNumber();
    let exists = await Order.findOne({ orderNumber });
    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await Order.findOne({ orderNumber });
    }

    const processedItems = [];
    for (const item of orderItems) {
      const prodId = String(item.product?.id || item.product?._id || item.product || item.productId || '');
      const quantity = Math.floor(Number(item.quantity));
      if (!prodId || !Number.isFinite(quantity) || quantity < 1 || quantity > 10) {
        throw Object.assign(new Error('Invalid product or quantity'), { status: 400 });
      }

      const dbProduct = await Product.findOne({
        $or: [{ id: prodId }, { _id: prodId.length === 24 ? prodId : null }],
      });
      if (!dbProduct) {
        throw Object.assign(new Error('A product in your cart no longer exists'), { status: 400 });
      }

      // Atomic stock decrement: succeeds only if enough stock is left (no overselling)
      const updated = await Product.findOneAndUpdate(
        { _id: dbProduct._id, stockUnits: { $gte: quantity } },
        { $inc: { stockUnits: -quantity, stock: -quantity } },
        { new: true }
      );
      if (!updated) {
        throw Object.assign(new Error(`Not enough stock for ${dbProduct.name}`), { status: 409 });
      }
      reserved.push({ _id: dbProduct._id, quantity });
      if (updated.stockUnits === 0) {
        await Product.updateOne({ _id: dbProduct._id }, { $set: { inStock: false } });
      }

      processedItems.push({
        product: dbProduct._id,
        productId: dbProduct.id || String(dbProduct._id),
        name: dbProduct.name,
        quantity,
        price: dbProduct.price,
        mainImage: dbProduct.mainImage || '',
      });
    }

    const subtotal = processedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const taxPrice = Math.round(subtotal * 0.08 * 100) / 100;
    const shippingPrice = subtotal >= 500 ? 0 : 25;
    const totalAmount = Math.round((subtotal + taxPrice + shippingPrice) * 100) / 100;

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : null,
      orderItems: processedItems,
      shippingAddress,
      paymentMethod,
      paymentResult: {
        id: `SIM-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: 'SIMULATED',
        updateTime: new Date().toISOString(),
        emailAddress: shippingAddress.email,
      },
      subtotal,
      taxPrice,
      shippingPrice,
      totalAmount,
      isPaid: true,
      paidAt: new Date(),
      status: 'Processing',
    });

    const savedOrder = await order.save();
    console.log(`Order placed: ${savedOrder.orderNumber} (${savedOrder.totalAmount})`);
    res.status(201).json(savedOrder);
  } catch (error) {
    // Put reserved stock back if anything failed
    for (const r of reserved) {
      await Product.updateOne(
        { _id: r._id },
        { $inc: { stockUnits: r.quantity, stock: r.quantity }, $set: { inStock: true } }
      ).catch(() => {});
    }
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Protected
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user orders' });
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:id
// @access  Protected (owner or admin)
export const getOrderById = async (req, res) => {
  try {
    const query = req.params.id.startsWith('VRM-')
      ? { orderNumber: req.params.id.toUpperCase() }
      : { _id: req.params.id };

    const order = await Order.findOne(query).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const ownerId = order.user?._id ? String(order.user._id) : String(order.user || '');
    if (req.user.role !== 'admin' && ownerId !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Protected (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Protected (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
