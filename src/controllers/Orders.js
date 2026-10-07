const Orders = require("../modules/Orders");
const Users = require("../modules/Users");
const Products = require("../modules/Products");

const showAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate("user")
      .populate("products.product");

    return res.status(200).json(orders);
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.validated;

    const order = await Orders.findById(id)
      .populate("user")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.validated;

    const user = await Users.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Orders.find({ user: user_id })
      .populate("user")
      .populate("products.product");

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      orders,
    });
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { user_id, products } = req.validated;

    const user = await Users.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderProducts = [];
    let totalPrice = 0;

    for (const item of products) {
      const product = await Products.findById(item.product_id);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product_id}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}`,
          available: product.stock,
          requested: item.quantity,
        });
      }

      const linePrice = product.price * item.quantity;
      totalPrice += linePrice;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    for (const item of products) {
      await Products.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = new Orders({
      user: user_id,
      products: orderProducts,
      totalPrice,
    });

    await order.save();

    await Users.findByIdAndUpdate(user_id, {
      $push: { orders: order._id },
    });

    const populatedOrder = await Orders.findById(order._id)
      .populate("user")
      .populate("products.product");

    return res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("is Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  showAllOrders,
  getOrder,
  getOrdersByUser,
  createOrder,
};
