import mongoose from "mongoose";

const TunnelConfigSchema = new mongoose.Schema(
  {
    // The standard floor area of the tunnel (e.g., 1000, 2500 sqft)
    size: {
      type: Number,
      required: true,
      unique: false, // Ensure size alone is not unique anymore
    },
    // Classification of the tunnel (Basic, Moderate, or High-Tech)
    type: {
      type: String,
      required: true,
      enum: ["Basic", "Moderate", "High-Tech"],
    },
    // Cost per square foot based on the selected type and size
    pricePerSqft: {
      type: Number,
      required: true,
    },
    // Optional physical dimensions
    length: { type: Number },
    width: { type: Number },
    arches: { type: Number },
  },
  { timestamps: true },
);

// CRITICAL: This allows the same size to exist for different types
// (e.g., 1000 + Basic is unique, 1000 + Moderate is also unique)
TunnelConfigSchema.index({ size: 1, type: 1 }, { unique: true });

export default mongoose.model("TunnelConfig", TunnelConfigSchema);
