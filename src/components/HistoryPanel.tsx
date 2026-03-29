import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { HistoryEntry } from "@/lib/foodClasses";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onClear: () => void;
}

const HistoryPanel = ({ history, onClear }: HistoryPanelProps) => {
  if (history.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-foreground">Recent Predictions</h2>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {history.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="overflow-hidden rounded-xl border border-border bg-card"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <img
                src={entry.imageDataUrl}
                alt={entry.result.prediction}
                className="h-32 w-full object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="font-heading text-sm font-bold text-foreground">
                  {entry.result.prediction}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(entry.result.confidence * 100).toFixed(1)}% ·{" "}
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
                {entry.feedback && (
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      entry.feedback === "correct"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {entry.feedback === "correct" ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoryPanel;
