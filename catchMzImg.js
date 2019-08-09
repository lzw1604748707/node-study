const express = require('express')
const cheerio = require('cheerio')
const fs = require('fs')
const url = require('url')
const axios = require('axios')
const moment = require('moment')
const request = require('request')
const iconvLite = require('iconv-lite')

const app = express()
const baseUrl = 'http://desk.zol.com.cn'
const currentDatePath = './' + moment().format('YYYY-MM-DD') + '/'
app.get('/', (req, res) => {
  axios({
    url: baseUrl + '/pc/',
    responseType: 'arraybuffer'
  })
    .then(data => {
      const $ = cheerio.load(iconvLite.decode(data.data, 'gb2312'))
      let picUrlAndNameList = []
      let picCoverDomList = $('.pic-list2')
        .first()
        .find('.photo-list-padding')
        .each((index, photoCover) => {
          let a = $(photoCover).find('.pic>span')
          picUrlAndNameList.push({
            url: $(photoCover)
              .find('.pic')
              .attr('href'),
            folderName: $(photoCover)
              .find('.pic>span')
              .attr('title')
          })
        })
      axiosAllRequest(picUrlAndNameList).then(results => {
        results.forEach((result, collectionIndex) => {
          let $collection = $(result.data)
          let collectionImgUrlList = findcollectionUrl($collection)
          picUrlAndNameList[
            collectionIndex
          ].collectionImgUrlList = collectionImgUrlList
          let a = picUrlAndNameList
        })
        res.send(picUrlAndNameList)
        checkFolder(currentDatePath)
        fileDownload(
          'https://desk-fd.zol-img.com.cn/t_s1920x1080c5/g2/M00/08/0E/ChMlWV1LidqIFVMYADVD_aWv1NIAAMc2gHq4UUANUQV817.jpg'
        )
        // filesDownload(picUrlAndNameList, 0, picUrlAndNameList.length - 1)
      })
    })
    .catch(error => {
      let b = error
      res.send('发送失败')
    })
})
function findcollectionUrl($collection) {
  let collectionImgUrlList = []
  $collection.find('#showImg li a img').each((index, urlInfo) => {
    let filePath = urlInfo.attribs['src'] || urlInfo.attribs['srcs']
    collectionImgUrlList.push(filePath.replace('t_s144x90c5', 't_s1920x1080c5'))
  })
  return collectionImgUrlList
}
function axiosAllRequest(array) {
  return axios.all(
    array.map(reqUrl => {
      let url = reqUrl.url || reqUrl
      return axios.get(baseUrl + url)
    })
  )
}
function checkFolder(path) {
  fs.readdir(path, (error, files) => {
    if (error) {
      fs.mkdir(path, function(err) {
        if (err) throw err
      })
    }
  })
}
function fileDownload(path) {
  request(
    {
      url: path,
      method: 'GET',
      encoding: null
    },
    function(error, response, body) {
      let currentCollectionPath = currentDatePath + '临时'
      checkFolder(currentCollectionPath)
      let filePath = `${currentCollectionPath}/1.jpg`
      let readStream = fs.createReadStream(body)
      let writeStream = fs.createWriteStream(filePath)
      readStream.pipe(writeStream)
    }
  )
  // axios.get(path, { responseType: 'arraybuffer' }).then(result => {
  //   let currentCollectionPath = currentDatePath + '临时'
  //   checkFolder(currentCollectionPath)
  //   let filePath = `${currentCollectionPath}/1.jpg`
  //   let readStream = fs.createReadStream(result.data)
  //   let writeStream = fs.createWriteStream(filePath)
  //   readStream.pipe(writeStream)
  // })
}
function filesDownload(picList, currentIndex, lastIndex) {
  axiosAllRequest(picList[currentIndex].collectionImgUrlList).then(results => {
    let currentCollectionPath =
      currentDatePath + picList[currentIndex].folderName
    checkFolder(currentCollectionPath)
    results.forEach((result, index) => {
      let filePath = `${currentCollectionPath}/${index}.jpg`
      let readStream = result.data
      let writeStream = fs.createWriteStream(filePath)
      readStream.pipe(writeStream)
    })
    if (currentIndex !== lastIndex) {
      filesDownload(picList, ++currentIndex, lastIndex)
    }
  })
}

app.listen(3000, () => {
  console.log('监听3000端口')
})
