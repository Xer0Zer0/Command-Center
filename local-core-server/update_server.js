const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

const routeCode = `
app.get('/', (req, res) => {
  res.json({
    system: "Aethel",
    status: "online",
    entity: "3KIG Co., Ltd.",
    category: "Office Agent"
  });
});
`;

if (!code.includes("app.get('/',")) {
  // Insert before app.listen
  const lastIndex = code.lastIndexOf('app.listen');
  if (lastIndex !== -1) {
    code = code.slice(0, lastIndex) + routeCode + '\n' + code.slice(lastIndex);
    fs.writeFileSync('server.js', code, 'utf8');
    console.log("Successfully updated server.js with root route.");
  } else {
    console.log("Could not find app.listen in server.js");
  }
} else {
  console.log("Root route already exists in server.js");
}
