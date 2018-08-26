var https = require('https');
var fs = require('fs');
var path = require('path');

function downloadimg (imgdir,url) {
    https.get(url,function(res) {
      res.setEncoding('binary')
      var data = '';
      res.on('data', function(chunk) {
          data += chunk
      })
      res.on('end', function(chunk) {
          fs.writeFile(imgdir + path.basename(url),data,'binary',function (err) {
            if (err) {
              console.error(err.message)
            }
            console.log('图片已下载： ' + path.basename(url))
          })
      })
    }).on('error', function(err) {
        console.log(err)
    })
  }
module.exports = downloadimg  