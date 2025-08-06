import React from "react";
import "@/src/styles/globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Add providers/context here if needed */}
        <main>
          <div className=" mx-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
