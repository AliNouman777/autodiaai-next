// components/Landing/NavbarDesktopCTA.client.tsx
"use client";

import Button from "../../common/Button";
import ButtonSkeleton from "../../skeleton/landing/ButtonSkeleton";
import { useAuth } from "@/src/context/AuthContext";

export default function NavbarDesktopCTA() {
  const { user, initializing } = useAuth();

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

  return (
    <div className="flex items-center gap-2">
      <Button
        href="/signup"
        className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition font-medium cursor-pointer"
      >
        Sign up
      </Button>
      <Button
        href="/login"
        className="border border-border bg-card text-foreground px-6 py-2 rounded-full hover:bg-accent transition font-medium cursor-pointer"
      >
        Log in
      </Button>
    </div>
  );
}
