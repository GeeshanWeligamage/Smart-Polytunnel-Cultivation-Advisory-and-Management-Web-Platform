# Disease information database for Tomato leaf diseases
# Maps model class names to user-friendly information and solutions

DISEASE_INFO = {
    "Tomato_Bacterial_spot": {
        "name": "Bacterial Spot",
        "severity": "High",
        "description": "Bacterial spot is caused by Xanthomonas bacteria. It creates small, dark, water-soaked spots on leaves that may have a yellow halo.",
        "solutions": [
            "Remove the all infected plants immediately to prevent spread.",
            "Apply copper-based bactericide sprays at 7-10 day intervals.",
            "Avoid overhead watering — use drip irrigation to keep foliage dry.",
            "Ensure proper spacing between plants for adequate air circulation.",
            "Use disease-free seeds and resistant tomato varieties for future planting.",
            "Rotate crops every 2-3 years to break the bacterial cycle in soil."
        ]
    },
    "Tomato_Early_blight": {
        "name": "Early Blight",
        "severity": "Moderate",
        "description": "Early blight is caused by the fungus Alternaria solani. It produces dark, concentric ring-shaped spots (target-like) on older leaves first.",
        "solutions": [
            "Remove and destroy infected lower leaves to slow the spread.",
            "Apply fungicides containing Chlorothalonil or Mancozeb as a preventive measure.",
            "Mulch around plants to prevent soil-borne spores from splashing onto leaves.",
            "Water at the base of plants and avoid wetting the foliage.",
            "Ensure proper plant spacing for good air circulation.",
            "Practice crop rotation — avoid planting tomatoes in the same spot for 2+ years."
        ]
    },
    "Tomato_Late_blight": {
        "name": "Late Blight",
        "severity": "Critical",
        "description": "Late blight is caused by Phytophthora infestans. It causes large, dark, water-soaked lesions on leaves and stems, and can destroy crops rapidly.",
        "solutions": [
            "Act immediately — Late Blight spreads extremely fast in cool, wet conditions.",
            "Remove the all infected plants. Do NOT compost them.",
            "Apply systemic fungicides such as Metalaxyl or Cymoxanil immediately.",
            "Improve drainage and air circulation in the polytunnel.",
            "Avoid overhead irrigation and reduce humidity levels inside the tunnel.",
            "Monitor neighboring crops — Late Blight can spread via airborne spores.",
            "Use resistant tomato varieties like 'Defiant' or 'Mountain Magic' in future."
        ]
    },
    "Tomato_Leaf_Mold": {
        "name": "Leaf Mold",
        "severity": "Moderate",
        "description": "Leaf mold is caused by the fungus Passalora fulva. It creates pale green to yellowish spots on upper leaf surfaces with olive-green mold underneath.",
        "solutions": [
            "Improve ventilation inside the polytunnel to reduce humidity below 85%.",
            "Remove and destroy infected leaves promptly.",
            "Apply fungicides containing Chlorothalonil or copper-based products.",
            "Avoid leaf wetness — water plants at the base during morning hours.",
            "Space plants adequately and prune lower branches for airflow.",
            "Use resistant tomato varieties when available."
        ]
    },
    "Tomato_Septoria_leaf_spot": {
        "name": "Septoria Leaf Spot",
        "severity": "Moderate",
        "description": "Septoria leaf spot is caused by the fungus Septoria lycopersici. It creates many small, circular spots with dark borders and grey centers on lower leaves.",
        "solutions": [
            "Remove infected leaves immediately to prevent spore spread.",
            "Apply fungicides such as Chlorothalonil or Mancozeb at first sign of disease.",
            "Mulch around the base to prevent spores from splashing from soil to leaves.",
            "Avoid overhead watering — use drip irrigation systems.",
            "Ensure adequate spacing between plants for air circulation.",
            "Rotate crops and avoid planting tomatoes in the same location for 3 years."
        ]
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
        "name": "Spider Mites (Two-spotted)",
        "severity": "High",
        "description": "Two-spotted spider mites are tiny pests that feed on leaf cells, causing stippling, yellowing, and eventual leaf drop. Fine webbing may be visible.",
        "solutions": [
            "Spray plants with a strong jet of water to dislodge mites from leaves.",
            "Apply neem oil or insecticidal soap to affected areas every 5-7 days.",
            "Introduce natural predators like Phytoseiulus persimilis (predatory mites).",
            "Increase humidity inside the polytunnel — mites thrive in dry conditions.",
            "Remove heavily infested leaves and dispose of them away from the crop.",
            "Avoid broad-spectrum insecticides that kill beneficial predator insects."
        ]
    },
    "Tomato__Target_Spot": {
        "name": "Target Spot",
        "severity": "Moderate",
        "description": "Target spot is caused by the fungus Corynespora cassiicola. It produces circular brown spots with concentric rings on leaves, stems, and fruit.",
        "solutions": [
            "Remove the infected plant material to reduce fungal spread.",
            "Apply fungicides containing Azoxystrobin or Chlorothalonil as treatment.",
            "Ensure good air circulation by proper spacing and pruning.",
            "Avoid overhead irrigation — water at the base of plants.",
            "Mulch around plants to prevent soil splash onto lower leaves.",
            "Practice crop rotation to reduce soil-borne fungal pressure."
        ]
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
        "name": "Yellow Leaf Curl Virus (TYLCV)",
        "severity": "Critical",
        "description": "TYLCV is transmitted by whiteflies. It causes severe leaf curling, yellowing of leaf margins, stunted growth, and significant yield loss.",
        "solutions": [
            "Control whitefly populations using yellow sticky traps inside the polytunnel.",
            "Apply systemic insecticides such as Imidacloprid to control whiteflies.",
            "Remove and destroy infected plants immediately — there is NO cure for the virus.",
            "Use insect-proof netting on polytunnel openings to prevent whitefly entry.",
            "Plant TYLCV-resistant tomato varieties for future crops.",
            "Avoid planting near other infected crops that harbor whiteflies.",
            "Introduce natural predators like Encarsia formosa for biological control."
        ]
    },
    "Tomato__Tomato_mosaic_virus": {
        "name": "Tomato Mosaic Virus (ToMV)",
        "severity": "High",
        "description": "ToMV causes mottled light and dark green patterns on leaves, leaf curling, and reduced fruit quality. It spreads through mechanical contact.",
        "solutions": [
            "Remove all infected plants — there is NO chemical cure.",
            "Wash hands thoroughly with soap before and after handling plants.",
            "Disinfect all tools, stakes, and equipment with a 10% bleach solution.",
            "Avoid smoking near plants — tobacco can carry the virus.",
            "Use certified disease-free seeds and transplants.",
            "Plant resistant varieties labeled with 'ToMV' resistance in future crops."
        ]
    },
    "Tomato_healthy": {
        "name": "Healthy Leaf",
        "severity": "None",
        "description": "This leaf appears healthy with no visible signs of disease or pest damage. The plant is in good condition.",
        "solutions": [
            "Continue with your current care routine — the plant is healthy!",
            "Maintain regular watering schedules using drip irrigation.",
            "Apply balanced fertilizer (NPK 10-10-10) every 2-3 weeks.",
            "Monitor regularly for early signs of disease or pest activity.",
            "Ensure good ventilation inside the polytunnel to prevent fungal growth.",
            "Keep the area around plants clean and free from debris."
        ]
    }
}
