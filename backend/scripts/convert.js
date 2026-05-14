import fs from "fs";

const fileName = "Capsicum prices.csv";

try {
  const csv = fs.readFileSync(fileName, "utf8");
  const lines = csv.split("\n");
  const historyArray = [];

  // Skip the first line (Headers) and read the data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Split the line by commas to get individual columns
      const columns = line.split(",");

      // ⚠️ Change these index numbers according to your Excel column order ⚠️
      // For example, if Date is in the 1st column, it is [0]
      // If Min Price is in the 4th column, it is [3]
      // If Max Price is in the 5th column, it is [4]

      const date = columns[0]; // The column containing the Date
      const min = columns[2]; // The column containing the Min Price
      const max = columns[3]; // The column containing the Max Price

      if (date && min && max && !isNaN(Number(min)) && !isNaN(Number(max))) {
        historyArray.push({
          date: date.trim(),
          priceMin: Number(min.trim()),
          priceMax: Number(max.trim()),
        });
      }
    }
  }

  const finalJSON = [
    {
      cropName: "Capsicum",
      category: "Vegetable",
      image: "https://example.com/capsicum.jpg",
      currentPriceMin: historyArray[historyArray.length - 1]?.priceMin || 0,
      currentPriceMax: historyArray[historyArray.length - 1]?.priceMax || 0,
      history: historyArray,
    },
  ];

  fs.writeFileSync("capsicum_prices.json", JSON.stringify(finalJSON, null, 2));
  console.log("✅ JSON file created successfully!");
} catch (error) {
  console.error("❌ Error:", error.message);
}
