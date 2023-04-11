const express = require("express");
const router = express.Router();

const {
  getCustomers,
  getCustomerByAccount,
} = require("../controllers/customers");

router.route("/").get(getCustomers);
router.route("/:account_id").get(getCustomerByAccount);

module.exports = router;
