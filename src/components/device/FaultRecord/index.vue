<template>
  <div class="pane-content">
    <el-row>
      报告生成时间：
      <el-radio v-model="dateRadio" label="day" @change="radioChange('day')">当日</el-radio>
      <el-radio v-model="dateRadio" label="isoWeek" @change="radioChange('isoWeek')">本周</el-radio>
      <el-radio v-model="dateRadio" label="month" @change="radioChange('month')">当月</el-radio>
      开始时间：
      <el-date-picker v-model="startDate" type="date" placeholder="选择日期" @change="changeStartDate"></el-date-picker>
      结束时间：
      <el-date-picker v-model="endDate" type="date" placeholder="选择日期" @change="changeEndDate"></el-date-picker>
      <el-button type="primary" style="margin-left: 10px" @click="getData">查询</el-button>
      <!-- <el-button type="primary">下载</el-button> -->
    </el-row>
    <el-row>
      <el-table :data="faultRecordData" style="width: 100%">
        <el-table-column prop="name" label="故障名称"> </el-table-column>
        <el-table-column prop="startTime" label="故障开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="故障结束时间"> </el-table-column>
        <el-table-column prop="faultLevel" label="故障级别"> </el-table-column>
        <el-table-column prop="professionalAttr" label="专业属性"> </el-table-column>
        <el-table-column prop="reason" label="故障原因"> </el-table-column>
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
  </div>
</template>

<script>
import moment from 'moment'
import { getFaultRecordListByDeviceIdWithPage } from '@/api/device'
export default {
  props: ['deviceCode'],
  watch: {
    deviceCode(newVal, oldVal) {
      this.innerDeviceCode = newVal
      this.initFaultRecordData()
    },
  },
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  methods: {
    radioChange(val) {
      let start = moment(moment().startOf(val))
      let end = moment(moment().endOf(val))
      this.dateObj.startDate = new Date(start).getTime()
      this.dateObj.endDate = new Date(end).getTime()
      this.startDate = this.dateObj.startDate
      this.endDate = this.dateObj.endDate
    },
    getData() {
      this.initFaultRecordData()
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
      this.getData()
    },
    handleSizeChange(val) {
      this.limit = val
      this.offset = 1
      this.getData()
    },
    initFaultRecordData() {
      if (this.innerDeviceCode == 0) {
        return
      }
      let params = {
        deviceCode: this.innerDeviceCode,
        limit: this.limit,
        offset: this.offset,
      }
      if (this.dateObj.startDate !== 0) {
        params.startDate = this.dateObj.startDate
      }
      if (this.dateObj.endDate !== 0) {
        params.endDate = this.dateObj.endDate
      }
      getFaultRecordListByDeviceIdWithPage(params).then((res) => {
        if (res.status !== 200) {
          // this.faultRecordData = this.mockFaultRecordData
          // this.total = this.mockFaultRecordData.length
          return this.$message.error('获取故障履历失败')
        }
        const { code, result } = res.data
        if (code !== 200) {
          // this.faultRecordData = this.mockFaultRecordData
          // this.total = this.mockFaultRecordData.length
          return this.$message.error('获取故障履历失败')
        }
        this.faultRecordData = result.data
        this.total = result.total
        if (process.env.NODE_ENV === 'development') {
          if (this.faultRecordData.length < 1 || this.total < 1) {
            this.faultRecordData = this.mockFaultRecordData
            this.total = this.mockFaultRecordData.length
          }
        }
      })
    },
  },
  data() {
    return {
      innerDeviceCode: 0,
      dateObj: {
        startDate: 0,
        endDate: 0,
      },
      offset: 1,
      total: 0,
      limit: 10,
      pageSizes: [10, 20, 30, 50],
      dateRadio: '',
      startDate: null,
      endDate: null,
      mockFaultRecordData: [
        {
          bookId: '330303M05S05', //故障编号
          endTime: 1653532702000, //故障结束时间
          faultLevel: '10', //故障级别
          name: '10月底最后测试数据一条', //故障名称
          professionalAttr: 'M', //专业属性
          reason: '10月底数据一条', //故障原因
          startTime: 1653532702000, //故障开始时间
        },
        {
          bookId: '330303M05S05', //故障编号
          endTime: 1653532702000, //故障结束时间
          faultLevel: '10', //故障级别
          name: '10月底最后测试数据一条', //故障名称
          professionalAttr: 'M', //专业属性
          reason: '10月底数据一条', //故障原因
          startTime: 1653532702000, //故障开始时间
        },
        {
          bookId: '330303M05S05', //故障编号
          endTime: 1653532702000, //故障结束时间
          faultLevel: '10', //故障级别
          name: '10月底最后测试数据一条', //故障名称
          professionalAttr: 'M', //专业属性
          reason: '10月底数据一条', //故障原因
          startTime: 1653532702000, //故障开始时间
        },
      ],
      faultRecordData: [],
    }
  },
  // mounted() {
  //   this.innerDeviceCode = this.deviceCode
  //   this.initFaultRecordData()
  // },
}
</script>

<style></style>
