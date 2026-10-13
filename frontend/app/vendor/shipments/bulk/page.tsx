
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Download,
  FileSpreadsheet,
  FileCheck2,
  AlertCircle,
  X,
  CheckCircle2,
} from "lucide-react";

const requiredColumns = [
  "sender_name",
  "sender_phone",
  "sender_address",
  "sender_city",
  "receiver_name",
  "receiver_phone",
  "receiver_address",
  "receiver_city",
  "parcel_description",
  "weight",
  "parcel_value",
  "payment_method",
];

type PreviewRow = {
  values: string[];
  line: number;
  errors: string[];
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && inQuotes && line[i + 1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}

export default function BulkUploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validCount = rows.filter((row) => row.errors.length === 0).length;
  const invalidCount = rows.length - validCount;

  function downloadTemplate() {
    const example = [
      "Muna Store",
      "9800000001",
      "Thamel, Kathmandu",
      "Kathmandu",
      "Ram Sharma",
      "9800000002",
      "Lakeside, Pokhara",
      "Pokhara",
      "Clothing",
      "1",
      "2500",
      "COD",
    ];

    const csv = [
      requiredColumns,
      example,
    ]
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    downloadFile(csv, "aarambha-shipment-template.csv");
  }

  async function handleFile(file?: File) {
    setError("");
    setMessage("");
    setRows([]);
    setHeaders([]);
    setFileName("");

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a .csv file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be 5 MB or less.");
      return;
    }

    setLoading(true);

    try {
      const content = await file.text();
      const lines = content
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)
        .filter((line) => line.trim().length > 0);

      if (lines.length < 2) {
        throw new Error("The CSV must contain a header and at least one data row.");
      }

      const parsedHeaders = parseCsvLine(lines[0]).map((header) =>
        header.trim().toLowerCase()
      );

      const missingColumns = requiredColumns.filter(
        (column) => !parsedHeaders.includes(column)
      );

      if (missingColumns.length > 0) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}`
        );
      }

      const parsedRows: PreviewRow[] = lines.slice(1).map((line, index) => {
        const values = parseCsvLine(line);
        const rowErrors: string[] = [];

        if (values.length !== parsedHeaders.length) {
          rowErrors.push("Column count does not match the header.");
        }

        const getValue = (column: string) =>
          values[parsedHeaders.indexOf(column)]?.trim() ?? "";

        for (const column of requiredColumns) {
          if (!getValue(column)) {
            rowErrors.push(`Missing ${column}.`);
          }
        }

        const weight = Number(getValue("weight"));
        const parcelValue = Number(getValue("parcel_value"));

        if (getValue("weight") && (!Number.isFinite(weight) || weight <= 0)) {
          rowErrors.push("Weight must be greater than zero.");
        }

        if (
          getValue("parcel_value") &&
          (!Number.isFinite(parcelValue) || parcelValue < 0)
        ) {
          rowErrors.push("Parcel value must be zero or greater.");
        }

        const paymentMethod = getValue("payment_method").toLowerCase();

        if (
          paymentMethod &&
          !["cod", "prepaid"].includes(paymentMethod)
        ) {
          rowErrors.push("Payment method must be COD or Prepaid.");
        }

        return {
          values,
          line: index + 2,
          errors: [...new Set(rowErrors)],
        };
      });

      setFileName(file.name);
      setHeaders(parsedHeaders);
      setRows(parsedRows);
      setMessage("CSV loaded successfully. Review the rows before importing.");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not read the CSV file."
      );
    } finally {
      setLoading(false);
    }
  }

  function exportPreview() {
    const csv = [
      headers,
      ...rows.map((row) => row.values),
    ]
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    downloadFile(csv, "shipment-preview.csv");
  }

  function importShipments() {
    if (rows.length === 0) {
      setError("Please select a valid CSV file first.");
      return;
    }

    if (invalidCount > 0) {
      setError("Fix all invalid rows before importing.");
      return;
    }

    setError("");
    setMessage(
      `${validCount} rows passed validation. Connect your backend API to save these shipments. No shipments have been created yet.`
    );
  }

  function clearFile() {
    setFileName("");
    setHeaders([]);
    setRows([]);
    setError("");
    setMessage("");

    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <main className="min-h-screen bg-app p-4 text-fg sm:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <Link
          href="/vendor/shipments"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary"
        >
          <ArrowLeft size={17} />
          Back to Shipments
        </Link>

        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted">Vendor / Shipments / Bulk Upload</p>
            <h1 className="mt-2 text-3xl font-bold">Bulk Upload</h1>
            <p className="mt-2 text-sm text-muted">
              Import multiple shipments using a properly formatted CSV file.
            </p>
          </div>

          <button
            onClick={downloadTemplate}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm font-semibold hover:bg-panel"
          >
            <Download size={17} />
            Download Template
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total Rows"
            value={rows.length}
            icon={<FileSpreadsheet size={21} />}
          />
          <SummaryCard
            label="Valid Rows"
            value={validCount}
            icon={<CheckCircle2 size={21} />}
          />
          <SummaryCard
            label="Invalid Rows"
            value={invalidCount}
            icon={<AlertCircle size={21} />}
          />
        </section>

        <section className="card p-5 sm:p-8">
          <h2 className="text-lg font-semibold">Upload CSV File</h2>
          <p className="mt-2 text-sm text-muted">
            CSV files only. Maximum file size: 5 MB.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />

          {!fileName ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="mt-6 flex min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-hairline p-6 text-center transition hover:border-primary hover:bg-primary/5 disabled:opacity-50"
            >
              <span className="rounded-2xl bg-primary/15 p-4 text-primary">
                <Upload size={32} />
              </span>
              <span className="mt-5 font-semibold">
                {loading ? "Reading CSV..." : "Choose a CSV file"}
              </span>
              <span className="mt-2 text-sm text-muted">
                Click here to browse files
              </span>
            </button>
          ) : (
            <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-hairline bg-panel p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/15 p-3 text-primary">
                  <FileCheck2 size={26} />
                </div>
                <div>
                  <p className="font-semibold">{fileName}</p>
                  <p className="mt-1 text-sm text-muted">
                    {rows.length} data rows loaded
                  </p>
                </div>
              </div>

              <button
                onClick={clearFile}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-hairline px-4 py-2.5 text-sm hover:bg-app"
              >
                <X size={16} />
                Remove File
              </button>
            </div>
          )}

          {error && (
            <div role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div role="status" className="mt-5 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm">
              {message}
            </div>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex flex-col justify-between gap-4 border-b border-hairline p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">CSV Preview</h2>
              <p className="mt-1 text-sm text-muted">
                Review your imported data and correct invalid rows.
              </p>
            </div>

            {rows.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportPreview}
                  className="inline-flex items-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm font-semibold hover:bg-panel"
                >
                  <Download size={16} />
                  Export Preview
                </button>

                <button
                  onClick={importShipments}
                  disabled={invalidCount > 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-dark-1 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Upload size={16} />
                  Validate Import
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-panel text-muted">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4">Row</th>
                  {headers.map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-4 font-medium">
                      {header}
                    </th>
                  ))}
                  {rows.length > 0 && (
                    <th className="whitespace-nowrap px-4 py-4">Validation</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-hairline">
                {rows.slice(0, 100).map((row) => (
                  <tr
                    key={row.line}
                    className={row.errors.length ? "bg-red-500/5" : "hover:bg-panel"}
                  >
                    <td className="px-4 py-4 text-muted">{row.line}</td>

                    {headers.map((header, index) => (
                      <td key={`${row.line}-${header}`} className="whitespace-nowrap px-4 py-4">
                        {row.values[index] ?? ""}
                      </td>
                    ))}

                    <td className="px-4 py-4">
                      {row.errors.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 size={15} />
                          Valid
                        </span>
                      ) : (
                        <span
                          title={row.errors.join("\n")}
                          className="inline-flex items-center gap-1 text-red-500"
                        >
                          <AlertCircle size={15} />
                          {row.errors.length} issue(s)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={Math.max(headers.length + 2, 3)} className="px-5 py-16 text-center">
                      <FileSpreadsheet size={32} className="mx-auto text-muted" />
                      <p className="mt-3 font-medium">No CSV data yet</p>
                      <p className="mt-1 text-sm text-muted">
                        Upload a file to preview shipment rows here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {rows.length > 100 && (
            <p className="border-t border-hairline p-4 text-sm text-muted">
              Showing the first 100 of {rows.length} rows. Validation covers all rows.
            </p>
          )}
        </section>

        <section className="card p-5">
          <h2 className="font-semibold">Required CSV Columns</h2>
          <p className="mt-2 text-sm text-muted">
            Your CSV must contain these exact column names in its header row.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {requiredColumns.map((column) => (
              <code
                key={column}
                className="rounded-lg bg-panel px-3 py-2 text-xs"
              >
                {column}
              </code>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="card flex items-center justify-between p-5">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-3 text-3xl font-bold">{value}</p>
      </div>
      <div className="rounded-xl bg-primary/15 p-3 text-primary">
        {icon}
      </div>
    </div>
  );
}
