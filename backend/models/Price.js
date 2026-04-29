import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    // දිනපතා මිල ගණන් ගබඩා වන Array එක
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
