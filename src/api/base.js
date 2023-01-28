import request from '@/utils/mockrequest'
/*
// 获取基地设备总数量, 启用规则设备数量, 配置的数据项数量, 离线设备, 离线数据项

export function getDeviceInfoAmount(domainId) {
  return request({
    url: '/ISDM001/getDeviceInfoAmount',
    method: 'post',
    data: { domainId },
  })
}*/

//获取基地设备总数量  getAmount

export function getAmount(domainId) {
  return request({
    url: '/ISDM001/getAmount',
    method: 'post',
    data: { domainId },
  })
}

//启用规则设备数量  getRuleAmount

export function getRuleAmount(domainId) {
  return request({
    url: '/ISDM001/getRuleAmount',
    method: 'post',
    data: { domainId },
  })
}

//配置的数据项数量 getDataAmount

export function getDataAmount(domainId) {
  return request({
    url: '/ISDM001/getDataAmount',
    method: 'post',
    data: { domainId },
  })
}

//离线设备 getOfflineDeviceAmount

export function getOfflineDeviceAmount(domainId) {
  return request({
    url: '/ISDM001/getOfflineDeviceAmount',
    method: 'post',
    data: { domainId },
  })
}

// 离线数据项 getOfflineDataAmount

export function getOfflineDataAmount(domainId) {
  return request({
    url: '/ISDM001/getOfflineDataAmount',
    method: 'post',
    data: { domainId },
  })
}

// 设备类型数量

export function getDeviceTypeAmount(domainId) {
  return request({
    url: '/ISDM001/getDeviceTypeAmount',
    method: 'post',
    data: { domainId },
  })
}

// 设备状况数据

export function getDomainDeviceInfos(domainId) {
  return request({
    url: '/ISDM001/getDomainDeviceInfos',
    method: 'post',
    data: { domainId },
  })
}

// 上月诊断次数

export function getLastMonthDeviceDiagnosesAmount(domainId) {
  return request({
    url: '/ISDM001/getLastMonthDeviceDiagnosesAmount',
    method: 'post',
    data: { domainId },
  })
}

// 过去7天报警

export function getLast7DaysAlert(domainId) {
  return request({
    url: '/ISDM001/getLast7DaysAlert',
    method: 'post',
    data: { domainId },
  })
}

// 告警设备(各告警级别分类)

export function getAlertDeviceAmount(domainId) {
  return request({
    url: '/ISDM001/getAlertDeviceAmount',
    method: 'post',
    data: { domainId },
  })
}

// 异常设备(各报警级别)

export function getAbnormalDeviceAmount(domainId) {
  return request({
    url: '/ISDM001/getAbnormalDeviceAmount',
    method: 'post',
    data: { domainId },
  })
}

// 未闭环报警

export function getUnclosedAlertAmount(domainId) {
  return request({
    url: '/ISDM001/getUnclosedAlertAmount',
    method: 'post',
    data: { domainId },
  })
}
/*

//产线 -> 翘扣头

export function getCockingHead(domainId) {
  return request({
    url: '/ISDM001/getCockingHead',
    method: 'post',
    data: { domainId },
  })
}

//加热炉温度

export function getHeatingFurnace(domainId) {
  return request({
    url: '/ISDM001/getHeatingFurnace',
    method: 'post',
    data: { domainId },
  })
}

//扭矩
export function getTorqueInfo(domainId) {
  return request({
    url: '/DM001/getTorqueInfo',
    method: 'post',
    data: { domainId },
  })
}
*/
