import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

type EvidenceData = {
  case_id: string;
  filename: string;
  hash_value: string;
  investigator: string;
  status: string;
  created_at: string;
};

export async function exportEvidenceBundle(
  data: EvidenceData,
  originalFile?: File
) {
  const zip = new JSZip();

  // metadata.json
  const metadata = {
    case_id: data.case_id,
    filename: data.filename,
    investigator: data.investigator,
    status: data.status,
    created_at: data.created_at,
  };

  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  // sha256.txt
  zip.file("sha256.txt", data.hash_value);

  // PDF report
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("FORENSIC EVIDENCE REPORT", 10, 20);

  doc.setFontSize(12);
  doc.text(`Case ID: ${data.case_id}`, 10, 40);
  doc.text(`Filename: ${data.filename}`, 10, 50);
  doc.text(`SHA-256: ${data.hash_value}`, 10, 60);
  doc.text(`Investigator: ${data.investigator}`, 10, 70);
  doc.text(`Status: ${data.status}`, 10, 80);

  const pdfBlob = doc.output("blob");

  zip.file("report.pdf", pdfBlob);

  // original uploaded file
  if (originalFile) {
    zip.file(originalFile.name, originalFile);
  }

  // generate ZIP
  const content = await zip.generateAsync({ type: "blob" });

  saveAs(content, `evidence_bundle_${data.case_id}.zip`);
}