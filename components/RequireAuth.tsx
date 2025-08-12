"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // or next/router for Pages Router
import { useAuth } from "@/src/context/AuthContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !user) router.replace("/login");
  }, [initializing, user, router]);

  if (initializing) return null; // or a spinner
  if (!user) return null;

  return <>{children}</>;
}
