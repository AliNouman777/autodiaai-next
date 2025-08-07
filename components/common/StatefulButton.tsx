"use client";
import React from "react";
import { Button } from "@/src/components/ui/stateful-button";
import { useRouter } from "next/navigation";

const StatefulButton = () => {
  const router = useRouter();

  const handleClick = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        router.push("/diagram/erd");
      }, 1000);
    });
  };

  return (
    <div className="py-3">
      <Button onClick={handleClick}> Create New Diagram</Button>
    </div>
  );
};

export default StatefulButton;
