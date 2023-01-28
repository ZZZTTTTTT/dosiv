<template>
  <div class="pane-content">
    <el-row :gutter="10">
      <el-col :span="16">
        <el-table :data="deviceSummaryData" @row-click="rowClick" style="width: 100%" v-loading="tableLoading" :row-class-name="tableRowClassName">
          <el-table-column prop="deviceName" label="设备名称" width="200px" align="center"> </el-table-column>
          <el-table-column prop="deviceCode" label="设备编号" align="center"> </el-table-column>
          <el-table-column prop="deviceStatus" label="状态" align="center">
            <template slot-scope="scope">
              <div v-show="scope.row.deviceStatus == '正常' || scope.row.deviceStatus == 1" style="color: rgb(60, 210, 165)">正常</div>
              <div v-show="scope.row.deviceStatus == '注意' || scope.row.deviceStatus == 2" style="color: #FFC600">注意</div>
              <div v-show="scope.row.deviceStatus == '警告' || scope.row.deviceStatus == 3" style="color: #FF7A18">警告</div>
              <div v-show="scope.row.deviceStatus == '危险' || scope.row.deviceStatus == 4" style="color: #F75D54">危险</div>
            </template>
          </el-table-column>
          <el-table-column prop="abnormalTicketNum" label="异常工单" align="center"> </el-table-column>
          <!-- <el-table-column prop="alertMessage" label="报警信息"> </el-table-column> -->
          <el-table-column prop="diagnosisReportNum" label="诊断报告" align="center"> </el-table-column>
          <!-- <el-table-column prop="exceedThresholdKpiCodeNum" label="超阈值数据"> </el-table-column> -->
          <el-table-column prop="inactiveKpiCodeNum" label="断更数据" align="center"> </el-table-column>
          <el-table-column prop="confirmedAlertNum" label="已确认报警" align="center"> </el-table-column>
          <el-table-column prop="newAlertNum" label="新产生报警" align="center"> </el-table-column>
        </el-table>
        <el-row style="margin-top: 10px; text-align: right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="offset"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :popper-class="themeStyle ? 'select_dark' : 'select_light'"
          >
          </el-pagination
        ></el-row>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-tabs v-model="activeName" style="margin: 0px 30px" @tab-click="handleClick">
            <el-tab-pane label="实时数据" name="dataBoard">
              <div>
                <el-row>
                  <div class="dataBoard">
                    <el-row style="padding: 10px; justify-content: space-between; display: flex">
                      <div :span="4">测点</div>
                      <div :span="5">数据项</div>
                      <!--<el-col :span="5">超阈值</el-col>-->
                      <div :span="4">断更</div>
                      <div :span="6">从未上报</div>
                    </el-row>
                    <el-row style="padding: 10px; justify-content: space-between; display: flex">
                      <div :span="4">
                        {{ currentNodeData.pointNum }}
                      </div>
                      <div :span="5">{{ currentNodeData.kpiNum }}</div>
                      <!--<el-col :span="5">{{ currentNodeData.exceedThresholdKpiCodeNum }}</el-col>-->
                      <div :span="4">{{ currentNodeData.inactiveKpiCodeNum }}</div>
                      <div :span="6">{{ currentNodeData.neverReportKpiCodeNum }}</div>
                    </el-row>
                  </div>
                </el-row>
                <div v-for="detail in currentDataItemDetail" :key="detail.collectPointId">
                  <collapse-board :detail-data="detail" :device-code="clickDeviceCode"></collapse-board>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="异常工单" name="modelConfig">
              <div v-for="ticket in abnormalTicketList" :key="ticket.taskId">
                <abnormal-ticket-board :ticket="ticket"></abnormal-ticket-board>
              </div>
              <div v-show="abnormalTicketList.length < 1" style="text-align: center">暂无数据</div>
              <div v-show="abnormalTicketList.length > 0">
                <el-pagination
                  @current-change="handleAbnormalTicketCurrentChange"
                  :current-page="abnormalTicketCurrentPage"
                  :page-size="10"
                  layout="total, prev, pager, next"
                  :total="abnormalTicketTotal"
                  :popper-class="themeStyle ? 'select_dark' : 'select_light'"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="报警" name="realTimeImage">
              <div v-for="alert in alertList" :key="alert.taskId">
                <alert-board :alert="alert"></alert-board>
              </div>
              <div v-show="alertList.length < 1" style="text-align: center">暂无数据</div>
              <div v-show="alertList.length > 0">
                <el-pagination
                  @current-change="handleAlertCurrentChange"
                  :current-page="alertCurrentPage"
                  :page-size="10"
                  layout="total, prev, pager, next"
                  :total="alertTotal"
                  :popper-class="themeStyle ? 'select_dark' : 'select_light'"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CornerBorder from '@/components/globalComs/cornerBorder.vue'
import RealTimeDataPane from '@/components/Area/RealTimeDataPane'
import CollapseBoard from '@/components/Area/CollapseBoard'
import AbnormalTicketBoard from '@/components/Area/AbnormalTicketBoard'
import AlertBoard from '@/components/Area/AlertBoard'
import {
  getDeviceStatusViewListByConditionWithPage,
  statisticsKpiIndicatorAggrByPoint,
  getTicketListByConditionWithPage,
  getAlertListByConditionWithPage,
} from '@/api/area'

export default {
  components: {
    CornerBorder,
    RealTimeDataPane,
    CollapseBoard,
    AbnormalTicketBoard,
    AlertBoard,
  },
  props: ['nodeId'],
  watch: {
    clickDeviceCode(newVal, oldVal) {
      if (this.deviceSummaryData.length > 0) {
        this.currentNodeData = this.deviceSummaryData.find((data) => {
          if (data.deviceCode == newVal) {
            return true
          }
        })

        // 处理测点
        this.statisticsKpiIndicatorAggrByPointApi()

        // 处理异常工单
        this.abnormalTicketCurrentPage = 1
        this.getTicketListByConditionWithPageApi()

        // 处理报警
        this.alertCurrentPage = 1
        this.getAlertListByConditionWithPageApi()
      }
    },
    innerNodeId(newVal, oldVal) {
      this.initDataStatusSummaryData()
    },
  },
  computed: {
    innerNodeId() {
      return this.nodeId
    },

    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  data() {
    return {
      alertStateDict: [
        {
          value: 5,
          label: '新产生',
        },
        {
          value: 6,
          label: '忽略审核',
        },
        {
          value: 10,
          label: '已确认',
        },
        {
          value: 15,
          label: '已忽略',
        },
        {
          value: 20,
          label: '已完成',
        },
      ],
      tableLoading: false,
      clickDeviceCode: 0,
      offset: 1,
      limit: 10,
      total: 0,
      activeName: 'dataBoard',
      deviceSummaryData: [],
      currentNodeData: {},
      activeCollapseName: 1,
      currentDataItemDetail: [],
      // loadVerticalshow: false,
      // loadVerticalshow2: false,
      // loadHorizontalshow: false,
      sheetshow: false,
      warnshow: false,
      ticketStateDict: [
        {
          value: 5,
          label: '诊断分析',
        },
        {
          value: 10,
          label: '诊断审核',
        },
        {
          value: 15,
          label: '异常处理',
        },
        {
          value: 20,
          label: '关闭说明',
        },
        {
          value: 25,
          label: '关闭确认',
        },
        {
          value: 30,
          label: '忽略审核',
        },
        {
          value: 35,
          label: '已忽略',
        },
        {
          value: 40,
          label: '已完成',
        },
      ],
      // loadVerticalData: [],
      // loadHorizontalData: [],
      abnormalTicketCurrentPage: 1,
      abnormalTicketTotal: 0,
      abnormalTicketList: [],
      mockAbnormalTicketList: [
        {
          alertLevel: '1', //报警最高等级
          alertMessage: '-来源B-1', //报警信息
          alertSource: '来源B', //报警来源
          deviceCode: '480338E33',
          domains: '0/500233',
          hasDiagnosis: 1, //是否诊断
          hasHang: 0, //是否挂起
          hasReport: 0, //诊断报告数量
          recCreateTime: 1652100203000, //工单创建时间
          recReviseTime: 1652670969000,
          relatedAlertNum: '1', //关联报警数量
          specialty: '专业', //专业
          taskId: '08428214beba4235a32ba791ee0a7761', //工单号
          taskLabel: 'taskLabel',
          taskState: 35, //工单状态
          taskType: 1,
        },
        {
          alertLevel: '2', //报警最高等级
          alertMessage: '-来源B-2', //报警信息
          alertSource: '来源B', //报警来源
          deviceCode: '480338E33',
          domains: '0/500233',
          hasDiagnosis: 1, //是否诊断
          hasHang: 0, //是否挂起
          hasReport: 0, //诊断报告数量
          recCreateTime: 1652100203000, //工单创建时间
          recReviseTime: 1652670969000,
          relatedAlertNum: '1', //关联报警数量
          specialty: '专业', //专业
          taskId: '08428214beba4235a32ba791ee0a7762', //工单号
          taskLabel: 'taskLabel',
          taskState: 25, //工单状态
          taskType: 1,
        },
      ],
      mockTableData: [
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
        {
          abnormalTicketNum: 0,
          alertMessage: 'Test-01',
          confirmedAlertNum: 10,
          deviceCode: '310712M00',
          deviceName: '3#卷取机',
          deviceStatus: '注意',
          diagnosisReportNum: 1,
          exceedThresholdKpiCodeNum: 2,
          inactiveKpiCodeNum: 3,
          neverReportKpiCodeNum: 4,
          newAlertNum: 5,
          kpiNum: 7,
          pointNum: 4,
        },
        {
          abnormalTicketNum: 2,
          alertMessage: 'Test-02',
          confirmedAlertNum: 11,
          deviceCode: '310713M01',
          deviceName: '3#卷取机-1',
          deviceStatus: '注意',
          diagnosisReportNum: 2,
          exceedThresholdKpiCodeNum: 3,
          inactiveKpiCodeNum: 4,
          neverReportKpiCodeNum: 5,
          newAlertNum: 6,
          kpiNum: 8,
          pointNum: 5,
        },
      ],
      mockCurrentDataItemDetail: [
        {
          collectPointId: '01',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 6,
          kpiNum: 4,
          neverReportKpiCodeNum: 7,
          pointName: '负荷侧水平',
          pointNo: '01',
        },
        {
          collectPointId: '02',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '02',
        },
        {
          collectPointId: '03',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '03',
        },
        {
          collectPointId: '04',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '04',
        },
        {
          collectPointId: '05',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '05',
        },
        {
          collectPointId: '06',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '06',
        },
        {
          collectPointId: '07',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '07',
        },
        {
          collectPointId: '08',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '08',
        },
        {
          collectPointId: '09',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '09',
        },
        {
          collectPointId: '10',
          deviceKpi: [
            {
              collectKpiId: '10001',
              kpiDisplayName: '不对中能量',
              kpiId: 10000,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10002',
              kpiDisplayName: '不平衡能量',
              kpiId: 10001,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10003',
              kpiDisplayName: '不平衡能量',
              kpiId: 10002,
              specialty: '振动诊断',
              unit: 'm/s',
            },
            {
              collectKpiId: '10004',
              kpiDisplayName: '低频加速度PMS',
              kpiId: 10003,
              specialty: '振动诊断',
              unit: 'm/s',
            },
          ],
          deviceKpiCount: 0,
          exceedThresholdKpiCodeNum: 0,
          inactiveKpiCodeNum: 1,
          kpiNum: 4,
          neverReportKpiCodeNum: 8,
          pointName: '负荷侧垂直',
          pointNo: '10',
        },
      ],
      alertList: [],
      mockAlertList: [
        {
          alertId: '123BJ18721', //报警编号
          alertLabel: '6',
          alertLevel: 3, //报警等级
          alertMessage: '报警消息1', //报警信息
          alertSource: '2011', //报警来源
          alertState: 5, //报警状态
          checkSpecialty: 'B', //专业
          deviceCode: '264504E50_0011',
          file: 'http://www.baidu.com,http://www.google.com',
          firstTime: 1651022132000, //首次报警时间
          handleNode: '确认不转诊断',
          hasHang: 1, //挂起
          recCreateTime: 1651025683000,
          recReviseTime: 1652711221000, //工单创建时间
          ruleId: 'GZ1231',
          taskId: '170e5c8f2998b4f63bde0da76bedfb61e1', //工单号
        },
        {
          alertId: '123BJ1872', //报警编号
          alertLabel: '6',
          alertLevel: 3, //报警等级
          alertMessage: '报警消息', //报警信息
          alertSource: '201', //报警来源
          alertState: 5, //报警状态
          checkSpecialty: 'A', //专业
          deviceCode: '264504E50_001',
          file: 'http://www.baidu.com,http://www.google.com',
          firstTime: 1651022132000, //首次报警时间
          handleNode: '确认不转诊断',
          hasHang: 1, //挂起
          recCreateTime: 1651025683000,
          recReviseTime: 1652711221000, //工单创建时间
          ruleId: 'GZ123',
          taskId: '70e5c8f2998b4f63bde0da76bedfb61e', //工单号
        },
      ],
      alertCurrentPage: 1,
      alertTotal: 0,
      tableRowIndex: null,
    }
  },
  methods: {
    handleAlertCurrentChange(val) {
      this.alertCurrentPage = val
      this.getAlertListByConditionWithPageApi()
    },
    handleAbnormalTicketCurrentChange(val) {
      this.abnormalTicketCurrentPage = val
      this.getTicketListByConditionWithPageApi()
    },
    rowClick(row) {
      this.tableRowIndex = this.getArrayIndex(this.deviceSummaryData, row)
      //console.log('2', this.tableRowIndex)
      if (row.deviceCode === this.clickDeviceCode) {
        return
      }
      this.clickDeviceCode = row.deviceCode
    },
    // 获取一个元素在数组中的下标
    getArrayIndex(arr, obj) {
      var i = arr.length
      while (i--) {
        if (arr[i] === obj) {
          return i
        }
      }
      return -1
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.tableRowIndex) {
        return 'highlight-row'
      }
      return ''
    },
    initDataStatusSummaryData() {
      this.getDeviceStatusViewListByConditionWithPageApi()
    },
    clickDataItemDetail(detail, index) {
      this.currentDataItemDetail[index].show = !this.currentDataItemDetail[index].show
    },
    // handleCollapseChange() {},
    getAlertListByConditionWithPageApi() {
      if (this.clickDeviceCode == 0 || this.clickDeviceCode == null || this.clickDeviceCode == undefined) {
        return
      }
      const params = {
        deviceCode: this.clickDeviceCode,
        limit: 10,
        offset: (this.alertCurrentPage - 1) * 10,
      }
      getAlertListByConditionWithPage(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        const { code, result } = res.data
        if (code !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        if (process.env.NODE_ENV === 'development') {
          if (result.data.length < 1) {
            result.data = this.mockAlertList
            result.total = this.mockAlertList.length
          }
        }
        result.data.forEach((item) => {
          if (item.recCreateTime) {
            let createTime = new Date(item.recCreateTime)
            let createTimeStr = createTime.toLocaleString()
            item.recCreateTime = createTimeStr
          }
          if (item.firstTime) {
            let firstTime = new Date(item.firstTime)
            let firstTimeStr = firstTime.toLocaleString()
            item.firstTime = firstTimeStr
          }
          if (item.latestAriseTime) {
            let lastTime = new Date(item.latestAriseTime)
            let lastTimeStr = lastTime.toLocaleString()
            item.latestAriseTime = lastTimeStr
          }
          if (item.recReviseTime) {
            let reviseTime = new Date(item.recReviseTime)
            let reviseTimeStr = reviseTime.toLocaleString()
            item.recReviseTime = reviseTimeStr
          }
          for (let alert of this.alertStateDict) {
            if (item.alertState == alert.value) {
              item.alertState = alert.label
            }
          }
          if (item.file) {
            let fileArr = item.file.split(',')
            item.file = fileArr
          }
        })
        this.alertList = result.data
        this.alertTotal = result.total
      })
    },
    getTicketListByConditionWithPageApi() {
      if (this.clickDeviceCode == 0 || this.clickDeviceCode == null || this.clickDeviceCode == undefined) {
        return
      }
      const params = {
        deviceCode: this.clickDeviceCode,
        limit: 10,
        offset: (this.abnormalTicketCurrentPage - 1) * 10,
      }
      getTicketListByConditionWithPage(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        const { code, result } = res.data
        if (code !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        if (process.env.NODE_ENV === 'development') {
          if (result.data.length < 1) {
            result.data = this.mockAbnormalTicketList
            result.total = this.mockAbnormalTicketList.length
          }
        }
        result.data.forEach((item) => {
          if (item.hasDiagnosis === 1) {
            item.hasDiagnosis = '是'
          } else {
            item.hasDiagnosis = '否'
          }
          if (item.recCreateTime) {
            let time = new Date(item.recCreateTime)
            item.recCreateTime = time.toLocaleString()
          }
          for (let state of this.ticketStateDict) {
            if (state.value == item.taskState) {
              item.taskState = state.label
            }
          }
        })
        this.abnormalTicketList = result.data
        this.abnormalTicketTotal = result.total
      })
    },
    getDeviceStatusViewListByConditionWithPageApi() {
      this.tableLoading = true
      getDeviceStatusViewListByConditionWithPage(this.innerNodeId, (this.offset - 1) * this.limit, this.limit).then((res) => {
        this.tableLoading = false
        if (res.status !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        const { code, result } = res.data
        if (code !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        this.deviceSummaryData = result.data
        this.total = result.total
        if (process.env.NODE_ENV === 'development') {
          if (this.deviceSummaryData.length < 1 || this.total < 1) {
            // 未获取到数据，使用模拟数据
            this.deviceSummaryData = this.mockTableData
            this.total = 100
          }
        }
        if (this.deviceSummaryData.length > 0) {
          this.currentNodeData = this.deviceSummaryData[0]
          this.clickDeviceCode = this.deviceSummaryData[0].deviceCode
        } else {
          this.currentNodeData = {}
          this.clickDeviceCode = 0
        }
      })
    },
    statisticsKpiIndicatorAggrByPointApi() {
      let deviceCode = this.clickDeviceCode
      if (deviceCode === 0 || deviceCode === null || deviceCode === undefined || deviceCode === '') {
        return
      }
      statisticsKpiIndicatorAggrByPoint(deviceCode).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        let { code, result } = res.data
        if (code !== 200) {
          return this.$message.error('请求数据出错，请重试')
        }
        if (process.env.NODE_ENV == 'development') {
          if (result === null || result === undefined || result.length < 1) {
            // 使用模拟数据
            result = this.mockCurrentDataItemDetail
          }
        }
        this.currentDataItemDetail = result
      })
    },
    handleSizeChange(val) {
      // console.log('val', val)
      this.limit = val
      this.offset = 1
      this.getDeviceStatusViewListByConditionWithPageApi()
    },
    handleCurrentChange(val) {
      // console.log('val', val)
      this.offset = val
      this.getDeviceStatusViewListByConditionWithPageApi()
    },
    handleClick(val) {
      // console.log('val', val)
    },
  },
  // mounted() {
  //   this.getDeviceStatusViewListByConditionWithPageApi()
  //   this.innerNodeId = this.nodeId
  //   this.initDataStatusSummaryData()
  // },
}
</script>

<style scoped>
.detailShow {
  display: block;
}
.detailHide {
  display: none;
}

.button-background {
  background-color: #218466;
  border-radius: 6px;
  padding: 1rem 1rem;
}
.num-theme,
.text-theme {
  color: #fff;

  font-weight: normal;
}

.text-theme {
  font-size: 14px;
}

.num-theme {
  font-size: 14px;
}
.textclass {
  color: #3cd2a5;
}
.dataBoard {
  font-size: 14px;
}
</style>
