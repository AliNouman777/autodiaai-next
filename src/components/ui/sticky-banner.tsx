// src/components/ui/sticky-banner.tsx
"use client";
import React, { SVGProps, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";

export const StickyBanner = ({
  className,
  children,
  hideOnScroll = false,
}: {
  className?: string;
  children: React.ReactNode;
  hideOnScroll?: boolean;
}) => {
  const [open, setOpen] = useState(true);
  const userClosed = useRef(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Do nothing if auto-hide disabled or user dismissed
    if (!hideOnScroll || userClosed.current) return;
    // Hide when scrolled down, show near top
    setOpen(latest <= 40);
  });

  const handleClose = () => {
    userClosed.current = true; // don't auto-reopen
    setOpen(false); // triggers exit + unmount
  };

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className={cn(
            "sticky inset-x-0 top-0 z-40 flex min-h-14 w-full items-center justify-center bg-transparent px-4 py-1",
            className
          )}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {children}

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleClose}
          >
            <CloseIcon className="h-5 w-5 text-white" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);
