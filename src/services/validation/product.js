const z = require("zod");
const { objectIdSchema } = require("./common");

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  category_id: objectIdSchema,
});

const updateProductSchema = z.object({
  id: objectIdSchema,
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  category_id: objectIdSchema.optional(),
});

const deleteProductSchema = z.object({
  id: objectIdSchema,
});

const getProductQuerySchema = z.object({
  id: objectIdSchema,
});

const productsByCategoryQuerySchema = z.object({
  category_id: objectIdSchema,
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  getProductQuerySchema,
  productsByCategoryQuerySchema,
};
