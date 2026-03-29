import { motion } from "framer-motion";
import { Brain, Sparkles, Upload } from "lucide-react";

interface HeroSectionProps {
  onScrollToUpload: () => void;
}

const HeroSection = ({ onScrollToUpload }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Brain className="h-4 w-4 text-primary" />
            <span>Deep Learning · MobileNetV2 · 22 Classes</span>
          </div>

          <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient">Food</span>{" "}
            <span className="text-foreground">Classifier</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-xl">
            Upload a food image and let our neural network identify it instantly.
            Powered by a deep learning model trained on 22 food categories.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onScrollToUpload}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-heading font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
            >
              <Upload className="h-5 w-5" />
              Classify an Image
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.03 }}
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 font-heading font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Sparkles className="h-5 w-5 text-accent" />
              How It Works
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
