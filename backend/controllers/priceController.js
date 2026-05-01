import Price from "../models/Price.js";
import axios from "axios"; // Required for making requests to the Python ML server

// 1. Get crop prices (with optional date filtering)
export const getPrices = async (req, res) => {
  try {
    const { date } = req.query;
    const allPrices = await Price.find().sort({ cropName: 1 });

    if (date) {
      const filteredPrices = allPrices
        .map((item) => {
          const dayRecord = item.history.find((h) => h.date === date);

          if (dayRecord) {
            return {
              _id: item._id,
              cropName: item.cropName,
              category: item.category,
              image: item.image,
              priceMin: dayRecord.priceMin,
              priceMax: dayRecord.priceMax,
              history: item.history,
              date: dayRecord.date,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      return res.json(filteredPrices);
    }

    res.json(allPrices);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching prices", error: err.message });
  }
};

// 2. Add initial crop price
export const addPrice = async (req, res) => {
  try {
    const { cropName, category, priceMin, priceMax, image } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const newPrice = new Price({
      cropName,
      category,
      image,
      currentPriceMin: priceMin,
      currentPriceMax: priceMax,
      history: [{ date: today, priceMin, priceMax }],
    });

    const savedPrice = await newPrice.save();
    res.status(201).json(savedPrice);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error adding price data", error: err.message });
  }
};

// 3. Update daily price
export const updateDailyPrice = async (req, res) => {
  const { cropName, date, priceMin, priceMax } = req.body;

  try {
    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      return res
        .status(400)
        .json({ message: "Cannot add prices for future dates! ❌" });
    }

    const priceRecord = await Price.findOne({ cropName: cropName });
    if (!priceRecord)
      return res.status(404).json({ message: `Crop '${cropName}' not found` });

    const existingIndex = priceRecord.history.findIndex((h) => h.date === date);

    if (existingIndex > -1) {
      priceRecord.history[existingIndex] = { date, priceMin, priceMax };
    } else {
      priceRecord.history.push({ date, priceMin, priceMax });
    }

    priceRecord.history.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (date === today) {
      priceRecord.currentPriceMin = priceMin;
      priceRecord.currentPriceMax = priceMax;
    }

    await priceRecord.save();
    res.json({ message: `Price updated successfully`, data: priceRecord });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// 4. Delete crop price
export const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCrop = await Price.findByIdAndDelete(id);
    if (!deletedCrop)
      return res.status(404).json({ message: "Crop not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting price" });
  }
};

// 5. Calculate Forecast Income using Python Machine Learning API
export const calculateForecastIncome = async (req, res) => {
  try {
    const { cropName, plantDate, numberOfPlants } = req.body;

    // Validation: Currently, the ML model is trained specifically for Capsicum
    if (cropName.toLowerCase() !== "capsicum") {
      return res
        .status(400)
        .json({
          message: "ML prediction is currently supported for Capsicum only.",
        });
    }

    if (!plantDate || !numberOfPlants) {
      return res
        .status(400)
        .json({ message: "Plant date and number of plants are required." });
    }

    let harvestData = [];
    let currentDate = new Date(plantDate);

    // 1st Harvest (After 45 days, 50g / 0.05kg per plant)
    currentDate.setDate(currentDate.getDate() + 45);
    harvestData.push({ date: new Date(currentDate), yieldPerPlantKg: 0.05 });

    // 2nd Harvest (After 7 days, 50g / 0.05kg per plant)
    currentDate.setDate(currentDate.getDate() + 7);
    harvestData.push({ date: new Date(currentDate), yieldPerPlantKg: 0.05 });

    // 3rd Harvest (After 7 days, 150g / 0.15kg per plant)
    currentDate.setDate(currentDate.getDate() + 7);
    harvestData.push({ date: new Date(currentDate), yieldPerPlantKg: 0.15 });

    // Calculate end date (4 months from the 1st harvest)
    let firstHarvestDate = new Date(harvestData[0].date);
    let endHarvestDate = new Date(firstHarvestDate);
    endHarvestDate.setMonth(endHarvestDate.getMonth() + 4);

    // 4th Harvest onwards: Alternate 4 days and 3 days (200g / 0.20kg per plant)
    let isFourDays = true;
    while (true) {
      currentDate.setDate(currentDate.getDate() + (isFourDays ? 4 : 3));

      if (currentDate > endHarvestDate) {
        break; // Stop when the 4-month duration is exceeded
      }

      harvestData.push({ date: new Date(currentDate), yieldPerPlantKg: 0.2 });
      isFourDays = !isFourDays; // Toggle between 4 and 3 days
    }

    // Format dates for the Python API (Required format: YYYY-MM-DD)
    const datesForAPI = harvestData.map(
      (h) => h.date.toISOString().split("T")[0],
    );

    // Fetch predicted prices from Python ML Server
    const pythonResponse = await axios.post("http://localhost:5001/predict", {
      dates: datesForAPI,
    });
    const pricePredictions = pythonResponse.data;

    if (!pricePredictions || pricePredictions.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to get predictions from ML server." });
    }

    let totalMinIncome = 0;
    let totalMaxIncome = 0;

    // Calculate income for each predicted harvest day
    for (let i = 0; i < harvestData.length; i++) {
      const totalYieldKg = harvestData[i].yieldPerPlantKg * numberOfPlants;

      const minPrice = pricePredictions[i].predicted_min_price;
      const maxPrice = pricePredictions[i].predicted_max_price;

      totalMinIncome += totalYieldKg * minPrice;
      totalMaxIncome += totalYieldKg * maxPrice;
    }

    // Return the final formatted result to the Frontend
    res.json({
      cropName,
      expectedMinIncome: totalMinIncome.toFixed(2),
      expectedMaxIncome: totalMaxIncome.toFixed(2),
      totalHarvests: harvestData.length,
      message:
        "Income calculated successfully using Time-Series Forecasting ML model.",
    });
  } catch (error) {
    console.error("ML Prediction Error:", error.message);
    res
      .status(500)
      .json({
        message:
          "An error occurred while forecasting the income. Please ensure the Python server is running.",
      });
  }
};
