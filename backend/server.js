import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import priceRoutes from "./routes/priceRoutes.js";
import tunnelRoutes from "./routes/tunnelRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Define Routes
app.use("/api/auth", authRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/tunnel", tunnelRoutes); // Connection for Tunnel Configurations

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
