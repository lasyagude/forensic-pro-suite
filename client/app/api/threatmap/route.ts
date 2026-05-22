import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

function parseCsv(csv: string) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines.shift()?.split(",") ?? [];
  return lines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, idx) => {
        obj[header] = values[idx] ?? "";
        return obj;
      }, {} as Record<string, string>);
    });
}

function inferLocation(ip: string) {
  if (ip.startsWith("10.")) {
    return { region: "North America", coordinates: [-98.5795, 39.8283] as [number, number] };
  }

  if (ip.startsWith("172.")) {
    return { region: "Europe", coordinates: [10.4515, 51.1657] as [number, number] };
  }

  if (ip.startsWith("192.168.")) {
    return { region: "Asia-Pacific", coordinates: [103.8198, 1.3521] as [number, number] };
  }

  return { region: "Corporate LAN", coordinates: [-77.0369, 38.9072] as [number, number] };
}

export async function GET() {
  try {
    const csvPath = path.resolve(process.cwd(), "../cybercrime_forensic_dataset.csv");
    const csv = await fs.readFile(csvPath, "utf8");
    const rows = parseCsv(csv);

    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ error: "Unable to load dataset" }, { status: 500 });
  }
}
