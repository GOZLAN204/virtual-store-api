const router = require("express").Router();
const {
  showAllOrders,
  getOrder,
  getOrdersByUser,
  createOrder,
} = require("../controllers/Orders");
const {
  validate,
  createOrderSchema,
  getOrderQuerySchema,
  getOrdersByUserQuerySchema,
} = require("../services/validation");

router.get("/All", showAllOrders);
router.get("/user", validate(getOrdersByUserQuerySchema, "query"), getOrdersByUser);
router.get("/", validate(getOrderQuerySchema, "query"), getOrder);

router.post("/add", validate(createOrderSchema), createOrder);

module.exports = router;
