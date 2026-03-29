import { motion } from "framer-motion";
import { Upload, Cpu, BarChart3, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload", desc: "Submit a food image via drag & drop, file picker, or webcam." },
  { icon: Cpu, title: "Preprocess", desc: "Image resized to 224×224, normalized, and converted to tensor." },
  { icon: Sparkles, title: "Neural Network", desc: "MobileNetV2 deep learning model performs inference." },
  { icon: BarChart3, title: "Result", desc: "Top-3 predictions with confidence scores returned instantly." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          How It Works
        </h2>
        <p className="mt-3 text-muted-foreground">
          From image to prediction in under a second.
        </p>
      </motion.div>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 md:flex-row md:gap-0">
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex w-40 flex-col items-center text-center"
            >
              <div className="mb-3 rounded-2xl bg-primary/10 p-4 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground">{step.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
            </motion.div>
            {i < steps.length - 1 && (
              <ArrowRight className="mx-2 hidden h-5 w-5 flex-shrink-0 text-border md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
