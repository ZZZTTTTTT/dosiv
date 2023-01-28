<template>
  <div>
    <div>
      <div class="d-flex" style="justify-content: space-between; align-items: center">
        <div>
          故障开始时间：
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
            <span>结束日期:</span> <el-date-picker v-model="endDate" type="date"></el-date-picker>
            <span class="input-group-text"><font-awesome-icon icon="fa-solid fa-calendar" /> </span>
          </div>
        </div>
        <button class="btn-outline-theme">查询</button>
        <button class="btn-outline-theme">下载履历</button>
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
    <el-table :data="malfunctionData" style="width: 100%">
      <el-table-column prop="name" label="故障名称"> </el-table-column>
      <el-table-column prop="startTime" label="故障开始时间"> </el-table-column>
      <el-table-column prop="endTime" label="故障结束时间"> </el-table-column>
      <el-table-column prop="faultLevel" label="故障级别"> </el-table-column>
      <el-table-column prop="professionalAttr" label="专业属性"> </el-table-column>
      <el-table-column prop="reason" label="故障原因"> </el-table-column>
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
import { getFaultRecordListByDeviceIdWithPage } from '@/api/device'

export default {
  data() {
    return {
      time: 'week',
      startDate: '',
      endDate: '',
      malfunctionParams: {
        deviceCode: '264504E50_001',
        limit: 1,
        offset: 0,
      },
      malfunctionData: null,
    }
  },
  mounted() {
    getFaultRecordListByDeviceIdWithPage(this.malfunctionParams).then((res) => {
      this.malfunctionData = res.data.result.data
    })
  },
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
}
</script>
<style scoped>
.status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 30%;
  margin: 0 auto;
}
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

.form-select {
  padding: 0.5rem 0.7rem;
  margin-right: 1rem;
  background: transparent;
  color: #fff;
  border-radius: 5px;
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
