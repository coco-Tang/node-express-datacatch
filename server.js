/*
 * @Author: coco-Tang
 * @Date: 2019-09-24 17:10:28
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-09-24 18:20:37
 * @Description: 
 */
var http = require('http') // Node.js提供了http模块，用于搭建HTTP服务端和客户端
var url = 'http://theory.people.com.cn/n1/2018/0815/c419481-30229193-5.html' //输入任何网址都可以
var cheerio = require('cheerio') // 抓取页面模块，为服务器特别定制的，快速、灵活、实施的jQuery核心实现
var iconv = require('iconv-lite');
var express = require("express");
var app = express();

function fetchData() {
  return new Promise((resolve, reject) => {
    http.get(url, function (res) {  //发送get请求
      // var html = ''
      var chunks = [];
      res.on('data', function (data) {
        // html += data.toSting('utf8')  //字符串的拼接
        chunks.push(data);
      })
      res.on('end', function () {
        var courseData = filterChapters(chunks)
        // console.log('courseData', courseData)
        resolve(courseData);
      })
    }).on('error', function (error) {
      reject(error)
      console.log('获取资源出错！')
    })

  })
  

}



function filterChapters(chunks) {
  var $ = cheerio.load(iconv.decode(Buffer.concat(chunks), 'GB2312'))  // 加载需要的html
  var chapters = $('.text_show p')  //在html里寻找需要的资源的class
  var courseData = [] // 创建一个数组，用来保存资源
  chapters.each(function (item, index) {  //遍历html文档
    var chapter = $(this)
    var text = chapter.children('a').text() + chapter.children('span').text()
    // console.log('text', text)
    // var chapterTitle = chapter.children('a').attr('title')
    // var tvUrl = chapter.children('a').attr('href').split('show/')[1]
    // var imgUrl = chapter.find('img').attr('src')
    // var updateStatus = chapter.find('.hdtag').text()
    // var type = chapter.find('.otherinfo a').text()
    // var url = `http://www.m4yy.com/show/${tvUrl}`
    courseData.push({
      text
      // chapterTitle: chapterTitle,
      // tvUrl: tvUrl,
      // imgUrl: imgUrl,
      // updateStatus: updateStatus,
      // type: type,
      // url: url
    })
  })
  return courseData //返回需要的资源
}

app.get("/", async function (req, res) {
  const data =  await fetchData()
  res.send(data)
})

app.listen(10001,function(req,res) {
  console.log('server is running on');
})