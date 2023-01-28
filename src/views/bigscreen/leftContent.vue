<template>
  <div id="left-content">
    <div class="d-flex flex-column card1">
      <dv-decoration-10 style="height: 5px" />
      <alarm-equipment style="height: calc(100% - 10px)" title="当前告警设备" :count="alarmCount" />
      <dv-decoration-10 style="height: 5px" />
    </div>

    <general-count class="card2" :dataList="statisticalList" />

    <div class="w-100 card3">
      <dv-border-box-7 :color="['#002e76', '#3DDDFF']">
        <div class="h-100 border-content">
          <left-chart-device :deviceNumList="deviceNumList" style="margin-bottom: 20px" />
          <left-chart-alarm :alarmNumList="alarmNumList" />
        </div>
      </dv-border-box-7>
    </div>
  </div>
</template>

<script>
import alarmEquipment from './alarmEquipment.vue'
import generalCount from './generalCount.vue'
import leftChartDevice from './leftChartDevice.vue'
import leftChartAlarm from './leftChartAlarm.vue'
import deviceNumListData from './json/deviceNumListData.json'
import alarmNumListData from './json/alarmNumListData.json'
import { getAccessDeviceCount, getAbnormalDeviceTotalCount, getAriseAlertCount, getAbnormalTicketCount } from '@/api/bigscreen'
import { getRuleAmount } from '@/api/base'
import moment from 'moment'
export default {
  data: function () {
    return {
      // nodeId: 0,
      alarmCount: null, // 当前告警设备
      statisticalList: [
        { name: '规则总数量', count: null },
        { name: '未闭环异常总数量', count: null },
      ],
      deviceNumList: [], // 设备总数列表
      alarmNumList: [], // 告警总数列表
      dateTo: moment().format('YYYY-MM-DD'),
      dateFrom: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      domainId: this.$route.params.nodeId || '',
    }
  },
  components: {
    alarmEquipment,
    generalCount,
    leftChartDevice,
    leftChartAlarm,
  },
  watch: {
    $route() {
      this.domainId = this.$route.params.nodeId
      // console.log('leftContent, this.nodeId', this.domainId)
      this.init()
    },
  },

  methods: {
    getDeviceNumListData() {
      let params = {
        domainId: this.domainId,
      }
      getAccessDeviceCount(params).then((res) => {
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.deviceNumList = result
          }
        }
      })
      // this.deviceNumList = deviceNumListData
    },
    getAlarmNumListData() {
      // setTimeout(() => {
      //   this.alarmNumList = alarmNumListData
      // }, 1000)
      let params = {
        domainId: this.domainId,
      }
      getAriseAlertCount(params).then((res) => {
        // this.alarmNumList = res.result

        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.alarmNumList = result
          }
        }
      })
    },
    getalarmCount() {
      let params = {
        domainId: this.domainId,
      }
      getAbnormalDeviceTotalCount(params).then((res) => {
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.alarmCount = result.count
          }
        }
      })
    },
    getstatisticalList() {
      let params = {
        domainId: this.domainId,
      }
      getRuleAmount(params).then(({ data }) => {
        const { result } = data
        if (result) {
          this.statisticalList[0].count = result.ruleAmount
        }
      })
      getAbnormalTicketCount(params).then((res) => {
        const { data } = res
        const { code, result } = data
        if (code == 200) {
          if (result) {
            this.statisticalList[1].count = result.count
          }
        }
      })
    },
    init() {
      this.getDeviceNumListData()
      this.getAlarmNumListData()
      this.getstatisticalList()
      this.getalarmCount()
    },
  },

  mounted() {
    this.init()
  },
}
</script>
<style lang="scss" scoped>
#left-content {
  padding-right: 20px;
  .card1 {
    height: 18%;
  }
  .card2 {
    height: 26%;
  }
  .card3 {
    height: 53%;
  }
}
</style>
