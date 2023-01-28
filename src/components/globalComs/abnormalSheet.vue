<template>
  <div>
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
    <el-table :data="abnormalSheetData" style="width: 100%">
      <el-table-column prop="taskId" label="工单编号"> </el-table-column>
      <el-table-column prop="relatedAlertNum" label="关联报警"> </el-table-column>
      <el-table-column prop="alertMessage" label="报警信息"> </el-table-column>
      <el-table-column prop="alertLevel" label="报警最高等级"> </el-table-column>
      <el-table-column prop="alertSource" label="报警来源"> </el-table-column>
      <el-table-column prop="specialty" label="专业"> </el-table-column>
      <el-table-column prop="hasDiagnosis" label="是否诊断"> </el-table-column>
      <el-table-column label="诊断报告">
        <template slot-scope="scope">
          <a href="#" class="check" @click="dialogVisible = true">查看</a>
        </template>
        <detailDialog
          @updateValue="updateValue"
          :dialogVisible="dialogVisible"
          :processData="processData"
          :sheetTableData="sheetTableData"
        ></detailDialog>
      </el-table-column>
      <el-table-column prop="taskState" label="工单状态"> </el-table-column>
      <el-table-column prop="hasHang" label="是否挂起"> </el-table-column>
      <el-table-column prop="" label="超时"> </el-table-column>
      <el-table-column prop="" label="处理人"> </el-table-column>
      <el-table-column prop="recCreateTime" label="工单创建时间"> </el-table-column>
      <el-table-column prop="" label="附件"> </el-table-column>
      <el-table-column label="工单追踪">
        <template slot-scope="scope">
          <a href="#" class="check">查看</a>
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
        :total="sheetTotal"
        prev-text="上页"
        next-text="下页"
        :popper-class="themeStyle ? 'select_dark' : 'select_light'"
      />
    </div>
  </div>
</template>

<script>
import detailDialog from '@/components/device/detailDialog'
import { getTicketListByConditionWithPage } from '@/api/device'
export default {
  components: { detailDialog },
  data() {
    return {
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
      queryparams: {
        deviceCode: '',
        domainId: 11111,
        deviceCodeOrName: '', //(编码或者名称):非必须
        startDate: '', //非必须, 工单创建时间范围
        endDate: '', //非必须, 工单创建时间范围
        relatedAlert: '', //非必须
        alertSource: '', //非必须
        specialty: '', //非必须
        limit: 10,
        offset: 0,
      },
      abnormalSheetData: null,
      sheetTotal: null,
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
    getTicketListByConditionWithPage(this.queryparams).then((res) => {
      this.abnormalSheetData = res.data.result.data
      this.sheetTotal = res.data.result.data.length
    })
  },
}
</script>
<style scoped>
table {
  border-collapse: collapse;
  margin: 20px;
}
.check {
  text-decoration: underline !important  ;
}

.check:hover {
  cursor: pointer;
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
a {
  text-decoration: underline;
}
option {
  color: #292d38;
  font-size: 10px;
  background: #fff;
}
</style>

<style scoped>
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .btn-next {
  background: #292d38 !important;
}
.el-pagination span {
  color: rgb(146, 141, 141) !important;
}
.el-pagination.is-background .el-pager .active {
  background: #3cd2a5 !important;
}
</style>
