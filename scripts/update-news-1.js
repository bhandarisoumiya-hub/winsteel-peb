const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'db.json');
const raw = fs.readFileSync(dbPath, 'utf8');
const data = JSON.parse(raw);

const newsIndex = data.news.findIndex(n => n.id === 'news-1');
if (newsIndex === -1) {
  console.error('news-1 not found');
  process.exit(1);
}

const newsContentHtml = `<p>A Pre-Engineered Building (PEB) is an engineered steel building system in which the structural components are designed according to project requirements and manufactured in a controlled production environment before being transported to the site for assembly and erection. PEB systems are commonly used for industrial buildings, warehouses, manufacturing facilities, workshops, logistics facilities and other applications where large, functional steel structures are required.</p>

<p>The defining feature of a PEB is the coordination between structural engineering, detailing, fabrication, manufacturing and site erection. Rather than treating each structural component as an isolated element, the building is developed as an integrated system in which the primary frame, secondary framing, connections and building envelope work together.</p>

<h3>Primary Framing</h3>
<p>Primary framing forms the principal load-bearing system of a PEB. It generally consists of columns and rafters that transfer loads from the building structure to the foundations.</p>
<p>The primary frame is engineered according to the required building geometry, structural loading, span, height, frame spacing and applicable design requirements. Member sizes and configurations are therefore determined by engineering calculations rather than by a fixed standard arrangement.</p>

<h3>Secondary Framing</h3>
<p>Secondary framing supports the roof and wall systems and transfers their loads to the primary structure. Purlins are generally used within the roof system, while girts are commonly used to support wall cladding.</p>
<p>Secondary members also contribute to the overall stability and coordination of the building envelope. Their arrangement is developed alongside the primary structural system and cladding requirements.</p>

<h3>Roof and Wall Systems</h3>
<p>The roof and wall systems form the external envelope of the building. Depending on the project, these systems may include profiled steel sheeting, insulation, flashings, trims and other associated components.</p>
<p>The selection and configuration of the building envelope depend on factors such as the intended use of the facility, environmental conditions, thermal requirements, appearance and project specifications.</p>

<h3>Structural Connections</h3>
<p>Connections provide the interfaces between structural members and are designed to transfer the forces generated within the structure. Their design and detailing are important to both structural performance and fabrication.</p>
<p>Connection details are incorporated into the engineering and detailing process so that the required components can be accurately manufactured and assembled at site.</p>

<h3>Engineering and Detailing</h3>
<p>PEB design starts with the technical requirements of the building. These may include dimensions, structural loads, clear-span requirements, equipment loads, crane requirements, site conditions, openings, cladding systems and future expansion provisions.</p>
<p>Once the structural system has been established, detailed engineering information is developed for manufacturing. 3D structural detailing can be used to coordinate members, connections, dimensions and interfaces before fabrication begins.</p>

<h3>Manufacturing and Erection</h3>
<p>The engineered components are manufactured according to approved drawings and fabrication information. Activities can include material preparation, cutting, drilling, fit-up, welding, assembly and inspection.</p>
<p>After fabrication and quality checks, components are transported to site for erection. The erection process involves assembling the manufactured components in the planned sequence and establishing the structural frame according to the approved engineering information.</p>

<h3>Why PEB Engineering Matters</h3>
<p>A PEB should not be considered simply as a prefabricated steel shed. It is an engineered structural system in which design, manufacturing and erection need to remain coordinated throughout the project.</p>
<p>WINSTEEL approaches PEB projects through an integrated workflow covering structural engineering, 3D detailing, fabrication, manufacturing, quality inspection, supply and erection according to the agreed project scope.</p>

<div class="collab-callout">
  <h4>International Technical Collaboration</h4>
  <p>WINSTEEL also has a technical collaboration with the international company <strong>M/S ALPI South East Asia Co., Ltd.</strong> (<a href="https://www.alpisea.com" target="_blank" rel="noopener noreferrer">https://www.alpisea.com</a>), supporting its technical capabilities through international engineering expertise and knowledge.</p>
</div>`;

data.news[newsIndex] = {
  id: "news-1",
  title: "Pre-Engineered Buildings: Understanding the Structure Behind PEB Systems",
  slug: "pre-engineered-buildings-understanding-structure-peb-systems",
  category: "Engineering Insights",
  date: "2026-08-14",
  author: "Winsteel PEB Engineering Division",
  image: "assets/images/Turnkey Pre-Engineered Steel Buildings (PEB).png",
  shortDescription: "A Pre-Engineered Building (PEB) is an engineered steel building system designed to project requirements and manufactured under controlled production environments before site erection.",
  content: newsContentHtml,
  status: "Published",
  featured: true
};

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated news-1 in database/db.json');
