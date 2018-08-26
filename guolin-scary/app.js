var https = require('https');
var cheerio = require('cheerio');
var sanitize = require('validator').sanitize;
var fs = require('fs');
var path = require('path');
var predeal = require('./lib/preDeal.js');
var downloadimg = require('./lib/imgdownload.js');


var option = {
  hostname: 'movie.douban.com',
  path: '/top250',
  port: 443
};

var name = [];
var title = [];
var score = [];
var img = []
var commenturl = []
var comments = []
/**
 * 
 */

// var scrapy = function (opt, cb) {
  
//   https.get(opt, function(res) {
//     // 预处理一下
//     predeal(res)

//     var chunks = '';

//     res.on('data', function(chunk) {
//       chunks += chunk;
//     });

//     res.on('end', function() {
//       cb(null, chunks);
//     })
//   }).on('error', function(e) {
//     cb(e, null);
//   })
// }

function gen (opt) {
  return new Promise ((resolve, reject) => {
    https.get(opt, function(res) {
      // 预处理一下
      predeal(res)
  
      var chunks = '';
  
      res.on('data', function(chunk) {
        chunks += chunk;
      });
  
      res.on('end', function() {
        resolve(chunks)
      })
    }).on('error', function(e) {
      console.log(e)
    })
  }) 
}

// function gen (opt) {
//   return new Promise((resolve, reject) => {
//     var data 
//     paqu(opt).then((result) => { data = result }) 
//     resolve(data)
//   })
// }

gen(option)
  .then((result) => {
    var html = result
    var basename = 'https://' + option.hostname + option.path  
    name.push('https://movie.douban.com/top250')
    var $ = cheerio.load(html);
    $('#wrapper .article .paginator a').each(function () { 
    name.push(basename + $(this).attr('href'));})
    var ob = {
      length : name.length-1
    };
    return geng(ob)
}).then(ex => {
  console.log(ex);
  for ( var i = 0; i < title.length;i ++) {
    console.log('标题： ' + title[i] + '\n')
  }
})

function geng (oc) {
  return new Promise((resolve, reject) => {
    https.get(name[oc.length], function(res) {
      // 预处理一下
      console.log(name[oc.length])
      predeal(res)
      oc.chunks = '';
  
      res.on('data', function(chunk) {
        oc.chunks += chunk;
      });
  
      res.on('end', function() {
        oc.length -= 1;
        resolve(oc)
      })
    }).on('error', function(e) {
      console.log(e)
    })
    
  }).then(data => {
    if(data.length < 0) { 
      return Promise.resolve('爬完啦')
    };
      var html = data.chunks;
      var $ = cheerio.load(html);
      $('#wrapper .grid_view li').each(function () {
      title.push($('.item .info a').first().text());
      score.push($('.item .info .rating_num').text());
      img.push($('.item .pic img').attr('src'));
      commenturl.push($('.item .info a').attr('href'));})
    return geng(data)
  })
}



// paqu(option).then((result) => {
//     var html = result;
//     var basename = option.hostname + option.path + '/' 
//     name.push('movie.douban.com/top250')
//     var $ = cheerio.load(html);
//     $('#wrapper .article .paginator a').each(function () {
       
//        name.push(basename + $(this).attr('href'));
       
//     });
  
// }).then(() => {
//     return paqu(name[1]);
// }).then((result) => {
//   var html = result;
//         var $ = cheerio.load(html);
//         $('#wrapper .grid_view li').each(function () {
//           title.push($('.item .info a .title').text());
//           score.push($('.item .info .rating_num').text());
//           img.push($('.item .pic img').attr('src'));
//           commenturl.push($('.item .info a').attr('href'));})
//   console.log(title)
// })
 //   for (var i = 0;i < name.length;i++) {
    //     paqu(name[i]).then((result) => {
    //     var html = result;
    //     var $ = cheerio.load(html);
    //     $('#wrapper .grid_view li').each(function () {
    //       title.push($('.item .info a .title').text());
    //       score.push($('.item .info .rating_num').text());
    //       img.push($('.item .pic img').attr('src'));
    //       commenturl.push($('.item .info a').attr('href'));
    //     })
    //   })
    // }

// let paqu = new Promise (function(resolve, reject) {
//   scrapy.get(option, function (err, data) {
//     var html = data;
//     var basename = option.hostname + option.path + '/' 
//     name.push('movie.douban.com/top250')
//     var $ = cheerio.load(html);
//     $('#wrapper .article .paginator a').each(function () {
       
//        name.push(basename + $(this).attr('href'));
       
//     });
//     console.log(name)
//   })
//        resolve();
// })

// paqu.then(() => console.log(name))

// async.waterfall([
//   function(cb) {
//     scrapy.get(option, function (err, data) {
//       var html = data;
//       var basename = option.hostname + option.path + '/' 
//       name.push('movie.douban.com/top250')
//       var $ = cheerio.load(html);
//       $('#wrapper .article .paginator a').each(function () {
         
//          name.push(basename + $(this).attr('href'));
         
//       });
//     })
//     cb(null,name)
//   },
//   function (name, cb) {
//     console.log(name)
//     for (var i = 0;i < name.length;i++) {
//       scrapy.get(name[i], function (err, data) {
//         var html = data;
//         var $ = cheerio.load(html);
//         $('#wrapper .grid_view li').each(function () {
//           title.push($('.item .info a .title').text());
//           score.push($('.item .info .rating_num').text());
//           img.push($('.item .pic img').attr('src'));
//           commenturl.push($('.item .info a').attr('href'));
//        });
//       })
//     }
//     cb(null, commenturl)
//   },
//   function (commenturl, cb) {
//     for (var i = 0;i < commenturl.length;i++) {
//       scrapy.get(commenturl[i], function (err, data) {
//         var html = data;
//         var $ = cheerio.load(html);
//         comments.push($('#hot-comments .short ').text())
//       })
//     }
//     cb(null, comments)
//   }
// ],function(err, result) {
//   if(err) {
//   console.log(err)
//   }
//   for (var i = 0;i < 10;i++) {
//     console.log('电影： '+ title[i] + '\n' + '评分： ' + score[i] + '\n' + '热评： ' + comments[i]+ '\n')
//   }
// })




