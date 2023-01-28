<template>
  <!--
  <div>
    <el-row :gutter="10">
      <el-col :span="17">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-row>
              <div style="padding-top: 10px">
                <accessDeviceNum :access-device="accessDevice" />
              </div>
            </el-row>

            <el-row
              ><div class="unit">{{ currentNodeName }}</div></el-row
            >
            <el-row>
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
          </el-col>
          <el-col :span="17">
            <div style="height: 628px">
              <corner-border
                ><div class="subtitledisplay">
                  产线运行状态：运行
                  <iframe ref="iframe" src="http://localhost:9527/#/workbench/index" style="height: 500px" width="100%" frameborder="0"></iframe></div
              ></corner-border>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="6">
            <div style="height: 375px">
              <deviceTypeChart :device-type-config="deviceTypeConfig" ref="deviceType" />
            </div>
          </el-col>
          <el-col :span="6">
            <div style="height: 375px">
              <diagnoseNumChart :diagnose-num-config="diagnoseNumConfig" ref="diagnoseNum" />
            </div>
          </el-col>
          <el-col :span="12">
            <div v-resize="handleResize">
              <alarmBarChart />
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-row>
          <unclosedAlarm :unclosedData="unclosedData" />
        </el-row>
        <el-row>
          <corner-border>
            <div>
              <ProductlineAlarmChart
                :productline-alarm-config="ProductlineAlarmConfig"
                :alert-devicetotal-amount="AlertDevicetotalAmount"
                ref="ProductlineAlarm"
              />
            </div>

            <hr />
            <div>
              <ProductlineAbnormalChart
                :productline-abnormal-config="ProductlineAbnormalConfig"
                :abnormal-devicetotal-amount="AbnormalDevicetotalAmount"
                ref="ProductlineAbnormal"
              />
            </div>
          </corner-border>
        </el-row>
      </el-col>
    </el-row>
  </div>-->
  <div class="container">
    <div class="left-wrap">
      <div style="display: flex; flex: 2">
        <div class="left-box" style="width: 30%">
          <div class="box1">
            <accessDeviceNum :access-device="accessDevice" />
          </div>
          <!--
          <div class="wrap-container">
            <div class="wrap">
              <div>设备区域</div>
            </div>
          </div>
          <div class="unit">1580机组</div></div>-->
          <div class="box1" style="flex: 1">
            <div>
              <corner-border style="margin-bottom: 10px">
                <enabledRules :enabled-rules-num="enabledRulesNum" />
                <hr />
                <configurationDataItem :configuration-data-item-num="configurationDataItemNum" />
              </corner-border>
              <corner-border>
                <offlineDevice :offline-device-num="offlineDeviceNum" />
                <hr />
                <offlineData :offline-data-num="offlineDataNum" />
              </corner-border>
            </div>
          </div>
        </div>
        <div class="middle-box">
          <div style="margin: 10px">
            <span style="font-size: 40px; font-weight: bold">{{ currentNodeName }}</span>
            <span>
              <real-time />
            </span>
          </div>

          <div class="box1" style="flex: 1; height: 100%">
            <shufflingList :device-list-message="deviceListMessage" />
          </div>
        </div>
      </div>
      <div class="bottom-box" style="flex: 1">
        <deviceTypeChart :device-type-config="deviceTypeConfig" />
        <diagnoseNumChart :diagnose-num-config="diagnoseNumConfig" />
        <alarmBarChart />
      </div>
    </div>
    <div class="right-box" style="width: 30%">
      <div>
        <div class="box1">
          <unclosedAlarm />
        </div>
      </div>
      <div class="box1">
        <corner-border>
          <abnormalDevice :abnormal-devicetotal-amount="AbnormalDevicetotalAmount" v-resize="handleResize" />
        </corner-border>
        <corner-border>
          <alarmDevice :alert-devicetotal-amount="AlertDevicetotalAmount" v-resize="handleResize" />
        </corner-border>
      </div>
    </div>
  </div>
</template>

<script>
import { getAbnormalDeviceAmount, getAlertDeviceAmount } from '@/api/base'
import { basemix } from '@/mixin/base'
import { mapState } from 'vuex'
export default {
  components: {},
  mixins: [basemix],
  data() {
    return {
      accessDevice: '',
      offlineDeviceNum: null,
      offlineDataNum: null,
      enabledRulesNum: null,
      configurationDataItemNum: null,
      ProductlineAlarmConfig: {},
      ProductlineAbnormalConfig: {},
      domainId: null,
      detailObj: {
        amount: null,
        channelNo: null,
        steelNo: null,
        downTorque: null,
        rollForce: null,
        steelSpeed: 11,
        upTorque: null,
        HeatingFurnace: null,
      },
      AbnormalDevicetotalAmount: null,
      AlertDevicetotalAmount: null,
      deviceTypeConfig: {},
      diagnoseNumConfig: {},
      alarmBarChartoption: null,
      unclosedData: {},
      alarmBarChart: {},
    }
  },
  computed: {
    ...mapState('app', ['currentNodeId', 'currentNodeName']),
  },
  watch: {
    currentNodeId(newVal, oldVal) {
      this.domainId = newVal
      this.initProductlineData()
    },
  },

  methods: {
    initProductlineData() {
      this.domainId = this.currentNodeId

      getAlertDeviceAmount(this.domainId).then((res) => {
        this.AlertDevicetotalAmount = res.data.result.totalAmount

        let tmp = [
          { name: '危险', value: res.data.result.dangerAmount },
          { name: '注意', value: res.data.result.noticeAmount },
          { name: '警告', value: res.data.result.warnAmount },
        ]

        if (res.data.result.dangerAmount == 0 && res.data.result.noticeAmount == 0 && res.data.result.warnAmount == 0) {
          // console.log('数据不能全为0')
          tmp = []
        }

        this.ProductlineAlarmConfig = {
          data: tmp,
          color: ['#3cd2a5', '#1ecc33', '#2d8e83'],
          lineWidth: 30,
          radius: '50%',
          activeRadius: '60%',
          digitalFlopStyle: {
            fontSize: 20,
          },
          showOriginValue: true,
        }
      })

      getAbnormalDeviceAmount(this.domainId).then((res) => {
        this.AbnormalDevicetotalAmount = res.data.result.totalAmount

        let tmp = [
          { name: '危险', value: res.data.result.dangerAmount },
          { name: '注意', value: res.data.result.noticeAmount },
          { name: '警告', value: res.data.result.warnAmount },
        ]
        /*
        let result = { dangerAmount: 0, noticeAmount: 0, warnAmount: 0 }
        let tmp = [
          { name: '危险', value: result.dangerAmount },
          { name: '注意', value: result.noticeAmount },
          { name: '告警', value: result.warnAmount },
        ]*/

        if (res.data.result.dangerAmount == 0 && res.data.result.noticeAmount == 0 && res.data.result.warnAmount == 0) {
          // console.log('数据不能全为0')
          tmp = []
        }

        this.ProductlineAbnormalConfig = {
          data: tmp,
          color: ['#3cd2a5', '#1ecc33', '#2d8e83'],
          lineWidth: 30,
          radius: '50%',
          activeRadius: '60%',
          digitalFlopStyle: {
            fontSize: 20,
          },
          showOriginValue: true,
        }
      })

      this.initData()

      this.barEcharts()
    },
    handleResize() {
      //console.log('resize')
      this.alarmBarChart.resize()
      this.$refs.deviceType.key++
      this.$refs.diagnoseNum.key++
      this.$refs.ProductlineAlarm.key++
      this.$refs.ProductlineAbnormal.key++
    },
  },
  mounted() {
    this.initProductlineData()
    let frame = this.$refs.iframe

    window.onmessage = function (e) {
      if (e.data.retcode == 200) {
        // console.log('子页面加载完成')
        frame.contentWindow.postMessage('111', '*')
      }
    }
  },
}
</script>

<style>
.container {
  display: flex;
}
.left-box,
.middle-box,
.right-box {
  flex-direction: column;
}
.left-box {
  width: 30%;
}
.middle-box {
  width: 70%;
  align-self: stretch;
  display: flex;
  flex-direction: column;
}
.right-box {
  width: 20%;
}

.bottom-box {
  display: flex;
}

.box1 {
  margin: 10px;
  padding: 10px;
}
.left-wrap {
  display: flex;
  flex-direction: column;
  width: 70%;
}
.charttitle {
  margin: 20px;
  font-size: 25px;
}

.unit {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
}

.accessnum {
  font-size: 30px;
  text-align: center;
  font-family: HarmonyOS_Sans_Condensed-regular;
  color: rgba(255, 255, 255, 100);
  padding: 3px;
  line-height: 75px;
}

.accessnum-6 {
  font-size: 30px;
  text-align: center;
  font-family: HarmonyOS_Sans_Condensed-regular;
  color: rgba(255, 255, 255, 100);
  padding: 3px;
  line-height: 75px;
}

.block-6 {
  width: 71px;
  height: 75px;
  background-color: #488a7d;
  margin: 5px;
  border-radius: 6px;
  text-align: center;
}

.bottom-box .titledisplay {
  font-size: 25px;
  font-weight: bold;
}
.wrap-container {
  position: relative;
}
.bottom-box .numdisplay {
  color: #3cd2a5;
  font-weight: bold;
}

.wrap {
  position: absolute;
  bottom: 6px;
  width: 100%;
}
.wrap div {
  height: 14px;
  font-size: 14px;
  color: #fff;
  text-align: center;
}

.wrap div::after,
.wrap div::before {
  position: absolute;
  top: 50%;
  height: 1px;
  width: 35%;
  content: '';
  background: #ddd;
}
.wrap div::before {
  left: 0;
}

.factory-path {
  font-size: 10px;
  margin-left: 10px;
}
.wrap div::after {
  right: 0;
}

.legend {
  line-height: 20px;
}

.legend-item-1::before {
  display: inline-block;
  content: '';
  height: 10px;
  width: 10px;
  border-radius: 10px;
  margin-right: 10px;
  background-color: #e8c82c;
}

.legend-item-2::before {
  display: inline-block;
  content: '';
  height: 10px;
  width: 10px;
  border-radius: 10px;
  margin-right: 10px;
  background-color: #da7f1c;
}

.legend-item-3::before {
  display: inline-block;
  content: '';
  height: 10px;
  width: 10px;
  border-radius: 10px;
  margin-right: 10px;

  background-color: #df1d1e;
}
.display {
  display: flex;
  justify-content: space-between;
}
.num-display {
  font-weight: bold;
  color: #e8c82c !important;

  font-size: 2rem;

  line-height: 1.2;
  margin-bottom: 20px;
}
</style>
