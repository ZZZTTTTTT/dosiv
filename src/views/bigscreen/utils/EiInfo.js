class EiInfo {
  constructor(objJson) {
    this.eiInfo = objJson
  }

  getStatus() {
    return this.eiInfo['__sys__'].status
  }

  getMsg() {
    return this.eiInfo['__sys__'].msg
  }

  getBlock(blockName = 'result') {
    return this.extractBlockData(this.eiInfo['__blocks__'][blockName])
  }

  getBlocks() {
    let datas = {}
    let blockNames = Object.keys(this.eiInfo['__blocks__']) || []
    blockNames.forEach((name) => {
      datas[name] = this.getBlock(name)
    })
    if (this.eiInfo['__blocks__'] && this.eiInfo['__blocks__'].result && this.eiInfo['__blocks__'].result.attr) {
      datas.attr = this.eiInfo['__blocks__'].result.attr
    }
    return datas
  }

  extractBlockData(blockData = { meta: { columns: [] } }) {
    let columnNames = blockData.meta.columns.map((colInfo) => colInfo.name)
    let valueArray = blockData.rows || null

    if (!valueArray) return []
    let dataList = valueArray.map((objArr) => {
      let obj = {}
      columnNames.forEach((colN, colIdx) => {
        obj[colN] = objArr[colIdx]
      })
      return obj
    })
    return dataList
  }
}

EiInfo.prototype['RESP_STATE'] = 0

export default EiInfo
