import { FOOD_CLASSES, type ClassificationResponse } from "./foodClasses";

export async function mockPredict(): Promise<ClassificationResponse> {
  // Simulate network + inference delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

  const shuffled = [...FOOD_CLASSES].sort(() => Math.random() - 0.5);
  const topConfidence = 0.7 + Math.random() * 0.25;
  const second = (1 - topConfidence) * (0.4 + Math.random() * 0.3);
  const third = 1 - topConfidence - second;

  return {
    prediction: shuffled[0],
    confidence: parseFloat(topConfidence.toFixed(4)),
    top_k: [
      { label: shuffled[0], confidence: parseFloat(topConfidence.toFixed(4)) },
      { label: shuffled[1], confidence: parseFloat(second.toFixed(4)) },
      { label: shuffled[2], confidence: parseFloat(Math.max(third, 0.001).toFixed(4)) },
    ],
    inference_time_ms: Math.round(80 + Math.random() * 300),
  };
}

const API_URL = import.meta.env.VITE_API_URL || "";

export async function predict(file: File): Promise<ClassificationResponse> {
  if (!API_URL) return mockPredict();

  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/predict`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}
