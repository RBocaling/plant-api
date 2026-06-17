const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const buildInfo = path.join(__dirname, "..", "tsconfig.tsbuildinfo");

// Incremental tsc skips emit when dist is missing but .tsbuildinfo still exists.
if (!fs.existsSync(distDir)) {
  try {
    fs.unlinkSync(buildInfo);
  } catch {
    // no stale build info to remove
  }
}
