// components/Landing/NavbarDesktopCTA.client.tsx
"use client";

import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "../../common/Button";
import ButtonSkeleton from "../../skeleton/landing/ButtonSkeleton";
import { useAuth } from "@/src/context/AuthContext";

/* Minimal inline spinner that fits your tokenized theme */
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

export default function NavbarDesktopCTA() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  // null | "signup" | "login"
  const [navLoading, setNavLoading] = useState<null | "signup" | "login">(null);

  const go = (path: string, key: "signup" | "login") => (e: MouseEvent) => {
    // Prevent default <a> navigation so React can re-render showing the spinner
    e.preventDefault();
    if (navLoading) return; // ignore double clicks
    setNavLoading(key);
    router.push(path);
  };

  if (initializing) {
    return (
      <div className="flex items-center gap-2">
        <ButtonSkeleton />
        <ButtonSkeleton />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          href="/diagram"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition font-medium cursor-pointer"
        >
          Generate Diagram
        </Button>
      </div>
    );
  }

  const isBusy = !!navLoading;

  return (
    <div className="flex items-center gap-2">
      <Button
        href="/signup"
        onClick={go("/signup", "signup")}
        aria-disabled={isBusy}
        className={`bg-primary text-primary-foreground px-6 py-2 rounded-full transition font-medium cursor-pointer hover:bg-primary/90 ${
          isBusy ? "pointer-events-none opacity-70" : ""
        }`}
      >
        {navLoading === "signup" ? (
          <span className="inline-flex items-center gap-2">
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
        className={`border border-border bg-card text-foreground px-6 py-2 rounded-full transition font-medium cursor-pointer hover:bg-accent ${
          isBusy ? "pointer-events-none opacity-70" : ""
        }`}
      >
        {navLoading === "login" ? (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            <span>Loading…</span>
          </span>
        ) : (
          "Log in"
        )}
      </Button>
    </div>
  );
}
