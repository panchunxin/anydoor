// 只对文件进行压缩
const {createGzip, createDeflate} = require('zlib'); //zlib模块提供通过Gzip和Deflate/Inflate实现的压缩功能
module.exports = (rs, req, res) => {
  const acceptEncoding = req.headers['accept-encoding']; //拿到浏览器支持的压缩方式
  if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)) {//不支持压缩
    return rs; 
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    res.setHeader('Content-Encoding', 'gzip'); //告诉浏览器使用的压缩方式
    return rs.pipe(createGzip()); //处理压缩返回好的流
  } else if (acceptEncoding.match(/\bdeflate\b/)) {
    res.setHeader('Content-Encoding', 'deflate');
    return rs.pipe(createDeflate());
  }
}