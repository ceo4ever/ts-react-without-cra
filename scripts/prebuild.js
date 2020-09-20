const path = require("path");
const fs = require("fs");

const APP_DIR = process.cwd();
const BUILD_DIR = path.resolve(APP_DIR, "build");
const PUBLIC_DIR = path.resolve(APP_DIR, "public");

function getBuildPath(name) {
  return path.resolve(BUILD_DIR, name);
}
function getPublicPath(name) {
  return path.resolve(PUBLIC_DIR, name);
}

// * build 내 파일이 존재하면 비우고 build directory가 없으면 만듬
if (fs.existsSync(BUILD_DIR)) {
  fs.readdir(BUILD_DIR, (_, files) => {
    files.forEach((item) => {
      if (/_|\.[\w]{1,}/.test(item)) {
        fs.unlinkSync(getBuildPath(item));
      } else {
        fs.rmdirSync(getBuildPath(item), { recursive: true });
      }
    });
  });
} else {
  fs.mkdirSync(BUILD_DIR);
}

// * index.html을 제외한 모든 public 파일을 build/로 복사
fs.readdir(PUBLIC_DIR, (_, files) => {
  files.forEach((item) => {
    if (item !== "index.html") {
      fs.copyFileSync(getPublicPath(item), getBuildPath(item));
    }
  });
});
