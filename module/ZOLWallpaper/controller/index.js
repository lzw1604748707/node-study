'use strict'

import service from '../service/index'

class ZolWallpaperController {
  async getCollectionList(req, res, next) {
    let collectionList = await service.getCollectionList()
    await res.send(collectionList)
  }
}

export default new ZolWallpaperController()
