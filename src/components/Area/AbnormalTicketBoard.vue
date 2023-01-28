<template>
  <div>
    <button class="accordion-button d-flex" style="justify-content: space-between; cursor: pointer" @click="sheetshow = !sheetshow">
      <p :class="{ textclass: sheetshow }">工单编号: {{ ticket.taskId }}</p>
      <div class="d-flex" style="transform: translateY(40%)">
        <font-awesome-icon icon="fa-solid fa-angle-down" style="font-size: 16px" :class="{ iconclass: sheetshow }" />
      </div>
    </button>
    <transition>
      <div v-show="sheetshow">
        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">报警信息</el-col>
          <el-col :span="15">{{ ticket.alertMessage }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">关联报警数量</el-col>
          <el-col :span="15">{{ ticket.relatedAlertNum }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">报警来源</el-col>
          <el-col :span="15">{{ ticket.alertSourceName }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">报警最高等级</el-col>
          <el-col :span="15">
            <div v-show="ticket.alertLevel == 1" style="color: rgb(60, 210, 165)">正常</div>
            <div v-show="ticket.alertLevel == 2" style="color: #ffc600">注意</div>
            <div v-show="ticket.alertLevel == 3" style="color: #ff7a18">警告</div>
            <div v-show="ticket.alertLevel == 4" style="color: #f75d54">危险</div>
          </el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">专业</el-col>
          <el-col :span="15">{{ ticket.checkSpecialtyName }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">是否诊断</el-col>
          <el-col :span="15">{{ ticket.hasDiagnosis }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">诊断报告</el-col>
          <el-col :span="15"><span class="check" @click="viewReport(ticket)">查看</span></el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">工单状态</el-col>
          <el-col :span="15">{{ ticket.taskState }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">处理人</el-col>
          <el-col :span="15">{{ ticket.handleName }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">创建时间</el-col>
          <el-col :span="15">{{ ticket.recCreateTime }}</el-col>
        </el-row>

        <!-- <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">附件</el-col>
          <el-col :span="15">
            <span v-if="ticket.file == null || ticket.file == undefined || ticket.fill == ''">无</span>
            <span v-else style="color: rgb(60, 210, 165); cursor: pointer" @click="downloadAttach(ticket.file)">下载</span></el-col
          >
        </el-row> -->

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">工单追踪</el-col>
          <el-col :span="15"><span @click="viewTrack(ticket)" class="check">查看</span></el-col>
        </el-row>
      </div>
    </transition>
    <el-dialog append-to-body v-if="ticketTrackDialogShow" :visible.sync="ticketTrackDialogShow" width="80%" top="6vh" :modal="true">
      <ticket-track-dialog :task-id="currentTaskId"></ticket-track-dialog>
    </el-dialog>
    <el-dialog title="诊断履历详情" append-to-body v-if="diagnoseReportShow" :visible.sync="diagnoseReportShow" width="70%" top="6vh" :modal="true">
      <diagnose-report-dialog :report-detail="reportDetail"></diagnose-report-dialog>
    </el-dialog>
  </div>
</template>

<script>
import DiagnoseReportDialog from '@/components/globalComs/DiagnoseReportDialog.vue'
import { findDiagnosisReportByTaskId } from '@/api/area'

export default {
  props: ['ticket'],
  components: {
    DiagnoseReportDialog,
  },
  data() {
    return {
      sheetshow: false,
      ticketTrackDialogShow: false,
      diagnoseReportShow: false,
      currentTaskId: '',
      reportDetail: {},
      mockReportDetail: {
        detectionSite: '检测部位', // 监测部位
        attentionPoint: '注意事项', // 注意事项
        siteOperation: '[{"userId":"171465","userName":"王帅"}]',
        judgmentCriteria: '判断标准', // 判断标准
        processStatus: '工艺状况', // 工艺状况
        handleAdvise: '异常处理方案建议', // 异常处理方案建议
        abnormalType: '异常类型', // 异常类型
        contentId: 50,
        judgmentConclusion: '综合判断结论', // 综合判断结论
        abnormalPosition: '异常部位', // 异常部位
        remark:
          '备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长', // 备注
        reviewer: '[{"userId":"171459","userName":"陆运盛"}]',
        stateLevel: '综合状态等级，不确定返回类型', // 综合状态等级，不确定返回值类型
        judgmentBasis: '判断依据', // 判断依据
        recCreateTime: 1655808561000, // 提交报告时间
        fileUrl: 'http://www.google.com,http://www.baidu.com', // 附件，链接形式下载
        abnormalPhenomenon: '异常现象', // 异常现象
        basisUrl: 'http://www.baidu.com,http://www.google.com', // 判断依据图片，链接形式下载
        nodeId: 734,
        taskId: '202206211846530001',
        userName: '报告编制人', // 报告编制人
      },
    }
  },
  methods: {
    downloadAttach(file) {
      if (file == null || file == undefined || file == '') {
        return this.$message.info('无附件')
      }
      window.open(file, '_blank')
    },
    viewReport(ticket) {
      const taskId = ticket.taskId
      if (taskId == null || taskId == undefined || taskId == '') {
        return
      }
      const params = {
        taskId,
      }
      findDiagnosisReportByTaskId(params).then((res) => {
        if (res.status !== 200 || res.data.code !== 200) {
          return this.$message.error('获取诊断报告失败')
        }
        let result = res.data.result
        if (typeof result == 'string' && result.indexOf('无诊断报告') != -1) {
          return this.$message.info(result)
        } else {
          if (process.env.NODE_ENV == 'development') {
            if (result == null || result == undefined) {
              result = this.mockReportDetail
            }
          }
          this.reportDetail = result
          let fileStr = this.reportDetail.fileUrl
          let fileArr = fileStr.split(',')
          this.reportDetail.fileUrl = fileArr
          let imgStr = this.reportDetail.basisUrl
          let imgArr = imgStr.split(',')
          this.reportDetail.basisUrl = imgArr
          if (this.reportDetail.recCreateTime) {
            let timeStr = new Date(this.reportDetail.recCreateTime)
            timeStr = timeStr.toLocaleString()
            this.reportDetail.recCreateTime = timeStr
          }
          this.diagnoseReportShow = true
        }
      })
    },
    viewTrack(ticket) {
      this.currentTaskId = ticket.taskId
      this.ticketTrackDialogShow = true
    },
  },
}
</script>

<style>
.el-dialog__title {
  /* color: #d2d6d7; */
  font-weight: bold;
}
.el-checkbox {
  color: #161717;
}
</style>
