"use client";
import * as htmlToImage from "html-to-image";
import React, { createContext, useContext, useRef, useState } from "react";
import type { ReactFlowInstance } from "@xyflow/react";

type DiagramContextType = {
  diagramRef: React.RefObject<HTMLDivElement>;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;
  exportPNG: () => Promise<void>;
  isExporting: boolean;
};

const DiagramContext = createContext<DiagramContextType | undefined>(undefined);

export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportPNG = async () => {
    if (!diagramRef.current || !reactFlowInstance) return;

    try {
      setIsExporting(true);

      // 1️⃣ Fit the diagram
      reactFlowInstance.fitView({ padding: 0.2 });

      // 2️⃣ Give time for view to update
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 3️⃣ Capture screenshot
      const dataUrl = await htmlToImage.toPng(diagramRef.current, {
        backgroundColor: "white",
        quality: 1,
      });

      // 4️⃣ Download file
      const link = document.createElement("a");
      link.download = "diagram.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DiagramContext.Provider
      value={{ diagramRef, setReactFlowInstance, exportPNG, isExporting }}
    >
      {children}
    </DiagramContext.Provider>
  );
};

export const useDiagram = () => {
  const context = useContext(DiagramContext);
  if (!context) throw new Error("useDiagram must be used inside DiagramProvider");
  return context;
};
