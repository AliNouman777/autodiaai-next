// app/layout.tsx or wherever your RootLayout is
import React from "react";
import "@/src/styles/globals.css";
import { DiagramProvider } from "@/src/context/DiagramContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the whole app with DiagramProvider */}
        <DiagramProvider>
          <main>
            <div className="mx-auto">{children}</div>
          </main>
        </DiagramProvider>
      </body>
    </html>
  );
}
