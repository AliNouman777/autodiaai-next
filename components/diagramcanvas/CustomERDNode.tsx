import React, { useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Pencil, Check, X, Trash2, Plus } from "lucide-react";

interface Column {
  id: string;
  title: string;
  type: string;
  key?: string;
}

interface DatabaseSchemaNodeProps {
  data: {
    label: string;
    schema: Column[];
    onChange?: (data: { label: string; schema: Column[] }) => void;
    onNodeUnhover?: () => void;
    onNodeHover?: () => void;
    isHovered?: boolean;
    isConnected?: boolean;
  };
}

const generateId = () =>
  `col-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString().slice(-4)}`;

export default function CustomERDNode({ data }: DatabaseSchemaNodeProps) {
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(() => ({
    label: data.label,
    schema: [...data.schema],
  }));

  const resetEditData = useCallback(() => {
    setEditData({ label: data.label, schema: [...data.schema] });
  }, [data.label, data.schema]);

  const handleSave = useCallback(() => {
    setEdit(false);
    // Optional parent sync: data.onChange?.(editData);
  }, [editData]);

  const handleCancel = useCallback(() => {
    resetEditData();
    setEdit(false);
  }, [resetEditData]);

  const updateCol = useCallback((idx: number, key: keyof Column, value: string) => {
    setEditData(prev => {
      const updatedSchema = [...prev.schema];
      updatedSchema[idx] = { ...updatedSchema[idx], [key]: value };
      return { ...prev, schema: updatedSchema };
    });
  }, []);

  const handleDeleteCol = useCallback((idx: number) => {
    setEditData(prev => ({
      ...prev,
      schema: prev.schema.filter((_, i) => i !== idx),
    }));
  }, []);

  const handleAddRow = useCallback(() => {
    setEditData(prev => ({
      ...prev,
      schema: [...prev.schema, { id: generateId(), title: "", type: "", key: "" }],
    }));
  }, []);

  const glowClasses = [
    data.isHovered && "ring-1 ring-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.8)]",
    data.isConnected && "ring-1 ring-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.9)]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`min-w-[200px] rounded-lg bg-white border border-gray-300 shadow transition-shadow font-sans text-xs duration-150 relative group ${glowClasses}`}
      onMouseEnter={data.onNodeHover}
      onMouseLeave={data.onNodeUnhover}
    >
      {/* Action Buttons */}
      <div className="absolute top-1 right-2 flex gap-1 z-10">
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            className="opacity-70 hover:opacity-100 text-white cursor-pointer bg-blue-600 rounded p-1 transition"
            title="Edit Table"
          >
            <Pencil size={16} />
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="text-green-600 bg-white rounded hover:bg-green-100 p-1 transition"
              title="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-600 bg-white rounded hover:bg-red-100 p-1 transition"
              title="Cancel"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>

      {/* Table Label */}
      {!edit ? (
        <div className="bg-blue-600 text-white px-2.5 py-1.5 font-bold rounded-t-lg text-center text-sm">
          {editData.label}
        </div>
      ) : (
        <input
          value={editData.label}
          onChange={(e) => setEditData(prev => ({ ...prev, label: e.target.value }))}
          className="bg-blue-50 border-b-2 border-blue-500 px-2.5 py-1.5 font-bold rounded-t-lg text-center text-sm w-full focus:outline-none"
        />
      )}

      {/* Schema Columns */}
      <div>
        {editData.schema.map((col, idx) => (
          <div
            key={col.id}
            className={`flex items-center px-2 py-1 border-b last:border-b-0 ${
              col.key === "PK" ? "bg-yellow-100" : col.key === "FK" ? "bg-blue-100" : "bg-white"
            } relative min-h-[32px]`}
          >
            {/* Left Handle */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${col.id}-left`}
              className="!bg-blue-600 w-2 h-2 absolute -left-2 top-1/2 -translate-y-1/2"
            />

            {!edit ? (
              <span className="flex justify-between w-full">
                <span className="flex items-center ml-2">
                  {col.key && (
                    <span className="mr-1.5 text-xs">{col.key === "PK" ? "🔑" : "🔗"}</span>
                  )}
                  <span className="font-medium">{col.title}</span>
                </span>
                <span className="text-gray-500 text-xs">{col.type}</span>
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1 ml-2">
                  <select
                    value={col.key ?? ""}
                    onChange={(e) => updateCol(idx, "key", e.target.value)}
                    className="rounded border border-gray-300 text-xs focus:border-blue-400 bg-white w-[52px]"
                  >
                    <option value="">None</option>
                    <option value="PK">PK</option>
                    <option value="FK">FK</option>
                  </select>
                  <input
                    value={col.title}
                    onChange={(e) => updateCol(idx, "title", e.target.value)}
                    className="border-b border-gray-200 focus:border-blue-400 bg-transparent px-1 py-0.5 w-20 text-xs"
                  />
                </span>
                <input
                  value={col.type}
                  onChange={(e) => updateCol(idx, "type", e.target.value)}
                  className="border-b border-gray-200 focus:border-blue-400 bg-transparent px-1 py-0.5 w-14 text-xs text-gray-700"
                />
                <button
                  type="button"
                  title="Delete row"
                  onClick={() => handleDeleteCol(idx)}
                  className="ml-2 text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}

            {/* Right Handle */}
            <Handle
              type="source"
              position={Position.Right}
              id={`${col.id}-right`}
              className="!bg-blue-600 w-2 h-2 absolute -right-2 top-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>

      {/* Add Row */}
      {edit && (
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center justify-center w-full gap-1 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-1 transition"
        >
          <Plus size={16} />
          <span className="text-xs font-medium">Add Row</span>
        </button>
      )}
    </div>
  );
}
