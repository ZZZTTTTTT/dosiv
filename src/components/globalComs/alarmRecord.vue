<template>
  <div>
    <div class="d-flex" style="justify-content: space-between; align-items: center">
      <div class="d-flex">
        <div>报告生成时间：</div>
        <el-radio v-model="time" label="day">当日</el-radio>
        <el-radio v-model="time" label="week">本周</el-radio>
        <el-radio v-model="time" label="month">本月</el-radio>
      </div>
      <div class="d-flex">
        <div class="d-flex" style="margin-right: 30px; align-items: center">
          <span style="margin-right: 0px">开始时间:</span> <el-date-picker v-model="startDate" type="date"></el-date-picker>
          <span class="input-group-text"><font-awesome-icon icon="fa-solid fa-calendar" /> </span>
        </div>
        <div class="d-flex" style="align-items: center">
          <span>结束日期:</span> <el-date-picker v-model="startDate" type="date"></el-date-picker>
          <span class="input-group-text"><font-awesome-icon icon="fa-solid fa-calendar" /> </span>
        </div>
      </div>
      <div>
        <button class="btn-outline-theme">查询</button>
        <button class="btn-outline-theme">下载</button>
      </div>
    </div>
    <div class="d-flex" style="margin: 20px; justify-content: space-between">
      <div>
        <select class="form-select">
          <option value="">10</option>
          <option value="">20</option>
          <option value="">30</option>
          <option value="">40</option>
          <option value="">50</option></select
        >记录/页
      </div>
      <div>查询：<input type="text" /></div>
    </div>
    <el-table :data="alarmTableData" style="width: 100%">
      <el-table-column prop="alertId" label="报警编号"> </el-table-column>
      <el-table-column prop="alertSource" label="报警来源"> </el-table-column>
      <el-table-column prop="checkSpecialty" label="检测专业"> </el-table-column>
      <el-table-column prop="alertMessage" label="报警信息"> </el-table-column>
      <el-table-column prop="alertLevel" label="报警级别"> </el-table-column>
      <el-table-column prop="" label="次数"> </el-table-column>
      <el-table-column prop="taskId" label="关联工单"> </el-table-column>
      <el-table-column prop="recReviseTime" label="平台创建时间"> </el-table-column>
      <el-table-column prop="firstTime" label="首次报警"> </el-table-column>
      <el-table-column prop="" label="最近报警"> </el-table-column>
      <el-table-column prop="file" label="附件"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="#" class="check" @click="dialogVisible = true">处理记录</a>
        </template>
        <detailDialog
          @updateValue="updateValue"
          :dialogVisible="dialogVisible"
          :processData="processData"
          :sheetTableData="sheetTableData"
        ></detailDialog>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: space-between; margin: 30px">
      <span>显示第 1 至 5 项记录，共 5 项</span>
      <el-pagination
        background
        layout=" prev, pager, next"
        :total="100"
        prev-text="上页"
        next-text="下页"
        :popper-class="themeStyle ? 'select_dark' : 'select_light'"
      />
    </div>
  </div>
</template>

<script>
import { getAlertListByConditionWithPage } from '@/api/device'
import detailDialog from '@/components/device/detailDialog'

export default {
  components: { detailDialog },
  data() {
    return {
      time: 'week',
      startDate: '',
      endDate: '',
      alarmParams: {
        deviceCode: '',
        domainId: 0,
        deviceCodeOrName: '', //(编码或者名称):非必须
        createTimeFrom: '', //非必须
        createTimeTo: '', //非必须
        firstAlertTimeFrom: '', // 非必须
        firstAlertTimeTo: '', // 非必须
        relatedTicket: '', //非必须
        alertSource: '', //非必须
        specialty: '', //非必须
        limit: 10,
        offset: 0,
      },
      alarmTableData: null,
      dialogVisible: false,
      processData: [
        {
          title: '关闭说明2021-12-2117:55:08 22222',
          handler: '处理人:xxx 33333 ',
          endtime: '任务结束时间:2021-12-2117:55:34',
        },
        { title: '异常处理2021-12-2117:55:08', handler: '处理人:xxx', endtime: '任务结束时间:2021-12-2117:55:34', detail: '详情' },
        { title: '异常处理2021-12-2117:55:08', handler: '处理人:xxx', endtime: '任务结束时间:2021-12-2117:55:34', detail: '详情' },
      ],
      sheetTableData: [
        { num: '111', info: 'xxxxxx' },
        { num: '222', info: 'xxxxxx' },
        { num: '333', info: 'xxxxxx' },
      ],
    }
  },
  methods: {
    updateValue() {
      this.dialogVisible = false
    },
  },
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  mounted() {
    getAlertListByConditionWithPage(this.alarmParams).then((res) => {
      this.alarmTableData = res.data.result.data
    })
  },
}
</script>
<style scoped>
table {
  border-collapse: collapse;
  margin: 20px;
}

input {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  height: 30px;
}
.notice {
  border-bottom: 2px solid #ffa13c !important;
  color: #ffa13c;
}
.form-select {
  padding: 0.5rem 0.7rem;
  margin-right: 1rem;
  background: transparent;
  color: #fff;
  border-radius: 5px;
}

.check {
  text-decoration: underline !important  ;
}

.check:hover {
  cursor: pointer;
}
a {
  text-decoration: underline;
}

.input-group-text {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;

  justify-content: center;
}
option {
  color: #292d38;
  font-size: 10px;
  background: #fff;
}
</style>

<style>
.table > :not(caption) > * > * {
  padding: 0.5rem 0.5rem;
  font-size: 16px;
  border-bottom: 2px solid #ccc;
}
</style>
