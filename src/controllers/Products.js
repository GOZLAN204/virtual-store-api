const Products = require("../modules/Products");
const Categories = require("../modules/Categories");

const showAllProducts = async (req, res) => {
  try {
    const products = await Products.find().populate("category");
    return res.status(200).json(products);
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.validated;
    const product = await Products.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("is error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.validated;

    const category = await Categories.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const product = new Products({
      name,
      description: description || "",
      price,
      stock,
      category: category_id,
    });

    await product.save();

    await Categories.findByIdAndUpdate(category_id, {
      $inc: { numOfProducts: 1 },
    });

    const populatedProduct = await Products.findById(product._id).populate(
      "category"
    );

    return res.status(201).json({
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("is Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, stock, category_id } = req.validated;

    const existingProduct = await Products.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (category_id) {
      const category = await Categories.findById(category_id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (String(existingProduct.category) !== category_id) {
        await Categories.findByIdAndUpdate(existingProduct.category, {
          $inc: { numOfProducts: -1 },
        });
        await Categories.findByIdAndUpdate(category_id, {
          $inc: { numOfProducts: 1 },
        });
      }
    }

    const updates = Object.fromEntries(
      Object.entries({
        name,
        description,
        price,
        stock,
        category: category_id,
      }).filter(([, value]) => value !== undefined)
    );

    const updatedProduct = await Products.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("category");

    return res.status(200).json({
      message: "Update success!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("is Error", error);
    return res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.validated;
    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Categories.findByIdAndUpdate(deletedProduct.category, {
      $inc: { numOfProducts: -1 },
    });

    return res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    console.error("is Error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const showProductsByCategory = async (req, res) => {
  try {
    const { category_id } = req.validated;

    const category = await Categories.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Products.find({ category: category_id }).populate(
      "category"
    );

    return res.status(200).json({
      category,
      numOfProducts: products.length,
      products,
    });
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  showAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  showProductsByCategory,
};
