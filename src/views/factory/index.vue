<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-row style="margin-top: 10px">
          <accessDeviceNum :access-device="accessDevice" />
        </el-row>
        <el-row style="margin-top: 10px">
          <corner-border>
            <enabledRules :enabled-rules-num="enabledRulesNum" />
            <hr />
            <configurationDataItem :configuration-data-item-num="configurationDataItemNum" />
            <hr />
            <offlineDevice :offline-device-num="offlineDeviceNum" />
            <hr />
            <offlineData :offline-data-num="offlineDataNum" />
          </corner-border>
        </el-row>
        <el-row style="margin-top: 5px"><deviceTypeChart :device-type-config="deviceTypeConfig" ref="factorydeviceType" /> </el-row>
      </el-col>
      <el-col :span="12">
        <el-row style="height: 90px">
          <span style="font-size: 50px; font-weight: bold">{{ this.currentNodeName }}</span>
          <div style="float: right">
            <real-time />
          </div>
        </el-row>
        <hr />
        <el-row>
          <shufflingList :device-list-message="deviceListMessage" />
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row :gutter="10">
          <el-col :span="12">
            <diagnoseNumChart :diagnose-num-config="diagnoseNumConfig" ref="factorydiagnoseNum" />
          </el-col>
          <el-col :span="12">
            <unclosedAlarm :unclosedData="unclosedData" />
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 5px">
          <el-col :span="12"><alarmDevice :alert-devicetotal-amount="AlertDevicetotalAmount" v-resize="handleResize" /></el-col>
          <el-col :span="12"><abnormalDevice :abnormal-devicetotal-amount="AbnormalDevicetotalAmount" v-resize="handleResize" /></el-col>
        </el-row>
        <el-row style="margin-top: 5px" v-resize="handleResize">
          <alarmBarChart />
        </el-row>
      </el-col>
    </el-row>
  </div>
  <!-- <div class="container">
    <div class="left-box">
      <div class="box1">
        <div class="box1">
          <accessDeviceNum :access-device="accessDevice" />
        </div>
        <div>
          <corner-border>
            <enabledRules :enabled-rules-num="enabledRulesNum" />
            <configurationDataItem :configuration-data-item-num="configurationDataItemNum" />
            <offlineDevice :offline-device-num="offlineDeviceNum" />
            <offlineData :offline-data-num="offlineDataNum" />
          </corner-border>
        </div>
      </div>
      <div class="box1" style="flex: 1">
        <deviceTypeChart :device-type-config="deviceTypeConfig" />
      </div>
    </div>
    <div class="shuffling-box">
      <div style="margin: 10px">
        <span class="platform">设备智能运维平台</span>
        <div style="float: right">
          <real-time />
        </div>
      </div>
      <div class="factory-path">
        <FactoryPath />
      </div>
      <div class="box1" style="flex: 1; height: 100%">
        <shufflingList :device-list-message="deviceListMessage" />
      </div>
    </div>
    <div class="right-box">
      <div style="display: flex">
        <div class="box1" style="width: 50%">
          <diagnoseNumChart :diagnose-num-config="diagnoseNumConfig" />
        </div>
        <div class="box1" style="width: 50%">
          <unclosedAlarm />
        </div>
      </div>
      <div class="box1" style="display: flex">
        <alarmDevice :alert-devicetotal-amount="AlertDevicetotalAmount" />
        <abnormalDevice :abnormal-devicetotal-amount="AbnormalDevicetotalAmount" />
      </div>
      <div class="box1">
        <alarmBarChart />
      </div>
    </div>
  </div> -->
</template>

<script>
import { basemix } from '@/mixin/base'
import { mapState } from 'vuex'
export default {
  components: {},
  mixins: [basemix],

  data() {
    return {
      deviceListMessage: {},
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
      abnormalDeviceChart: {},
      alarmDeviceChart: {},
      alarmBarChart: {},
    }
  },
  computed: {
    ...mapState('app', ['currentNodeId', 'currentNodeName']),
  },
  watch: {
    currentNodeId(newVal, oldVal) {
      this.domainId = newVal
      // console.log('切换')
      this.initFactoryData()
    },
  },
  methods: {
    initFactoryData() {
      this.domainId = this.currentNodeId
      // console.log('this.currentNodeId', this.currentNodeId)
      this.initData()

      this.barEcharts()

      this.dvCharts()
      // console.log('11', this.deviceListMessage)
    },
    handleResize() {
      this.alarmBarChart.resize()
      this.alarmDeviceChart.resize()
      this.abnormalDeviceChart.resize()
      this.$refs.factorydeviceType.key++
      this.$refs.factorydiagnoseNum.key++
    },
  },
  mounted() {
    this.initFactoryData()
  },
}
</script>

<style>
.container {
  display: flex;
}
.left-box,
.shuffling-box,
.right-box {
  flex-direction: column;
}
.container .left-box {
  width: 20%;
}
.shuffling-box {
  width: 40%;
  align-self: stretch;
  display: flex;
  flex-direction: column;
}
.container .right-box {
  width: 40%;
}

.box1 {
  margin: 10px;
  padding: 10px;
}

.factory-path {
  font-size: 10px;
  margin-left: 10px;
}
.platform {
  display: inline-block;
  height: 50px;
}

.access {
  display: flex;
}

.accessnum {
  font-size: 55px;
  text-align: center;
  font-family: HarmonyOS_Sans_Condensed-regular;
  color: rgba(255, 255, 255, 100);
  padding: 3px;
  line-height: 75px;
}

.numdisplay {
  color: rgba(30, 128, 207, 100);
  font-size: 20px;
  text-align: center;
  font-family: HarmonyOS_Sans_Condensed-regular;
  margin: 10px;
}
</style>
