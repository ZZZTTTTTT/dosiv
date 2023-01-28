<template>
  <div class="pane-content">
    <el-row>
      <span class="querytext">工单创建时间：</span>

      <el-radio v-model="dateRadio" label="day" @change="radioChange('day')">当日</el-radio>
      <el-radio v-model="dateRadio" label="isoWeek" @change="radioChange('isoWeek')">本周</el-radio>
      <el-radio v-model="dateRadio" label="month" @change="radioChange('month')">当月</el-radio>

      <span class="querytext">开始时间：</span>
      <el-date-picker v-model="startDate" type="date" placeholder="选择日期" @change="changeStartDate" :append-to-body="false"></el-date-picker>

      <span class="querytext">结束时间：</span>
      <el-date-picker v-model="endDate" type="date" placeholder="选择日期" @change="changeEndDate" :append-to-body="false"></el-date-picker>
      <el-button type="primary" style="margin-left: 10px" @click="getData">查询</el-button>
      <!-- <el-button type="primary" @click="ticketDownload">下载</el-button> -->
    </el-row>
    <el-row style="margin-top: 10px">
      <span class="querytext">设备：</span>
      <el-input v-model="deviceKey" style="width: 150px"></el-input>

      <span class="querytext">关联报警：</span>
      <el-input v-model="relateAlertKey" style="width: 150px"></el-input>

      <span class="querytext">报警来源：</span>
      <el-select v-model="alertSourceSelect" :popper-append-to-body="false">
        <el-option v-for="item in alertSourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <span class="querytext">检测专业：</span>
      <!-- <el-select v-model="specialtySelect">
        <el-option v-for="item in specialtyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select> -->
      <el-cascader
        v-model="specialtySelect"
        :options="specialtyOptions"
        :props="{ checkStrictly: true, value: 'code', label: 'name' }"
        clearable
        :append-to-body="false"
      ></el-cascader>
    </el-row>
    <el-row>
      <el-table :data="ticketData" style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="taskId" label="工单编号"> </el-table-column>
        <el-table-column prop="deviceCode" label="设备编号"></el-table-column>
        <el-table-column prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column prop="relatedAlertNum" label="关联报警"> </el-table-column>
        <el-table-column prop="alertMessage" label="报警信息"> </el-table-column>
        <el-table-column prop="alertLevel" label="报警最高等级">
          <template slot-scope="scope">
            <div v-show="scope.row.alertLevel == 1" style="color: rgb(60, 210, 165)">正常</div>
            <div v-show="scope.row.alertLevel == 2" style="color: #ffc600">注意</div>
            <div v-show="scope.row.alertLevel == 3" style="color: #ff7a18">警告</div>
            <div v-show="scope.row.alertLevel == 4" style="color: #f75d54">危险</div>
          </template>
        </el-table-column>
        <el-table-column prop="alertSourceName" label="报警来源"> </el-table-column>
        <el-table-column prop="checkSpecialtyName" label="专业"> </el-table-column>
        <el-table-column prop="hasDiagnosis" label="是否诊断"> </el-table-column>
        <el-table-column prop="hasReport" label="诊断报告"> </el-table-column>
        <el-table-column prop="taskState" label="工单状态"> </el-table-column>
        <el-table-column prop="hasHang" label="是否挂起"> </el-table-column>
        <!-- <el-table-column prop="overtime" label="超时"> </el-table-column> -->
        <el-table-column prop="handlerName" label="处理人"> </el-table-column>
        <el-table-column prop="recCreateTime" label="工单创建时间"> </el-table-column>
        <!-- <el-table-column prop="attachment" label="附件"> </el-table-column> -->
        <el-table-column label="工单追踪">
          <template slot-scope="scope"> <span class="check" @click="viewTicketTrack(scope.row)">查看</span></template></el-table-column
        >
      </el-table>
    </el-row>
    <el-row style="margin-top: 10px; text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="offset"
        :page-sizes="pageSizes"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :popper-class="themeStyle ? 'select_dark' : 'select_light'"
      ></el-pagination>
    </el-row>
    <el-dialog v-if="ticketTrackDialogShow" :visible.sync="ticketTrackDialogShow" width="80%" top="6vh" :modal="false">
      <ticket-track-dialog :task-id="currentTaskId"></ticket-track-dialog>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import TicketTrackDialog from '@/components/globalComs/TicketTrackDialog.vue'
import { getTicketListByConditionWithPage, getSpecialtyTree, getAlertSourceDict } from '@/api/area'
export default {
  components: {
    TicketTrackDialog,
  },
  props: ['nodeId'],
  // computed: {
  //   innerNodeId() {
  //     return this.nodeId
  //   },
  // },
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  watch: {
    nodeId(newVal, oldVal) {
      this.innerNodeId = newVal
      this.initAbnormalTicketData()
    },
    // innerNodeId(newVal, oldVal) {
    //   this.initAbnormalTicketData()
    // },
  },
  data() {
    return {
      currentTaskId: '',
      tableLoading: false,
      ticketTrackDialogShow: false,
      innerNodeId: 0,
      dateRadio: '',
      deviceKey: '',
      relateAlertKey: '',
      startDate: '',
      endDate: '',
      alertSourceSelect: '0',
      alertSourceOptions: [
        {
          value: '0',
          label: '全部',
        },
      ],
      // defaultAlertSourceList: [{}],
      specialtySelect: [],
      specialtyOptions: [
        // {
        //   value: '0',
        //   label: '全部',
        // },
      ],
      dateObj: {
        startDate: 0,
        endDate: 0,
      },
      relateAlert: '',
      alertSource: '',
      checkSpecialty: '',
      offset: 1,
      total: 0,
      limit: 10,
      pageSizes: [10, 20, 30, 50],
      // searchKey: '',
      ticketData: [],
      mockTicketData: [
        {
          taskId: 1,
          relatedAlertNum: '关联报警1',
          alertMessage: '层冷辊道SEC9-10#辊道开关跳电 ins1344(mg-alg028)',
          alertLevel: '危险',
          alertSource: 'BA规则',
          specialty: '电气性能分析',
          hasDiagnosis: '是',
          hasReport: '查看',
          taskState: '诊断缝隙',
          hasHang: 'xxx',
          overtime: 'xxx',
          handlerName: 'xx',
          recCreateTime: '2012-02-02 11:55:33',
          attachment: 'xxx',
          ticketTrack: '查看',
        },
        {
          taskId: 2,
          relatedAlertNum: '关联报警2',
          alertMessage: '层冷辊道SEC9-10#辊道开关跳电 ins1344(mg-alg028)',
          alertLevel: '危险',
          alertSource: 'BA规则',
          specialty: '电气性能分析',
          hasDiagnosis: '是',
          hasReport: '查看',
          taskState: '诊断缝隙',
          hasHang: 'xxx',
          overtime: 'xxx',
          handlerName: 'xx',
          recCreateTime: '2012-02-02 11:55:33',
          attachment: 'xxx',
          ticketTrack: '查看',
        },
        {
          taskId: 3,
          relatedAlertNum: '关联报警3',
          alertMessage: '层冷辊道SEC9-10#辊道开关跳电 ins1344(mg-alg028)',
          alertLevel: '危险',
          alertSource: 'BA规则',
          specialty: '电气性能分析',
          hasDiagnosis: '是',
          hasReport: '查看',
          taskState: '诊断缝隙',
          hasHang: 'xxx',
          overtime: 'xxx',
          handlerName: 'xx',
          recCreateTime: '2012-02-02 11:55:33',
          attachment: 'xxx',
          ticketTrack: '查看',
        },
      ],
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
    }
  },
  methods: {
    ticketDownload() {
      this.$message.info('此功能暂未上线')
    },
    viewTicketTrack(row) {
      // console.log('row', row)
      this.currentTaskId = row.taskId
      // return this.$message.info('此功能暂未上线')
      this.ticketTrackDialogShow = true
    },
    getData() {
      this.initAbnormalTicketData()
    },
    radioChange(val) {
      let start = moment(moment().startOf(val))
      let end = moment(moment().endOf(val))
      this.dateObj.startDate = new Date(start).getTime()
      this.dateObj.endDate = new Date(end).getTime()
      this.startDate = this.dateObj.startDate
      this.endDate = this.dateObj.endDate
    },
    changeStartDate(val) {
      this.dateRadio = ''
      this.dateObj.startDate = val.getTime()
    },
    changeEndDate(val) {
      this.dateRadio = ''
      this.dateObj.endDate = val.getTime()
    },
    handleSizeChange(val) {
      this.limit = val
      this.offset = 1
      this.initAbnormalTicketData()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.initAbnormalTicketData()
    },
    initAbnormalTicketData() {
      if (this.innerNodeId == 0 || this.innerNodeId == null || this.innerNodeId == undefined) {
        return
      }
      // if (this.alertSourceOptions.length < 2) {
      //   return setTimeout(() => {
      //     this.initAbnormalTicketData()
      //   }, 500)
      // }
      const params = {
        domainId: this.innerNodeId,
        limit: this.limit,
        offset: (this.offset - 1) * this.limit,
      }
      if (this.dateObj.startDate !== 0) {
        params.startDate = this.dateObj.startDate
      }
      if (this.dateObj.endDate !== 0) {
        params.endDate = this.dateObj.endDate
      }
      if (this.deviceKey !== null && this.deviceKey !== undefined && this.deviceKey.trim() !== '') {
        params.deviceCodeOrName = this.deviceKey
      }
      if (this.relateAlertKey !== null && this.relateAlertKey !== undefined && this.relateAlertKey.trim() !== '') {
        params.relatedAlert = this.relateAlertKey
      }
      if (this.alertSourceSelect !== '0') {
        params.alertSource = this.alertSourceSelect
      }
      if (this.specialtySelect.length != 0) {
        let length = this.specialtySelect.length
        params.specialty = this.specialtySelect[length - 1]
      }
      this.tableLoading = true
      getTicketListByConditionWithPage(params).then((res) => {
        this.tableLoading = false
        if (res.status !== 200) {
          return this.$message.error('获取工单列表失败')
        }
        const { code, result } = res.data
        if (code !== 200) {
          return this.$message.error('获取工单列表失败')
        }
        result.data.forEach((item) => {
          if (item.recCreateTime) {
            let time = new Date(item.recCreateTime)
            let timeString = time.toLocaleString()
            item.recCreateTime = timeString
            // for (let alert of this.alertSourceOptions) {
            //   if (item.alertSource == alert.value) {
            //     item.alertSource = alert.label
            //   }
            // }
          }
          if (item.hasDiagnosis == 1) {
            item.hasDiagnosis = '是'
          } else {
            item.hasDiagnosis = '否'
          }
          if (item.hasHang == 1) {
            item.hasHang = '是'
          } else {
            item.hasHang = '否'
          }
          for (let state of this.ticketStateDict) {
            if (state.value == item.taskState) {
              item.taskState = state.label
            }
          }
        })
        this.ticketData = result.data
        this.total = result.total
        if (process.env.NODE_ENV === 'development') {
          if (this.ticketData.length < 1 || this.total < 1) {
            // 未获取到数据，使用模拟数据
            this.ticketData = this.mockTicketData
            this.total = this.mockTicketData.length
          }
        }
      })
    },
  },
  mounted() {
    this.innerNodeId = this.nodeId
    getSpecialtyTree().then((res) => {
      if (res.status !== 200 || res.data.code !== 200) {
        return this.$message.error('获取专业字典表失败')
      }
      this.specialtyOptions = res.data.result
      // for (let item of res.data.result) {
      //   let obj = {}
      //   obj.value = item.code
      //   obj.label = item.name
      //   this.specialtyOptions.push(obj)
      // }
    })
    getAlertSourceDict().then((res) => {
      if (res.status !== 200 || res.data.code !== 200) {
        return this.$message.error('获取报警来源字典表失败')
      }
      for (let item of res.data.result) {
        let obj = {}
        obj.value = item.code
        obj.label = item.name
        this.alertSourceOptions.push(obj)
      }
    })
    this.initAbnormalTicketData()
  },
}
</script>

<style lang="scss">
.querytext {
  margin-left: 10px;
}
.select_dark {
  background: rgba($color: #1d2835, $alpha: 0.95);
  .el-select-dropdown__item.hover {
    background: transparent;
    color: #3cd3a6;
  }
  .el-select-dropdown__item.selected {
    color: #3cd3a6;
  }
}
.select_light {
  background: #f7faff;
  .el-select-dropdown__item.hover {
    background: transparent;
    color: rgb(48, 136, 244);
  }
}
</style>
