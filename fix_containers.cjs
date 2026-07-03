const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// For each section that has "container" and "card-page", except the footer
// Wait, the footer also has "container card-page":
// <footer className="footer container card-page" style={{ '--stack-index': 7 }}>

// Let's manually replace each section's contents to wrap them in a container.
// This is safer if we just use string replacement for the opening and closing tags.

content = content.replace(
  '<section className="section container card-page" style={{ \'--stack-index\': 2 }}>',
  '<section className="section card-page" style={{ \'--stack-index\': 2 }}>\n          <div className="container">'
).replace(
  '</section>\n\n        \n        <section className="section container card-page" style={{ \'--stack-index\': 3 }}>',
  '  </div>\n        </section>\n\n        \n        <section className="section card-page" style={{ \'--stack-index\': 3 }}>\n          <div className="container">'
).replace(
  '</section>\n      \n        <section className="section container card-page" style={{ \'--stack-index\': 4 }}>',
  '  </div>\n        </section>\n      \n        <section className="section card-page" style={{ \'--stack-index\': 4 }}>\n          <div className="container">'
).replace(
  '</section>\n\n        \n        <section className="section container card-page" style={{ \'--stack-index\': 5 }}>',
  '  </div>\n        </section>\n\n        \n        <section className="section card-page" style={{ \'--stack-index\': 5 }}>\n          <div className="container">'
).replace(
  '</section>\n\n        \n        \n        <section className="section container card-page join-now-page" style={{ \'--stack-index\': 6 }}>',
  '  </div>\n        </section>\n\n        \n        \n        <section className="section card-page join-now-page" style={{ \'--stack-index\': 6 }}>\n          <div className="container" style={{ height: "100%" }}>'
).replace(
  '</section>\n      \n      </main>\n\n      <footer className="footer container card-page"',
  '  </div>\n        </section>\n      \n      </main>\n\n      <footer className="footer card-page"'
);

// We need to wrap the footer content in a container too, or maybe not? 
// <footer className="footer card-page" style={{ '--stack-index': 7 }}>
//   <div className="footer-grid"> -> we can just wrap the footer-grid in container?
// Actually, it's safer to just wrap it:
content = content.replace(
  '<footer className="footer card-page" style={{ \'--stack-index\': 7 }}>',
  '<footer className="footer card-page" style={{ \'--stack-index\': 7 }}>\n        <div className="container">'
).replace(
  '</footer>',
  '  </div>\n      </footer>'
);

fs.writeFileSync('src/App.jsx', content);
