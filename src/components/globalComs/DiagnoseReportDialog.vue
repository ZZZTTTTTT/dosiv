<template>
  <div style="max-height: 750px; overflow: auto; color: #d2d6d7; font-size: 16px">
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">判定依据</el-col>
      <el-col :span="9">{{ reportDetail.judgmentBasis }} </el-col>
      <el-col :span="3" style="font-weight: bold">注意事项</el-col>
      <el-col :span="9">{{ reportDetail.attentionPoint }}</el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">检测部位</el-col>
      <el-col :span="9">{{ reportDetail.detectionSite }}</el-col>
      <el-col :span="3" style="font-weight: bold">工艺状况</el-col>
      <el-col :span="9">{{ reportDetail.processStatus }}</el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">判断标准</el-col>
      <el-col :span="9">{{ reportDetail.judgmentCriteria }}</el-col>
      <el-col :span="3" style="font-weight: bold">综合状态等级</el-col>
      <el-col :span="9">{{ reportDetail.stateLevel }}</el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">异常部位</el-col>
      <el-col :span="9">{{ reportDetail.abnormalPosition }}</el-col>
      <el-col :span="3" style="font-weight: bold">异常类型</el-col>
      <el-col :span="9">{{ reportDetail.abnormalType }}</el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">综合判定结论</el-col>
      <el-col :span="9">{{ reportDetail.judgmentConclusion }}</el-col>
      <el-col :span="3" style="font-weight: bold">异常处理方案建议</el-col>
      <el-col :span="9">{{ reportDetail.handleAdvise }}</el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">异常现象</el-col>
      <el-col :span="9">{{ reportDetail.abnormalPhenomenon }}</el-col>
      <el-col :span="3" style="font-weight: bold">报告编制人</el-col>
      <el-col :span="9">{{ reportDetail.userName }}</el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">报告提交时间</el-col>
      <el-col :span="21">{{ reportDetail.recCreateTime }}</el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">判断依据图片</el-col>
      <el-col :span="9">
        <span
          v-for="(item, index) in reportDetail.basisUrl"
          :key="index"
          style=" margin-right: 10px"
          class="check"
          @click="downloadImg(item)"
          >图片{{ index + 1 }}</span
        >
      </el-col>
      <el-col :span="3" style="font-weight: bold">附件</el-col>
      <el-col :span="9">
        <span
          v-for="(item, index) in reportDetail.fileUrl"
          :key="index"
          style=" margin-right: 10px"
          class="check"
          @click="downloadAttach(item)"
          >附件{{ index + 1 }}</span
        >
      </el-col>
    </el-row>
    <el-row class="el-row-class">
      <el-col :span="3" style="font-weight: bold">备注</el-col>
      <el-col :span="21">{{ reportDetail.remark }}</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['reportDetail'],
  methods: {
    downloadImg(item) {
      if (item == null || item == undefined || item == '') {
        return this.$message.info('无图片可供下载')
      }
      window.open(item, '_blank')
    },
    downloadAttach(item) {
      if (item == null || item == undefined || item == '') {
        return this.$message.info('无附件可供下载')
      }
      window.open(item, '_blank')
    },
  },
  mounted() {},
}
</script>

<style scoped>
.el-row-class {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
</style>
