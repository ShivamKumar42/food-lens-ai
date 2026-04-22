import type { ClassificationResponse } from "./foodClasses";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function predict(file: File): Promise<ClassificationResponse> {
  if (!API_URL) {
    throw new Error(
      "Inference API is not configured. Set VITE_API_URL to your FastAPI backend URL."
    );
  }

  const form = new FormData();
  form.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_URL}/predict`, { method: "POST", body: form });
  } catch {
    throw new Error("Could not reach the inference server. Please try again.");
  }

  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data?.detail || "";
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Inference failed (HTTP ${res.status}).`);
  }

  return (await res.json()) as ClassificationResponse;
}
