"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && user) {
      router.replace("/"); // send logged-in users home
    }
  }, [initializing, user, router]);

  if (initializing) return null; // or show a loading spinner
  if (user) return null; // don't flash login form

  return <>{children}</>;
}
