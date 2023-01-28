<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container menu-wrap" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container menu-wrap">
      <!-- <div :class="{ 'fixed-header': fixedHeader }"> -->
      <!-- :style="{ background: themeStyle ? '#1e2936' : '#dae1e7' }" -->
      <div class="nav-header">
        <navbar />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <div class="main-content">
        <!-- <div class="main-device"></div> -->
        <div class="main-device column">
          <transition name="ease">
            <div class="column-left animate-left" v-show="showDevice">
              <div class="resize-bar"></div>
              <!-- <div class="resize-line"></div> -->
              <div class="resize-save">
                <BorderWrap class="main-left">
                  <DeviceTabs
                    v-model="activeTab"
                    @getCheckedNode="getCheckedNode"
                    @getBreadcrumb="getBreadcrumb"
                    :initDeviceCode="selectedNodeId"
                    :nodeType="selectedNodeType"
                    :noCacheFlag="noCacheFlag"
                    :theme="themeStyle ? 'dark' : 'light'"
                  >
                    <DeviceTabPane label="我的" name="deviceTree">
                      <DeviceTree :apiConfig="deviceApi"></DeviceTree>
                    </DeviceTabPane>
                    <DeviceTabPane label="收藏" name="deviceCollect">
                      <DeviceCollect :apiConfig="deviceApi" :refreshCollect="refreshCollect"></DeviceCollect>
                    </DeviceTabPane>
                    <DeviceTabPane label="需关注" name="deviceFocus">
                      <DeviceFocus :apiConfig="deviceApi"></DeviceFocus>
                    </DeviceTabPane>
                  </DeviceTabs>
                </BorderWrap>
              </div>
            </div>
          </transition>
          <i class="expand-icon" :class="{ fold: !showDevice }" @click="toggleDevice"></i>
        </div>

        <app-main style="flex: 1" />
      </div>

      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
    </div>
  </div>
</template>

<script>
const getQueryParams = (key) => {
  let searchArr = location.search.split('?')
  if (searchArr.length > 1) {
    let strArr = searchArr[1].split('&')
    let obj = {}
    for (const i in strArr) {
      let strs = strArr[i].split('=')
      obj[strs.shift()] = strs.shift()
    }
    return obj[key]
  }
  return ''
}
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState, mapMutations } from 'vuex'
import { setCurrentNodeId, getCurrentNodeId, setCurrentNodeLevel, getCurrentNodeLevel } from '@/utils/auth'

import deviceApi from '@/api/devicetree'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showDevice: true,
      activeTab: 'deviceTree',
      // selectedNodeId: getQueryParams('deviceCode'),
      selectedNodeId: getCurrentNodeId(),
      selectedNodeType: getCurrentNodeLevel(),
      deviceApi: deviceApi.device,
    }
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader,
      themeStyle() {
        return this.$store.state.user.themeStyle
      },
      nodeType() {
        return this.$store.state.app.configNodeLevel
      },
      nodeId() {
        return this.$store.state.app.configNodeId
      },
      noCacheFlag() {
        return this.$store.state.app.lastClickStamp
      },
      refreshCollect() {
        return this.$store.state.devicetree.refreshFlag
      },
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
        'theme-dark': this.themeStyle,
        'theme-light': !this.themeStyle,
      }
    },
    nodeFinishFlag() {
      return this.$deviceStore.state.nodeFinishFlag
    },
  },
  methods: {
    ...mapMutations('app', {
      setLevel: 'SET_LEVEL',
      setNodeId: 'SET_NODE_ID',
      setDeviceCode: 'SET_DEVICE_CODE',
      setLevelList: 'SET_LEVEL_LIST',
      setCurrentNode: 'SET_CURRENT_NODE',
      setNodeName: 'SET_NODE_NAME',
      setDomainPath: 'SET_DOMAIN_PATH',
    }),
    toggleDevice() {
      this.showDevice = !this.showDevice
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    getCheckedNode(checkedNode) {
      // console.log('layout/index.vue getCheckedNode checkedNode', checkedNode)
      this.setDeviceCode(checkedNode.deviceCode)
      this.setNodeName(checkedNode.name)
      this.setLevel(checkedNode.domainType)
      this.setDomainPath(checkedNode.domainPath)
      this.setNodeId(checkedNode.id)
      // if (
      //   checkedNode.domainType == '基地' ||
      //   checkedNode.domainType == '厂部' ||
      //   checkedNode.domainType == '产线' ||
      //   checkedNode.domainType == '区域'
      // ) {
      //   setCurrentNodeId(checkedNode.id)
      //   setCurrentNodeLevel('domain')
      // } else {
      //   setCurrentNodeId(checkedNode.deviceCode)
      //   setCurrentNodeLevel('device')
      // }
      setCurrentNodeLevel(checkedNode.domainType)
      this.setCurrentNode(checkedNode)
      // 如需还原，请注释掉下面的三行
      // if (
      //   checkedNode.domainType == '基地' ||
      //   checkedNode.domainType == 'base' ||
      //   checkedNode.domainType == '厂部' ||
      //   checkedNode.domainType == 'factory' ||
      //   checkedNode.domainType == '产线' ||
      //   checkedNode.domainType == 'productLine'
      // ) {
      //   this.$router.push('/bigscreen/' + checkedNode.id)
      // }
    },
    getBreadcrumb(breadcrumb) {
      this.setLevelList(breadcrumb)
    },
  },
  watch: {
    nodeId(newVal) {
      this.selectedNodeId = newVal
    },
    nodeType(newVal) {
      this.selectedNodeType = newVal
    },
    nodeFinishFlag(val) {
      //val ： false ->loading    true->完成
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.menu-wrap {
  padding-top: 70px;
}
.nav-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 50px;
  z-index: 1009;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
.main-content {
  display: flex;
  position: relative;
  align-items: flex-start;
  .main-device {
    position: relative;
    height: calc(100vh - 80px);
    margin-left: 10px;
    z-index: 1;
    .main-left {
      width: 350px;
      background: transparent;
      height: 100%;
      margin-left: 0 !important;
      margin-top: 0 !important;
    }
    .expand-icon {
      position: absolute;
      right: 11px;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 48px;
      cursor: pointer;
      z-index: 1999;
      // background: url('../assets/收起1.png') center/100% 100% no-repeat;

      &.fold {
        right: 0px;
        // background: url('../assets/展开1.png') center/100% 100% no-repeat;
        // &:hover {
        //   background: url('../assets/鼠标悬浮点击状态.png') center/100% 100% no-repeat;
        // }
      }
    }
  }
}
.animate-left {
  transition: 0.3s all ease-in-out;
}
.column {
  display: flex;
  height: 100%;
}

.column-left {
  height: calc(100vh - 80px);
  position: relative;
}
.resize-save {
  position: absolute;
  top: 0;
  right: 20px;
  bottom: 0;
  left: 0;
  // overflow-x: hidden;
  ::v-deep .card {
    width: 100% !important;
    margin: 0 !important;
  }
}

.resize-bar {
  min-width: 200px;
  max-width: 600px;
  width: 350px;
  height: inherit;
  resize: horizontal;
  cursor: ew-resize;
  cursor: col-resize;
  opacity: 0;
  overflow: scroll;
}

.resize-bar::-webkit-scrollbar {
  width: 200px;
  height: inherit;
}

.ease-enter-active,
.ease-leave-active {
  transition: width 0.3s ease-in-out;
}
.ease-enter,
.ease-leave-to {
  opacity: 0;
  width: 0;
}
</style>
