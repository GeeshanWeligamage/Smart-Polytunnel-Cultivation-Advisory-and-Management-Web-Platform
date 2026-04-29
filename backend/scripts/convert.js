import fs from "fs";

const fileName = "Capsicum prices.csv";

try {
  const csv = fs.readFileSync(fileName, "utf8");
  const lines = csv.split("\n");
  const historyArray = [];

  // පළමු පේළිය (Headers) මඟහැර දත්ත ටික කියවීම
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // කෝමාවෙන් වෙන් කරලා columns ටික වෙනම ගන්නවා
      const columns = line.split(",");

      // ⚠️ මෙන්න මේ අංක ටික ඔයාගේ Excel එකේ පිළිවෙළට වෙනස් කරන්න ⚠️
      // උදාහරණයක් විදිහට Date තියෙන්නේ 1 වෙනි තීරුවේ නම් ඒක [0]
      // Min Price තියෙන්නේ 4 වෙනි තීරුවේ නම් ඒක [3]
      // Max Price තියෙන්නේ 5 වෙනි තීරුවේ නම් ඒක [4]

      const date = columns[0]; // දිනය තියෙන තීරුව
      const min = columns[2]; // අවම මිල තියෙන තීරුව
      const max = columns[3]; // උපරිම මිල තියෙන තීරුව

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
