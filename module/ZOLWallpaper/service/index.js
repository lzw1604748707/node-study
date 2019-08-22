'use strict'

import ReptileBaseComponent from '../../../base/ReptileBase'
import cheerio from 'cheerio'
import fs from 'fs'
import url from 'url'
import axios from 'axios'
import iconvLite from 'iconv-lite'

class ZolWallpaperService extends ReptileBaseComponent {
  constructor() {
    super()
    this.BASEURL = 'http://desk.zol.com.cn'
  }
  async getCollectionList() {
    let picUrlAndNameList = []
    await this.callApi({
      url: this.BASEURL + '/pc/',
      responseType: 'arraybuffer'
    })
      .then(data => {
        const $ = cheerio.load(iconvLite.decode(data.data, 'gb2312'))
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
      })
      .catch(error => {
        return '发送失败'
      })
    return await picUrlAndNameList
  }
}

export default new ZolWallpaperService()
