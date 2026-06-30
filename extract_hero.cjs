const fs = require('fs');
const content = fs.readFileSync('sarvam_home.html', 'utf8');

// Find the nav
const navMatch = content.match(/<nav[^>]*>.*?<\/nav>/s);
if (navMatch) {
  fs.writeFileSync('nav.html', navMatch[0]);
  console.log('Saved nav.html');
}

// The hero section contains "AI for all from India". We can find the parent section.
const heroIndex = content.indexOf('AI for all from India');
if (heroIndex !== -1) {
  const start = content.lastIndexOf('<section', heroIndex);
  const end = content.indexOf('</section>', heroIndex) + 10;
  if (start !== -1 && end !== -1) {
    fs.writeFileSync('hero.html', content.substring(start, end));
    console.log('Saved hero.html');
  }
}
