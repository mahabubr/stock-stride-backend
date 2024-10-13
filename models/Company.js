

const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    marketCap: { type: Number, required: true },
    description: { type: String, required: true },
    ceo: { type: String, required: true },
    foundedYear: { type: Number, required: true },
    industry: { type: String, required: true },
    website: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
