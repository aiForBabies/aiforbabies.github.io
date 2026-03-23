const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://aiforbabies.github.io';

const concepts = JSON.parse(fs.readFileSync('concepts-data.json', 'utf8'));
const template = fs.readFileSync('_template.html', 'utf8');

let generated = 0;
let errors = 0;

concepts.forEach(concept => {
  try {
    const dir = path.join('concepts', concept.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const relatedLinks = (concept.related || [])
      .map(slug => {
        const rel = concepts.find(c => c.slug === slug);
        if (!rel) return '';
        return `<a href="${SITE_URL}/concepts/${slug}/" class="related-tag">${rel.title}</a>`;
      })
      .filter(Boolean)
      .join('\n    ');

    const fullTitle = concept.full_title !== concept.title ? concept.full_title : concept.title;

    const html = template
      .replace(/{{SLUG}}/g, concept.slug)
      .replace(/{{TITLE}}/g, concept.title)
      .replace(/{{FULL_TITLE}}/g, fullTitle)
      .replace(/{{WHAT}}/g, concept.what)
      .replace(/{{ANALOGY}}/g, concept.analogy)
      .replace(/{{AT_WORK}}/g, concept.at_work)
      .replace(/{{ONE_THING}}/g, concept.one_thing)
      .replace(/{{RELATED_LINKS}}/g, relatedLinks)
      .replace(/{{SITE_URL}}/g, SITE_URL);

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`  ✓  concepts/${concept.slug}/`);
    generated++;
  } catch (err) {
    console.error(`  ✗  ${concept.slug}: ${err.message}`);
    errors++;
  }
});

console.log(`\nDone. ${generated} pages generated, ${errors} errors.`);
