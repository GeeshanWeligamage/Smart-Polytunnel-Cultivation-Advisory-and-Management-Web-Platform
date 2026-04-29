import express from "express";
import {
  getPrices,
  addPrice,
  deletePrice,
  updateDailyPrice,
  calculateForecastIncome,
} from "../controllers/priceController.js";

const router = express.Router();

// සියලුම මිල ගණන් ලබා ගැනීමට (දැන් query parameters සපෝට් කරයි)
router.get("/", getPrices);

// අලුත් බෝගයක් පද්ධතියට ඇතුළත් කිරීමට
router.post("/", addPrice);

// පවතින බෝගයක මිල දිනපතා යාවත්කාලීන කිරීමට
router.post("/update", updateDailyPrice);

// බෝගයක් මකා දැමීමට
router.delete("/:id", deletePrice);

// ආදායම පුරෝකථනය කිරීමට (Income Forecasting)
router.post("/calculate-income", calculateForecastIncome);

export default router;
