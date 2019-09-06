'use strict'

import ReptileBaseComponent from '../../../base/ReptileBase'
import cheerio from 'cheerio'
import iconvLite from 'iconv-lite'

class ZolWallpaperService extends ReptileBaseComponent {
  constructor() {
    super()
    this.BASEURL = 'http://desk.zol.com.cn'
  }
  async getTabList() {
    let tabList = [
      {
        text: '电脑壁纸',
        value: 'p1'
      },
      {
        text: '笔记本壁纸',
        value: 'p4'
      },
      {
        text: 'Pad壁纸',
        value: 'p3'
      },
      {
        text: '手机壁纸',
        value: 'moblie'
      }
    ]
    return tabList
  }
  async getCollectionList(config) {
    let collectionList = []
    let total = 0
    let url = await this.completeUrl(config)

    await this.callApi({
      url: url,
      responseType: 'arraybuffer'
    })
      .then(data => {
        const $ = cheerio.load(iconvLite.decode(data.data, 'gb2312'))
        let picCoverDomList = $('.pic-list2')
          .first()
          .find('.photo-list-padding')
        let picDomAllTotal = Number($('.choosebox .allPic font').text())
        // let picDomPageTotal = picCoverDomList.length
        // total = Math.ceil(picDomAllTotal / picDomPageTotal)
        total = picDomAllTotal
        picCoverDomList.each((index, photoCover) => {
          let a = $(photoCover).find('.pic>span')
          collectionList.push({
            cover: $(photoCover)
              .find('.pic img')
              .attr('src')
              .replace(RegExp(/t_s(\w+)[^/]/), 't_s600x400c5'),
            title: $(photoCover)
              .find('.pic>span')
              .attr('title'),
            createDate: $(photoCover)
              .find('ins')
              .text(),
            sheets: $(photoCover)
              .find('.pic>span')
              .text()
              .match(/(\w+[^(])/)[0],
            url: $(photoCover)
              .find('.pic')
              .attr('href')
          })
        })
      })
      .catch(error => {
        return '发送失败，获取作品集错误'
      })
    return await {collectionList, total}
  }
  async getStyleTypeList(params) {
    let styleTypeList = []
    let url = await this.completeUrl(params)
    console.log(url)
    await this.callApi({
      url: url,
      responseType: 'arraybuffer'
    })
      .then(data => {
        const $ = cheerio.load(iconvLite.decode(data.data, 'gb2312'))
        try {
          let styleTypeDomList = $(
            '.choosebox .filter-item.first .brand-sel-box'
          )
            .first()
            .find('a')
          styleTypeDomList.each((index, styleType) => {
            if (index === 0) return
            styleTypeList.push({
              text: $(styleType).text(),
              value: $(styleType)
                .attr('href')
                .match(/\w+\w/)[0]
            })
          })
        } catch (error) {
          return '发送失败，获取壁纸类型错误' + error
        }
      })
      .catch(error => {
        return '发送失败，获取壁纸类型错误'
      })
    return await styleTypeList
  }
  async getColorTypeList(params) {
    let colorTypeList = []
    let url = await this.completeUrl(params)
    console.log(url)
    await this.callApi({
      url: url,
      responseType: 'arraybuffer'
    })
      .then(data => {
        const $ = cheerio.load(iconvLite.decode(data.data, 'gb2312'))
        try {
          let colorTypeDomList = $(
            '.choosebox .filter-item.color-item .brand-sel-box'
          )
            .first()
            .find('a')
          colorTypeDomList.each((index, colorType) => {
            if (index === 0) return
            colorTypeList.push({
              text: $(colorType).text(),
              color: $(colorType).attr('class'),
              value: $(colorType)
                .attr('href')
                .match(/\w+\w/)[0]
            })
          })
        } catch (error) {
          colorTypeList = '发送失败，获取壁纸色系错误' + error
        }
      })
      .catch(error => {
        colorTypeList = '发送失败，获取壁纸类型错误'
      })
    return await colorTypeList
  }
  async getPixelRatioList(params) {
    let pixelRatioList = []
    let url = await this.completeUrl(params)
    console.log(url)
    await this.callApi({
      url: url,
      responseType: 'arraybuffer'
    })
      .then(data => {
        const $ = cheerio.load(iconvLite.decode(data.data, 'gb2312'))
        try {
          let pixelRatioDomList = $(
            '.choosebox .filter-item:nth-child(2)  .brand-sel-box'
          )
            .first()
            .find('a')
          pixelRatioDomList.each((index, pixelRatio) => {
            if (index === 0) return
            pixelRatioList.push({
              text: $(pixelRatio).text(),
              value: $(pixelRatio)
                .attr('href')
                .match(/\w+\w/)[0]
            })
          })
        } catch (error) {
          return '发送失败，获取壁纸类型错误' + error
        }
      })
      .catch(error => {
        return '发送失败，获取壁纸类型错误'
      })
    return await pixelRatioList
  }

  completeUrl(config) {
    let detailList = [config.pixelRatio, config.colorType, config.model]
    // 可优化
    detailList = _lodash.differenceWith(detailList, ['', undefined, null])
    let detail = detailList.join('_')
    let currentPage =
      config.pageIndex && Number(config.pageIndex) !== 1
        ? `${config.pageIndex}.html`
        : ''
    let url =
      this.BASEURL +
      this.formatPath(config.styleType) +
      this.formatPath(detail) +
      '/' +
      currentPage
    return url
  }
  formatPath(path) {
    return path ? '/' + path : ''
  }
}

export default new ZolWallpaperService()
