<template>
  <div class="pane-content">
    <div v-show="configViewUrl == null">
      <h3>未绑定视图</h3>
    </div>
    <div v-show="configViewUrl != null">
      <iframe :src="configViewUrl" height="600px" width="100%" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { queryByLabelIdAndObjectId, queryByObjectIdWithPage } from '@/api/area'
export default {
  props: ['nodeId'],
  watch: {
    nodeId(newVal, oldVal) {
      this.initConfigView()
    },
  },
  data() {
    return {
      configViewUrl: null,
      objectId: null,
    }
  },
  methods: {
    ...mapMutations('app', {
      setConfigNodeId: 'SET_CONFIG_NODE_ID',
      setConfigNodeLevel: 'SET_CONFIG_NODE_LEVEL',
      setLastClickStamp: 'SET_LAST_CLICK_STAMP',
    }),
    receiveMessage(e) {
      const { data } = e
      this.setConfigNodeLevel(data.type)
      if (data.type == 'domain') {
        let domainPathArr = data.domainPath.split('/')
        let nodeId = domainPathArr[domainPathArr.length - 1]
        this.setConfigNodeId(nodeId)
      } else {
        this.setConfigNodeId(data.deviceCode)
      }
      this.setLastClickStamp(Date.now())
    },
    initConfigView() {
      if (
        this.currentLevel == 'area' ||
        this.currentLevel == '区域' ||
        this.currentLevel == 'base' ||
        this.currentLevel == '基地' ||
        this.currentLevel == 'factory' ||
        this.currentLevel == '厂部' ||
        this.currentLevel == 'productLine' ||
        this.currentLevel == '产线'
      ) {
        this.objectId = this.currentDomainPath
      } else {
        this.objectId = this.currentDeviceCode
      }
      if (process.env.NODE_ENV == 'development') {
        // 开发环境
        this.configViewUrl = 'http://10.26.10.233/dossr/preview/?id=111'
      } else if (process.env.NODE_ENV == 'production') {
        //216环境
        let params = {
          objectId: this.objectId,
          pageIndex: 1, //分页参数
          pageCount: 10,
        }

        queryByObjectIdWithPage(params).then((res) => {
          const { data } = res
          const { code, result } = data
          if (code == 200) {
            if (result) {
              let topoId = result.data && result.data[0].id
              this.configViewUrl = process.env.VUE_APP_CONFIG_VIEW_URL + topoId
              console.log('ConfigView, this.configViewUrl:', this.configViewUrl)
            }
          }
        })
      } else {
        const that = this
        const params = {
          labelId: Number(process.env.VUE_APP_CONFIG_VIEW_LABEL_ID),
          objectId: this.objectId,
        }
        // if (this.currentLevel == '区域' || this.currentLevel == '基地' || this.currentLevel == '厂部' || this.currentLevel == '产线') {
        //   params.objectId = this.currentDomainPath
        // } else {
        //   params.objectId = this.currentDeviceCode
        // }

        queryByLabelIdAndObjectId(params).then((res) => {
          // that.configViewUrl = process.env.CONFIG_VIEW_URL
          // console.log(res)
          if (res.status !== 200) {
            return that.$message.error('获取组态视图失败')
          }
          let topoId = null
          try {
            topoId = res.data.result.topologyId
          } catch (e) {
            topoId = null
          }
          if (topoId == null || topoId == undefined) {
            that.configViewUrl = null
            // return that.$message.info('未绑定视图')
            return
          } else {
            that.configViewUrl = process.env.VUE_APP_CONFIG_VIEW_URL + topoId
          }
        })
      }
    },
  },
  computed: {
    ...mapState('app', ['currentDeviceCode', 'currentDomainPath', 'currentLevel']),
  },
  mounted() {
    window.addEventListener('message', this.receiveMessage)
    // console.log('ConfigView mounted')
    this.initConfigView()
  },
  beforeDestroy() {
    window.removeEventListener('message', this.receiveMessage)
  },
}
</script>

<style></style>
