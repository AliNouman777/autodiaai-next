"use client";

import { motion } from "motion/react";
import Image from "next/image";
import StatefulButton from "../common/StatefulButton";
import Button from "../common/Button";

export default function Hero() {
  return (
    <section className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center px-4">
      {/* Decorative gradient borders */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      <div className="py-10 md:py-20">
        {/* Animated headline */}
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
          {"AI ERD Generator — Create Database Diagrams from Text"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.08,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-2xl py-6 text-center text-lg font-normal text-muted-foreground"
        >
          Instantly build professional{" "}
          <strong  >Entity Relationship Diagrams (ERDs)</strong> from plain text.
          Edit, refine, and export your diagram in seconds.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-4"
        >
          <StatefulButton
            navigateTo="/diagram"
            label="Start Free — Generate Your ERD"
          />
          <Button
            href="/#pricing"
            className="border border-border text-foreground px-8 py-2 rounded-md hover:bg-accent transition-all duration-300 font-semibold text-lg hover-lift cursor-pointer"
          >
            See Pricing
          </Button>
        </motion.div>

        {/* Horizontal value bullets */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className="relative z-10 mt-10 flex flex-col items-center gap-4 text-foreground/90 text-base sm:flex-row sm:flex-wrap sm:justify-center"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-2"></span>
            <span>Generate ERDs from natural language prompts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-1"></span>
            <span>No login required — guest users can create up to 4 diagrams</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-3"></span>
            <span>Free account unlocks 10 diagrams + exports</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-4"></span>
            <span>Pro plan coming soon for unlimited AI diagrams</span>
          </div>
        </motion.div>

        {/* Hero preview image */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.4 }}
          className="relative z-10 mt-16 rounded-3xl border border-border bg-muted/50 p-4 shadow-md"
        >
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <Image
              src="/erd.png"
              alt="Autodia AI — ERD Generator Preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              width={1000}
              height={600}
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
