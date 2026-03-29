export const FOOD_CLASSES = [
  "Baked Potato", "Burger", "Butter Naan", "Chai", "Chapati",
  "Chole Bhature", "Dal Makhani", "Dhokla", "Fried Rice", "Idli",
  "Jalebi", "Kaathi Rolls", "Kadai Paneer", "Kulfi", "Masala Dosa",
  "Momos", "Paani Puri", "Pakode", "Pav Bhaji", "Pizza",
  "Samosa", "Sushi"
] as const;

export type FoodClass = typeof FOOD_CLASSES[number];

export interface PredictionResult {
  label: string;
  confidence: number;
}

export interface ClassificationResponse {
  prediction: string;
  confidence: number;
  top_k: PredictionResult[];
  inference_time_ms: number;
}

export interface HistoryEntry {
  id: string;
  imageDataUrl: string;
  result: ClassificationResponse;
  timestamp: number;
  feedback?: "correct" | "incorrect";
}
