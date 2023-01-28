import request from '@/utils/mockrequest'

// 获取统计指标-异常设备数量
export function getAbnormalDeviceCount(params) {
  return request({
    url: '/ISDV02/getAbnormalDeviceCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-设备数量
export function countDevice(params) {
  return request({
    url: '/ISDV02/countDevice',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-待处理报警数量
export function getAlertToHandleCount(params) {
  return request({
    url: '/ISDV02/getAlertToHandleCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-最近30天共产生
export function countAlertToLast30Day(params) {
  return request({
    url: '/ISDV02/countAlertToLast30Day',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-流程中的报警
export function getAlertOnProcessCount(params) {
  return request({
    url: '/ISDV02/getAlertOnProcessCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-最近30天处理完
export function countAlertFinishedToLast30Day(params) {
  return request({
    url: '/ISDV02/countAlertFinishedToLast30Day',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-已配置数据项数量
export function getKpiCodeCount(params) {
  return request({
    url: '/ISDV02/getKpiCodeCount',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取统计指标-断更数据项
export function countInactiveKpi(params) {
  return request({
    url: '/ISDV02/countInactiveKpi',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取当前节点下设备状态概览汇总数据
export function getDeviceStatusViewListByConditionWithPage(domainId, offset, limit) {
  return request({
    url: '/ISDV01/getDeviceStatusViewListByConditionWithPage',
    method: 'post',
    data: {
      params: {
        domainId,
        offset,
        limit,
      },
    },
  })
}

// 统计设备测点下kpi指标按照测点聚合
export function statisticsKpiIndicatorAggrByPoint(deviceCode) {
  return request({
    url: '/ISDV01/statisticsKpiIndicatorAggrByPoint',
    method: 'post',
    data: {
      params: {
        deviceCode,
      },
    },
  })
}

// 获取工单列表根据查询条件
export function getTicketListByConditionWithPage(params) {
  return request({
    url: '/ISDV01/getTicketListByConditionWithPage',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取报警列表根据条件
export function getAlertListByConditionWithPage(params) {
  return request({
    url: '/ISDV01/getAlertListByConditionWithPage',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取数据项实时数据
export function getKpiValueListByCondition(params) {
  return request({
    url: '/ISDV01/getKpiValueListByCondition',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取专业字典表
export function getSpecialtyDict() {
  return request({
    url: 'ISDT01/getSpecialtyDict',
    method: 'post',
    data: {},
  })
}

// 获取检测专业树形结构
export function getSpecialtyTree() {
  return request({
    url: 'ISDV01/getSpecialtyTree',
    method: 'post',
    data: {},
  })
}

// 获取报警来源字典表
export function getAlertSourceDict() {
  return request({
    url: 'ISDV01/getAlertSourceDict',
    method: 'post',
    data: {},
  })
}

// 获取工单过程跟踪列表
export function getTicketProcessListByTaskId(params) {
  return request({
    url: 'ISDV01/getTicketProcessListByTaskId',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取工单节点处理详情
export function findTaskById(params) {
  return request({
    url: 'ISDV01/findTaskById',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取报警处理记录
export function getAlertProcessListByAlertId(params) {
  return request({
    url: 'ISDV01/getAlertProcessListByAlertId',
    method: 'post',
    data: {
      params,
    },
  })
}

// 获取诊断报告
export function findDiagnosisReportByTaskId(params) {
  return request({
    url: 'ISDV01/findDiagnosisReportByTaskId',
    method: 'post',
    data: {
      params,
    },
  })
}

// 根据标签和对象id获取View对象
export function queryByLabelIdAndObjectId(params) {
  return request({
    url: 'ISDV03/queryByLabelIdAndObjectId',
    method: 'post',
    data: {
      params,
    },
  })
}

// 根据对象id和分页参数获取View对象
export function queryByObjectIdWithPage(params) {
  return request({
    url: 'ISDV03/queryByObjectIdWithPage',
    method: 'post',
    data: {
      params,
    },
  })
}

// sample
export function getDeviceInfoAmount(domainId) {
  return request({
    url: '/ISDM001/getDeviceInfoAmount',
    method: 'post',
    data: { domainId },
  })
}
