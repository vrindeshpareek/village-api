const app = require("./app");
const { port } = require("./config");

app.listen(port, () => {
  console.log(`Village API listening on http://localhost:${port}`);
});
