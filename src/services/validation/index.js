const validate = require("./validate");

module.exports = {
  validate,
  ...require("./user"),
  ...require("./product"),
  ...require("./category"),
  ...require("./order"),
};
