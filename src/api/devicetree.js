// import request from '@/utils/mockrequest'
// // 设备收藏
// export function addFavoriteDevice(params) {
//   return request({
//     url: '/ISDT01/addFavoriteDevice',
//     method: 'post',
//     data: { params },
//   })
// }
// // 设备取消收藏
// export function deleteFavoriteDevice(params) {
//   return request({
//     url: '/ISDT01/deleteFavoriteDevice',
//     method: 'post',
//     data: { params },
//   })
// }
import http from '@/utils/mockrequest-devicetree'

const baseUrlMap = {
  device: '/ISDT01/',
}

const urlNames = {
  /** 设备 */
  device: [
    'findRootDomain', //获取用户根域（带权限）
    'getNextLevelNodes', // 获取下级节点（带权限）
    'getDeviceListByConditionWithPage', // 获取设备列表
    'getPointAndKpiListByCondition', // 获取设备下测点和数据项列表
    'getFavoriteDeviceList', // 获取用户收藏设备列表
    'addFavoriteDevice', // 添加设备收藏
    'deleteFavoriteDevice', // 取消设备收藏
    'getPeerDeviceListByDeviceCodeWithPage',
    'getStateByDeviceCodeListOrDomainIdList', //获取设备状态
    'getSpecialtyDict', //获取专业项目分类字典表
    'getImportanceDegreeDict', //获取重要程度字典表
    'getDomainById', //根据管理域id获取路径
    'findAlarmDevicesByUserId', //通过userId查询未闭环的报警设备
    'findAlarmDevicesNoByuserId', //通过userId查询未闭环的工单设备
  ],
  //设备组
  // deviceGroup: [
  //   'getDeviceListByDeviceGroupIdWithPage',//获取设备组下关联设备
  //   'getDeviceGroupListByConditionWithPage'//获取设备组列表
  // ],
}

let deviceApi = { device: {} }
Object.keys(urlNames).map((type) => {
  urlNames[type].map((urlName) => {
    deviceApi[type][urlName] = function (params) {
      return http.post(`${baseUrlMap[type]}${urlName}`, params)
    }
  })
})

export default deviceApi
