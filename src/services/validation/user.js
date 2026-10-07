const z = require("zod");
const { objectIdSchema } = require("./common");

const createUserSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  email: z.email(),
  address: z.string().min(2),
});

const updateUserSchema = z.object({
  id: objectIdSchema,
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  phone: z.string().min(9).optional(),
  address: z.string().min(2).optional(),
});

const deleteUserSchema = z.object({
  id: objectIdSchema,
});

const getUserQuerySchema = z.object({
  id: objectIdSchema,
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  getUserQuerySchema,
};
