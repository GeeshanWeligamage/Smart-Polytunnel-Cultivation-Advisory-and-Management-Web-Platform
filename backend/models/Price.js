import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    // Array to store daily prices
    history: [
      {
        date: { type: String, required: true },
        priceMin: { type: Number, required: true },
        priceMax: { type: Number, required: true },
      },
    ],
    currentPriceMin: { type: Number },
    currentPriceMax: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.model("Price", priceSchema);
