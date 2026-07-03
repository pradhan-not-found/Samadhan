const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');
content = content.replace('className="hero container card-page"', 'className="hero card-page"');
fs.writeFileSync('src/App.jsx', content);
