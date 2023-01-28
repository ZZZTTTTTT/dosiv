import request from '@/utils/mockrequest'

//getDomainById
export function getDomainById(params) {
  return request({
    url: '/ISDT01/getDomainById',
    method: 'post',
    data: {
      params,
    },
  })
}
// 当前异常设备数量
export function getAbnormalDeviceTotalCount(params) {
  return request({
    url: '/ISDV04/getAbnormalDeviceTotalCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取子节点
export function getNextLevelNodes(params) {
  return request({
    url: 'ISDT01/getNextLevelNodes',
    method: 'post',
    data: {
      params,
    },
  })
}

// 规则总数量
// export function getRuleAmount(params) {
//   return request({
//     url: '/ISDV04/getRuleAmount',
//     method: 'post',
//     data: {
//       params,
//     },
//   })
// }

// 未闭环异常总数量
export function getAbnormalTicketCount(params) {
  return request({
    url: '/ISDV04/getAbnormalTicketCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 设备总接入数量（按月统计）
export function getAccessDeviceCount(params) {
  return request({
    url: '/ISDV04/getAccessDeviceCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 产生告警数（按日统计）
export function getAriseAlertCount(params) {
  return request({
    url: '/ISDV04/getAriseAlertCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 设备总数量
export function getDeviceTotalCount(params) {
  return request({
    url: '/ISDV04/getDeviceTotalCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 故障设备数量
export function getFaultDeviceCount(params) {
  return request({
    url: '/ISDV04/getFaultDeviceCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 产线数量
export function getProductLineCount(params) {
  return request({
    url: '/ISDV04/getProductLineCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 数据项总数
export function getDataItemTotalCount(params) {
  return request({
    url: '/ISDV04/getDataItemTotalCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 分类数量占比
export function getDeviceTypePercentage(params) {
  return request({
    url: '/ISDV04/getDeviceTypePercentage',
    method: 'post',
    data: {
      params,
    },
  })
}

// 监测台数
export function getMonitorDeviceCount(params) {
  return request({
    url: '/ISDV04/getMonitorDeviceCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 告警数量（月）
export function getAlertCountByMonth(params) {
  return request({
    url: '/ISDV04/getAlertCountByMonth',
    method: 'post',
    data: {
      params,
    },
  })
}

// 诊断次数（月）
export function getDiagnoseCountByMonth(params) {
  return request({
    url: '/ISDV04/getDiagnoseCountByMonth',
    method: 'post',
    data: {
      params,
    },
  })
}
