module.exports = (totalSize, req, res) => {
  const range = req.headers['range'];  //拿到range
  if (!range) {
    return {code: 200}
  }

  const sizes = range.match(/bytes=(\d*)-(\d*)/);//返回一个数字，第一个是匹配到的内容，第二是前一个范围，第三个是后一个范围
  const end = sizes[2] || totalSize-1;
  const start = sizes[1] || totalSize-end;

  //处理不了的情况
  if (start < 0 || end < start || end > totalSize) {
    return {code: 200};
  }

  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Range', `bytes ${end}-${start} / ${totalSize}`);
  res.setHeader('Content-Length', end - start);
  return {
    code: 206,//部分内容
    start: parseInt(start),
    end: parseInt(end)
  }
}