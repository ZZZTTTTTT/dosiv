<template>
  <div style="max-height: 750px; overflow: auto" class="ticketDialog">
    <el-table :data="alertRecordList">
      <el-table-column prop="handleTime" label="时间"></el-table-column>
      <el-table-column prop="handleResult" label="操作"></el-table-column>
      <el-table-column prop="handlerName" label="用户"></el-table-column>
      <el-table-column prop="taskId" label="相关工单"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getAlertProcessListByAlertId } from '@/api/area'
export default {
  props: ['alertId'],
  data() {
    return {
      currentAlertId: '',
      alertRecordList: [],
    }
  },
  methods: {
    getRecord() {
      const params = {
        alertId: this.currentAlertId,
      }
      getAlertProcessListByAlertId(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取报警处理记录失败')
        }
        if (res.data.code !== 200) {
          return this.$message.error('获取报警处理记录失败')
        }
        this.alertRecordList = res.data.result
        for (let alert of this.alertRecordList) {
          let time = new Date(alert.handleTime)
          alert.handleTime = time.toLocaleString()
        }
      })
    },
  },
  mounted() {
    this.currentAlertId = this.alertId
    this.getRecord()
  },
}
</script>

<style></style>
