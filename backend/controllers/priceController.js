import Price from "../models/Price.js";

// 1. බෝග වල තොරතුරු ලබා ගැනීම (දිනය අනුව Filter කිරීමේ හැකියාව සමඟ)
export const getPrices = async (req, res) => {
  try {
    const { date } = req.query; // Frontend එකෙන් එවන ?date=... කොටස
    const allPrices = await Price.find().sort({ cropName: 1 });

    if (date) {
      // තෝරාගත් දිනයට අදාළ මිල ගණන් පමණක් පෙරා ගැනීම (Filtering logic)
      const filteredPrices = allPrices
        .map((item) => {
          // history array එක ඇතුළේ අදාළ දිනය තියෙනවද බලනවා
          const dayRecord = item.history.find((h) => h.date === date);

          if (dayRecord) {
            return {
              _id: item._id,
              cropName: item.cropName,
              category: item.category,
              image: item.image,
              priceMin: dayRecord.priceMin, // ඉතිහාසයෙන් අදාළ දවසේ අවම මිල
              priceMax: dayRecord.priceMax, // ඉතිහාසයෙන් අදාළ දවසේ උපරිම මිල
              history: item.history,
              date: dayRecord.date,
            };
          }
          return null;
        })
        .filter((item) => item !== null); // මිල ඇතුළත් කර නැති බෝග අයින් කරයි

      return res.json(filteredPrices);
    }

    // දිනයක් ලබා දී නැතිනම් සාමාන්‍ය පරිදි සියල්ල ලබා දීම
    res.json(allPrices);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching prices", error: err.message });
  }
};

// 2. අලුත් බෝගයක් පද්ධතියට මුලින්ම ඇතුළත් කිරීම
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

// 3. දිනපතා මිල යාවත්කාලීන කිරීම
export const updateDailyPrice = async (req, res) => {
  const { cropName, date, priceMin, priceMax } = req.body;

  try {
    const today = new Date().toISOString().split("T")[0];
    if (date > today) {
      return res
        .status(400)
        .json({ message: "අනාගත දින සඳහා මිල ගණන් ඇතුළත් කළ නොහැක! ❌" });
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

// 4. බෝගයක් මකා දැමීම
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

// 5. ආදායම් පුරෝකථනය (Income Forecasting) සඳහා නව function එක
export const calculateForecastIncome = async (req, res) => {
  try {
    const { cropName, numberOfPlants } = req.body;

    const cropData = await Price.findOne({ cropName: cropName });

    if (!cropData || !cropData.history || cropData.history.length === 0) {
      return res.status(404).json({ message: "ප්‍රමාණවත් දත්ත නොමැත" });
    }

    // 1. එක පැළයකින් ලැබෙන අස්වැන්න පරාසය
    let yieldPerPlantMin = 0;
    let yieldPerPlantMax = 0;

    if (cropName === "Capsicum") {
      yieldPerPlantMin = 4; // කිලෝ 4
      yieldPerPlantMax = 6; // කිලෝ 6
    } else if (cropName === "Tomato") {
      yieldPerPlantMin = 5;
      yieldPerPlantMax = 8;
    } else {
      // වෙනත් බෝගයක් ආවොත් default අගයක්
      yieldPerPlantMin = 3;
      yieldPerPlantMax = 5;
    }

    // 2. මුළු අස්වැන්න පරාසය (Expected Harvest Range)
    const expectedHarvestMin = numberOfPlants * yieldPerPlantMin;
    const expectedHarvestMax = numberOfPlants * yieldPerPlantMax;

    // 3. Database එකෙන් සාමාන්‍ය මිල සෙවීම
    const history = cropData.history;
    let totalMinPrice = 0;
    let totalMaxPrice = 0;

    history.forEach((record) => {
      totalMinPrice += record.priceMin;
      totalMaxPrice += record.priceMax;
    });

    const avgMinPrice = totalMinPrice / history.length;
    const avgMaxPrice = totalMaxPrice / history.length;

    // 4. ආදායම් පරාසය සෙවීම (Expected Income Range)
    const expectedMinIncome = expectedHarvestMin * avgMinPrice;
    const expectedMaxIncome = expectedHarvestMax * avgMaxPrice;

    res.json({
      cropName,
      expectedHarvestMin,
      expectedHarvestMax,
      expectedMinIncome: expectedMinIncome.toFixed(2),
      expectedMaxIncome: expectedMaxIncome.toFixed(2),
    });
  } catch (error) {
    console.error("Forecast error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
