import jsPDF from "jspdf";
import { SimInputs } from "../components/SimulatorForm";
import { ResultsFull } from "../components/SimulatorPage"

const fmtEUR = (v: number) =>
  new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v);
const fmtPct = (v: number) => `${v.toFixed(2).replace('.', ',')} %`;

async function loadLogoDataUrl(path = "/images/logoA&M.png"): Promise<string | null> {
  try {
    const res = await fetch(path);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.readAsDataURL(blob);
    });
  } catch { return null; }
}

export async function exportSimulationPdf(inputs: SimInputs, results: ResultsFull) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 56;

  const blue = "#002B45";
  const gold = "#BFA45F";

  const logo = await loadLogoDataUrl();
  if (logo) doc.addImage(logo, "PNG", marginX, y - 8, 36, 36);

  doc.setFont("helvetica","bold"); doc.setFontSize(18); doc.setTextColor(blue);
  doc.text("A&M Capital — Simulation d’investissement", marginX + (logo ? 48 : 0), y);
  y += 26;

  doc.setDrawColor(191,164,95); doc.setLineWidth(1); doc.line(marginX,y,595-marginX,y); y += 18;

  // Paramètres
  doc.setFontSize(12); doc.setFont("helvetica","bold"); doc.setTextColor(0);
  doc.text("Paramètres de la simulation", marginX, y); y += 14; doc.setFont("helvetica","normal");

  const params: [string,string][] = [
    ["Ville", inputs.ville || "-"],
    ["Type d’exploitation", inputs.type === "longue" ? "Longue durée" : "Courte durée"],
    ["Nombre de pièces", inputs.pieces.toUpperCase()],
    ["Prix du bien", fmtEUR(inputs.prix)],
    ["Surface", `${inputs.surface} m²`],
  ];
  params.forEach(([k,v]) => { doc.setTextColor(100); doc.text(`${k} :`, marginX, y);
    doc.setTextColor(0); doc.text(v, marginX+160, y); y += 16; });

  y += 8; doc.setDrawColor(230,230,230); doc.line(marginX,y,595-marginX,y); y += 18;

  // KPIs
  doc.setFont("helvetica","bold"); doc.text("Indicateurs clés", marginX, y); y += 18; doc.setFont("helvetica","normal");
  ([
    ["Rendement brut", fmtPct(results.rendement)],
    ["Cash-flow mensuel", fmtEUR(results.cashflow)],
    ["Investissement total", fmtEUR(results.investissementTotal)],
  ] as [string,string][])
  .forEach(([k,v]) => { doc.setTextColor(100); doc.text(`${k} :`, marginX, y);
    doc.setTextColor(0); doc.text(v, marginX+160, y); y += 16; });

  y += 8; doc.setDrawColor(230,230,230); doc.line(marginX,y,595-marginX,y); y += 18;

  // Détails
  doc.setFont("helvetica","bold"); doc.text("Détails calcul", marginX, y); y += 18; doc.setFont("helvetica","normal");
  const details: [string,string][] = [
    ...(typeof results.loyerMensuelParM2 === "number"
      ? [["Loyer estimé (€/m²/mois)", results.loyerMensuelParM2.toFixed(1).replace(".", ",")]] as [string,string][]
      : []),
    ["Frais de notaire (9%)", fmtEUR(results.fraisNotaire)],
    ["Commission A&M (8,5%)", fmtEUR(results.commissionAM)],
    ["Frais d’architecte", fmtEUR(results.fraisArchitecte)],
    ["Total des frais", fmtEUR(results.fraisTotal)],
    ["Revenu mensuel", fmtEUR(results.revenusMensuel)],
    ["Revenu annuel", fmtEUR(results.revenusAnnuels)],
  ];
  details.forEach(([k,v]) => { doc.setTextColor(100); doc.text(`${k} :`, marginX, y);
    doc.setTextColor(0); doc.text(v, marginX+200, y); y += 16; });

  y += 16;
  const date = new Date();
  doc.setTextColor(120); doc.setFontSize(10);
  doc.text(`Source: ${results.source}  •  Généré le ${date.toLocaleDateString("fr-FR")} à ${date.toLocaleTimeString("fr-FR")}`, marginX, y);

  // Footer
  doc.setFillColor(0,43,69); doc.rect(0,842-36,595,36,"F");
  doc.setTextColor(gold); doc.setFont("helvetica","bold");
  doc.text("A&M Capital — Confidentiel", marginX, 842-14);

  doc.save("simulation-am-capital.pdf");
}
