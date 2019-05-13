const {catche} = require('../config/defaultConfig');
//更新响应
function refreshRes (stats,res) {//第一个参数用来获取修改时间
  const {maxAge, expires, catcheControl, lastModified, etag} = catche;

  if (expires) {
    res.setHeader('Expires', (new Date(Date.now() + maxAge * 1000)).toUTCString());
  }
  if (catcheControl) {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
  }
  if (lastModified) {
    res.setHeader('Last-Modified', stats.mtime.toUTCString()); //stats.mtime修改时间
  }
  if (etag) {
    res.setHeader('Etag', `${stats.size}-${stats.mtime}`);
  }
} 

module.exports = function isFresh (stats, req, res) {
  refreshRes(stats, res);

  const lastModified = req.headers['if-modified-since'];
  const etag = req.headers['if-none-match'];

  if (!lastModified && !etag) {
    return false;
  }
  if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
    return false;
  }
  if (etag && !etag !== res.getHeader['Etag']) {
    return false;
  }

  return true;
}