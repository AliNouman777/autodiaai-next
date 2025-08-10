"use client";
import { Button } from "@/src/components/ui/stateful-button";
import { useRouter } from "next/navigation";
import React , {useState} from "react";

type StatefulButtonProps = {
  label: string;
  navigateTo?: string; // optional route to navigate to
  delay?: number;      // delay in ms before action
  onAction?: () => Promise<void> | void; // async/ sync action
  className?: string;
  loadingText?: string; 
};

const StatefulButton: React.FC<StatefulButtonProps> = ({
  label,
  navigateTo,
  delay = 0,
  onAction,
  className = "",
  loadingText = "Processing...",
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      if (delay > 0) {
        await new Promise((res) => setTimeout(res, delay));
      }

      if (onAction) {
        await onAction();
      }

      if (navigateTo) {
        router.push(navigateTo);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      // className={`${className} ${loading ? "opacity-70 cursor-wait" : ""}`}
    >
      {loading ? loadingText : label}
    </Button>
  );
};

export default StatefulButton;

