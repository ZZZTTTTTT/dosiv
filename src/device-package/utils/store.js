const equalsObject = (a, b) => {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b
  if (a.prototype !== b.prototype) return false
  let keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((k) => equalsObject(a[k], b[k]))
}

export function store(Vue, options) {
  const state = Vue.observable({
    selectedNode: {},
    selectOptions: {},
    collectList: [],
    groupList: [],
    dataCache: {},
    breadcrumb: [],
    refreshGroup: false,
    apiObj: {
      device: {},
      collect: {},
      focus: {},
      deviceGroup: {},
      export: {},
    },
    nodeFinishFlag: false,
  })

  const mutations = {
    setNodeFinishFlag(flag) {
      state.nodeFinishFlag = flag
    },
    setGroupList(data) {
      state.groupList = data
    },
    setCollectList(data) {
      state.collectList = data
    },
    setDeviceApi(apiObj) {
      state.apiObj.device = apiObj
    },
    setDeviceGroupApi(apiObj) {
      state.apiObj.deviceGroup = apiObj
    },
    setExportApi(apiObj) {
      state.apiObj.export = apiObj
    },
    setCollectApi(apiObj) {
      state.apiObj.collect = apiObj
    },
    setFocusApi(apiObj) {
      state.apiObj.focus = apiObj
    },
    toggleRefreshGroup() {
      state.refreshGroup = !state.refreshGroup
    },
    // 0默认 1为正常 2为注意 3为警告 4为危险
    statusColor(status) {
      let color
      switch (status) {
        case 0:
          color = '#869098'
          break
        case 1:
          color = '#3cd2a5'
          break
        case 2:
          color = '#ffdc30'
          break
        case 3:
          color = '#da7f1c'
          break
        case 4:
          color = '#f51f21'
          break
        default:
          break
      }
      return color
    },
    templateAttr(value) {
      const tempAttrOptions = [
        {
          label: '自用',
          value: 0,
        },
        {
          label: '通用',
          value: 1,
        },
      ]
      if (value !== 0 && !value) {
        return tempAttrOptions
      }
      let tempObj = tempAttrOptions.find((item) => item.value === value)
      return tempObj && tempObj.label
    },
    downloadBaseToExcel(base64result) {
      const link = document.createElement('a')
      const blob = new Blob([base64result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', decodeURI(`设备组列表.xlsx`))
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    domainTypeMap(key) {
      if(!key) return 'device'
      const map = {
        基地: 'base',
        厂部: 'factory',
        产线: 'productLine',
        区域: 'area',
        设备: 'device',
      }
      return map[key] || key
    },
    async setSelectedNode(node) {
      state.selectedNode = node
      const { category } = node
      if (category == 'group') {
        const { children } = node
        if (children && children.length > 0) {
          state.breadcrumb = children.map((item) => {
            let { deviceId, deviceName, deviceCode, domainNamePath, domainPath } = item
            let nameList = domainNamePath.split('/')
            nameList.push(deviceName + ' ( ' + deviceCode + ' )')
            let pathIds = domainPath.split('/')
            pathIds.push(deviceId)
            return {
              name: nameList,
              id: deviceId,
              deviceCode,
              pathIds,
            }
          })
        } else {
          state.breadcrumb = []
        }
      } else {
        const { domainKVList, id, name, domainNamePath, domainPath, deviceId, deviceName, deviceCode } = node
        if (domainKVList) {
          state.breadcrumb = domainKVList.map((item) => {
            let keys = Object.keys(item)
            return {
              name: item[keys[0]],
              id: keys[0],
            }
          })
        }
        if (domainNamePath) {
          let idList = domainPath.split('/')
          let nameList = domainNamePath.split('/')
          state.breadcrumb = idList.map((id, index) => {
            let name = nameList[index]
            return {
              name,
              id,
            }
          })
        }
        if (category === 'device') {
          state.breadcrumb.push({
            id: id || deviceId,
            name: name ? name + ' ( ' + deviceCode + ' )' : deviceName + ' ( ' + deviceCode + ' )',
            deviceCode,
          })
        }
      }
    },
    async getSelectOptions(dpkId) {
      try {
        const root = await this.getRootDomain()
        let rootId = root.id
        if (!dpkId) return { options: [root] }
        let tempArr = dpkId.split('&')
        let deviceCode = tempArr[0],
          pointId = tempArr[1]
        // 获取设备信息
        let targetDevice
        if (pointId == 'group') {
          const deviceGroup = await this.getDeviceListByDeviceGroupId({ deviceGroupId: deviceCode })
          if (deviceGroup.data && deviceGroup.data.length > 0) {
            targetDevice = deviceGroup.data[0]
          } else {
            return { options: [root] }
          }
        } else {
          const res = await this.getDeviceListByConditionWithPage({ deviceCodeOrName: deviceCode })
          const { data } = res
          if (data.length == 0) return { options: [root] }
          targetDevice = data.find((item) => item.deviceCode == deviceCode)
        }
        let { domainPath, deviceCode: targetDeviceCode } = targetDevice
        let tempDomainArr = domainPath.split('/')
        let rootIndex = tempDomainArr.findIndex((item) => item == rootId)
        let domainArr = tempDomainArr.slice(rootIndex)
        let options = [[root]]
        let level = 0
        for (let index = 0; index < domainArr.length; index++) {
          let dominId = domainArr[index]
          let nextOptions = await this.getNextLevelNodes(dominId, level++)
          options.push(nextOptions)
        }
        let lastOptions = options[options.length - 1]
        if (lastOptions.some((item) => item.domainType)) {
          let lastDeviceObj = lastOptions.find((item) => item.deviceCode == targetDeviceCode)
          options.push([
            {
              name: lastDeviceObj ? lastDeviceObj.name : '',
              deviceCode: targetDeviceCode,
            },
          ])
          // domainArr.push(targetDeviceCode)
          domainArr.push(lastDeviceObj ? lastDeviceObj.id : targetDeviceCode)
        }
        const pointOptions = await this.getPointAndKpiListByCondition({
          deviceCodeList: [targetDeviceCode],
          isSignal:false,
        })
        options.push(pointOptions)
        if (pointId && pointId != 'group') {
          let kpiOptions = pointOptions.find((item) => item.pointId === pointId).kpiList
          options.push(kpiOptions)
        }
        // eslint-disable-next-line require-atomic-updates
        state.selectOptions[dpkId] = { ...targetDevice, domainArr, options: options }
        return state.selectOptions[dpkId]
      } catch (error) {
        return Promise.reject(error)
      }
    },
    setDataCache({ key, params, data }) {
      if (!state.dataCache[key]) {
        state.dataCache[key] = {
          params: [],
          data: [],
        }
      }
      const cacheParams = state.dataCache[key].params
      if (!cacheParams.some((item) => equalsObject(item, params))) {
        state.dataCache[key].params.push(params)
        state.dataCache[key].data.push(data)
      }
    },
    getDataCacheByKey({ key, params }) {
      if (!state.dataCache[key]) return false
      let index = state.dataCache[key].params.findIndex((item) => equalsObject(item, params))
      return index > -1 && state.dataCache[key].data[index]
    },
    // 获取根域
    async getRootDomain(params) {
      const { findRootDomain } = state.apiObj.device
      try {
        let cacheParams = { key: 'findRootDomain', params }
        let rootDomain = this.getDataCacheByKey(cacheParams)
        if (!rootDomain) {
          // console.log('根域接口请求')
          const result = await findRootDomain(params)
          result.level = 0
          result.status = 0
          result.root = true
          result.children = []
          this.setDataCache({ ...cacheParams, data: result })
          rootDomain = result
        } else {
          // console.log('根域缓存数据', rootDomain)
        }
        return rootDomain
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 获取下级节点
    async getNextLevelNodes(nodeId, level) {
      const { getNextLevelNodes } = state.apiObj.device
      try {
        let cacheParams = { key: 'getNextLevelNodes', params: { nodeId } }
        let nextNode = this.getDataCacheByKey(cacheParams)
        if (!nextNode) {
          // console.log('下级接口请求')
          const result = await getNextLevelNodes({ params: { nodeId } })
          result.forEach((item) => {
            item.level = level + 1 || 0
            item.status = 0
            item.children = []
          })
          this.setDataCache({ ...cacheParams, data: result })
          nextNode = result
        } else {
          // console.log('下级缓存数据', nextNode)
        }
        return nextNode
      } catch (error) {
        // console.log('error', error)
        return Promise.reject(error)
      }
    },
    // 获取节点报警状态
    async getNodeStatus(params) {
      // console.log('获取状态等级参数', params)
      const { getStateByDeviceCodeListOrDomainIdList } = state.apiObj.device
      try {
        const result = await getStateByDeviceCodeListOrDomainIdList({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 更新节点报警状态
    async updateNodeStatus(nodeData) {
      try {
        if (!nodeData || nodeData.length == 0) return
        let params = { domains: [], deviceCode: [] }
        nodeData.map((item) => {
          // console.log('item', item)
          const { id, domainType, deviceCode } = item
          if (domainType) {
            params.domains.push(id)
          } else {
            params.deviceCode.push(deviceCode)
          }
        })
        let domainStatusRes = [],
          deviceStatusRes = []
        let { domains, deviceCode } = params
        if (domains.length > 0) {
          domainStatusRes = await this.getNodeStatus({ domains })
          nodeData.forEach((item) => {
            let domainStatusObj = domainStatusRes.find((status) => status.domains && status.domains == item.id)
            if (domainStatusObj) {
              item.status = domainStatusObj.level
            }
          })
        }
        if (deviceCode.length > 0) {
          deviceStatusRes = await this.getNodeStatus({ deviceCode })
          nodeData.forEach((item) => {
            let domainStatusObj = deviceStatusRes.find((status) => status.deviceCode && status.deviceCode == item.deviceCode)
            if (domainStatusObj) {
              item.status = domainStatusObj.level
            }
          })
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 获取测点和数据项
    async getPointAndKpiListByCondition(params) {
      try {
        const { getPointAndKpiListByCondition } = state.apiObj.device
        let cacheParams = { key: 'getPointAndKpiListByCondition', params }
        let pointAndKpiList = this.getDataCacheByKey(cacheParams)
        if (!pointAndKpiList) {
          // console.log('下级接口请求')
          const result = await getPointAndKpiListByCondition({ params })
          this.setDataCache({ ...cacheParams, data: result })
          pointAndKpiList = result
        } else {
          // console.log('下级缓存数据', pointAndKpiList)
        }
        return pointAndKpiList
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 获取设备列表
    async getDeviceListByConditionWithPage(params) {
      try {
        // let cacheParams = { key: 'getDeviceListByConditionWithPage', params }
        // let deviceList = this.getDataCacheByKey(cacheParams)
        // if (!deviceList) {
        //   // console.log('获取设备接口请求')
        //   const { deviceBaseUrl } = state.apiObj.device
        //   const res = await axios.post(deviceBaseUrl + '/getDeviceListByConditionWithPage', {
        //     params
        //   })
        //   const result = await handleError(res)
        //   this.setDataCache({ ...cacheParams, data: result })
        //   deviceList = result
        // } else {
        //   // console.log('获取设备缓存数据', deviceList)
        // }
        const { getDeviceListByConditionWithPage } = state.apiObj.device
        const result = await getDeviceListByConditionWithPage({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 根据域id获取详细信息
    async getDomainById(params) {
      try {
        const { getDomainById } = state.apiObj.device
        if (!getDomainById) return
        const result = await getDomainById({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    //获取设备收藏列表
    async getFavoriteDeviceList(params) {
      try {
        const { getFavoriteDeviceList } = state.apiObj.collect
        const result = await getFavoriteDeviceList({ params })
        return result.map((item) => ({ ...item, status: 0 }))
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 获取字典-设备专业、设备重要程度
    async getDeviceDictionary() {
      try {
        const { getImportanceDegreeDict, getSpecialtyDict } = state.apiObj.device
        let specialtyParams = { key: 'getSpecialtyDict', params: {} }
        let importanceDegreeParams = { key: 'getImportanceDegreeDict', params: {} }
        let specialty = this.getDataCacheByKey(specialtyParams)
        let importanceDegree = this.getDataCacheByKey(importanceDegreeParams)
        if (!specialty) {
          specialty = await getSpecialtyDict({})
          this.setDataCache({ ...specialtyParams, data: specialty })
        }
        if (!importanceDegree) {
          importanceDegree = await getImportanceDegreeDict({})
          this.setDataCache({ ...importanceDegreeParams, data: importanceDegree })
        }
        return {
          specialty,
          importanceDegree,
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 查询未闭环的报警设备
    async getAlarmDevices(params) {
      try {
        const { findAlarmDevicesByUserId } = state.apiObj.focus
        let alertParams = { key: 'findAlarmDevicesByUserId', params }
        let result = this.getDataCacheByKey(alertParams)
        if (!result) {
          result = await findAlarmDevicesByUserId({ params })
          this.setDataCache({ ...alertParams, data: result })
        }
        return result.map((item) => ({ ...item, status: 0 }))
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 查询未闭环的工单设备
    async getWorkOrderDevices(params) {
      try {
        const { findAlarmDevicesNoByuserId } = state.apiObj.focus
        let orderParams = { key: 'findAlarmDevicesNoByuserId', params }
        let result = this.getDataCacheByKey(orderParams)
        if (!result) {
          result = await findAlarmDevicesNoByuserId({ params })
          this.setDataCache({ ...orderParams, data: result })
        }
        return result.map((item) => ({ ...item, status: 0 }))
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 获取设备组列表
    async getDeviceGroupList(params) {
      try {
        const { getDeviceGroupListByConditionWithPage } = state.apiObj.deviceGroup
        const result = await getDeviceGroupListByConditionWithPage({ params })
        this.setGroupList(result)
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 获取设备组下关联设备
    async getDeviceListByDeviceGroupId(params) {
      try {
        const { getDeviceListByDeviceGroupIdWithPage } = state.apiObj.deviceGroup
        const result = await getDeviceListByDeviceGroupIdWithPage({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 设备组管理-获取列表
    async getDeviceListAndDeviceByConditionWithPage(params) {
      try {
        const { getDeviceListAndDeviceByConditionWithPage } = state.apiObj.deviceGroup
        const result = await getDeviceListAndDeviceByConditionWithPage({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 导出失败数据或导出选中项
    async exportExcelByConfig(params) {
      try {
        const { exportExcelByConfig } = state.apiObj.export
        const result = await exportExcelByConfig('fileName=设备组列表.xlsx&config=lpdg01', params)
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 设备组新增
    async addDeviceGroupByManager(params) {
      try {
        const { addDeviceGroupByManager } = state.apiObj.deviceGroup
        const result = await addDeviceGroupByManager({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 设备组修改
    async updateDeviceGroupByManager(params) {
      try {
        const { updateDeviceGroupByManager } = state.apiObj.deviceGroup
        const result = await updateDeviceGroupByManager({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 生成唯一设备组编码
    async generateDeviceGroupCode(params) {
      try {
        const { generateDeviceGroupCode } = state.apiObj.deviceGroup
        const result = await generateDeviceGroupCode({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 删除设备组、设备关联设备
    async deleteDeviceGroup(params) {
      try {
        const { deleteDeviceGroupAndDevice } = state.apiObj.deviceGroup
        const result = await deleteDeviceGroupAndDevice({ params })
        return result
      } catch (error) {
        return Promise.reject(error)
      }
    },
  }
  const commit = (fn, ...val) => {
    return mutations[fn](...val)
  }
  return {
    state,
    commit,
  }
}
