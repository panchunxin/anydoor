const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress');


const tplpath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplpath);
const template = Handlebars.compile(source.toString());
module.exports = async function (req, res, pathFile) {
  try {
    const stats = await stat(pathFile);
    if (stats.isFile()) {
      const contentType = mime(pathFile);
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      let rs = fs.createReadStream(pathFile);
      if (pathFile.match(config.compress)) {
          rs = compress(rs, req, res);
        }
      // fs.createReadStream(pathFile).pipe(res); 
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(pathFile);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const dir = path.relative(config.root, pathFile);
      const data = {
        title: path.basename(pathFile), //文件夹的名字
        dir: dir ? `/${dir}` : '',
        files : files.map(file => {
          return {
            file,
            icon: mime(file)
          }
        })
      };
      // res.end(files.join(','));
      res.end(template(data));
    }
  } catch (ex) {
    console.log(ex)
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${pathFile} is not a file or directory`)
  }
}