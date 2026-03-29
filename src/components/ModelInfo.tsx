import { motion } from "framer-motion";
import { Cpu, Database, Layers, Zap } from "lucide-react";
import { FOOD_CLASSES } from "@/lib/foodClasses";

const ModelInfo = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          Model Details
        </h2>
        <p className="mt-3 text-muted-foreground">Architecture and training information.</p>
      </motion.div>

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Cpu, title: "Architecture", value: "MobileNetV2" },
          { icon: Database, title: "Dataset", value: "22 food classes" },
          { icon: Layers, title: "Input Size", value: "224 × 224 px" },
          { icon: Zap, title: "Framework", value: "TensorFlow / Keras" },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-5 text-center"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <item.icon className="mx-auto mb-3 h-7 w-7 text-primary" />
            <p className="text-xs font-medium text-muted-foreground">{item.title}</p>
            <p className="mt-1 font-heading text-lg font-bold text-foreground">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border bg-card p-6"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <h3 className="mb-3 font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Supported Food Classes
        </h3>
        <div className="flex flex-wrap gap-2">
          {FOOD_CLASSES.map((cls) => (
            <span
              key={cls}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {cls}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default ModelInfo;
