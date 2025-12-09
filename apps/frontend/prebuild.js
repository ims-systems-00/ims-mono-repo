const fs = require("fs");
const readline = require("readline");
async function buildVersion() {
  const readable = fs.createReadStream("./changelog.md");
  const reader = readline.createInterface({ input: readable });
  let line = await new Promise((resolve) => {
    reader.on("line", (line) => {
      reader.close();
      resolve(line);
    });
  });
  readable.close();
  line = line.split(" ")[1];
  fs.writeFileSync(
    "./src/version.js",
    `
    let currentV = '(${line})'
    function getCurretVersion() {
      return currentV
    }
    let version = {
      get: getCurretVersion
    }
    export default version
    `
  );
}
buildVersion();
