import express from "express";
const router = express.Router();
import TunnelConfig from "../models/TunnelConfig.js";

// 1. Get all configurations
router.get("/configs", async (req, res) => {
  try {
    const configs = await TunnelConfig.find().sort({ size: 1 });
    res.json(configs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Add a new configuration
router.post("/configs", async (req, res) => {
  try {
    const newConfig = new TunnelConfig(req.body);
    const saved = await newConfig.save();
    res.json(saved);
  } catch (err) {
    // If user tries to add same size and type again
    if (err.code === 11000) {
      return res
        .status(400)
        .json("Error: This size and type already exist! ❌");
    }
    res.status(500).json(err);
  }
});

// 3. Delete a configuration
router.delete("/configs/:id", async (req, res) => {
  try {
    await TunnelConfig.findByIdAndDelete(req.params.id);
    res.json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. Update the price of an existing configuration
router.put("/configs/:id", async (req, res) => {
  try {
    const updatedConfig = await TunnelConfig.findByIdAndUpdate(
      req.params.id,
      {
        $set: { pricePerSqft: req.body.pricePerSqft },
      },
      { new: true }, // This ensures it returns the newly updated data
    );
    res.json(updatedConfig);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json(err);
  }
});

export default router;
