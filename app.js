const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const url = require('url')

const app = express()
app.get('/', (req, res) => {
  const rootUrl = 'https://cnodejs.org/'
  axios
    .get(rootUrl)
    .then(data => {
      const $ = cheerio.load(data.data)
      var items = []
      let cellList = $('#topic_list .cell').splice(0, 4)
      childReqList = []
      cellList.forEach(element => {
        var $element = $(element)
        let childUrl = $element.find(' .topic_title').attr('href')
        items.push({
          author: $element.find('.user_avatar img').attr('title'),
          href: childUrl,
          title: $element.find('.topic_title').attr('title')
        })
        childReqList.push(url.resolve(rootUrl, childUrl))
      })
      axios.all(childReqList.map(reqUrl => axios.get(reqUrl))).then(results => {
        let commentUserUrlList = []
        results.forEach((result, index) => {
          let $commentUserInfo = $(result.data)
          let firstCommentUser = $commentUserInfo.find('.reply_item').first()

          let userInfoUrl = firstCommentUser.find('.reply_author').attr('href')
          commentUserUrlList.push(url.resolve(rootUrl, userInfoUrl))

          items[index].firstComment = firstCommentUser
            .find('.reply_content>.markdown-text>p')
            .text()
          items[index].commerName = firstCommentUser
            .find('.reply_author')
            .text()
        })
        axios
          .all(commentUserUrlList.map(reqUrl => axios.get(reqUrl)))
          .then(results => {
            results.forEach((result, index) => {
              items[index].floor = $(result.data)
                .find('.userinfo .unstyled .big')
                .text()
            })
            res.send(items)
          })
      })
    })
    .catch(err => {
      res.send('失败')
    })
})
// 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
app.listen(3000, () => {
  console.log('app is listening at port 3000')
})
