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
import { useDiagram } from "@/src/context/DiagramContext";
import * as htmlToImage from "html-to-image";
import StatefulButton from "@/components/common/StatefulButton";

type DiagramFormPanelProps = {
  actionLabel: string;
  actionColor?: string; // Tailwind color
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
  const [description, setDescription] = useState(defaultDescription);

  const wordCount = description.trim() === "" ? 0 : description.trim().split(/\s+/).length;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 1000) {
      setDescription(e.target.value);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setLastSavedTitle(title);
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
            />
          )}
        </div>
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

      {/* Diagram Type */}
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
          className="border border-gray-200 bg-gray-50 focus:bg-white rounded-md min-h-[250px] shadow-sm focus:ring-2 focus:ring-blue-200 transition max-h-[350px]"
          value={description}
          onChange={handleDescriptionChange}
        />
        <p className="text-sm text-gray-500 mt-1">{wordCount}/1000</p>
      </div>

      {/* Action and Model */}
      <div className="flex flex-wrap w-full justify-between px-3">
        <Button
          className={`w-full md:w-37 my-4 text-white text-md py-4 rounded-md font-semibold hover-lift transform hover:scale-105 cursor-pointer flex transition-all duration-300 ${actionColor} ${actionButtonClassName}`}
        >
          {actionLabel}
        </Button>

        <div className="mt-4 flex w-full md:w-35">
          <Select>
            <SelectTrigger className="w-full md:w-42 cursor-pointer bg-gray-50 border-gray-200 rounded-md">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="gemini-flash-2.5">Gemini Flash 2.5</SelectItem>
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

function ExportPanel() {
  const { exportPNG, isExporting } = useDiagram();


  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl text-gray-700 border-2 bg-white p-4 flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Export Your Diagram</h2>
      <div className="flex flex-col gap-3">
         {/* PNG Export Button with built-in loading */}
         <StatefulButton
        label="Save as PNG"
        // loadingText="Exporting..."
        onAction={exportPNG}
        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium"
      />
        <Button
          className="bg-purple-500 cursor-pointer hover:bg-purple-600 text-white py-3 rounded-md font-medium"
          onClick={() => console.log("Export as SQL")}
        >
          Save as SQL
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Choose a format to download your ERD. The PNG export will save a visual image of the diagram, while the SQL export will save a generated SQL schema.
      </p>
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
    {
      title: "Export",
      value: "export",
      content: <ExportPanel />,
    },
  ];

  return (
    <div className="h-[35rem] md:h-[48rem] relative flex flex-col max-w-5xl mx-auto w-full">
      <Tabs tabs={tabs} />
    </div>
  );
}
