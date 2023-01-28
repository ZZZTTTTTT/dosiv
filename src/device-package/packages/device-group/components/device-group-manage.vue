<template>
  <div class="template-manage">
    <border-box2>
      <div class="template-content">
        <div class="title">设备组信息</div>
        <div class="content">
          <el-form :inline="true" :model="searchParam">
            <el-form-item label="设备组代码">
              <el-select v-model="searchParam.code" filterable clearable placeholder="请选择" @change="codeChange">
                <el-option v-for="(item, index) in groupCodeList" :key="index" :label="item.code" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备组名称">
              <el-input v-model="searchParam.name" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="设备组说明">
              <el-input v-model="searchParam.description" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="设备组属性">
              <el-select v-model="searchParam.attribute" clearable placeholder="请选择">
                <el-option v-for="(item, index) in tempAttrOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备编码">
              <el-input v-model="searchParam.deviceCode" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="创建日期">
              <date-range-quick ref="dateRangeQuick" v-model="dateRange"> </date-range-quick>
            </el-form-item>
            <!-- <el-form-item label="创建人">
                <el-input v-model="userId" style="width: 100px" disabled></el-input>
              </el-form-item> -->
            <el-form-item>
              <el-button @click="onSearch">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="btns">
            <el-button @click="handleAdd">新增</el-button>
            <el-button type="primary" :disabled="deleteDisabled" @click="batchDelete">批量删除</el-button>
            <el-button @click="downloadTemp">模板下载</el-button>
            <el-upload
              style="margin: 0 10px"
              :show-file-list="false"
              action="/ddslp/import/LPDG01/importDeviceGroupModelList"
              :data="{ config: 'lpdg01' }"
              :on-success="uploadSuccess"
              :before-upload="
                () => {
                  importLoading = true
                }
              "
            >
              <el-button :loading="importLoading">批量导入</el-button>
            </el-upload>
            <el-dropdown trigger="click" @command="exportList">
              <el-button> 批量导出<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="selected" :disabled="deleteDisabled">导出选中项</el-dropdown-item>
                <el-dropdown-item command="all">导出全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="table-wrap">
            <div style="display: grid; height: 100%" v-loading="loading">
              <el-table
                :data="tableData"
                :row-key="rowKey"
                :span-method="spanMethod"
                border
                style="margin-top: 10px"
                height="calc(100% - 10px)"
                @selection-change="selectChange"
                ref="groupTable"
              >
                <el-table-column label="设备组代码" prop="deviceGroupCode" align="center"></el-table-column>
                <el-table-column label="设备组名称" prop="deviceGroupName" align="center"></el-table-column>
                <el-table-column label="设备组说明" prop="deviceGroupDescription" align="center"></el-table-column>
                <el-table-column label="设备组属性" prop="deviceGroupAttribute" width="90" :formatter="attrFormat" align="center"></el-table-column>
                <el-table-column label="所属用户" prop="creator" align="center"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" width="90" :formatter="dateFormat" align="center"></el-table-column>
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
                <el-table-column label="设备编码" prop="deviceCode" align="center"></el-table-column>
                <el-table-column label="设备名称" prop="deviceName" align="center"></el-table-column>
                <el-table-column label="设备类别" prop="deviceTypeName" align="center"></el-table-column>
                <el-table-column label="基地" prop="baseName" align="center"></el-table-column>
                <el-table-column label="厂部" prop="factoryName" align="center"></el-table-column>
                <el-table-column label="产线" prop="prodLineName" align="center"></el-table-column>
                <el-table-column label="区域" prop="areaName" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                  <template slot-scope="{ row }">
                    <el-link type="primary" :underline="false" :disabled="row.creator !== userId" @click="handleEdit(row)">编辑</el-link>
                    <el-divider direction="vertical"></el-divider>
                    <el-popconfirm
                      title="确认删除吗？"
                      :disabled="row.creator !== userId"
                      cancel-button-type="primary"
                      @onConfirm="handleDelete(row)"
                    >
                      <el-link slot="reference" type="primary" :disabled="row.creator !== userId" :underline="false">删除</el-link>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>

              <el-pagination
                style="text-align: right; margin-top: 10px"
                prev-text="上页"
                next-text="下页"
                background
                layout="total,sizes,prev, pager, next"
                :page-size="pagination.pageSize"
                :current-page="pagination.pageNum"
                :total="pagination.total"
                @current-change="changeCurrentPage"
                @size-change="handleSizeChange"
                :popper-class="themeStyle ? 'select_dark' : 'select_light'"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <!-- 新增/编辑 -->
      <AddEditDialogVue
        :dialogVisible.sync="dialogVisible"
        @visibleChange="visibleChange"
        :formData="formData"
        :tableData="deviceTableData"
      ></AddEditDialogVue>
    </border-box2>
  </div>
</template>
<script>
import AddEditDialogVue from './add-edit-dialog.vue'

export default {
  name: 'DeviceGroupManage',
  inject: {
    activeTab: {
      from: 'activeTab',
      default: () => ({ exportApi: '' }),
    },
  },
  props: ['deviceGroupApi', 'exportApi'],
  data() {
    return {
      loading: false,
      importLoading: false,
      formData: {},
      searchParam: {
        code: '', //设备组代码
        name: '', //设备组名称
        description: '', //设备组说明
        attribute: '', //设备组属性
        deviceCode: '', //设备代码
      },
      dateRange: [],
      tableData: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      dialogVisible: false,
      spanArr: [],
      deviceTableData: [],
      selectedGroup: [],
      searchedParams: {},
    }
  },
  components: { AddEditDialogVue },
  created() {
    this.deviceGroupApi ? this.$deviceStore.commit('setDeviceGroupApi', this.deviceGroupApi) : null
    this.$deviceStore.commit('setExportApi', this.exportApi || this.activeTab.exportApi)
    this.init()
  },
  computed: {
    tempAttrOptions() {
      return this.$deviceStore.commit('templateAttr')
    },
    groupCodeList() {
      let groupListObj = this.$deviceStore.state.groupList
      return groupListObj && groupListObj.data
    },
    deleteDisabled() {
      return this.selectedGroup.length == 0
    },
    userId() {
      return this.$UserId || ''
    },
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  methods: {
    batchDelete() {
      let authDelete = this.selectedGroup.filter((item) => item.creator == this.userId)
      let noAuthDelete = this.selectedGroup.filter((item) => item.creator !== this.userId)
      this.$confirm(`选中 ${this.selectedGroup.length} 项，可删除 ${authDelete.length} 项，确认删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 删除
        try {
          if (authDelete.length == 0) return
          const res = await this.$deviceStore.commit(
            'deleteDeviceGroup',
            authDelete.map((item) => ({ deviceGroupId: item.deviceGroupId, deviceCode: item.deviceCode }))
          )
          if (res == 'ok') {
            this.getTemplateList()
            this.resetSelection()
            this.refreshGroupList()
            authDelete.forEach((row) => {
              this.$refs.groupTable.toggleRowSelection(row, false)
            })
            this.selectedGroup = noAuthDelete
            this.$message.success('操作成功！')
          } else {
            this.$message.error(res)
          }
        } catch (error) {
          this.$message.error(error.msg ? error.msg : error)
        }
      })
    },
    selectChange(val) {
      this.selectedGroup = val
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      let tempArr = this.spanArr.flat()
      if (tempArr.length == 0) return
      if (columnIndex <= 5) {
        let _row = tempArr[rowIndex].counter
        let _col = _row > 0 ? 1 : 0
        return [_row, _col]
      }
    },
    codeChange(val) {
      this.searchParam.name = this.groupCodeList.find((item) => item.code == val).name
    },
    dateFormat(row, column, cellValue, index) {
      return this.$dayjs(cellValue).format('YYYY/MM/DD HH:mm:ss')
    },
    attrFormat(row, column, cellValue, index) {
      return this.tempAttrOptions.find((item) => item.value == cellValue).label
    },
    init() {
      this.getTemplateList()
    },
    async getTemplateList() {
      try {
        this.loading = true
        const { pageSize, pageNum } = this.pagination
        const [startTime, endTime] = this.dateRange
        this.searchedParams = {
          ...this.searchParam,
          startTime: +new Date(startTime) || undefined,
          stopTime: +new Date(endTime) || undefined,
        }
        let params = {
          ...this.searchedParams,
          limit: pageSize,
          offset: (pageNum - 1) * pageSize,
        }
        const res = await this.$deviceStore.commit('getDeviceListAndDeviceByConditionWithPage', params)
        const { data, total } = res
        let tempObj = []
        data.forEach((item, index) => {
          if (index == 0) {
            tempObj.push({ deviceGroupId: item.deviceGroupId, counter: 1 })
          } else if (item.deviceGroupId == data[index - 1].deviceGroupId) {
            tempObj.forEach((temp) => {
              if (temp.deviceGroupId == item.deviceGroupId) {
                temp.counter++
              }
            })
          } else {
            tempObj.push({ deviceGroupId: item.deviceGroupId, counter: 1 })
          }
        })
        let tempArr = []
        tempObj.forEach((obj) => {
          let { counter, deviceGroupId } = obj
          let newArr = Array(counter - 1).fill({ deviceGroupId, counter: 0 })
          newArr.unshift(obj)
          tempArr.push(newArr)
        })
        this.spanArr = tempArr
        this.tableData = data
        this.pagination.total = total
        this.loading = false
      } catch (error) {
        // console.log(error)
        this.loading = false
        this.$message.error(error.msg)
      }
    },
    refreshGroupList() {
      this.$deviceStore.commit('toggleRefreshGroup')
    },
    async handleEdit(row) {
      let { deviceGroupId, deviceGroupDescription, deviceGroupName, deviceGroupCode, creator, deviceGroupAttribute, deviceCode: rowDeviceCode } = row
      this.formData = {
        id: deviceGroupId,
        code: deviceGroupCode,
        name: deviceGroupName,
        description: deviceGroupDescription,
        attributeLabel: deviceGroupAttribute,
        creator,
      }
      try {
        const res = await this.$deviceStore.commit('getDeviceListByDeviceGroupId', { deviceGroupId })
        const { data } = res
        this.deviceTableData = data.map((item) => {
          let { deviceCode, deviceName, deviceTypeName, baseName, factoryName, prodLineName, areaName } = item
          return {
            deviceCode,
            deviceName,
            deviceTypeName,
            domainNamePath: baseName + '/' + factoryName + '/' + prodLineName + '/' + areaName,
            highlight: rowDeviceCode == deviceCode ? 1 : 0,
          }
        })
      } catch (error) {
        this.$message.error(error.msg)
      }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        const { deviceGroupId, deviceCode } = row
        const res = await this.$deviceStore.commit('deleteDeviceGroup', [{ deviceGroupId, deviceCode }])
        if (res == 'ok') {
          this.getTemplateList()
          this.resetSelection()
          this.refreshGroupList()
          this.$message.success('操作成功！')
        } else {
          this.$message.error(res)
        }
      } catch (error) {
        this.$message.error(error.msg ? error.msg : error)
      }
    },
    handleAdd() {
      this.formData = {
        id: '',
        name: '',
        code: '',
        description: '',
        attributeLabel: '',
        creator: '',
      }
      this.deviceTableData = []
      this.dialogVisible = true
    },
    visibleChange(val) {
      this.dialogVisible = val
    },
    rowKey(row) {
      let { deviceGroupId, deviceCode } = row
      return deviceGroupId + deviceCode
    },
    onSearch() {
      this.pagination.pageNum = 1
      this.getTemplateList()
      this.resetSelection()
    },
    resetSelection() {
      this.selectedGroup = []
      this.$refs.groupTable.clearSelection()
    },
    resetForm() {
      this.searchParam = this.$options.data().searchParam
      this.dateRange = []
      this.pagination.pageNum = 1
      this.getTemplateList()
      this.resetSelection()
    },
    changeCurrentPage(val) {
      this.pagination.pageNum = val
      this.getTemplateList()
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.pageNum = 1
      this.getTemplateList()
    },
    uploadSuccess(res) {
      const { code, message, result } = res
      this.importLoading = false
      if (code != 200) {
        this.$message.error(message)
      } else {
        this.alertMsg(result, 'import')
      }
    },
    async downloadList(fileName, tableData, config) {
      try {
        await this.$deviceStore.commit('exportExcelByConfig', tableData, config)
      } catch (error) {
        this.$message.error(error.msg)
      }
    },
    alertMsg(res, type) {
      const { failObj, successObj } = res
      if (failObj.length > 0) {
        let reason = failObj[0].failDesc + '...'
        this.$alert(`<h3>失败 ${failObj.length} 条，成功 ${successObj.length} 条</h3><div>失败原因：${reason}</div>`, '提示', {
          confirmButtonText: type == 'import' ? '下载失败数据' : '',
          showCancelButton: true,
          cancelButtonText: '关闭',
          type: 'warning',
          dangerouslyUseHTMLString: true,
        }).then(() => {
          if (type == 'import') {
            this.downloadList('设备组-失败数据列表', failObj, 'lpdg02')
          }
        })
      } else {
        this.$message.success('操作成功！')
      }
    },
    downloadTemp() {
      window.open(`/ddslp/download?fileName=设备组模板.xlsx&fileUrl=template/dgTemp.xlsx`)
    },
    exportList(type) {
      let fileName = '设备组列表'
      if (type == 'selected') {
        let tempData = this.selectedGroup.map((item) =>
          Object.assign({}, item, { deviceGroupAttribute: this.$deviceStore.commit('templateAttr', item.deviceGroupAttribute) })
        )
        this.downloadList(fileName, tempData, 'lpdg01')
      } else if (type == 'all') {
        let queryObj = Object.assign({}, this.searchedParams)
        let qStr = `?fileName=${fileName}.xlsx&paramJson=${encodeURIComponent(JSON.stringify(queryObj))}&config=lpdg01`
        let url = `${location.origin}/ddslp/export/LPDG01/getDeviceGroupListAndDeviceByConditionWithPageExport${qStr}`
        window.open(url, '_blank')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.template-manage {
  height: 100%;
  ::v-deep .card {
    height: 100% !important;
    box-sizing: border-box !important;
  }
}
.title {
  height: 40px;
  line-height: 40px;
  color: #fff;
  background: rgba(0, 0, 0, 0.2);
  padding-left: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}
.content {
  flex: 1;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-wrap {
    flex: 1;
    overflow: auto;
  }
}
.btns {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;
}
.template-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
