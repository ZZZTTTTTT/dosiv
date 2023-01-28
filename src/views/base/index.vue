<template>
  <div class="container">
    <div class="left-wrap">
      <div style="display: flex; flex: 2">
        <div class="left-box" style="width: 30%">
          <div>
            <accessDeviceNum :access-device="accessDevice" />
          </div>
          <!--
          <div class="wrap-container">
            <div class="wrap">
              <div>设备区域</div>
            </div>
          </div>
          <div class="unit">1580机组</div></div>-->
          <div class="display" style="flex-direction: column; flex: 1; margin: 0px 10px 15px 0px">
            <BorderWrap style="margin-bottom: 10px; height: 100%; width: 100%">
              <div class="display dataitem">
                <data-item :statisticsData="enabledRulesNum">
                  <template #default>启用规则</template>
                </data-item>
                <hr />
                <data-item :statisticsData="configurationDataItemNum">
                  <template #default>配置数据项</template>
                </data-item>
              </div>
            </BorderWrap>
            <BorderWrap style="flex-direction: column; height: 100%; width: 100%; margin: 0" class="display">
              <div class="display dataitem">
                <data-item :statisticsData="offlineDeviceNum">
                  <template #default>离线设备</template>
                </data-item>
                <hr />
                <data-item :statisticsData="offlineDataNum">
                  <template #default>离线数据项</template>
                </data-item>
              </div>
            </BorderWrap>
          </div>
        </div>
        <div class="middle-box">
          <div style="margin: 10px; display: flex; justify-content: space-between">
            <span class="currentNodeName">{{ currentNodeName }}</span>
            <span style="position: relative">
              <real-time />
            </span>
          </div>
          <!--
          <el-button type="primary" style="margin-left: 15px; width: 80px" @click="toggleView">切换显示</el-button>
          <BorderWrap style="height: 100%; width: 100%; margin: 15px 0; overflow: hidden" v-if="!showConfig">
            <div>testing</div>
            <config-view :nodeId="this.domainId"></config-view>
          </BorderWrap>-->

          <div style="flex: 1; height: 100%; margin: 15px 0" v-if="showConfig">
            <shufflingList :device-list-message="deviceListMessage" />
          </div>
        </div>
      </div>
      <div class="bottom-box" style="flex: 1">
        <div style="width: 30%; padding-right: 10px">
          <!-- <deviceTypeChart :device-type-config="deviceTypeConfig" ref="basedeviceType" style="" @updateConfig="updateConfig($event)" /> -->
          <dvechart :dvechartData="deviceTypeData">
            <template #default>设备类型</template>
          </dvechart>
        </div>
        <div style="width: 30%; padding-right: 10px">
          <!-- <diagnoseNumChart
            :diagnose-num-config="diagnoseNumConfig"
            ref="basediagnoseNum"
            style="margin-right: 10px"
            @updateConfig="updateConfig($event)"
          /> -->
          <dvechart :dvechartData="diagnoseNumData">
            <template #default>上月诊断次数</template>
          </dvechart>
        </div>
        <div style="width: 40%">
          <alarmBarChart @updateConfig="updateAlarmBarConfig()" />
        </div>
      </div>
    </div>
    <div class="right-box" style="width: 30%; height: calc(100% - 20px)">
      <div style="height: 30%; margin: 0px 10px 10px 10px">
        <abnormalDevice :abnormal-devicetotal-amount="AbnormalDevicetotalAmount" />
      </div>

      <div style="height: 30%; margin: 0px 10px 10px 10px">
        <alarmDevice :alert-devicetotal-amount="AlertDevicetotalAmount" />
      </div>

      <div style="height: 40%; margin: 0px 10px 10px 10px">
        <unclosedAlarm :unclosedData="unclosedData" />
      </div>
    </div>
  </div>
</template>

<script>
import { basemix } from '@/mixin/base'
import CornerBorder from '@/components/globalComs/cornerBorder.vue'
import { mapState } from 'vuex'
import ConfigView from '@/components/globalComs/ConfigView.vue'
import store from '@/store'
import dvechart from '@/components/Charts/dvechart'
import { getDeviceTypeAmount, getLastMonthDeviceDiagnosesAmount } from '@/api/base'
export default {
  components: { CornerBorder, ConfigView, dvechart },
  mixins: [basemix],
  data() {
    return {
      deviceListMessage: null,
      accessDevice: '',
      deviceTypeConfig: {},
      diagnoseNumConfig: {},
      offlineDeviceNum: null,
      offlineDataNum: null,
      enabledRulesNum: null,
      configurationDataItemNum: null,
      domainId: null,
      alarmBarChartoption: null,
      alarmDeviceChartoption: null,
      AlertDevicetotalAmount: null,
      abnormalDeviceChartoption: null,
      AbnormalDevicetotalAmount: null,
      unclosedData: {},
      alarmBarChart: {},
      diagnoseNumChart: {},
      deviceTypeChart: {},
      showConfig: true,
      deviceTypeData: [],
      diagnoseNumData: [],
    }
  },
  computed: {
    ...mapState('app', ['currentNodeId', 'currentNodeName']),
  },
  watch: {
    currentNodeId(newVal, oldVal) {
      if (this.$route.path.indexOf('real') == -1) {
        return
      }
      this.domainId = newVal
      this.initBaseData()
    },
  },
  mounted() {
    if (this.$route.path.indexOf('real') == -1) {
      return
    }
    this.initBaseData()
  },
  methods: {
    toggleView() {
      this.showConfig = !this.showConfig
    },
    updateConfig($event) {
      let config = $event
      this[config].digitalFlopStyle.fill = store.state.user.themeStyle ? '#fff' : '#000'
      this[config] = { ...this[config] }
    },
    updateAlarmBarConfig() {
      this.alarmBarChartoption.legend.textStyle.color = store.state.user.themeStyle ? '#fff' : '#000'
      this.alarmBarChart.setOption(this.alarmBarChartoption, true)
    },
    initBaseData() {
      this.domainId = this.currentNodeId
      this.getdeviceTypeData()
      this.getdiagnoseNumData()
      this.initData()
      this.barEcharts()
      this.dvCharts()
    },
    getdiagnoseNumData() {
      getDeviceTypeAmount(this.domainId).then((res) => {
        const tmp = []
        res.data.result.forEach((item) => {
          tmp.push({ name: item.deviceType, value: item.amount })
        })
        this.deviceTypeData = tmp
        console.log(this.deviceTypeData)
      })
    },
    getdeviceTypeData() {
      getLastMonthDeviceDiagnosesAmount(this.domainId).then((res) => {
        let tmp = []
        //res.data.result = [{ amount: 0 }, { amount: 0 }, { amount: 0 }]
        if (res.data.result.every((item) => item.amount == 0)) {
          tmp = []
        } else {
          res.data.result.forEach((item) => {
            tmp.push({ name: item.domainName, value: item.amount })
          })
        }
        this.diagnoseNumData = tmp
      })
    },
  },
}
</script>

<style>
.container {
  display: flex;
  height: 100%;
  width: 100%;
}
.left-box,
.shuffling-box,
.right-box {
  flex-direction: column;
}
.left-box {
  display: flex;
}
.container .left-box {
  width: 20%;
}
.shuffling-box {
  width: 40%;
  align-self: stretch;
}
.container .right-box {
  width: 40%;
}
.right-box {
  justify-content: space-between;
}

.currentNodeName {
  font-size: 40px;
  font-weight: bold;
}
.box1 {
  margin: 10px;
  padding: 10px;
}

.access {
  display: flex;
}

.block {
  width: 71px;
  height: 75px;
  background-color: #488a7d;
  margin: 10px 10px 10px 0;
  border-radius: 6px;
  text-align: center;
}
.dataitem {
  flex-direction: column;
  height: 100%;
  padding: 15px 5px;
}

.accessnum {
  font-size: 55px;
  text-align: center;
  font-family: HarmonyOS_Sans_Condensed-regular;
  color: rgba(255, 255, 255, 100);
  padding: 3px;
  line-height: 75px;
}

.titledisplay {
  text-align: center;
  margin: 20px 30px;
  font-size: 28px;
  font-weight: bold;
}

.numdisplay {
  color: rgba(30, 128, 207, 100);
  font-size: 30px;
  text-align: center;
  font-family: HarmonyOS_Sans_Condensed-regular;
  margin: 10px;
}

.subtitledisplay {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem;
}

.fill {
  height: 100%;
}

hr {
  border: none;
  border-top: 0.015rem solid;
  opacity: 0.25;
  width: 100%;
}
</style>
