"use client";

/**
 * Compact FloatingDock with action support
 * - Smaller rail and icons
 * - Subtler hover expansion
 */

import { cn } from "@/lib/utils";
import { PanelRightClose } from "lucide-react";
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React, { useRef, useState } from "react";

export type FloatingDockItem = {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: FloatingDockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

/* ---------------- Mobile ---------------- */

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => {
              const content = (
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs",
                    item.active
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  )}
                >
                  {/* keep icon box small */}
                  <div className="h-4 w-4">{item.icon}</div>
                </div>
              );

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    transition: { delay: idx * 0.04 },
                  }}
                  transition={{ delay: (items.length - 1 - idx) * 0.04 }}
                >
                  {item.onClick ? (
                    <button
                      type="button"
                      onClick={item.onClick}
                      aria-pressed={item.active}
                      className="outline-none"
                    >
                      {content}
                    </button>
                  ) : (
                    <a href={item.href || "#"} aria-current={item.active}>
                      {content}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
        title={open ? "Close menu" : "Open menu"}
      >
        <PanelRightClose className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

/* ---------------- Desktop ---------------- */

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: FloatingDockItem[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        // smaller rail + tighter spacing
        "mx-auto hidden h-12 items-end gap-2 rounded-2xl bg-gray-50 px-2 pb-1.5 md:flex dark:bg-neutral-900",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
  active,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Narrower influence range so the hover growth feels subtle
  const RANGE = 110;

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Smaller min/max; subtle expansion
  const wT = useTransform(distance, [-RANGE, 0, RANGE], [28, 48, 28]);
  const hT = useTransform(distance, [-RANGE, 0, RANGE], [28, 48, 28]);
  const wIconT = useTransform(distance, [-RANGE, 0, RANGE], [14, 24, 14]);
  const hIconT = useTransform(distance, [-RANGE, 0, RANGE], [14, 24, 14]);

  const spring = { mass: 0.1, stiffness: 160, damping: 14 };
  const width = useSpring(wT, spring);
  const height = useSpring(hT, spring);
  const widthIcon = useSpring(wIconT, spring);
  const heightIcon = useSpring(hIconT, spring);

  const shell = (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-full transition-colors",
        active
          ? "bg-blue-600 text-white ring-2 ring-blue-500/40"
          : "bg-gray-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
      )}
      aria-pressed={active}
      data-active={active ? "" : undefined}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-7 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[10px] text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ width: widthIcon, height: heightIcon }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={title}
        className="outline-none"
      >
        {shell}
      </button>
    );
  }

  return (
    <a href={href || "#"} aria-current={active}>
      {shell}
    </a>
  );
}
