const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = async function (req, res, pathFile) {
  try {
    const stats = await stat(pathFile);
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      fs.createReadStream(pathFile).pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(pathFile);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(files.join(','));
    }
  } catch (ex) {
    console.log(ex)
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${pathFile} is not a file or directory`)
  }
}