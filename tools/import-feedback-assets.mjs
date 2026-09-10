// Import only selected, supplied photographs. Masters stay in the source folder;
// the site ships bounded responsive derivatives and their source attribution.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = resolve(process.argv[2] || '/Users/jose/Downloads/OneDrive_1_10-09-2026');
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
  'claus-thierbach': ['Management Bilder/Foto Thierbach.jpg', 'Claus Thierbach'],
  // Later deliveries outside the original OneDrive folder (absolute paths resolve as-is).
  'verzahnung': ['/Users/jose/Downloads/EMPOSO Grafik 26-V2.jpg', 'Orange und blaue Datenströme laufen im Emposo-Logo zusammen'],
  'aleksandar-amidzic': ['/Users/jose/Downloads/Management Bilder/ALA.jpg', 'Aleksandar Amidzic'],
  'markus-auer': ['/Users/jose/Downloads/Management Bilder/markus-auer-me-1020x765.jpg', 'Markus Auer'],
  'roman-bretz': ['/Users/jose/Downloads/Management Bilder/Roman Bretz.jpg', 'Roman Bretz'],
};
await mkdir(destination, {recursive: true});
const manifest = {};
for (const [key, [file, alt]] of Object.entries(selections)) {
  const pipeline = sharp(resolve(source, file)).rotate();
  const metadata = await pipeline.metadata();
  const portrait = ['claus-thierbach', 'aleksandar-amidzic', 'markus-auer', 'roman-bretz'].includes(key);
  const fullWidth = Math.min(portrait ? 900 : 1600, metadata.autoOrient.width);
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
  manifest[key] = {source:file, alt, src:`/assets/supplied/${fallback}`, width:info.width, height:info.height, variants};
  console.log(`Imported ${key}`);
}
await writeFile(new URL('manifest.json', destination), JSON.stringify(manifest, null, 2) + '\n');
