const router = require("express").Router();
const {
  createCategory,
  AllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  showProductCountByCategory,
} = require("../controllers/Category");
const {
  validate,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategoryQuerySchema,
} = require("../services/validation");

router.get("/All", AllCategories);
router.get("/productCount", showProductCountByCategory);
router.get("/", validate(getCategoryQuerySchema, "query"), getCategory);

router.post("/add", validate(createCategorySchema), createCategory);

router.patch("/edit", validate(updateCategorySchema), updateCategory);

router.delete("/delete", validate(deleteCategorySchema), deleteCategory);

module.exports = router;
