import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import SampleGallery from "@/components/SampleGallery";
import ResultsPanel from "@/components/ResultsPanel";
import HowItWorks from "@/components/HowItWorks";
import ModelInfo from "@/components/ModelInfo";
import HistoryPanel from "@/components/HistoryPanel";
import { predict } from "@/lib/mockPredict";
import { addHistory, clearHistory, getHistory, updateFeedback } from "@/lib/history";
import type { ClassificationResponse, HistoryEntry } from "@/lib/foodClasses";

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | undefined>();
  const uploadRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = () =>
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  const handleImageSelect = useCallback((f: File, dataUrl: string) => {
    setFile(f);
    setImage(dataUrl);
    setResult(null);
    setError(null);
    setFeedback(undefined);
    setCurrentEntryId(null);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setImage(null);
    setResult(null);
    setError(null);
    setFeedback(undefined);
    setCurrentEntryId(null);
  }, []);

  const handleClassify = async () => {
    if (!file || !image) return;
    setLoading(true);
    setError(null);
    try {
      const res = await predict(file);
      setResult(res);
      const id = crypto.randomUUID();
      setCurrentEntryId(id);
      const entry: HistoryEntry = { id, imageDataUrl: image, result: res, timestamp: Date.now() };
      addHistory(entry);
      setHistory(getHistory());
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (fb: "correct" | "incorrect") => {
    setFeedback(fb);
    if (currentEntryId) {
      updateFeedback(currentEntryId, fb);
      setHistory(getHistory());
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onScrollToUpload={scrollToUpload} />

      {/* Upload + Results */}
      <section className="py-12" ref={uploadRef}>
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
            <div>
              <ImageUpload image={image} onImageSelect={handleImageSelect} onReset={handleReset} />
              {!image && <SampleGallery onSelect={handleImageSelect} />}
              {image && !result && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  onClick={handleClassify}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-heading font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Classifying…
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Classify Food
                    </>
                  )}
                </motion.button>
              )}
              {error && (
                <p className="mt-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            <AnimatePresence>
              {result && (
                <ResultsPanel
                  result={result}
                  onFeedback={handleFeedback}
                  currentFeedback={feedback}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <HowItWorks />
      <ModelInfo />
      <HistoryPanel history={history} onClear={handleClearHistory} />

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with TensorFlow, FastAPI & React</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
