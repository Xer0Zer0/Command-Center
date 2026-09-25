const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

// Remove misplaced root get if it exists
code = code.replace(/app\.get\('\/',\s*\(req,\s*res\)\s*=>\s*\{[\s\S]*?\}\);\s*/g, '');

// Insert properly right before app.listen
const rootRoute = `
app.get('/', (req, res) => {
  res.json({
    system: "Aethel",
    status: "online",
    entity: "3KIG Co., Ltd.",
    category: "Office Agent"
  });
});
`;

const lastIndex = code.lastIndexOf('app.listen');
if (lastIndex !== -1) {
  code = code.slice(0, lastIndex) + rootRoute + '\n' + code.slice(lastIndex);
  fs.writeFileSync('server.js', code, 'utf8');
  console.log("Successfully repositioned root route.");
}
