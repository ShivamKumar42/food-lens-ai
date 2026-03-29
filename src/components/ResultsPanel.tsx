import { motion } from "framer-motion";
import { Award, Clock, Download, ThumbsDown, ThumbsUp } from "lucide-react";
import type { ClassificationResponse } from "@/lib/foodClasses";

interface ResultsPanelProps {
  result: ClassificationResponse;
  onFeedback?: (feedback: "correct" | "incorrect") => void;
  currentFeedback?: "correct" | "incorrect";
}

function confidenceColor(c: number) {
  if (c >= 0.8) return "bg-success text-success-foreground";
  if (c >= 0.5) return "bg-warning text-accent-foreground";
  return "bg-destructive text-destructive-foreground";
}

function barColor(i: number) {
  if (i === 0) return "bg-primary";
  if (i === 1) return "bg-primary/60";
  return "bg-primary/30";
}

const ResultsPanel = ({ result, onFeedback, currentFeedback }: ResultsPanelProps) => {
  const downloadResult = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `prediction_${result.prediction}.json`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-6"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {/* Top prediction */}
      <div className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 text-accent">
          <Award className="h-5 w-5" />
          <span className="font-heading text-sm font-semibold uppercase tracking-wider">
            Prediction
          </span>
        </div>
        <h3 className="font-heading text-3xl font-bold text-foreground">{result.prediction}</h3>
        <span
          className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${confidenceColor(result.confidence)}`}
        >
          {(result.confidence * 100).toFixed(1)}% confidence
        </span>
      </div>

      {/* Top-k bars */}
      <div className="mb-6 space-y-3">
        <p className="font-heading text-sm font-semibold text-muted-foreground">Top Predictions</p>
        {result.top_k.map((p, i) => (
          <div key={p.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{p.label}</span>
              <span className="text-muted-foreground">{(p.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.confidence * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                className={`h-full rounded-full ${barColor(i)}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        Inference time: {result.inference_time_ms}ms
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFeedback?.("correct")}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            currentFeedback === "correct"
              ? "border-success bg-success/10 text-success"
              : "border-border text-foreground hover:bg-secondary"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" /> Correct
        </button>
        <button
          onClick={() => onFeedback?.("incorrect")}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            currentFeedback === "incorrect"
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-border text-foreground hover:bg-secondary"
          }`}
        >
          <ThumbsDown className="h-3.5 w-3.5" /> Incorrect
        </button>
        <button
          onClick={downloadResult}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Download className="h-3.5 w-3.5" /> JSON
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;
