const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Add JoinNow import
content = content.replace(
  "import { featuresData } from './featuresData';",
  "import { featuresData } from './featuresData';\nimport JoinNow from './JoinNow';"
);

// We want to extract each section from <main>
// Since we know the order, we can split by "<section"
let mainStart = content.indexOf('<main className="main-wrapper">');
let mainEnd = content.indexOf('</main>');

let beforeMain = content.substring(0, mainStart + '<main className="main-wrapper">'.length);
let afterMain = content.substring(mainEnd);

let mainContent = content.substring(mainStart + '<main className="main-wrapper">'.length, mainEnd);
let sections = mainContent.split('<section').filter(s => s.trim().length > 0).map(s => '<section' + s);

// Currently:
// 0: Hero
// 1: The vision
// 2: Gamification
// 3: DashboardUI
// 4: Core Features

// We want:
// 0: Hero (index 1)
// 1: DashboardUI (index 2)
// 2: Core Features (index 3)
// 3: The vision (index 4)
// 4: Gamification (index 5)
// 5: JoinNow (index 6)

// Let's modify their stack indices
function setIndex(sec, idx) {
  return sec.replace(/style=\{\{\s*'--stack-index':\s*\d\s*\}\}/g, `style={{ '--stack-index': ${idx} }}`);
}

let newSections = [
  setIndex(sections[0], 1), // Hero
  setIndex(sections[3], 2), // Dashboard
  setIndex(sections[4], 3), // Core features
  setIndex(sections[1], 4), // Vision
  setIndex(sections[2], 5), // Gamification
];

let joinNowSection = `
        <section className="section container card-page" style={{ '--stack-index': 6 }}>
          <JoinNow />
        </section>
      `;

newSections.push(joinNowSection);

let newMainContent = '\n        ' + newSections.join('\n        ') + '\n      ';

let newContent = beforeMain + newMainContent + afterMain;

// update footer stack index to 7
newContent = newContent.replace(/<footer className="footer container card-page" style=\{\{\s*'--stack-index':\s*\d\s*\}\}/g, `<footer className="footer container card-page" style={{ '--stack-index': 7 }}`);

fs.writeFileSync('src/App.jsx', newContent);
console.log("Rewrite successful");
