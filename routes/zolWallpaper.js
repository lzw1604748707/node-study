'use strict'

import express from 'express'
import ZOLWallpaper from '../module/ZOLWallpaper/controller/index.js'
const router = express.Router()

router.get('/CollectionList', ZOLWallpaper.getCollectionList)
export default router
