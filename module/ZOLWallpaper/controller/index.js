'use strict'

import service from '../service/index'
import querystring from 'querystring'

class ZolWallpaperController {
  async getCollectionList(req, res, next) {
    let postData = ''
    req.on('data', chuck => {
      postData += chuck
    })
    req.on('end', async () => {
      postData = querystring.parse(postData)
      let collectionList = await service.getCollectionList(postData)
      await res.send(collectionList)
    })
  }
  async getTabList(req, res, next) {
    let tabList = await service.getTabList()
    await res.send(tabList)
  }
  async getStyleTypeList(req, res, next) {
    let postData = ''
    req.on('data', chuck => {
      postData += chuck
    })
    req.on('end', async () => {
      postData = querystring.parse(postData)
      let styleTypeList = await service.getStyleTypeList(postData)
      await res.send(styleTypeList)
    })
  }
  async getColorTypeList(req, res, next) {
    let postData = ''
    req.on('data', chuck => {
      postData += chuck
    })
    req.on('end', async () => {
      postData = querystring.parse(postData)
      let colorTypeList = await service.getColorTypeList(postData)
      await res.send(colorTypeList)
    })
  }
  async getPixelRatioList(req, res, next) {
    let postData = ''
    req.on('data', chuck => {
      postData += chuck
    })
    req.on('end', async () => {
      postData = querystring.parse(postData)
      let pixelRatioList = await service.getPixelRatioList(postData)
      await res.send(pixelRatioList)
    })
  }
}

export default new ZolWallpaperController()
