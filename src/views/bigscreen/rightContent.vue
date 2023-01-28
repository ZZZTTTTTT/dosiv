<template>
  <div id="right-content">
    <div style="height: 32%; padding-bottom: 10px">
      <group-view v-bind:baseData="baseData" />
    </div>
    <div style="height: 65%">
      <dv-border-box-7 :color="['#002e76', '#3DDDFF']">
        <div class="border-content h-100">
          <div style="height: 54%">
            <d-title :title="'告警数量(月)'" :width="'150px'" />
            <alert-numbers v-bind:echartsData="echartsData" style="height: 80%" />
          </div>
          <div style="height: 46%; position: relative">
            <d-title :title="'诊断次数(月)'" :width="'150px'" />
            <diagnosis-times v-bind:echartsData="diagnosisTimesData" style="position: absolute; padding: 5px; height: 90%" class="w-100 h-100" />
          </div>
        </div>
      </dv-border-box-7>
    </div>
  </div>
</template>

<script>
import dTitle from './title'
import groupView from './groupView.vue'
import alertNumbers from './alertNumbers.vue'
import diagnosisTimes from './diagnosisTimes.vue'
// import baseData from './json/baseData.json'
// import alertNumberEchartsData from './json/alertNumberEchartsData.json'
// import diagnosisTimesData from './json/diagnosisTimesData'
import { getAlertCountByMonth, getAbnormalDeviceTotalCount, getMonitorDeviceCount, getDiagnoseCountByMonth } from '@/api/bigscreen'

export default {
  data: function () {
    return {
      // nodeId: 0,
      baseDataTotal: [],
      baseData: [
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
      ],
      echartsData: {},
      diagnosisTimesData: {},
      domainId: this.$route.params.nodeId || '',
      timer: null,
    }
  },
  watch: {
    $route() {
      this.domainId = this.$route.params.nodeId
      // console.log('rightContent, this.nodeId', this.domainId)
      this.init()
    },
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.initData()
      this.getBaseData()
      this.getAlertNumberEchartsData()
      this.getDiagnoseTimesData()
    },
    initData() {
      this.echartsData = {}
      this.diagnosisTimesData = {}
      this.baseDataTotal = []
      this.baseData = [
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
        { domainName: '--', deviceCount: '--' },
      ]
    },
    queryBaseInfo() {
      return new Promise((resolve) => {
        let params = {
          domainId: this.domainId,
        }

        getMonitorDeviceCount(params).then((res) => {
          // let result = [
          //   {
          //     deviceCount: 3,
          //     domainName: '12345',
          //   },
          //   {
          //     deviceCount: 3,
          //     domainName: 'api炼铁厂',
          //   },
          //   {
          //     deviceCount: 1,
          //     domainName: 'api热轧厂',
          //   },
          //   {
          //     deviceCount: 4,
          //     domainName: 'Kevin测试厂部',
          //   },
          //   {
          //     deviceCount: 2,
          //     domainName: '冷轧厂',
          //   },
          //   {
          //     deviceCount: 339,
          //     domainName: '大数据厂部',
          //   },
          //   {
          //     deviceCount: 23,
          //     domainName: '宝日汽车板1',
          //   },
          //   {
          //     deviceCount: 1,
          //     domainName: '炼钢厂-dev',
          //   },
          //   {
          //     deviceCount: 3,
          //     domainName: '炼铁厂测试',
          //   },
          //   {
          //     deviceCount: 133,
          //     domainName: '热轧厂-test',
          //   },
          //   {
          //     deviceCount: 10,
          //     domainName: '系统厂部',
          //   },
          //   {
          //     deviceCount: 28,
          //     domainName: '集成厂部',
          //   },
          // ]
          //resolve(result)
          const { data } = res
          const { code, result } = data
          if (code == 200) {
            if (result) {
              //this.baseData = result
              resolve(result)
            }
          }
        })
      })
    },
    getBaseData() {
      var vm = this
      var index = 8
      this.queryBaseInfo().then((data) => {
        var allData = [...data]
        vm.baseDataTotal = [...data]
        if (allData.length > index) {
          // 超过8个基地，轮流显示,增加一个其他基地
          vm.baseData = allData.slice(0, index)

          vm.timer = setInterval(() => {
            if (this.$route.path.indexOf('bigscreen') == -1) return
            vm.updateBaseInfo()
          }, 3 * 1000)
        } else {
          vm.baseData = allData
        }
      })
    },
    getAlertNumberEchartsData() {
      let params = {
        domainId: this.domainId,
      }
      getAlertCountByMonth(params).then((res) => {
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.sortArray(result)
            let y1 = result.map((t) => {
              return t.count
            })
            this.echartsData = {
              x: result.map((t) => {
                return t.domainName
              }),
              y1: y1,
              yMax: Math.max(...y1),
            }
          }
        }
        // this.echartsData = alertNumberEchartsData
      })
    },
    getDiagnoseTimesData() {
      let params = {
        domainId: this.domainId,
      }

      getDiagnoseCountByMonth(params).then((res) => {
        // this.diagnosisTimesData = diagnosisTimesData

        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.sortArray(result)

            let y1 = result.map((t) => {
              return t.count
            })
            // console.log(Math.max(...y1))
            this.diagnosisTimesData = {
              x: result.map((t) => {
                return t.domainName
              }),
              y1: y1,
              yMax: Math.max(...y1),
            }
          }
        }
      })
    },
    sortArray(arr) {
      arr.sort(this.compareVal('count'))

      return arr
    },
    compareVal(property) {
      return function (a, b) {
        return b[property] - a[property]
      }
    },
    updateBaseInfo() {
      for (var i = 0; i < 8; i++) {
        this.baseDataTotal.push(this.baseDataTotal.shift())
      }
      this.baseData = this.baseDataTotal.slice(0, 8)
    },
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  components: {
    dTitle,
    groupView,
    alertNumbers,
    diagnosisTimes,
  },
}
</script>

<style lang="scss">
#right-content {
  height: calc(100% + 30px);
  margin-top: -30px;
  padding-left: 18px;
}
</style>
