<template>
  <div class="de-tree" v-loading="deviceLoading">
    <DeviceTreeSearch></DeviceTreeSearch>
    <ul class="de-tree-item-wrapper" v-if="rootDomain.id">
      <DeviceTreeItem :model="rootDomain"  />
    </ul>
    <div class="de-empty" v-else>暂无数据</div>
  </div>
</template>
<script>
import DeviceTreeItem from './device-tree-item'
import DeviceTreeSearch from './device-tree-search.vue'
import mixin from '../../../utils/mixins'

export default {
  name: 'DeviceTree',
  provide(){
    return { outerData:this }
  },
  inject:['activeTab'],
  mixins: [mixin],
  props: {
    apiConfig: {
      type: Object,
      default: () => ( {} ),
    },
    onlyDevice:{ //只可选中设备
      type:Boolean,
      default:false,
    },
  },
  components: { DeviceTreeItem, DeviceTreeSearch },
  data() {
    return {
      rootDomain: { id:'' },
      deviceLoading:false,
    }
  },
  computed: {
    initDeviceCode(){
      return this.activeTab.initDeviceCode
    },
    nodeType(){
      return this.activeTab.nodeType
    },
    noCacheFlag(){
      return this.activeTab.noCacheFlag
    },
  },
  created() {
    this.$deviceStore.commit( 'setDeviceApi', this.apiConfig )
  },
  async mounted () {
    try {
      this.deviceLoading = true
      this.rootDomain = await this.$deviceStore.commit( 'getRootDomain', {} )
      this.updateNodeStatus( [this.rootDomain] )
      // 5分钟自动更新根节点状态
      setInterval( () => {
        this.updateNodeStatus( [this.rootDomain] )
      }, 300000 )
      const { initDeviceCode, nodeType } = this.activeTab
      if ( !initDeviceCode || !nodeType ){
        // 初始设备码为空，默认选中根节点
        this.setSelectedNode( this.rootDomain )
      } else {
        this.changeSelectedNode( { initDeviceCode, nodeType } )
      }
      this.deviceLoading = false
    } catch ( error ) {
      this.$message.error( error.msg ? error.msg : error )
      this.deviceLoading = false
    }
    // try {
    //   this.dpkId = this.value.dpkId
    //   this.rootDomain = await this.$deviceStore.commit('getRootDomain')
    //   this.$deviceStore.commit('updateNodeStatus', [this.rootDomain])
    //   setInterval(() => {
    //     this.$deviceStore.commit('updateNodeStatus', [this.rootDomain])
    //   }, 300000)
    //   if (!this.deviceOptions) return
    //   if (!this.deviceOptions.showGroup) {
    //     this.$deviceStore.commit('setSelectedNode', { ...this.rootDomain })
    //     this.dispatch('DeviceOptions', 'getCheckedNode', { ...this.rootDomain })
    //     this.dispatch('DeviceOptions', 'getBreadcrumb', this.$deviceStore.state.breadcrumb)
    //   }
    //   const deviceCode = this.deviceOptions.initDeviceCode
    //   if (deviceCode) {
    //     const deviceInfo = await this.$deviceStore.commit('getDeviceListByConditionWithPage', {
    //       deviceCodeOrName: deviceCode,
    //     })
    //     const { data } = deviceInfo
    //     if (data.length > 0) {
    //       this.$deviceStore.commit('setSelectedNode', { category: 'device', ...data[0] })
    //       this.dispatch('DeviceOptions', 'getCheckedNode', { category: 'device', ...data[0] })
    //       this.dispatch('DeviceOptions', 'getBreadcrumb', this.$deviceStore.state.breadcrumb)
    //     }
    //   }
    // } catch (error) {
    //   this.$message.error(error)
    // }
  },
  methods: {
    setSelectedNode( node ){
      this.$deviceStore.commit( 'setSelectedNode', { ...node } )
      this.dispatch( 'DeviceTabs', 'getCheckedNode', { ...node } )
      this.dispatch( 'DeviceTabs', 'getBreadcrumb', this.$deviceStore.state.breadcrumb )
    },
    updateNodeStatus( nodeArr ){
      this.$deviceStore.commit( 'updateNodeStatus', nodeArr )
    },
    async changeSelectedNode( { initDeviceCode, nodeType } ){
      try {
        this.$deviceStore.commit( 'setNodeFinishFlag', false )
        let data
        if ( nodeType == 'device' ) {
          const res = await this.$deviceStore.commit( 'getDeviceListByConditionWithPage', { deviceCodeOrName: initDeviceCode } )
          data = res.data.find( ( item ) => item.deviceCode == initDeviceCode )
        } else if ( nodeType == 'group' ) {
          // 初始化时选中设备组
        } else {
          data = await this.$deviceStore.commit( 'getDomainById', { domainId: initDeviceCode } )
        }
        let paramsData = {
          ...data,
          category: nodeType,
        }
        paramsData.id = paramsData.domainId || paramsData.deviceId
        this.setSelectedNode( paramsData )
        this.$deviceStore.commit( 'setNodeFinishFlag', true )
      } catch ( error ) {
        this.$deviceStore.commit( 'setNodeFinishFlag', true )
      }
    },
  },
  watch:{
    noCacheFlag() {
      this.changeSelectedNode( { nodeType:this.nodeType, initDeviceCode:this.initDeviceCode } )
    },
  },
}
</script>
