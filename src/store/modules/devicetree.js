export default {
  namespaced: true,
  state: {
    // 设备收藏
    deviceCodes: [],
    refreshFlag: false,
  },
  mutations: {
    setDeviceCodes(state, data) {
      state.deviceCodes = data
    },
    setRefreshFlag(state) {
      state.refreshFlag = !state.refreshFlag
    },
  },
  actions: {},
}
