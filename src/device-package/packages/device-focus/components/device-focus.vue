<template>
  <div class="de-focus">
    <div class="de-focus-item de-border-bottom" v-for="(item,index) in focusLabelList" :key="index">
      <div class="de-flex de-group-item de-focus_label" @click="toggle(item.value)">
        <span class="de-default" :class="{ 'de-active': currentActive(item.children || []) }">{{ item.name }}</span>
        <div class="de-expand-icon-wrap">
          <i class="de-expand-icon el-icon-caret-top" :class="{ 'de-rotate180': item.isOpen }"></i>
        </div>
      </div>
      <ul class="de-animate-wrap de-ul" v-show="item.isOpen">
        <li
          class="de-flex de-li-item"
          v-for="(device, deviceIndex) in item.children"
          :key="deviceIndex"
          @click="changeCurrentNodeId(device)"
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
</template>
<script>
import mixin from '../../../utils/mixins'
export default {
  name: 'DeviceFocus',
  inject:['activeTab'],
  mixins: [mixin],
  props: {
    refreshGroup: {
      type: Boolean,
      default: false,
    },
    apiConfig: {
      type: Object,
      default: () => ( {} ),
    },
  },
  data() {
    return {
      focusLabelList: [
        { name:'未闭环工单设备', value:0, isOpen:false, children:[] },
        { name:'未闭环报警设备', value:1, isOpen:false, children:[] },
      ],
    }
  },
  computed: {
    currentNode() {
      return this.$deviceStore.state.selectedNode
    },
    currentNodeId() {
      return this.currentNode.deviceId
    },
  },
  created() {
    this.$deviceStore.commit( 'setFocusApi', this.apiConfig )
  },
  async mounted () {
    for ( let index = 0; index < this.focusLabelList.length; index++ ) {
      let ele = this.focusLabelList[index]
      this.focusLabelList[index].children = ele.value ? await this.getAlarmDevices() : await this.getWorkOrderDevices()
      // console.log('ele.value',ele.value,this.focusLabelList[index]);
      this.$deviceStore.commit( 'updateNodeStatus', this.focusLabelList[index].children )
    }
  //   this.focusLabelList.forEach( async item=>{
  //     item.children= item.value? await this.getAlarmDevices():await this.getWorkOrderDevices()
  //     this.$deviceStore.commit('updateNodeStatus', item.children)
  //  })//不按照顺序执行
  },
  methods: {
    statusColor( status ) {
      return this.$deviceStore.commit( 'statusColor', status )
    },
    currentActive( children ){
      return children.some( item => item.deviceId == this.currentNodeId )
    },
    async getAlarmDevices(){
      try {
        const res = await this.$deviceStore.commit( 'getAlarmDevices', {} )
        return res
      } catch ( error ) {
        this.$message.error( error.msg ? error.msg : error )
      }
    },
    async getWorkOrderDevices(){
      try {
        const res = await this.$deviceStore.commit( 'getWorkOrderDevices', {} )
        return res
      } catch ( error ) {
        this.$message.error( error.msg ? error.msg : error )
      }
    },
    toggle( type ) {
      try {
        let length = this.focusLabelList.length
        let index = this.focusLabelList.findIndex( item => item.value == type )
        let isOpen = this.focusLabelList[index].isOpen
        this.focusLabelList[index].isOpen = !isOpen
        if ( !isOpen ){
          this.focusLabelList[length - 1 - index].isOpen = false
          this.$deviceStore.commit( 'updateNodeStatus', this.focusLabelList[index].children )
        }
      } catch ( error ) {
        this.$message.error( error.msg ? error.msg : error )
      }
    },
    changeCurrentNodeId( item ) {
      let checkedNode = { category:'device', domainType:'device', ...item }
      this.$deviceStore.commit( 'setSelectedNode', checkedNode )
      this.dispatch( 'DeviceTabs', 'getCheckedNode', checkedNode )
      this.dispatch( 'DeviceTabs', 'getBreadcrumb', this.$deviceStore.state.breadcrumb )
    },
  },
}
</script>
