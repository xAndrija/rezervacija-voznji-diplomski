const DANI = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'];
const MESECI = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];

export function formatDatumVreme(iso: string): string {
  const d = new Date(iso);
  const dan = DANI[d.getDay()];
  const datum = d.getDate();
  const mesec = MESECI[d.getMonth()];
  const sati = String(d.getHours()).padStart(2, '0');
  const minuti = String(d.getMinutes()).padStart(2, '0');
  return `${dan} ${datum}. ${mesec} u ${sati}:${minuti}`;
}

export function formatDatumKratko(iso: string): string {
  const d = new Date(iso);
  const datum = d.getDate();
  const mesec = MESECI[d.getMonth()];
  const sati = String(d.getHours()).padStart(2, '0');
  const minuti = String(d.getMinutes()).padStart(2, '0');
  return `${datum}. ${mesec} u ${sati}:${minuti}`;
}