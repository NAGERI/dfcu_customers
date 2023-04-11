const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema(
  {
    customer_id: {
      type: String,
      required: [true, "Please provide Customer"],
    },
    loan_id: {
      type: String,
    },
    date_disbursed: {
      type: Date,
    },
    outstanding_amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
module.exports.modelLoan = mongoose.model("Loan", LoanSchema);

const customerSchema = new mongoose.Schema(
  {
    account_id: {
      type: String,
      required: [true, "Please provide Account ID"],
      maxLength: 10,
    },
    loan_status: {
      type: String,
      enum: ["payed", "outstanding"],
      default: "outstanding",
    },
    loans: {
      type: [Number],
    },
  },
  {
    timestamps: true,
  }
);
module.exports.modelCustomer = mongoose.model("Customer", customerSchema);
