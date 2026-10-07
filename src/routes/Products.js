const router = require("express").Router();
const {
  showAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  showProductsByCategory,
} = require("../controllers/Products");
const {
  validate,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductQuerySchema,
  productsByCategoryQuerySchema,
} = require("../services/validation");

router.get("/All", showAllProducts);
router.get(
  "/byCategory",
  validate(productsByCategoryQuerySchema, "query"),
  showProductsByCategory
);
router.get("/", validate(getProductQuerySchema, "query"), getProduct);

router.post("/add", validate(createProductSchema), createProduct);

router.patch("/edit", validate(updateProductSchema), updateProduct);

router.delete("/delete", validate(deleteProductSchema), deleteProduct);

module.exports = router;
