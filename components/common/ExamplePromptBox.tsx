"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Lightbulb, ChevronDown, SendIcon } from "lucide-react";

export type ExamplePrompt = {
  title: string;
  description: string;
  prompt: string;
};

type ExamplePromptBoxProps = {
  prompts: ExamplePrompt[];
  onPick: (promptText: string) => void;
  defaultOpen?: boolean;
  className?: string;
  title?: string; // label text (defaults to "Example Prompts")
};

const ExamplePromptBox: React.FC<ExamplePromptBoxProps> = ({
  prompts,
  onPick,
  defaultOpen = false,
  className,
  title = "Example Prompts",
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className={className}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-10">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span>{title}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-3 mt-3">
          {prompts.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPick(ex.prompt)}
              className="
                w-full text-left p-4 rounded-lg
                border border-border
                bg-card
                hover:bg-accent/50
                transition-all duration-300 group
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
              "
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {ex.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ex.description}
                  </p>
                </div>
                <SendIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1 opacity-0 group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ExamplePromptBox;
