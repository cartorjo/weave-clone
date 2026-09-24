// Import only selected, supplied photographs. Masters stay in the source folder;
// the site ships bounded responsive derivatives and their source attribution.
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// --only=key1,key2 re-imports just those keys and merges them into the existing
// manifest, so lost masters of untouched keys don't block a partial delivery.
const args = process.argv.slice(2);
const only = args.find(a => a.startsWith('--only='))?.slice('--only='.length).split(',').filter(Boolean);
const source = resolve(args.find(a => !a.startsWith('--')) || '/Users/jose/Downloads/OneDrive_1_10-09-2026');
const destination = new URL('../assets/supplied/', import.meta.url);
const selections = {
  'hero-flow': ['Technology/GettyImages-2200128716.jpg', 'Leuchtende Datenverbindungen auf einer digitalen Platine'],
  'data2ai': ['Technology/GettyImages-2153711283.jpg', 'Visualisierung vernetzter Daten und Analysen'],
  'engineering-knowledge': ['Technology/GettyImages-2226205524.jpg', 'Vernetzte Prozessoren und digitale Informationsflüsse'],
  'technology-team': ['Technology/GettyImages-2255324297.jpg', 'Fachleute arbeiten gemeinsam an Software und Daten'],
  'technology': ['Technology/GettyImages-2246977904.jpg', 'Softwareentwicklung an vernetzten Arbeitsplätzen'],
  'pharma': ['Pharma/GettyImages-2192040012.jpg', 'Laborgerät für die Analyse medizinischer Proben'],
  'pharma-transition': ['Pharma/GettyImages-1178748271.jpg', 'Fachkraft arbeitet an einer Anlage im Reinraum'],
  'pharma-research': ['Pharma/GettyImages-477001700.jpg', 'Wissenschaftlerin untersucht ein Molekülmodell'],
  'energy': ['Sustainability/GettyImages-1850142671.jpg', 'Fachkraft mit Solarmodul vor Windenergieanlagen'],
  'wind-energy': ['Sustainability/GettyImages-869503738.jpg', 'Windenergieanlagen zwischen landwirtschaftlichen Flächen'],
  'collaboration': ['Sustainability/GettyImages-2002270922.jpg', 'Zwei Fachleute besprechen Daten auf einem Tablet'],
  'engineering': ['General/AdobeStock_286447622.jpeg', 'Ingenieur arbeitet mit digitalen Fahrzeugmodellen'],
  'automotive': ['General/AdobeStock_1912234018.jpeg', 'Digitales Modell eines vernetzten Fahrzeugs'],
  'vehicle-testing': ['General/AdobeStock_341429200.jpeg', 'Fahrzeugdiagnose mit einem digitalen Prüfgerät'],
  'logistics': ['General/AdobeStock_584600576.jpeg', 'Digitale Steuerung von Lager- und Logistikprozessen'],
  'datacenter': ['General/AdobeStock_2013412737.jpeg', 'Vernetzte Server in einem Rechenzentrum'],
  'software': ['General/AdobeStock_1949888112.jpeg', 'Entwicklung einer digitalen Anwendung am Laptop'],
  // Later deliveries outside the original OneDrive folder (absolute paths resolve as-is).
  // trimRight: the delivered V2 JPG carries a 1px light frame column on its right
  // edge that renders as a hairline on the navy section ("Grafik hat noch einen Rahmen").
  'verzahnung': ['/Users/jose/Downloads/EMPOSO Grafik 26-V2.jpg', 'Orange und blaue Datenströme laufen im Emposo-Logo zusammen', {trimRight: 2}],
  // 2026-09-22 delivery: all six management portraits, 850×607 landscape masters.
  'claus-thierbach': ['/Users/jose/Downloads/OneDrive_1_22-09-2026/Foto Thierbach.jpg', 'Claus Thierbach'],
  'aleksandar-amidzic': ['/Users/jose/Downloads/OneDrive_1_22-09-2026/ALA.jpg', 'Aleksandar Amidzic'],
  'markus-auer': ['/Users/jose/Downloads/OneDrive_1_22-09-2026/Markus Auer.jpg', 'Markus Auer'],
  'roman-bretz': ['/Users/jose/Downloads/OneDrive_1_22-09-2026/Roman Bretz.jpg', 'Roman Bretz'],
  'michael-schmitt': ['/Users/jose/Downloads/OneDrive_1_22-09-2026/Michael Schmitt.jpg', 'Dr. Michael Schmitt'],
  'marcus-hefele': ['/Users/jose/Downloads/OneDrive_1_22-09-2026/Marcus Hefele.jpg', 'Marcus Hefele'],
  // 2026-09-24 review: Über-uns Hays-Netzwerk graphic (edges carry white/blue
  // frame artefacts — trimmed like the Verzahnung graphic).
  'about-netzwerk': ['/Users/jose/Downloads/About Emposo Grafik Final_About Emposo Grafik V1B.jpg', '250 Inhouse-Experten von Emposo, dahinter das Hays-Netzwerk mit 3.000 festangestellten Talenten und 10.000 aktiven Partnern', {trimLeft: 3, trimTop: 1, trimBottom: 1}],
  // 2026-09-24 review: Leistungen hero (master restorable from OneDrive_1_10-09-2026.zip).
  'portfolio-hero': ['General/AdobeStock_1952732297.jpeg', 'Laptop mit Engineering-Workflows in einem Rechenzentrum'],
  // 2026-09-24 delivery: final per-industry images ("Feedback Branchen V2").
  'industry-aerospace': ['/Users/jose/Downloads/OneDrive_1_24-09-2026/AdobeStock_2155375490-Aerospace & Defense.jpg', 'Fachkraft überwacht Radar- und Flugdaten auf mehreren Monitoren'],
  'industry-energy': ['/Users/jose/Downloads/OneDrive_1_24-09-2026/AdobeStock_223686976-Energy & Resources.jpg', 'Strommast mit Solarmodulen und Windenergieanlagen im Gegenlicht'],
  'industry-health': ['/Users/jose/Downloads/OneDrive_1_24-09-2026/GettyImages-1194960360-Health & Pharma.jpg', 'Pipette dosiert Proben in Laborgefäße'],
  'industry-industrials': ['/Users/jose/Downloads/OneDrive_1_24-09-2026/AdobeStock_483288607-Indutrials & Manufacturing.jpg', 'Digital vernetzte Roboter in einer Fahrzeug-Fertigungslinie'],
  'industry-technology': ['/Users/jose/Downloads/OneDrive_1_24-09-2026/AdobeStock_970503738-Technology, Telecoms & Media.jpg', 'Mobilfunkmast über einer abendlichen Stadt'],
};
const unknown = (only ?? []).filter(key => !selections[key]);
if (unknown.length) {
  console.error(`Unknown --only keys: ${unknown.join(', ')}`);
  process.exit(1);
}
const selected = only ? Object.fromEntries(only.map(key => [key, selections[key]])) : selections;
// Fail fast before touching assets/supplied/: a missing source mid-loop would
// otherwise leave derivatives half-rewritten with a stale manifest.
{
  const missing = Object.values(selected).map(([file]) => resolve(source, file)).filter(path => !existsSync(path));
  if (missing.length) {
    console.error('Missing source files:\n' + missing.join('\n'));
    process.exit(1);
  }
}
await mkdir(destination, {recursive: true});
const manifestURL = new URL('manifest.json', destination);
const manifest = only ? JSON.parse(await readFile(manifestURL, 'utf8')) : {};
for (const [key, [file, alt, options = {}]] of Object.entries(selected)) {
  let pipeline = sharp(resolve(source, file)).rotate();
  const metadata = await pipeline.metadata();
  let sourceWidth = metadata.autoOrient.width;
  const trim = {left: options.trimLeft ?? 0, right: options.trimRight ?? 0, top: options.trimTop ?? 0, bottom: options.trimBottom ?? 0};
  if (trim.left || trim.right || trim.top || trim.bottom) {
    pipeline = pipeline.extract({left: trim.left, top: trim.top, width: sourceWidth - trim.left - trim.right, height: metadata.autoOrient.height - trim.top - trim.bottom});
    sourceWidth -= trim.left + trim.right;
  }
  const portrait = ['claus-thierbach', 'aleksandar-amidzic', 'markus-auer', 'roman-bretz', 'michael-schmitt', 'marcus-hefele'].includes(key);
  const fullWidth = Math.min(portrait ? 900 : 1600, sourceWidth);
  const widths = [...new Set([Math.min(640, fullWidth), fullWidth])];
  const variants = [];
  for (const width of widths) {
    for (const format of ['avif', 'webp']) {
      const name = `${key}-${width}.${format}`;
      const info = await pipeline.clone().resize({width, withoutEnlargement:true})[format]({quality:format === 'avif' ? 52 : 78}).toFile(fileURLToPath(new URL(name, destination)));
      variants.push({src:`/assets/supplied/${name}`, width:info.width, height:info.height, format, bytes:info.size});
    }
  }
  const fallback = `${key}-${fullWidth}.jpg`;
  const info = await pipeline.clone().resize({width:fullWidth, withoutEnlargement:true}).jpeg({quality:82, mozjpeg:true}).toFile(fileURLToPath(new URL(fallback, destination)));
  // The committed manifest records absolute-path sources by basename only.
  manifest[key] = {source: isAbsolute(file) ? basename(file) : file, alt, src:`/assets/supplied/${fallback}`, width:info.width, height:info.height, variants};
  console.log(`Imported ${key}`);
}
await writeFile(manifestURL, JSON.stringify(manifest, null, 2) + '\n');
