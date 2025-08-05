"use client";
import { KeyboardIcon, WandIcon, DownloadIcon } from "lucide-react";
import { motion, Variants, easeInOut } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Describe Your Schema",
    description:
      'Type your database requirements in plain English. "Create a blog system with users, posts."',
    icon: KeyboardIcon,
  },
  {
    number: 2,
    title: "AI Infers Relationships",
    description:
      "AutoDia AI automatically identifies entities, attributes, primary keys, and relationships between tables.",
    icon: WandIcon,
  },
  {
    number: 3,
    title: "Edit & Export",
    description:
      "Fine-tune your diagram with the visual editor, then export as PNG for immediate use.",
    icon: DownloadIcon,
  },
];

// Animation variants for step cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      stiffness: 60, // this is enough for spring
      type: "spring" as const,
    },
  }),
};
// Glow effect for the step number circles
const glowVariants = {
  initial: { boxShadow: "0px 0px 0px 0px rgba(0, 112, 243, 0.5)" },
  animate: {
    boxShadow: [
      "0px 0px 0px 0px rgba(0,112,243,0.5)",
      "0px 0px 16px 8px rgba(0,112,243,0.25)",
      "0px 0px 0px 0px rgba(0,112,243,0.5)",
    ],
    transition: {
      repeat: Infinity,
      duration: 2.5,
    },
  },
};

// Pulse variants for the CTA dots
const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.4, 1],
    opacity: [1, 0.7, 1],
    transition: {
      repeat: Infinity,
      duration: 1.4,
      ease: easeInOut, // <-- Use the imported easing constant
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              How It Works
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            Three simple steps to professional ERD diagrams
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="text-center"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
            >
              <div className="relative mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center mx-auto shadow-lg"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                >
                  <span className="text-white font-bold text-xl">
                    {step.number}
                  </span>
                </motion.div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                {step.description}
              </p>

              <motion.div
                className="bg-white rounded-lg p-4 border border-slate-200 hover:border-primary/30 transition-all duration-300 group"
                whileHover={{
                  scale: 1.08,
                  boxShadow: "0 6px 24px 0 rgba(0,112,243,0.08)",
                }}
              >
                <step.icon className="h-8 w-8 text-primary mx-auto group-hover:scale-110 transition-transform duration-300" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg border border-slate-200">
            <span className="text-slate-600">Ready to get started?</span>
            <div className="flex space-x-2">
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
              ></motion.div>
              <motion.div
                className="w-2 h-2 bg-primary/60 rounded-full"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: 0.3,
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                }}
              ></motion.div>
              <motion.div
                className="w-2 h-2 bg-primary/30 rounded-full"
                variants={pulseVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: 0.6,
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                }}
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
