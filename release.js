import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import { compareVersions } from "compare-versions";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This process has to be idempotent: run multiple times should produce the same result

const destDirectory = path.join(__dirname, "docs");

// Delete all files from target dir, except version dir, CNAME and ads.txt
async function clearTargetDirectory() {
  const allowList = ["CNAME", "ads.txt", "info", "version"];
  return fs.readdir(destDirectory).then((list) => {
    const toDelete = list.filter((x) => !allowList.includes(x));
    return Promise.all(
      toDelete.map((el) => {
        const item = path.join(destDirectory, el);
        fs.rm(item, { recursive: true, force: true });
      })
    );
  });
}

// get version from build
readFile(path.join(__dirname, "/build/info")).then((content) => {
  const info = content.toString();
  const version = info.trim();
  console.log("Build version:", version);
  // 1. Create a dir with the old version (get from info) if not exist => v2.2.1
  const versionPath = path.join(destDirectory, "/version/" + version);
  fs.stat(versionPath)
    .then((item) => {
      if (item.isDirectory()) {
        console.log("❌ This version already exists!\nIf you want to regenerate it you have to delete it manually first.");
        return;
      }
    })
    .catch((e) => {
      console.log("=> good, create and copy from build");
      //console.log(e);
      fs.mkdir(versionPath);
      // Copy from build dir
      fs.cp(path.join(__dirname, "build"), versionPath, { recursive: true }, (err) => {
        console.log(err);
      }).then(() => {
        // === Use newest version
        fs.readdir(path.join(destDirectory, "version")).then((versionList) => {
          const sorted = versionList.sort(compareVersions);
          const newestVersion = sorted[sorted.length - 1];
          console.log("Newest version:", newestVersion);
          clearTargetDirectory().then(() => {
            console.log("Cleaned Dir. Copying from build into version dir.");
            const srcNewestPath = path.join(destDirectory, "version" + newestVersion);
            console.log(srcNewestPath);
            fs.cp(srcNewestPath, destDirectory, { recursive: true }, (err) => {
              console.log(err);
            });
          });
        });
      });
    });
});
