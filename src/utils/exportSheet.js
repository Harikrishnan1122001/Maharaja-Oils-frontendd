// Lightweight CSV export — opens directly in Excel/Google Sheets, no extra npm package needed.
// rows: array of objects, columns: [{ key, label }]
export function exportToExcel(filename, columns, rows) {
  const escapeCell = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const header = columns.map((c) => escapeCell(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCell(c.value ? c.value(row) : row[c.key])).join(","))
    .join("\n");

  // BOM so Excel opens UTF-8 (₹ symbol etc.) correctly
  const csvContent = "\uFEFF" + header + "\n" + body;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
