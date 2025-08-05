import React from "react";
import "@/src/styles/globals.css";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Add providers/context here if needed */}
        <main className="container mx-auto" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
