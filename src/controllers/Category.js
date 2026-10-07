const Categories = require("../modules/Categories");
const Products = require("../modules/Products");

const AllCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.validated;
    const category = await Categories.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.validated;
    const category = new Categories({ name });
    await category.save();

    return res.status(201).json({ message: "Category saved successfully!", category });
  } catch (error) {
    console.error("is Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    return res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, id } = req.validated;

    const updatedCategory = await Categories.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "update success!",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("is Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.validated;
    const deletedCategory = await Categories.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ message: "category delete success!" });
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const showProductCountByCategory = async (req, res) => {
  try {
    const result = await Products.aggregate([
      {
        $group: {
          _id: "$category",
          numOfProducts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: {
          path: "$categoryInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          category_id: "$_id",
          category: "$categoryInfo.name",
          numOfProducts: 1,
        },
      },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("is Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCategory,
  AllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  showProductCountByCategory,
};
