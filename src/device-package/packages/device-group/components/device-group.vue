<template>
  <div class="de-group" v-loading="groupLoading">
    <div class="de-textalign-right">
      <el-button @click="dialogVisible = true">管理设备组</el-button>
    </div>
    <div class="de-overflow-auto de-group-wrap">
      <div class="de-border-bottom" v-for="item in groupLists" :key="item.id">
        <div class="de-flex de-group-item">
          <span class="de-default de-item_label" :class="{ 'de-active': currentNodeId === item.id }" @click="changeCurrentNodeId(item, 'group')">
            {{ item.name }}
          </span>
          <div class="de-expand-icon-wrap" @click="toggle(item.id)">
            <i class="de-expand-icon el-icon-caret-top" :class="{ 'de-rotate180': item.isOpen }"></i>
          </div>
        </div>
        <ul class="de-animate-wrap" v-show="item.isOpen">
          <li
            class="de-flex de-li-item"
            v-for="(device, deviceIndex) in item.children"
            :key="deviceIndex"
            @click="changeCurrentNodeId(device, 'device')"
          >
            <i
              class="el-icon-s-opportunity de-device-indent"
              :style="{
                color: statusColor(device.status),
              }"
            ></i>
            <span class="de-default-color de-item_label" :class="{ 'de-active': currentNodeId == device.deviceId }">
              {{ device.deviceName }}{{ ` ( ${device.deviceCode} )` }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 设备组管理 -->
    <el-dialog
      class="wrap-dialog"
      title="设备组管理"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      :visible.sync="dialogVisible"
      width="90%"
    >
      <DeviceGroupManage></DeviceGroupManage>
    </el-dialog>
  </div>
</template>
<script>
import mixin from '../../../utils/mixins'
import DeviceGroupManage from './device-group-manage.vue'
export default {
  name: 'DeviceGroup',
  mixins: [mixin],
  components: { DeviceGroupManage },
  props: {
    apiConfig: {
      type: Object,
      default: () => ( {} ),
    },
  },
  data() {
    return {
      groupLists: [],
      dialogVisible: false,
      groupLoading:false,
    }
  },
  computed: {
    refreshGroup(){
      return this.$deviceStore.state.refreshGroup
    },
    currentNode() {
      return this.$deviceStore.state.selectedNode
    },
    currentNodeId() {
      return this.currentNode.id || this.currentNode.deviceId
    },
  },
  created() {
    this.$deviceStore.commit( 'setDeviceGroupApi', this.apiConfig )
    this.getGroupList()
  },
  methods: {
    statusColor( status ) {
      return this.$deviceStore.commit( 'statusColor', status )
    },
    async getGroupList() {
      try {
        this.groupLoading = true
        const res = await this.$deviceStore.commit( 'getDeviceGroupList', {} )
        const { data } = res
        if ( data ) {
          let openItem = this.groupLists.filter( ( item ) => item.isOpen )
          this.groupLists = data.map( ( item ) => ( { ...item, isOpen: false, children: [] } ) ).sort( ( a, b ) => b.reviseTime - a.reviseTime )
          if ( openItem.length > 0 ) {
            openItem.forEach( ( item ) => {
              this.toggle( item.id )
            } )
          }
        } else {
          this.groupLists = []
        }
        this.groupLoading = false
      } catch ( error ) {
        this.groupLoading = false
        this.$message.error( error.msg ? error.msg : error )
      }
    },
    async toggle( deviceGroupId ) {
      let index = this.groupLists.findIndex( ( item ) => item.id === deviceGroupId )
      if ( index === -1 ) return
      this.groupLists[index].isOpen = !this.groupLists[index].isOpen
      try {
        const isOpen = this.groupLists[index].isOpen
        if ( isOpen ) {
          const res = await this.$deviceStore.commit( 'getDeviceListByDeviceGroupId', {
            deviceGroupId,
          } )
          const { data } = res
          if ( data && data.length > 0 ) {
            this.groupLists[index].children = data.map( ( item ) => ( { ...item, status: 0 } ) )
            this.$deviceStore.commit( 'updateNodeStatus', this.groupLists[index].children )
          } else {
            this.groupLists[index].children = []
          }
        }
      } catch ( error ) {
        this.$message.error( error.msg ? error.msg : error )
      }
    },
    async changeCurrentNodeId( item, category ) {
      if ( category === 'group' ) {
        await this.toggle( item.id )
      }
      let checkedNode = { category, domainType:'device', ...item }
      this.$deviceStore.commit( 'setSelectedNode', checkedNode )
      this.dispatch( 'DeviceTabs', 'getCheckedNode', checkedNode )
      this.dispatch( 'DeviceTabs', 'getBreadcrumb', this.$deviceStore.state.breadcrumb )
    },
  },
  watch: {
    refreshGroup() {
      this.getGroupList()
    },
  },
}
</script>
