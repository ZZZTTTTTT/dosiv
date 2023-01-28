<template>
  <div>
    <!-- <el-row>
      <node-summary :node-label="this.currentNodeName" :node-desc="this.nodeDesc" />
    </el-row> -->
    <el-row :gutter="10" style="margin-top: 10px">
      <!-- <el-col :span="6">
        <node-summary :node-label="this.currentNodeName" :node-desc="this.nodeDesc" />
      </el-col> -->
      <el-col :span="24">
        <div style="display: flex">
          <cardItem title="处理中异常" :Count="abnormalDeviceCount" :num="allDeviceCount" style="margin-right: 10px">
            <font-awesome-icon icon="fa-solid fa-chart-area" slot="chart" />
            <span slot="subtext" class="subtext">最近30天异常</span>
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
    <BorderWrap class="areapanel">
      <div style="height: 100%">
        <el-tabs v-model="activeName" style="margin: 0 10px" @tab-click="handleTabClick">
          <el-tab-pane label="设备状态概览" name="dataBoard">
            <device-status-summary :nodeId="this.innerNodeId"></device-status-summary>
          </el-tab-pane>
          <el-tab-pane label="模组/组态" name="configView">
            <div v-if="activeName == 'configView'">
              <config-view :nodeId="this.innerNodeId"></config-view>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="实时图像" name="realTimeImage">
            <real-time-image />
          </el-tab-pane> -->
          <el-tab-pane label="异常工单" name="abnormalSheet">
            <abnormal-ticket :nodeId="this.innerNodeId"></abnormal-ticket>
          </el-tab-pane>
          <el-tab-pane label="报警" name="alarmRecord">
            <alert :nodeId="this.innerNodeId"></alert>
          </el-tab-pane>
        </el-tabs>
      </div>
    </BorderWrap>
  </div>
</template>

<script>
import NodeSummary from '@/components/common/NodeSummary'
import CornerBorder from '@/components/globalComs/cornerBorder.vue'
import ImgDepot from '@/components/globalComs/imgDepot.vue'

import DataBoard from '@/components/globalComs/dataBoard.vue'
import DeviceStatusSummary from '@/components/Area/DeviceStatusSummary'
import AbnormalTicket from '@/components/Area/AbnormalTicket'
import Alert from '@/components/Area/Alert'
import AbnormalDevice from '@/components/Area/AbnormalDevice'
import AlertInProcess from '@/components/Area/AlertInProcess'
import AlertToHandle from '@/components/Area/AlertToHandle'
import ConfigDataItem from '@/components/Area/ConfigDataItem'
import cardItem from '@/components/Area/cardItem/index.vue'
import ConfigView from '@/components/globalComs/ConfigView.vue'
import {
  getAbnormalDeviceCount,
  countDevice,
  getAlertToHandleCount,
  countAlertToLast30Day,
  getAlertOnProcessCount,
  countAlertFinishedToLast30Day,
  getKpiCodeCount,
  countInactiveKpi,
} from '@/api/area'
import { mapMutations, mapState } from 'vuex'
import { setMenu, getMenu } from '@/utils/auth'
export default {
  components: {
    ConfigView,
    NodeSummary,
    CornerBorder,
    ImgDepot,

    DataBoard,
    DeviceStatusSummary,
    AbnormalTicket,
    Alert,
    AbnormalDevice,
    AlertInProcess,
    AlertToHandle,
    ConfigDataItem,
    cardItem,
  },
  watch: {
    currentNodeId(newVal, oldVal) {
      this.innerNodeId = newVal
      this.initAreaData()
    },
  },
  data() {
    return {
      innerNodeId: 0,
      abnormalDeviceCount: 0,
      allDeviceCount: 0,
      alertToHandleCount: 0,
      lastMonthCreateAlertCount: 0,
      alertInProcessCount: 0,
      lastMonthCloseAlertCount: 0,
      configDataItemCount: 0,
      inactiveDataItemCount: 0,
      nodeDesc: '描述文字',
      activeName: 'dataBoard',
      radio: 'allPoints',
    }
  },
  mounted() {
    this.innerNodeId = this.currentNodeId
    // if (this.activeTab == 'dataBoard' || this.activeTab == 'configView' || this.activeTab == 'abnormalSheet' || this.activeTab == 'alarmRecord') {
    //   this.activeName = this.activeTab
    // }
    let menu = getMenu()
    if (menu) {
      this.activeName = menu
    }
    this.initAreaData()
  },
  computed: {
    ...mapState('app', ['currentNodeName', 'currentNodeId']),
  },
  methods: {
    // ...mapMutations('app', { setActiveTab: 'SET_ACTIVE_TAB' }),
    initAreaData() {
      //console.log('init')
      const params = {
        domainId: this.innerNodeId,
      }
      getAbnormalDeviceCount(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取异常设备数量失败')
        }
        this.abnormalDeviceCount = res.data.result
      })
      countDevice(params).then((res) => {
        if (res.status != 200) {
          return this.$message.error('获取设备数量失败')
        }
        this.allDeviceCount = res.data.result
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
    handleTabClick(tab) {
      // this.setActiveTab(tab.name)
      setMenu(tab.name)
    },
  },
}
</script>

<style scoped>
.transition-enter-active,
.transition-leave-active {
  transition: all 0.15s ease;
}
.transition-enter,
.transition-leave-to {
  height: 0;
}
.subtext {
  color: grey;
  font-size: 14px;
}
.accordion-button {
  width: 100%;
  text-align: left;
  background-color: rgba(29, 40, 53, 0.95);
  color: #fff;
}
</style>
<style>
.areapanel {
  height: calc(100vh - 278px);
  width: 100%;

  margin-top: 10px;
}
/* .d-flex {
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
  width: 20px;
  height: 20px;
  background-color: rgb(27, 41, 52);
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

.el-picker-panel {
  background-color: rgba(29, 40, 53, 0.98);
}

.el-icon-date:before {
  content: '';
}

.el-input__inner {
  background-color: transparent;
} */
</style>
