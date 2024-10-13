// routes/company.js
const express = require("express");
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
} = require("../controllers/companyController");

const router = express.Router();

// Create a new company
router.post("/", createCompany);

// Get all companies
router.get("/", getAllCompanies);

// Get a company by ID
router.get("/:id", getCompanyById);

// Update a company by ID
router.patch("/:id", updateCompanyById);

// Delete a company by ID
router.delete("/:id", deleteCompanyById);

module.exports = router;
