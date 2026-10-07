const z = require("zod");
const { objectIdSchema } = require("./common");

const createOrderSchema = z.object({
  user_id: objectIdSchema,
  products: z
    .array(
      z.object({
        product_id: objectIdSchema,
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Order must include at least one product"),
});

const getOrderQuerySchema = z.object({
  id: objectIdSchema,
});

const getOrdersByUserQuerySchema = z.object({
  user_id: objectIdSchema,
});

module.exports = {
  createOrderSchema,
  getOrderQuerySchema,
  getOrdersByUserQuerySchema,
};
