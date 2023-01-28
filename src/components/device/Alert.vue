<template>
  <div class="pane-content">
    <el-row>
      <span class="querytext"></span>

      <el-select v-model="dateType" placeholder="请选择时间类型" :popper-append-to-body="false">
        <el-option v-for="item in dateTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-radio v-model="dateRadio" label="day" @change="radioChange('day')">当日</el-radio>
      <el-radio v-model="dateRadio" label="isoWeek" @change="radioChange('isoWeek')">本周</el-radio>
      <el-radio v-model="dateRadio" label="month" @change="radioChange('month')">当月</el-radio>

      <span class="querytext">开始时间：</span>

      <el-date-picker v-model="startDate" type="date" placeholder="选择日期" @change="changeStartDate" :append-to-body="false"></el-date-picker>

      <span class="querytext">结束时间：</span>

      <el-date-picker v-model="endDate" type="date" placeholder="选择日期" @change="changeEndDate" :append-to-body="false"></el-date-picker>
    </el-row>
    <el-row style="margin-top: 5px">
      <!-- 设备：
      <el-input v-model="deviceKey" style="width: 150px"></el-input> -->

      <span class="querytext">关联工单：</span>

      <el-input v-model="relateTicketKey" style="width: 150px"></el-input>

      <span class="querytext">报警来源：</span>

      <el-select v-model="alertSourceSelect" :popper-append-to-body="false">
        <el-option v-for="item in alertSourceOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>

      <span class="querytext">检测专业：</span>

      <el-cascader
        v-model="specialtySelect"
        :options="specialtyOptions"
        :props="{ checkStrictly: true, value: 'code', label: 'name' }"
        clearable
        :append-to-body="false"
      ></el-cascader>
      <!-- <el-select v-model="specialtySelect">
        <el-option v-for="item in specialtyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select> -->
      <el-button type="primary" style="margin-left: 10px" @click="getData">查询</el-button>
      <!-- <el-button type="primary" @click="alertDownload">下载</el-button> -->
    </el-row>
    <el-row>
      <el-table :data="alertData" style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="alertId" label="报警编号"> </el-table-column>
        <el-table-column prop="alertSourceName" label="报警来源"> </el-table-column>
        <el-table-column prop="checkSpecialtyName" label="检测专业"> </el-table-column>
        <el-table-column prop="alertMessage" label="报警信息"> </el-table-column>
        <el-table-column prop="alertLevel" label="报警级别">
          <template slot-scope="scope">
            <div v-show="scope.row.alertLevel === 1" style="color: rgb(60, 210, 165)">正常</div>
            <div v-show="scope.row.alertLevel === 2" style="color: #ffc600">注意</div>
            <div v-show="scope.row.alertLevel === 3" style="color: #ff7a18">警告</div>
            <div v-show="scope.row.alertLevel === 4" style="color: #f75d54">危险</div>
          </template>
        </el-table-column>
        <el-table-column prop="alertCount" label="次数"> </el-table-column>
        <el-table-column prop="recCreateTime" label="平台创建时间"> </el-table-column>
        <el-table-column prop="firstTime" label="首次报警"> </el-table-column>
        <el-table-column prop="lastTime" label="最近报警"> </el-table-column>
        <el-table-column prop="attachment" label="附件">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.file" :key="index" style="margin-right: 10px" class="check" @click="downloadAttach(item)"
              >附件{{ index + 1 }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope"> <span class="check" @click="viewAlertTrack(scope.row)">处理记录</span></template></el-table-column
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
      >
      </el-pagination
    ></el-row>
    <el-dialog v-if="alertTrackDialogShow" :visible.sync="alertTrackDialogShow" width="60%" top="6vh" :modal="false">
      <alert-track-dialog :alert-id="currentAlertId"></alert-track-dialog>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import AlertTrackDialog from '@/components/globalComs/AlertTrackDialog.vue'
import { getAlertListByConditionWithPage, getSpecialtyTree, getAlertSourceDict } from '@/api/area'
export default {
  props: ['deviceCode'],
  components: {
    AlertTrackDialog,
  },
  watch: {
    deviceCode(newVal, oldVal) {
      this.innerDeviceCode = newVal
      this.initAlertData()
    },
  },
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  methods: {
    downloadAttach(item) {
      if (item == null || item == undefined || item == '') {
        return this.$message.info('无附件可供下载')
      }
      window.open(item, '_blank')
    },
    viewAlertTrack(row) {
      // console.log('row', row)
      this.currentAlertId = row.alertId
      this.alertTrackDialogShow = true
    },
    alertDownload() {
      this.$message.info('此功能暂未上线')
    },
    viewRecord() {
      this.$message.info('此功能暂未上线')
    },
    radioChange(val) {
      let start = moment(moment().startOf(val))
      let end = moment(moment().endOf(val))
      this.dateObj.startDate = new Date(start).getTime()
      this.dateObj.endDate = new Date(end).getTime()
      this.startDate = this.dateObj.startDate
      this.endDate = this.dateObj.endDate
    },
    getData() {
      this.initAlertData()
    },
    changeStartDate(val) {
      this.dateRadio = ''
      this.dateObj.startDate = val.getTime()
    },
    changeEndDate(val) {
      this.dateRadio = ''
      this.dateObj.endDate = val.getTime()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.initAlertData()
    },
    handleSizeChange(val) {
      this.limit = val
      this.offset = 1
      this.initAlertData()
    },
    initAlertData() {
      if (this.innerDeviceCode == 0 || this.innerDeviceCode == null || this.innerDeviceCode == undefined) {
        return
      }
      if (this.alertSourceOptions.length < 2) {
        return setTimeout(() => {
          this.initAlertData()
        }, 500)
      }
      let params = {
        deviceCode: this.innerDeviceCode,
        limit: this.limit,
        offset: (this.offset - 1) * 10,
      }
      if (this.dateObj.startDate !== null && this.dateObj.startDate !== undefined && this.dateObj.startDate !== 0) {
        if (this.dateType === 1) {
          // 首次报警时间
          params.firstAlertTimeFrom = this.dateObj.startDate
        } else {
          // 平台创建时间
          params.createTimeFrom = this.dateObj.startDate
        }
      }
      if (this.dateObj.endDate !== null && this.dateObj.endDate !== undefined && this.dateObj.endDate !== 0) {
        if (this.dateType === 1) {
          // 首次报警时间
          params.firstAlertTimeTo = this.dateObj.endDate
        } else {
          // 平台创建时间
          params.createTimeTo = this.dateObj.endDate
        }
      }
      if (this.deviceKey !== null && this.deviceKey !== undefined && this.deviceKey.trim() !== '') {
        params.deviceCodeOrName = this.deviceKey
      }
      if (this.relateTicketKey !== null && this.relateTicketKey !== undefined && this.relateTicketKey.trim() !== '') {
        params.relatedAlert = this.relateTicketKey
      }
      if (this.alertSourceSelect !== '0') {
        params.alertSource = this.alertSourceSelect
      }
      if (this.specialtySelect.length != 0) {
        let length = this.specialtySelect.length
        params.specialty = this.specialtySelect[length - 1]
      }
      this.tableLoading = true
      getAlertListByConditionWithPage(params).then((res) => {
        this.tableLoading = false
        if (res.status !== 200) {
          return this.$message.error('获取报警列表失败')
        }
        const { code, result } = res.data
        if (code !== 200) {
          return this.$message.error('获取报警列表失败')
        }
        if (process.env.NODE_ENV === 'development') {
          if (result.data.length < 1 || result.total < 1) {
            result.data = this.mockAlertData
            result.total = this.mockAlertData.length
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
          for (let alert of this.alertSourceOptions) {
            if (item.alertSource == alert.value) {
              item.alertSource = alert.label
            }
          }
          if (item.file) {
            let fileArr = item.file.split(',')
            item.file = fileArr
          }
        })
        this.alertData = result.data
        this.total = result.total
      })
    },
  },
  data() {
    return {
      alertTrackDialogShow: false,
      currentAlertId: 0,
      tableLoading: false,
      dateObj: {
        startDate: 0,
        endDate: 0,
      },
      innerNodeId: 0,
      offset: 1,
      total: 0,
      limit: 10,
      pageSizes: [10, 20, 30, 50],
      dateRadio: '',
      startDate: null,
      endDate: null,
      mockAlertData: [
        {
          alertId: '123BJ1872', //报警编号
          alertLabel: '6',
          alertLevel: 3, //报警等级
          alertMessage: '报警消息', //报警信息
          alertSource: '201', //报警来源
          alertState: 5, //报警状态
          checkSpecialty: 'A', //专业
          deviceCode: '264504E50_001',
          file: '',
          firstTime: 1651022132000, //首次报警时间
          handleNode: '确认不转诊断',
          hasHang: 1, //挂起
          recCreateTime: 1651025683000,
          recReviseTime: 1652711221000, //工单创建时间
          latestAriseTime: 1652711221000,
          ruleId: 'GZ123',
          taskId: '70e5c8f2998b4f63bde0da76bedfb61e', //工单号
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
          file: '',
          firstTime: 1651022132000, //首次报警时间
          handleNode: '确认不转诊断',
          hasHang: 1, //挂起
          recCreateTime: 1651025683000,
          recReviseTime: 1652711221000, //工单创建时间
          latestAriseTime: 1652711221000,
          ruleId: 'GZ123',
          taskId: '70e5c8f2998b4f63bde0da76bedfb61e', //工单号
        },
      ],
      alertData: [],
      dateType: 1,
      dateTypeOptions: [
        {
          value: 1,
          label: '首次报警时间',
        },
        {
          value: 2,
          label: '平台创建时间',
        },
      ],
      deviceKey: '',
      relateTicketKey: '',
      alertSourceSelect: '0',
      alertSourceOptions: [
        {
          value: '0',
          label: '全部',
        },
      ],
      specialtySelect: [],
      specialtyOptions: [
        // {
        //   value: '0',
        //   label: '全部',
        // },
      ],
    }
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
    this.initAlertData()
  },
}
</script>

<style scoped>
.querytext {
  margin-left: 10px;
}
</style>
