<template>
  <div>
    <button class="accordion-button d-flex" style="justify-content: space-between; cursor: pointer" @click="sheetshow = !sheetshow">
      <p :class="{ textclass: sheetshow }" class="alertinfo">{{ alert.alertMessage }}</p>
      <div class="d-flex" style="transform: translateY(50%)">
        <font-awesome-icon icon="fa-solid fa-angle-down" style="font-size: 16px" :class="{ iconclass: sheetshow }" />
      </div>
    </button>
    <transition>
      <div v-show="sheetshow" style="font-size: 14px">
        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">报警编号</el-col>
          <el-col :span="15">{{ alert.alertId }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">报警来源</el-col>
          <el-col :span="15">{{ alert.alertSourceName }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">报警等级</el-col>
          <el-col :span="15">
            <div v-show="alert.alertLevel == 1" style="color: rgb(60, 210, 165)">正常</div>
            <div v-show="alert.alertLevel == 2" style="color: #FFC600">注意</div>
            <div v-show="alert.alertLevel == 3" style="color: #FF7A18">警告</div>
            <div v-show="alert.alertLevel == 4" style="color: #F75D54">危险</div></el-col
          >
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">检测专业</el-col>
          <el-col :span="15">{{ alert.checkSpecialtyName }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">次数</el-col>
          <el-col :span="15">{{ alert.alertCount }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">关联工单</el-col>
          <el-col :span="15" style="overflow: auto">{{ alert.taskId }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">状态</el-col>
          <el-col :span="15">{{ alert.alertState }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">创建时间</el-col>
          <el-col :span="15">{{ alert.recCreateTime }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">首次报警</el-col>
          <el-col :span="15">{{ alert.firstTime }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">最近报警</el-col>
          <el-col :span="15">{{ alert.recReviseTime }}</el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">附件</el-col>
          <el-col :span="15">
            <span v-for="(item, index) in alert.file" :key="index" style="margin-right: 10px" class="check" @click="downloadAttach(item)"
              >附件{{ index + 1 }}</span
            >
          </el-col>
        </el-row>

        <el-row style="margin-left: 15px; border-bottom: 1px solid #dfe6ec; border-color: #65707a; padding: 10px">
          <el-col :span="9">操作处理</el-col>
          <el-col :span="15"><span @click="viewRecord(alert.alertId)" class="check">处理记录</span></el-col>
        </el-row>
      </div>
    </transition>
    <el-dialog v-if="alertTrackDialogShow" :visible.sync="alertTrackDialogShow" width="60%" top="6vh" :modal="false">
      <alert-track-dialog :alert-id="alert.alertId"></alert-track-dialog>
    </el-dialog>
  </div>
</template>

<script>
import AlertTrackDialog from '@/components/globalComs/AlertTrackDialog.vue'
export default {
  components: {
    AlertTrackDialog,
  },
  props: ['alert'],
  data() {
    return {
      sheetshow: false,
      alertTrackDialogShow: false,
    }
  },
  methods: {
    downloadAttach(item) {
      if (item == null || item == undefined || item == '') {
        return this.$message.info('无附件可供下载')
      }
      window.open(item, '_blank')
    },
    viewRecord(alertId) {
      // console.log('this.alert', this.alert)
      this.alertTrackDialogShow = true
    },
    manageTicket() {
      return this.$message.info('此功能暂未上线')
    },
  },
}
</script>

<style scoped>
.alertinfo {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.alertinfo:hover {
  overflow: visible;
  white-space: inherit;
}
</style>
