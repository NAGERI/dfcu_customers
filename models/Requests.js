const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "requests",
    },
    hit_loan: {
      type: Number,
    },
    miss_loan: {
      type: Number,
    },
    validation: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Requests", requestSchema);
