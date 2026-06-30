const fs = require('fs');
const content = fs.readFileSync('sarvam_home.html', 'utf8');

// There are desktop tabs (<a ...>) and mobile tabs (<button role="tab" ...>).
// Let's find all items that have "flex flex-col gap-1 mt-3" which contain the title and subtitle.
const itemRegex = /<(a|button)[^>]*>(.*?)<\/(a|button)>/gs;

let matches;
const cards = [];

while ((matches = itemRegex.exec(content)) !== null) {
  const innerHTML = matches[2];
  if (innerHTML.includes('flex flex-col gap-1 mt-3')) {
    // Extract title
    const titleMatch = innerHTML.match(/<span class="font-matter font-medium[^>]*>(.*?)<\/span>/);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Extract SVGs
    const svgMatches = [...innerHTML.matchAll(/<svg[^>]*>.*?<\/svg>/gs)];
    
    if (title && svgMatches.length > 0) {
      if (!cards.find(c => c.title === title)) {
        cards.push({ title, svg: svgMatches[0][0] });
      }
    }
  }
}

fs.writeFileSync('extracted_cards.json', JSON.stringify(cards, null, 2));
console.log(`Extracted ${cards.length} cards.`);
