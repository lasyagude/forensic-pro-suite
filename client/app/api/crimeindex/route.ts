import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(csv: string) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift() ?? "");
  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const values = parseCsvLine(line);
      return headers.reduce((obj, header, idx) => {
        obj[header] = values[idx] ?? "";
        return obj;
      }, {} as Record<string, string>);
    });
}

export async function GET() {
  try {
    const csvPath = path.resolve(process.cwd(), "../World Crime Index .csv");
    const content = await fs.readFile(csvPath, "utf8");
    const rows = parseCsv(content);
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: "Unable to load the crime index dataset." }, { status: 500 });
  }
}
