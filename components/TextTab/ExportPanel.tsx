import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelect } from "@/components/common/AppSelect";
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";
import StatefulButton from "@/components/common/StatefulButton";
import { useDiagram, useExportSql } from "@/src/context/DiagramContext";
import { toast } from "react-hot-toast";

type SqlDialect = "postgres" | "mysql" | "sqlite";
const DIALECT_OPTIONS = [
  { value: "postgres", label: "Postgres" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
] as const;

const ExportPanel: React.FC<{ diagramId: string; defaultTitle?: string }> = ({
  diagramId,
  defaultTitle,
}) => {
  const { exportPNG } = useDiagram();
  const { exportSQL } = useExportSql();

  const [dialect, setDialect] = useState<SqlDialect>("postgres");
  const [filename, setFilename] = useState<string>(
    defaultTitle || "Untitled Diagram"
  );
  const [busy, setBusy] = useState(false);

  const handleExportSql = async () => {
    try {
      setBusy(true);
      const { blob, filename: serverFilename } = await exportSQL(diagramId, {
        dialect,
        filename,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = serverFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Export failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full overflow-hidden relative h-full rounded-2xl bg-card text-card-foreground border border-border p-4 flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Export Your Diagram</h2>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2 w-full justify-between">
          <label className="text-sm font-medium">SQL Dialect</label>
          <AppSelect<SqlDialect>
            value={dialect}
            onChange={setDialect}
            options={DIALECT_OPTIONS}
            placeholder="Choose dialect"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium">File name</label>
          <Input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="diagram"
          />
          <p className="text-xs text-muted-foreground">
            The <code>.sql</code> extension will be added automatically.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          disabled={busy}
          onClick={handleExportSql}
          className="text-lg cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground py-5 rounded-md font-medium disabled:opacity-60"
        >
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-4 w-4" /> Exporting SQL…
            </span>
          ) : (
            "Save as SQL"
          )}
        </Button>

        <StatefulButton
          label="Save as PNG"
          onAction={exportPNG}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg rounded-md font-medium"
        />
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Choose a format to download your ERD. PNG will save the diagram image;
        SQL will generate a schema based on your diagram.
      </p>
    </div>
  );
};

export default ExportPanel;
