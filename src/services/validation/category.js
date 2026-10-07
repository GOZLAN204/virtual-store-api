const z = require("zod");
const { objectIdSchema } = require("./common");

const createCategorySchema = z.object({
  name: z.string().min(1),
});

const updateCategorySchema = z.object({
  id: objectIdSchema,
  name: z.string().min(1),
});

const deleteCategorySchema = z.object({
  id: objectIdSchema,
});

const getCategoryQuerySchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategoryQuerySchema,
};
