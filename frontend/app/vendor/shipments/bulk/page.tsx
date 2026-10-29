
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
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const REQUIRED_COLUMNS = [
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
] as const;

type CsvRow = Record<string, string>;

type ValidatedRow = {
  rowNumber: number;
  values: CsvRow;
  errors: string[];
};

type ShipmentPayload = {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  description: string;
  weight: number;
  parcelValue: number;
  paymentMethod: "COD" | "PREPAID";
};

const SAMPLE_ROW = [
  "Muna Store",
  "9800000001",
  "Thamel",
  "Kathmandu",
  "Ram Sharma",
  "9800000002",
  "Lakeside",
  "Pokhara",
  "Clothing",
  "1",
  "2500",
  "COD",
];

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);

      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }

      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (quoted) {
    throw new Error("Your CSV contains an unclosed quotation mark.");
  }

  if (cell.length || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  return rows;
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function validateRows(
  headers: string[],
  records: string[][]
): ValidatedRow[] {
  return records.map((record, index) => {
    const values: CsvRow = {};

    headers.forEach((header, columnIndex) => {
      values[header] = (record[columnIndex] ?? "").trim();
    });

    const errors: string[] = [];
    const rowNumber = index + 2;

    const requiredFields = [
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

    for (const field of requiredFields) {
      if (!values[field]) errors.push(`${field} is required`);
    }

    const phoneRegex = /^9[678]\d{8}$/;

    if (values.sender_phone && !phoneRegex.test(values.sender_phone)) {
      errors.push("Invalid sender phone (use a 10-digit Nepali mobile number)");
    }

    if (values.receiver_phone && !phoneRegex.test(values.receiver_phone)) {
      errors.push("Invalid receiver phone (use a 10-digit Nepali mobile number)");
    }

    const weight = Number(values.weight);
    if (values.weight && (!Number.isFinite(weight) || weight <= 0)) {
      errors.push("Weight must be a number greater than zero");
    }

    const parcelValue = Number(values.parcel_value);
    if (
      values.parcel_value &&
      (!Number.isFinite(parcelValue) || parcelValue < 0)
    ) {
      errors.push("Parcel value must be zero or greater");
    }

    const method = values.payment_method?.toUpperCase();
    if (values.payment_method && !["COD", "PREPAID"].includes(method)) {
      errors.push("Payment method must be COD or PREPAID");
    }

    return { rowNumber, values, errors };
  });
}

function toShipment(row: CsvRow): ShipmentPayload {
  return {
    senderName: row.sender_name,
    senderPhone: row.sender_phone,
    senderAddress: row.sender_address,
    senderCity: row.sender_city,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    receiverAddress: row.receiver_address,
    receiverCity: row.receiver_city,
    description: row.parcel_description,
    weight: Number(row.weight),
    parcelValue: Number(row.parcel_value),
    paymentMethod: row.payment_method.toUpperCase() as "COD" | "PREPAID",
  };
}

export default function BulkShipmentUploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ValidatedRow[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  const validCount = rows.filter((row) => row.errors.length === 0).length;
  const invalidCount = rows.length - validCount;
  const allValid = rows.length > 0 && invalidCount === 0;

  function resetFile() {
    setFileName("");
    setRows([]);
    setError("");
    setMessage("");
    setImportedCount(null);

    if (inputRef.current) inputRef.current.value = "";
  }

  function downloadTemplate() {
    downloadCsv("aarambha-shipment-template.csv", [
      [...REQUIRED_COLUMNS],
      SAMPLE_ROW,
    ]);
  }

  async function handleFile(file?: File) {
    setError("");
    setMessage("");
    setImportedCount(null);
    setRows([]);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a .csv file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The file is too large. Maximum file size is 5 MB.");
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseCsv(text);

      if (parsed.length < 2) {
        throw new Error("The CSV must contain a header and at least one shipment.");
      }

      const headers = parsed[0].map((header, index) =>
        (index === 0 ? header.replace(/^\uFEFF/, "") : header)
          .trim()
          .toLowerCase()
      );

      const missingColumns = REQUIRED_COLUMNS.filter(
        (column) => !headers.includes(column)
      );

      if (missingColumns.length) {
        throw new Error(
          `Missing required columns: ${missingColumns.join(", ")}. Download the template and use its exact column names.`
        );
      }

      const duplicateHeaders = headers.filter(
        (header, index) => headers.indexOf(header) !== index
      );

      if (duplicateHeaders.length) {
        throw new Error(
          `Duplicate CSV columns found: ${[...new Set(duplicateHeaders)].join(", ")}`
        );
      }

      const records = parsed.slice(1);

      if (records.some((record) => record.length !== headers.length)) {
        throw new Error(
          "One or more CSV rows have a different number of columns than the header."
        );
      }

      const validated = validateRows(headers, records);

      setFileName(file.name);
      setRows(validated);
      setMessage(
        `Validated ${validated.length} row(s): ${validated.filter((row) => !row.errors.length).length} valid, ${validated.filter((row) => row.errors.length).length} invalid.`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not read this CSV file."
      );
    }
  }

  async function importShipments() {
    setError("");
    setMessage("");
    setImportedCount(null);

    if (!allValid) {
      setError("Fix all invalid rows before importing shipments.");
      return;
    }

    setImporting(true);

    try {
      const shipments = rows.map((row) => toShipment(row.values));

      const response = await fetch(`${API_URL}/api/shipments/bulk`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ shipments }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(
          payload.message ||
            `Import failed (${response.status}). Please check the backend API.`
        );
      }

      const count =
        typeof payload.importedCount === "number"
          ? payload.importedCount
          : typeof payload.count === "number"
            ? payload.count
            : shipments.length;

      setImportedCount(count);
      setMessage(
        `The server reported ${count} imported shipment(s).`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Import failed. Please try again."
      );
    } finally {
      setImporting(false);
    }
  }

  function exportPreview() {
    const outputRows = [
      [...REQUIRED_COLUMNS],
      ...rows.map((row) =>
        REQUIRED_COLUMNS.map((column) => row.values[column] || "")
      ),
    ];

    downloadCsv("aarambha-shipment-preview.csv", outputRows);
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5] p-4 text-[#141B22] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <Link
            href="/vendor/shipments"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} /> Back to shipments
          </Link>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Bulk shipment upload
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Upload a CSV file to validate and import multiple shipments into
            your vendor account.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total rows</p>
            <p className="mt-2 text-3xl font-bold">{rows.length}</p>
          </div>
          <div className="border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Valid rows</p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {validCount}
            </p>
          </div>
          <div className="border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Rows with errors</p>
            <p className="mt-2 text-3xl font-bold text-red-700">
              {invalidCount}
            </p>
          </div>
        </section>

        <section className="border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold">1. Prepare your CSV</h2>
              <p className="mt-1 text-sm text-gray-600">
                Use the template so the column names match exactly.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              <Download size={16} /> Download CSV template
            </button>
          </div>

          <div className="mt-5 border border-gray-200 bg-[#F7F7F5] p-4">
            <p className="text-sm font-semibold">Required columns</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {REQUIRED_COLUMNS.map((column) => (
                <span
                  key={column}
                  className="border border-gray-200 bg-white px-2 py-1 font-mono text-xs"
                >
                  {column}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Phone numbers must use the 10-digit Nepali mobile format. Payment
              method must be COD or PREPAID. Weight must be greater than zero.
            </p>
          </div>
        </section>

        <section className="border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="font-bold">2. Upload your CSV file</h2>
          <p className="mt-1 text-sm text-gray-600">
            CSV files only, maximum size 5 MB.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />

          {!fileName ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 flex min-h-48 w-full flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#FBB501] hover:bg-[#FEF8EB]"
            >
              <Upload size={30} className="mb-3 text-gray-500" />
              <span className="font-semibold">Choose a CSV file</span>
              <span className="mt-1 text-sm text-gray-500">
                Click here to browse your computer
              </span>
            </button>
          ) : (
            <div className="mt-5 flex flex-col justify-between gap-4 border border-gray-200 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <FileSpreadsheet size={28} className="shrink-0 text-gray-600" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{fileName}</p>
                  <p className="text-sm text-gray-500">
                    {rows.length} shipment row(s) parsed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetFile}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
              >
                <X size={16} /> Remove file
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {message && !error && (
            <div className="mt-4 flex items-start gap-2 border border-gray-200 bg-gray-50 p-3 text-sm">
              {importedCount !== null ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-700" />
              ) : (
                <FileCheck2 size={18} className="mt-0.5 shrink-0 text-gray-600" />
              )}
              <p>{message}</p>
            </div>
          )}

          {rows.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={exportPreview}
                className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
              >
                <Download size={16} /> Export preview
              </button>
              <button
                type="button"
                onClick={() => void importShipments()}
                disabled={!allValid || importing || importedCount !== null}
                className="inline-flex items-center gap-2 bg-[#FBB501] px-5 py-2.5 text-sm font-bold text-[#141B22] hover:bg-[#FAA212] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {importing ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {importing ? "Importing..." : "Import valid shipments"}
              </button>
            </div>
          )}
        </section>

        {rows.length > 0 && (
          <section className="border border-gray-200 bg-white">
            <div className="flex flex-col justify-between gap-2 border-b border-gray-200 p-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold">3. Review shipment rows</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Showing up to 100 rows. All rows are validated before import.
                </p>
              </div>
              <span className="text-sm font-semibold">
                {validCount} valid / {invalidCount} invalid
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left text-sm">
                <thead className="bg-[#F7F7F5] text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Row</th>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3">Receiver</th>
                    <th className="px-4 py-3">Destination</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Weight</th>
                    <th className="px-4 py-3">Parcel value</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.slice(0, 100).map((row) => (
                    <tr
                      key={row.rowNumber}
                      className={row.errors.length ? "bg-red-50/40" : ""}
                    >
                      <td className="px-4 py-3">{row.rowNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {row.values.sender_name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {row.values.sender_phone || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">
                          {row.values.receiver_name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {row.values.receiver_phone || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {row.values.receiver_city || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.values.parcel_description || "—"}
                      </td>
                      <td className="px-4 py-3">{row.values.weight || "—"}</td>
                      <td className="px-4 py-3">
                        Rs. {row.values.parcel_value || "0"}
                      </td>
                      <td className="px-4 py-3">
                        {row.values.payment_method || "—"}
                      </td>
                      <td className="px-4 py-3">
                        {row.errors.length ? (
                          <div className="max-w-64 text-xs text-red-700">
                            <p className="font-bold">
                              {row.errors.length} error(s)
                            </p>
                            <ul className="mt-1 list-disc pl-4">
                              {row.errors.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 size={15} /> Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
