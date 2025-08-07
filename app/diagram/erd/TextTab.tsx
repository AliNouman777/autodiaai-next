"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type DiagramFormPanelProps = {
  actionLabel: string;
  actionColor?: string; // Tailwind color (e.g. bg-primary, bg-green-500)
  showSelectDiagram?: boolean;
  defaultTitle?: string;
  defaultDescription?: string;
  actionButtonClassName?: string;
};

function DiagramFormPanel({
  actionLabel,
  actionColor = "bg-primary hover:bg-blue-700",
  showSelectDiagram = true,
  defaultTitle = "Untitled",
  defaultDescription = "",
  actionButtonClassName = "",
}: DiagramFormPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [lastSavedTitle, setLastSavedTitle] = useState(defaultTitle);

  const handleSave = () => {
    setIsEditing(false);
    setLastSavedTitle(title);
    // You can add save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTitle(lastSavedTitle);
  };

  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl text-gray-700 border-2 bg-white">
      {/* Header */}
      <div className="flex outline-none mx-auto justify-between w-full p-3 items-center">
        <div className="mt-1 flex-1">
          {!isEditing ? (
            <span
              className="block text-lg font-semibold cursor-pointer transition hover:text-blue-600"
              onClick={() => setIsEditing(true)}
              tabIndex={0}
              role="button"
            >
              {title}
            </span>
          ) : (
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold"
              onBlur={() => setIsEditing(false)} // Optional: remove if you want Save/Cancel only
            />
          )}
        </div>
        {/* Only show Save/Cancel when editing */}
        {isEditing && (
          <div className="mt-1 ml-2 flex gap-2">
            <Button
              className="px-3 font-bold cursor-pointer border rounded-md text-xs"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="px-5 font-bold border text-xs cursor-pointer rounded-md"
              type="button"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Diagram Type (Create only) */}
      {showSelectDiagram && (
        <div className="px-3">
          <Select>
            <SelectTrigger className="w-full mx-auto">
              <SelectValue placeholder="Select a Diagram" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Auto">Auto</SelectItem>
                <SelectItem value="ERD">Entity Relation Diagram</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Description */}
      <div className="p-3 w-full">
        <Textarea
          placeholder="Enter the Diagram Description"
          className="border border-gray-200 bg-gray-50 focus:bg-white rounded-md min-h-[250px] shadow-sm focus:ring-2 focus:ring-blue-200 transition"
          defaultValue={defaultDescription}
        />
      </div>

      {/* Action and Model */}
      <div className="flex flex-wrap w-full justify-between px-3 ">
        <Button
          className={`
            w-full md:w-37 my-4 text-white text-md py-4 rounded-md font-semibold hover-lift transform hover:scale-105 cursor-pointer flex
            transition-all duration-300
            ${actionColor} ${actionButtonClassName}
          `}
        >
          {actionLabel}
        </Button>

        <div className="mt-4 flex w-full md:w-35 ">
          <Select>
            <SelectTrigger className="w-full md:w-42 cursor-pointer bg-gray-50 border-gray-200 rounded-md">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="gemini-flash-2.5">
                  Gemini Flash 2.5
                </SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function TabsDemo() {
  const tabs = [
    {
      title: "Create",
      value: "create",
      content: (
        <DiagramFormPanel
          actionLabel="Generate Diagram"
          actionColor="bg-primary hover:bg-blue-700"
          showSelectDiagram={true}
        />
      ),
    },
    {
      title: "Update",
      value: "update",
      content: (
        <DiagramFormPanel
          actionLabel="Update Diagram"
          actionColor="bg-green-500 hover:bg-green-700"
          showSelectDiagram={false}
        />
      ),
    },
  ];

  return (
    <div className="h-[35rem] md:h-[48rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start ">
      <Tabs tabs={tabs} />
    </div>
  );
}
