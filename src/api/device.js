import request from '@/utils/mockrequest'

// 数据看板
export function statisticsKpiIndicatorAggrByPoint(params) {
  return request({
    url: '/ISDV01/statisticsKpiIndicatorAggrByPoint',
    method: 'post',
    data: { params },
  })
}

export function getKpiValueListByCondition(params) {
  return request({
    url: '/ISDV01/getKpiValueListByCondition',
    method: 'post',
    data: { params },
  })
}

//异常工单
export function getTicketListByConditionWithPage(params) {
  return request({
    url: '/ISDV01/getTicketListByConditionWithPage',
    method: 'post',
    data: { params },
  })
}
//报警记录
export function getAlertListByConditionWithPage(params) {
  return request({
    url: '/ISDV01/getAlertListByConditionWithPage',
    method: 'post',
    data: { params },
  })
}

//设备信息
export function findDeviceByDeviceCode(params) {
  return request({
    url: '/ISDV01/findDeviceByDeviceCode',
    method: 'post',
    data: { params },
  })
}

//故障履历
export function getFaultRecordListByDeviceIdWithPage(params) {
  return request({
    url: '/ISDV01/getFaultRecordListByDeviceIdWithPage',
    method: 'post',
    data: { params },
  })
}

// 获取根域
export function findRootDomain() {
  return request({
    url: '/ISDT01/findRootDomain',
    method: 'post',
    data: {},
  })
}

// 获取统计指标-处理中异常
export function countUnfinishedTicket(params) {
  return request({
    url: '/ISDV02/countUnfinishedTicket',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-最近30天异常
export function countTicketToLast30Day(params) {
  return request({
    url: '/ISDV02/countTicketToLast30Day',
    method: 'post',
    data: {
      params,
    },
  })
}

// 离线诊断报告
export function getOfflineReportListByDeviceCodeWithPage(params) {
  return request({
    url: '/ISDV01/getOfflineReportListByDeviceCodeWithPage',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取离线诊断报告文件
export function getOfflineReportFile(params) {
  return request({
    url: '/ISDV01/getOfflineReportFile',
    method: 'post',
    data: {
      params,
    },
  })
}
