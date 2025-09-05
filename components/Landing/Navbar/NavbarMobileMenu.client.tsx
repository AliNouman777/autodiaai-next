// components/Landing/NavbarMobileMenu.client.tsx
"use client";

import { createContext, useContext, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import ThemeToggle from "@/components/common/ThemeToggle";
import Button from "../../common/Button";
import ButtonSkeleton from "../../skeleton/landing/ButtonSkeleton";
import { useAuth } from "@/src/context/AuthContext";

type Ctx = { isOpen: boolean; setIsOpen: (v: boolean) => void };
const MobileMenuCtx = createContext<Ctx | null>(null);

/** Inline spinner, theme-friendly */
function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

export function MobileMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MobileMenuCtx.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuCtx.Provider>
  );
}

function useMobileMenu() {
  const ctx = useContext(MobileMenuCtx);
  if (!ctx)
    throw new Error(
      "MobileMenu components must be used within MobileMenuProvider"
    );
  return ctx;
}

export function MobileMenuHeaderControls() {
  const { isOpen, setIsOpen } = useMobileMenu();
  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />
      <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
}

export function MobileMenuPanel() {
  const { isOpen, setIsOpen } = useMobileMenu();
  const { user, initializing } = useAuth();
  const router = useRouter();

  // null | "signup" | "login" | "diagram"
  const [navLoading, setNavLoading] = useState<
    null | "signup" | "login" | "diagram"
  >(null);
  const isBusy = !!navLoading;

  const go =
    (path: string, key: "signup" | "login" | "diagram") =>
    (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      e.preventDefault();
      if (isBusy) return; // ignore double clicks
      setNavLoading(key);
      setIsOpen(false); // close the panel immediately
      router.push(path);
    };

  return (
    <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {/* Menu body */}
      <div className="px-4 pb-4">
        {initializing ? (
          <div className="mt-2">
            <ButtonSkeleton fullWidth />
          </div>
        ) : user ? (
          <div className="mt-2">
            <Button
              href="/diagram"
              onClick={go("/diagram", "diagram")}
              aria-disabled={isBusy}
              className={`bg-primary text-primary-foreground w-full mt-2 px-6 py-2 rounded-full transition font-medium cursor-pointer hover:bg-primary/90 ${
                isBusy ? "pointer-events-none opacity-70" : ""
              }`}
            >
              {navLoading === "diagram" ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Spinner />
                  <span>Opening…</span>
                </span>
              ) : (
                "Generate Diagram"
              )}
            </Button>
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              href="/signup"
              onClick={go("/signup", "signup")}
              aria-disabled={isBusy}
              className={`bg-primary text-primary-foreground w-full px-6 py-2 rounded-full transition font-medium cursor-pointer hover:bg-primary/90 ${
                isBusy ? "pointer-events-none opacity-70" : ""
              }`}
            >
              {navLoading === "signup" ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Spinner />
                  <span>Signing up…</span>
                </span>
              ) : (
                "Sign up"
              )}
            </Button>
            <Button
              href="/login"
              onClick={go("/login", "login")}
              aria-disabled={isBusy}
              className={`border border-border bg-card text-foreground w-full px-6 py-2 rounded-full transition font-medium cursor-pointer hover:bg-accent ${
                isBusy ? "pointer-events-none opacity-70" : ""
              }`}
            >
              {navLoading === "login" ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Spinner />
                  <span>Loading…</span>
                </span>
              ) : (
                "Log in"
              )}
            </Button>
          </div>
        )}

        {/* Optional quick links — left as simple anchors (no spinner needed) */}
        <nav className="mt-4 grid gap-2 text-sm">
          <a
            href="/diagram"
            onClick={() => setIsOpen(false)}
            className="text-foreground hover:underline"
          >
            ERD Generator
          </a>
          <a
            href="/#pricing"
            onClick={() => setIsOpen(false)}
            className="text-foreground hover:underline"
          >
            Pricing
          </a>
          <a
            href="/#faq"
            onClick={() => setIsOpen(false)}
            className="text-foreground hover:underline"
          >
            FAQ
          </a>
          <a
            href="/waitlist"
            onClick={() => setIsOpen(false)}
            className="text-primary hover:underline"
          >
            Pro Waitlist
          </a>
        </nav>
      </div>
    </MobileNavMenu>
  );
}
