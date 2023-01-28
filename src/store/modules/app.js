import Cookies from 'js-cookie'
import { getMenu } from '@/utils/auth'

// console.log('app.js - getMenu()', getMenu())

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  username: '',
  currentLevel: 'default',
  currentDomainId: '',
  currentNodeId: 0,
  currentDeviceCode: 0,
  currentNodeName: '',
  currentNode: {},
  currentDomainPath: '',
  configNodeId: '',
  configNodeLevel: '',
  lastClickStamp: 0, //组态点击时间戳
  // activeTab: getMenu() || '',
  resizeFlagT: '', // resize事件出发后，这个值会改变，用来刷新页面中布局需要重新渲染的组件块
  remRatio: 1,
  breadcrumb: [], //面包屑导航
  levelList: [
    {
      id: 0,
      name: '基地',
      level: 'base',
    },
    {
      id: 1,
      name: '厂部',
      level: 'factory',
    },
    {
      id: 2,
      name: '产线',
      level: 'productline',
    },
    {
      id: 3,
      name: '区域',
      level: 'area',
    },
    {
      id: 4,
      name: '设备',
      level: 'device',
    },
  ],
}

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },

  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_LEVEL: (state, level) => {
    state.currentLevel = level
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_NODE_ID: (state, nodeId) => {
    state.currentNodeId = nodeId
  },
  SET_DEVICE_CODE: (state, deviceCode) => {
    state.currentDeviceCode = deviceCode
  },
  SET_DOMAIN_PATH: (state, domainPath) => {
    state.currentDomainPath = domainPath
  },
  SET_NODE_NAME: (state, name) => {
    state.currentNodeName = name
  },
  SET_LEVEL_LIST: (state, levelList) => {
    state.levelList = levelList
  },
  SET_CURRENT_NODE: (state, node) => {
    state.currentNode = node
  },
  SET_CONFIG_NODE_ID: (state, id) => {
    state.configNodeId = id
  },
  SET_CONFIG_NODE_LEVEL: (state, level) => {
    state.configNodeLevel = level
  },
  // SET_ACTIVE_TAB: (state, tab) => {
  //   state.activeTab = tab
  // },
  SET_LAST_CLICK_STAMP: (state, stamp) => {
    state.lastClickStamp = stamp
  },
  SET_RESIZE_FLAG_T(state, t) {
    state.resizeFlagT = t
  },
  SET_REMRATIO(state, r) {
    state.remRatio = r
    //console.log('state.remRatio', state.remRatio)
  },
  setBreadcrumb(state, arr) {
    state.breadcrumb = arr
  },
  setCurrentDomain(state, id) {
    state.currentDomainId = id;
},
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
