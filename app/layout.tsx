// app/layout.tsx or wherever your RootLayout is
import React from "react";
import "@/src/styles/globals.css";
import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main>
            <div className="mx-auto">{children}</div>
          </main>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
