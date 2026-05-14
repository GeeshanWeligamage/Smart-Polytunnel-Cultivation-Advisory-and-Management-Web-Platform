import express from "express";
import {
  getPrices,
  addPrice,
  deletePrice,
  updateDailyPrice,
  calculateForecastIncome,
} from "../controllers/priceController.js";

const router = express.Router();

// To get all prices (now supports query parameters)
router.get("/", getPrices);

// To add a new crop to the system
router.post("/", addPrice);

// To update the daily price of an existing crop
router.post("/update", updateDailyPrice);

// To delete a crop
router.delete("/:id", deletePrice);

// To forecast income (Income Forecasting)
router.post("/calculate-income", calculateForecastIncome);

export default router;
