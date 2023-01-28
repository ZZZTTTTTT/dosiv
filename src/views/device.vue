<template>
  <div style="width: 98%">
    <el-row :gutter="10" style="margin-top: 15px">
      <el-col :span="24">
        <div style="display: flex">
          <cardItem title="处理中异常" :Count="abnormalInProcessCount" :num="lastMonthAbnormalCount" style="margin-right: 10px">
            <font-awesome-icon icon="fa-solid fa-chart-area" slot="chart" />
            <span slot="subtext" style="color: grey; font-size: 14px">最近30天异常</span>
          </cardItem>

          <cardItem title="待处理报警" :Count="alertToHandleCount" :num="lastMonthCreateAlertCount" style="margin-right: 10px">
            <font-awesome-icon icon="fa-solid fa-bar-chart" slot="chart" />
            <span slot="subtext" class="subtext">最近30天共产生</span>
          </cardItem>

          <cardItem title="流程中的报警" :Count="alertInProcessCount" :num="lastMonthCloseAlertCount" style="margin-right: 10px">
            <font-awesome-icon icon="fa-solid fa-chart-line" slot="chart" />
            <span slot="subtext" class="subtext">最近30天处理完</span>
          </cardItem>

          <cardItem title="已配置数据项" :Count="configDataItemCount" :num="inactiveDataItemCount">
            <font-awesome-icon icon="fa-solid fa-chart-pie" slot="chart" />
            <span slot="subtext" class="subtext">离线数据项</span>
          </cardItem>
        </div>
      </el-col>
    </el-row>
    <!-- <BorderWrap style="width: 100%; height: 800px"> -->
    <BorderWrap class="areapanel">
      <div>
        <el-row>
          <el-tabs v-model="activeName" style="margin: 0 10px" @tab-click="handleTabClick">
            <el-tab-pane label="数据看板" name="dataBoard">
              <data-board :device-code="this.innerDeviceCode"></data-board>
            </el-tab-pane>

            <!-- <el-tab-pane label="数据看板2" name="dataBoard2"> <data-board-two /> /> </el-tab-pane> -->

            <el-tab-pane label="模组/组态" name="configView">
              <!-- <config-view :nodeId="this.innerDeviceCode"></config-view> -->
              <div v-if="activeName == 'configView'">
                <config-view :nodeId="this.innerDeviceCode"></config-view>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备信息" name="facilityInfo">
              <device-info :device-code="this.innerDeviceCode"></device-info>
            </el-tab-pane>
            <el-tab-pane label="异常工单" name="abnormalSheet">
              <abnormal-ticket :device-code="this.innerDeviceCode"></abnormal-ticket>
            </el-tab-pane>
            <el-tab-pane label="报警" name="alarmRecord">
              <alert :device-code="this.innerDeviceCode"></alert>
            </el-tab-pane>
            <!-- <el-tab-pane label="实时图像" name="realTimeImage">
            <real-time-image />
          </el-tab-pane> -->
            <el-tab-pane label="离线诊断报告" name="OfflineDiagnosticReport">
              <offline-report :device-code="this.innerDeviceCode"></offline-report>
            </el-tab-pane>
            <el-tab-pane label="故障履历" name="FaultRecord">
              <fault-record :device-code="this.innerDeviceCode"></fault-record>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </div>
      <!-- </BorderWrap> -->
    </BorderWrap>
  </div>
</template>

<script>
import NodeSummary from '@/components/common/NodeSummary'
import ImgDepot from '@/components/globalComs/imgDepot.vue'

import DataBoardTwo from '@/components/globalComs/dataBoardTwo.vue'
import DataBoard from '@/components/globalComs/dataBoard.vue'
import BorderWrap from '@/components/BorderWrap'
import AbnormalInProcess from '@/components/device/AbnormalInProcess'
import AlertToHandle from '@/components/Area/AlertToHandle'
import AlertInProcess from '@/components/Area/AlertInProcess'
import ConfigDataItem from '@/components/Area/ConfigDataItem'
import AbnormalTicket from '@/components/device/AbnormalTicket'
import Alert from '@/components/device/Alert'
import OfflineReport from '@/components/device/OfflineReport'
import FaultRecord from '@/components/device/FaultRecord'
import { countUnfinishedTicket, countTicketToLast30Day } from '@/api/device'
import cardItem from '@/components/Area/cardItem/index.vue'
import ConfigView from '@/components/globalComs/ConfigView.vue'

import {
  getAlertToHandleCount,
  countAlertToLast30Day,
  getAlertOnProcessCount,
  countAlertFinishedToLast30Day,
  getKpiCodeCount,
  countInactiveKpi,
} from '@/api/area'
import { mapState, mapMutations } from 'vuex'
import { getMenu, setMenu, getCurrentNodeId } from '@/utils/auth'

export default {
  computed: {
    ...mapState('app', ['currentNodeName', 'currentDeviceCode', 'activeTab']),
  },
  watch: {
    currentDeviceCode(newVal, oldVal) {
      this.innerDeviceCode = newVal
      this.initDeviceData()
    },
  },
  components: {
    NodeSummary,
    BorderWrap,
    ImgDepot,
    DataBoard,
    DataBoardTwo,
    AbnormalInProcess,
    AlertToHandle,
    AlertInProcess,
    ConfigDataItem,
    AbnormalTicket,
    Alert,
    OfflineReport,
    FaultRecord,
    cardItem,
    ConfigView,
  },

  data() {
    return {
      innerDeviceCode: 0,
      nodeLabel: '粗轧区测温仪',
      nodeDesc: '区域详细地址-设备信息...',
      activeName: 'dataBoard',
      abnormalInProcessCount: 0,
      lastMonthAbnormalCount: 0,
      alertToHandleCount: 0,
      alertInProcessCount: 0,
      lastMonthCloseAlertCount: 0,
      lastMonthCreateAlertCount: 0,
      configDataItemCount: 0,
      inactiveDataItemCount: 0,
    }
  },
  mounted() {
    // console.log('device.vue - this.activeTab', this.activeTab)
    this.innerDeviceCode = this.currentDeviceCode
    if (!this.innerDeviceCode) {
      this.innerDeviceCode = getCurrentNodeId()
    }

    // if (
    //   this.activeTab == 'dataBoard' ||
    //   this.activeTab == 'configView' ||
    //   this.activeTab == 'facilityInfo' ||
    //   this.activeTab == 'abnormalSheet' ||
    //   this.activeTab == 'alarmRecord' ||
    //   this.activeTab == 'OfflineDiagnosticReport' ||
    //   this.activeTab == 'FaultRecord'
    // ) {
    //   this.activeName = this.activeTab
    // }
    let menu = getMenu()
    if (menu) {
      this.activeName = menu
    }
    this.initDeviceData()
  },
  methods: {
    // ...mapMutations('app', { setActiveTab: 'SET_ACTIVE_TAB' }),
    handleTabClick(tab) {
      // this.setActiveTab(tab.name)
      setMenu(tab.name)
    },
    initDeviceData() {
      const deviceCode = this.innerDeviceCode
      const params = {
        deviceCode,
      }
      countUnfinishedTicket(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取处理中异常数量失败')
        }
        this.abnormalInProcessCount = res.data.result
      })
      countTicketToLast30Day(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取最近30天异常数量失败')
        }
        this.lastMonthAbnormalCount = res.data.result
      })
      getAlertToHandleCount(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取待处理报警数量失败')
        }
        this.alertToHandleCount = res.data.result
      })
      countAlertToLast30Day(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取过去30天产生报警数量失败')
        }
        this.lastMonthCreateAlertCount = res.data.result
      })
      getAlertOnProcessCount(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取流程中报警数量失败')
        }
        this.alertInProcessCount = res.data.result
      })
      countAlertFinishedToLast30Day(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取过去30天处理完报警数量失败')
        }
        this.lastMonthCloseAlertCount = res.data.result
      })
      getKpiCodeCount(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取已配置数据项数量失败')
        }
        this.configDataItemCount = res.data.result
      })
      countInactiveKpi(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取离线数据项数量失败')
        }
        this.inactiveDataItemCount = res.data.result
      })
    },
  },
}
</script>

<style>
.subtext {
  color: grey !important;
  font-size: 14px;
}
.d-flex {
  display: flex;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #fff;
}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #3cd2a5;
  background: #3cd2a5;
}

.el-radio__inner {
  border: 1px solid #dcdfe6;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  background-color: rgb(27, 41, 52);
}

.el-radio__inner:hover {
  color: #3cd2a5;
}

.btn-outline-theme {
  border: 1px solid rgb(42, 168, 118);
  background: rgba(0, 0, 0, 0.1);
  color: rgb(42, 168, 118);
  padding: 10px;
  border-radius: 5px;
}

.btn-outline-theme:hover {
  background-color: rgb(42, 168, 118) !important;
  color: #fff !important;
  transition: 0.7s;
}

.el-radio__inner::after {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: rgb(27, 41, 52);
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
}

table {
  color: #ffffffbf !important;
}

.el-tabs__active-bar {
  background-color: #fff;
}

.el-tabs__item:hover {
  color: #3cd2a5;
}

.el-tabs__item.is-top.is-active {
  border: none !important;
}

.el-tabs__item.is-top {
  font-size: 14px;
}
.el-tabs__item.is-top {
  color: #858c94;
}
.el-radio__label {
  font-size: 14px;
}

.deviceBorder {
  width: 100%;
  height: 160px;
}

.el-icon-date:before {
  content: '';
}

.el-input__inner {
  background-color: transparent;
}

.theme-dark .is-active,
.theme-dark .is-active span {
  color: #fff !important;
}
</style>
<style scoped>
.el-input--medium .el-input__inner {
  color: #fff !important;
}
</style>
