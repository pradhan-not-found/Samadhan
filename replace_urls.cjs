const fs = require('fs');
let code = fs.readFileSync('src/Dashboard.jsx', 'utf8');
code = code.replace(/"http:\/\/127\.0\.0\.1:8000(\/api\/[^"]+)"/g, '`${import.meta.env.VITE_API_URL || \'http://127.0.0.1:8000\'}$1`');
code = code.replace(/'http:\/\/127\.0\.0\.1:8000(\/api\/[^']+)'/g, '`${import.meta.env.VITE_API_URL || \'http://127.0.0.1:8000\'}$1`');
code = code.replace(/`http:\/\/127\.0\.0\.1:8000(\/api\/[^`]+)`/g, '`${import.meta.env.VITE_API_URL || \'http://127.0.0.1:8000\'}$1`');
fs.writeFileSync('src/Dashboard.jsx', code);
console.log('Replaced all hardcoded URLs in Dashboard.jsx');
