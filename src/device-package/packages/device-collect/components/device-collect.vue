<template>
  <ul class="de-collection de-overflow-auto" v-loading="collectLoading">
    <!-- <li style="height:1000px"></li> -->
    <li class="de-collection-item de-li-item" v-for="(item, index) in myCollections" :key="index" @click="changeCurrentNodeId(item)">
      <i
        class="el-icon-s-opportunity"
        :style="{
          color: statusColor(item.status),
          'font-size': '14px',
        }"
      ></i>
      <span
        class="de-default-color de-device-name"
        :class="{
          'de-active': currentNode.deviceCode == item.deviceCode,
        }"
      >
        {{ item.deviceName }} ( {{ item.deviceCode }} )
      </span>
    </li>
    <!-- <DeviceBacktop target=".de-collection"></DeviceBacktop> -->
  </ul>
</template>
<script>
import mixin from '../../../utils/mixins'
import DeviceBacktop from '../../device-backtop'
export default {
  name:'DeviceCollect',
  mixins: [mixin],
  props:{
    refreshCollect:{
      type:Boolean,
      default:false,
    },
    apiConfig:{
      type:Object,
      default:() => ( {} ),
    },
  },
  components:{ DeviceBacktop },
  data() {
    return {
      myCollections: [],
      collectLoading: false,
      timer: null,
    }
  },
  computed: {
    currentNode() {
      return this.$deviceStore.state.selectedNode
    },
  },
  created() {
    this.$deviceStore.commit( 'setCollectApi', this.apiConfig )
    this.getCollectDeviceList()
  },
  methods: {
    statusColor( status ) {
      return this.$deviceStore.commit( 'statusColor', status )
    },
    async getCollectDeviceList() {
      try {
        this.collectLoading = true
        const deviceList = await this.$deviceStore.commit( 'getFavoriteDeviceList', {} )
        this.myCollections = deviceList
        this.$deviceStore.commit( 'setCollectList', deviceList )
        this.collectLoading = false
        clearInterval( this.timer )
        this.$deviceStore.commit( 'updateNodeStatus', deviceList )
        this.timer = setInterval( () => {
          this.$deviceStore.commit( 'updateNodeStatus', deviceList )
        }, 300000 )
      } catch ( error ) {
        this.collectLoading = false
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
  watch: {
    refreshCollect() {
      this.getCollectDeviceList()
    },
  },
}
</script>
