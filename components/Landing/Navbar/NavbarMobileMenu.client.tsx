// components/Landing/NavbarMobileMenu.client.tsx
"use client";

import { createContext, useContext, useState } from "react";
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
              className="bg-primary text-primary-foreground w-full mt-2 px-6 py-2 rounded-full hover:bg-primary/90 transition font-medium cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Generate Diagram
            </Button>
          </div>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              href="/signup"
              className="bg-primary text-primary-foreground w-full px-6 py-2 rounded-full hover:bg-primary/90 transition font-medium cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Sign up
            </Button>
            <Button
              href="/login"
              className="border border-border bg-card text-foreground w-full px-6 py-2 rounded-full hover:bg-accent transition font-medium cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Log in
            </Button>
          </div>
        )}

        {/* Optional quick links—add if you like */}
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
