const router = require("express").Router();
const {
  createUser,
  showAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/Users");
const {
  validate,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  getUserQuerySchema,
} = require("../services/validation");

router.get("/All", showAllUsers);
router.get("/", validate(getUserQuerySchema, "query"), getUser);

router.post("/add", validate(createUserSchema), createUser);

router.patch("/edit", validate(updateUserSchema), updateUser);

router.delete("/delete", validate(deleteUserSchema), deleteUser);

module.exports = router;
