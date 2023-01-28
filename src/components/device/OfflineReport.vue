<template>
  <div class="pane-content">
    <el-table :data="offlineReportData" style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="rptNo" label="报告编号"> </el-table-column>
      <!-- <el-table-column prop="rptName" label="报告名称"> </el-table-column> -->
      <el-table-column prop="rptDate" label="报告日期"> </el-table-column>
      <!-- <el-table-column prop="detectionTime" label="下次检验时间"> </el-table-column> -->
      <el-table-column prop="reportor" label="诊断负责人"> </el-table-column>
      <el-table-column prop="specialtyName" label="专业"> </el-table-column>
      <el-table-column prop="conclusion" label="报告结论"> </el-table-column>
      <el-table-column prop="diagnoseDesc" label="诊断描述"> </el-table-column>
      <el-table-column prop="dealOption" label="处理建议"> </el-table-column>
      <!-- <el-table-column prop="comment" label="备注"> </el-table-column> -->
      <el-table-column prop="rptSourceName" label="报告来源"> </el-table-column>
      <!-- <el-table-column prop="uploader" label="上传用户"> </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope"><span class="check" @click="downloadFile(scope.row)">下载</span></template>
      </el-table-column>
    </el-table>
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
import { getOfflineReportListByDeviceCodeWithPage, getOfflineReportFile } from '@/api/device'

function getFileType(file) {
  let filename = file
  let index1 = filename.lastIndexOf('.')
  let index2 = filename.length
  let type = filename.substring(index1 + 1, index2)
  //根据文件后缀 获取base64前缀不同
  switch (type) {
    case 'txt':
      return 'data:text/plain;base64,'
    case 'doc':
      return 'data:application/msword;base64,'
    case 'docx':
      return 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,'
    case 'xls':
      return 'data:application/vnd.ms-excel;base64,'
    case 'xlsx':
      return 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
    case 'pdf':
      return 'data:application/pdf;base64,'
    case 'pptx':
      return 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,'
    case 'ppt':
      return 'data:application/vnd.ms-powerpoint;base64,'
    case 'png':
      return 'data:image/png;base64,'
    case 'jpg':
      return 'data:image/jpeg;base64,'
    case 'gif':
      return 'data:image/gif;base64,'
    case 'svg':
      return 'data:image/svg+xml;base64,'
    case 'ico':
      return 'data:image/x-icon;base64,'
    case 'bmp':
      return 'data:image/bmp;base64,'
  }
}

function saveImg(fileName, base64) {
  let byteCharacters = window.atob(base64.replace(getFileType(fileName), ''))

  let byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  let byteArray = new Uint8Array(byteNumbers)
  let blob = new Blob([byteArray], {
    type: undefined,
  })
  let aLink = document.createElement('a')
  aLink.download = fileName //这里写保存时的图片名称
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
}

export default {
  props: ['deviceCode'],
  watch: {
    deviceCode(newVal, oldVal) {
      this.innerDeviceCode = newVal
      this.initOfflineReportData()
    },
  },
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  data() {
    return {
      tableLoading: false,
      reportSourceDict: [
        {
          value: 'F',
          label: '离线诊断',
        },
        {
          value: 'C',
          label: '在线综合诊断',
        },
        {
          value: 'A',
          label: '离线检测系统（金艺）',
        },
        {
          value: 'B',
          label: '其他',
        },
      ],
      innerDeviceCode: 0,
      offset: 1,
      total: 0,
      limit: 10,
      pageSizes: [10, 20, 30, 50],
      searchKey: '',
      offlineReportData: [],
    }
  },
  methods: {
    downloadFile(row) {
      if (this.deviceCode === null || this.deviceCode === undefined || this.deviceCode === '') {
        return
      }
      const params = {
        deviceCode: this.deviceCode,
        reportNo: row.rptNo,
      }
      getOfflineReportFile(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取离线诊断报告文件失败')
        }
        // console.log(res.data.result)
        let fileType = res.data.result.fileType
        let fileContent = res.data.result.content
        let fileName = '离线诊断报告.' + fileType
        saveImg(fileName, fileContent)
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.offset = 1
      this.initOfflineReportData()
    },
    handleCurrentChange(val) {
      this.offset = val
      this.initOfflineReportData()
    },
    initOfflineReportData() {
      if (this.innerDeviceCode == 0 || this.innerDeviceCode == null || this.innerDeviceCode == undefined) {
        return
      }
      const params = {
        deviceCode: this.innerDeviceCode,
        limit: this.limit,
        offset: this.offset - 1,
      }
      this.tableLoading = true
      getOfflineReportListByDeviceCodeWithPage(params).then((res) => {
        this.tableLoading = false
        if (res.status !== 200) {
          return this.$message.error('获取离线诊断报告失败')
        }
        const { code, result } = res.data
        if (code !== 200) {
          return this.$message.error('获取离线诊断报告失败')
        }
        result.data.forEach((item) => {
          for (let source of this.reportSourceDict) {
            if (item.rptSource == source.value) {
              item.rptSourceName = source.label
            }
          }
        })
        this.offlineReportData = result.data
        this.total = result.total
      })
    },
  },
}
</script>

<style></style>
