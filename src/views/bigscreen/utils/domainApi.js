import http from './request.js'
import { globalData } from './global.js'
import { getBlockLimit } from './tool'
import _ from 'lodash'

// 查询子域列表
export function getDomainChildrens(id, callback = (el) => el) {
  let params = _.cloneDeep(
    Object.assign(
      {},
      globalData.queryParams,
      {
        apiName: 'query_sub_domain',
        modelId: 'COMMONS',
        params: {
          domainId: id,
        },
      },
      getBlockLimit(50)
    )
  )
  return http.post(globalData.apiSBEDM02, params).then(callback)
}

export function getDomainInfo(id, callback) {
  let params = _.cloneDeep(
    Object.assign({}, globalData.queryParams, {
      apiName: 'query_domain_info_by_id',
      modelId: 'COMMONS',
      params: {
        domainId: id,
      },
    })
  )
  return http.post(globalData.apiSBEDM02, params).then(callback)
}

// 查询基地
export function queryBaseData(queryParams) {
  return new Promise((resolve) => {
    let params = Object.assign({}, queryParams, {
      apiName: 'query_sub_domain',
      modelId: 'COMMONS',
      params: {
        domainId: 515445641576227,
      },
      __blocks__: {
        result: {
          attr: {
            limit: '9999',
            offset: '0',
            showCount: 'true',
          },
        },
      },
    })
    http.post(globalData.apiSBEDM02, params).then((res) => {
      resolve(res.result)
    })
  })
}
// 查询厂部
export function queryFactoryData(queryParams, n) {
  return new Promise((resolve) => {
    let params = Object.assign({}, queryParams, {
      apiName: 'query_sub_domain',
      modelId: 'COMMONS',
      params: {
        domainId: n.slice(0, -1).split('/')[n.slice(0, -1).split('/').length - 1],
      },
      __blocks__: {
        result: {
          attr: {
            limit: '9999',
            offset: '0',
            showCount: 'true',
          },
        },
      },
    })
    http.post(globalData.apiSBEDM02, params).then((res) => {
      resolve(res.result)
    })
  })
}
// 查询产线
export function queryproductionLineData(queryParams, n) {
  return new Promise((resolve) => {
    let params = Object.assign({}, queryParams, {
      apiName: 'query_sub_domain',
      modelId: 'COMMONS',
      params: {
        domainId: n.slice(0, -1).split('/')[n.slice(0, -1).split('/').length - 1],
      },
      __blocks__: {
        result: {
          attr: {
            limit: '9999',
            offset: '0',
            showCount: 'true',
          },
        },
      },
    })
    http.post(globalData.apiSBEDM02, params).then((res) => {
      resolve(res.result)
    })
  })
}
