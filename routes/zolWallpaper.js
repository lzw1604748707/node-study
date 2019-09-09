'use strict'

import express from 'express'
import ZOLWallpaper from '../module/ZOLWallpaper/controller/index.js'
const router = express.Router()

router.post('/collectionList', ZOLWallpaper.getCollectionList)
router.post('/collectionDetail', ZOLWallpaper.getCollectionDetail)
router.get('/tabList', ZOLWallpaper.getTabList)
router.post('/styleTypeList', ZOLWallpaper.getStyleTypeList)
router.post('/colorTypeList', ZOLWallpaper.getColorTypeList)
router.post('/pixelRatioList', ZOLWallpaper.getPixelRatioList)

export default router
