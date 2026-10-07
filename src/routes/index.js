const router = require("express").Router();

router.use("/category", require("./category"));
router.use("/products", require("./Products"));
router.use("/users", require("./Users"));
router.use("/orders", require("./Orders"));

module.exports = router;
