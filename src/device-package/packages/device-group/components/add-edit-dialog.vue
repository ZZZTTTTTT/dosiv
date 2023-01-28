<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
    width="40%"
    size="medium"
  >
    <div v-loading="saveLoading">
      <el-form :model="formParam" label-width="90px" size="small" :rules="rules" ref="form">
        <el-form-item label="设备组名称" prop="name">
          <el-input v-model="formParam.name" :disabled="!!formParam.id"></el-input>
        </el-form-item>
        <el-form-item label="设备组说明" prop="description">
          <el-input v-model="formParam.description" type="textarea" placeholder="请输入模板说明，不超过50个字符"></el-input>
        </el-form-item>
        <el-form-item label="设备组属性" prop="attributeLabel">
          <el-select v-model="formParam.attributeLabel">
            <el-option v-for="(item, index) in tempAttrOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属用户" prop="creator">
          <el-input v-model="formParam.creator" clearable :disabled="!!formParam.id"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button @click="handleAdd" style="margin-right: 20px">添加设备</el-button>
      </div>
      <el-table height="400" :row-style="rowStyle" :data="deviceTableData">
        <el-table-column prop="deviceCode" label="设备代码" align="center"> </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" align="center"> </el-table-column>
        <el-table-column prop="deviceTypeName" label="设备类别" align="center"> </el-table-column>
        <el-table-column prop="domainNamePath" :show-overflow-tooltip="true" label="设备路径" align="center"> </el-table-column>
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="row">
            <el-link type="primary" :underline="false" @click="deleteDevice(row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin: 10px 0 0 10px">共 {{ deviceTotal }} 条</div>
      <div class="btns">
        <el-button @click="cancel" style="margin-right: 20px">取消</el-button>
        <el-button @click="onSave">保存</el-button>
      </div>
    </div>
    <!-- 设备查询 -->
    <el-dialog
      class="device-list"
      title="设备查询"
      :visible.sync="deviceVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :append-to-body="true"
      @close="deviceCancel"
      width="60%"
      size="medium"
    >
      <div v-loading="formLoading">
        <DeviceSelectTree :inline="true" onlyDevice ref="selectItem"></DeviceSelectTree>
        <el-form :model="deviceForm" class="device-form" label-width="100" ref="searchForm">
          <el-form-item label="专业项目分类" prop="specialtyCodeList">
            <el-checkbox-group v-model="deviceForm.specialtyCodeList">
              <el-checkbox v-for="(item, index) in specialDeviceOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="管理属性" prop="attrs">
            <el-checkbox v-model="deviceForm.careService">看护服务设备</el-checkbox>
            <el-checkbox v-model="deviceForm.meteringDevice">计量设备</el-checkbox>
            <el-checkbox v-model="deviceForm.specialDevice">特种设备</el-checkbox>
          </el-form-item>
          <el-form-item label="重要程度" class="last-form_item" prop="importanceDegreeCodeList">
            <el-checkbox-group v-model="deviceForm.importanceDegreeCodeList">
              <el-checkbox v-for="(item, index) in importanceDegreeOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <div class="form-btns">
              <el-button type="primary" @click="searchDevice">查 询</el-button>
              <el-button @click="resetDevice">重 置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-dialog">
        <el-table
          ref="deviceTable"
          :data="deviceTableList"
          row-key="deviceCode"
          style="width: 100%"
          height="410"
          class="device-table-list"
          v-loading="deviceLoading"
          @selection-change="deviceDialogSelectionChange"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" align="center"> </el-table-column>
          <el-table-column prop="deviceName" label="设备名称" align="center"> </el-table-column>
          <el-table-column prop="deviceTypeName" label="设备类别" align="center"> </el-table-column>
          <el-table-column prop="mgrAttrs" label="管理属性"> </el-table-column>
          <el-table-column prop="importanceDegree" label="重要程度"> </el-table-column>
          <el-table-column prop="domainNamePath" :show-overflow-tooltip="true" label="设备路径" align="center"> </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
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

      <div slot="footer" class="dialog-footer">
        <el-button @click="deviceCancel">取 消</el-button>
        <el-button @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      deviceLoading: false,
      deviceForm: {
        careService: false,
        meteringDevice: false,
        specialDevice: false,
        specialtyCodeList: [],
        importanceDegreeCodeList: [],
      },
      deviceVisible: false,
      specialDeviceOptions: [],
      importanceDegreeOptions: [],
      deviceTableList: [],
      rules: {
        name: [{ required: true, message: '设备组名称不能为空' }],
        description: [
          { required: true, message: '设备组说明不能为空' },
          { min: 1, max: 50, message: '不能超过50个字符' },
        ],
        attributeLabel: [{ required: true, message: '设备组属性不能为空!' }],
        creator: [{ required: true, message: '所属用户不能为空!' }],
      },
      groupList: [],
      deviceList: [],
      pointList: [],
      kpiNameOptions: [],
      visible: false,
      deviceName: '',
      formParam: {
        id: '',
        name: '',
        description: '',
        attributeLabel: '',
        creator: '',
      },
      deviceTableData: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      formLoading: false,
      saveLoading: false,
      selectedDevice: [],
    }
  },
  created() {
    this.visible = this.dialogVisible
    this.formParam = Object.assign(this.formParam, this.formData)
    this.deviceTableData = JSON.parse(JSON.stringify(this.tableData))
  },
  mounted() {
    this.getSearchDict()
  },
  updated() {
    this.$nextTick(() => {
      this.deviceTableList
        .filter((item) => this.deviceTableData.map((device) => device.deviceCode).includes(item.deviceCode))
        .forEach((row) => {
          this.$refs.deviceTable.toggleRowSelection(row, true)
        })
    })
  },
  computed: {
    tempAttrOptions() {
      return this.$deviceStore.commit('templateAttr')
    },
    nodeId() {
      return this.$route.params.id
    },
    category() {
      return this.$route.params.type
    },
    title() {
      return this.formData.id ? '设备组模板编辑' : '设备组模板新增'
    },
    deviceTotal() {
      return this.deviceTableData.length
    },
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  methods: {
    rowStyle({ row }) {
      if (row.highlight) {
        return {
          color: '#3cd3a6',
        }
      }
    },
    async getSearchDict() {
      try {
        this.formLoading = true
        const res = await this.$deviceStore.commit('getDeviceDictionary')
        const { specialty, importanceDegree } = res
        this.specialDeviceOptions = specialty
        this.importanceDegreeOptions = importanceDegree
        this.formLoading = false
      } catch (error) {
        this.formLoading = false
        this.$message.error(error.msg)
      }
    },
    deleteDevice(row) {
      this.deviceTableData.splice(row.$index, 1)
    },
    isEmpty() {
      const { careService, meteringDevice, specialDevice, specialtyCodeList, importanceDegreeCodeList } = this.deviceForm
      if (!careService && !meteringDevice && !specialDevice && specialtyCodeList.length === 0 && importanceDegreeCodeList.length === 0) {
        this.$message.warning('请选择筛选条件！')
        return true
      }
      return false
    },
    getDeviceList1() {
      this.$refs.selectItem.getValues(async (formValue) => {
        const { area, device } = formValue
        if (!area && !device && this.isEmpty()) {
          this.$message.warning('请选择查询条件！')
        } else {
          try {
            this.deviceLoading = true
            const { pageNum, pageSize } = this.pagination
            const { careService, meteringDevice, specialDevice } = this.deviceForm
            let params = {
              domainId: area,
              deviceCodeOrName: device,
              ...this.deviceForm,
              limit: pageSize,
              offset: (pageNum - 1) * pageSize,
              showCount: true,
            }
            params.careService = careService ? 1 : null
            params.meteringDevice = meteringDevice ? 1 : null
            params.specialDevice = specialDevice ? 1 : null
            const res = await this.$deviceStore.commit('getDeviceListByConditionWithPage', params)
            const { total, data } = res
            this.deviceTableList = data
            this.pagination.total = total
            this.deviceLoading = false
          } catch (error) {
            this.deviceLoading = false
            this.$message.error(error)
          }
        }
      })
    },
    unique(arr, code) {
      const res = new Map()
      return arr.filter((item) => !res.has(item[code]) && res.set(item[code], 1))
    },
    onSubmit() {
      try {
        this.deviceVisible = false
        this.deviceTableData = this.unique(this.deviceTableData.concat(JSON.parse(JSON.stringify(this.selectedDevice))), 'deviceCode')
        this.resetDevice()
      } catch (error) {
        this.$message.error(error.msg)
      }
    },
    deviceDialogSelectionChange(val) {
      this.selectedDevice = val
    },
    resetDevice() {
      this.$refs.selectItem.resetForm()
      this.deviceForm = this.$options.data().deviceForm
      this.deviceTableList = []
      this.pagination = this.$options.data().pagination
    },
    searchDevice() {
      this.pagination.pageNum = 1
      this.getDeviceList1()
    },
    changeCurrentPage(val) {
      this.pagination.pageNum = val
      this.getDeviceList1()
    },
    handleSizeChange(val) {
      this.pagination.pageNum = 1
      this.pagination.pageSize = val
      this.getDeviceList1()
    },
    // 设备查询取消
    deviceCancel() {
      this.$refs.deviceTable.clearSelection()
      this.selectedDevice = []
      this.deviceVisible = false
      this.resetDevice()
    },
    handleAdd() {
      this.deviceVisible = true
    },
    cancel() {
      this.$refs.form.resetFields()
      this.visible = false
      this.$emit('visibleChange', false)
    },
    alertMsg(res) {
      const { failObj, successObj, Desc } = res
      // console.log(failObj, successObj, Desc)
      if (Desc && Desc.toLowerCase() !== 'ok') {
        this.$message.error(Desc)
        return false
      }
      if (failObj && failObj.length > 0) {
        let reason = failObj[0].failDesc + '...'
        this.$alert(`<h3>失败 ${failObj.length} 条，成功 ${successObj.length} 条</h3><div>失败原因：${reason}</div>`, '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          dangerouslyUseHTMLString: true,
        })
        return false
      }
      this.$message.success('操作成功！')
      return true
    },
    onSave() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let deviceCodeList = this.deviceTableData.map((item) => item.deviceCode)
          if (deviceCodeList.length == 0) {
            this.$message.warning('请至少选择一个设备！')
            return
          }
          try {
            this.saveLoading = true
            const { name, description, attributeLabel: attribute, creator, id, code } = this.formParam
            let groupCode, apiName
            if (id) {
              groupCode = code
              apiName = 'updateDeviceGroupByManager'
            } else {
              groupCode = await this.$deviceStore.commit('generateDeviceGroupCode', {})
              apiName = 'addDeviceGroupByManager'
            }
            let params = {
              id,
              code: groupCode,
              creator,
              attribute,
              name,
              description,
              deviceCodeList,
            }
            let res
            res = await this.$deviceStore.commit([apiName], params)
            this.saveLoading = false
            if (this.alertMsg(res)) {
              this.cancel()
              this.$parent.$options.parent.getTemplateList()
              this.$parent.$options.parent.refreshGroupList()
            }
          } catch (error) {
            this.saveLoading = false
          }
        }
      })
    },
  },
  watch: {
    dialogVisible(newVal) {
      this.visible = newVal
    },
    formData: {
      deep: true,
      handler(newVal) {
        this.formParam = Object.assign(this.formParam, newVal)
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      },
    },
    tableData: {
      deep: true,
      handler(newVal) {
        this.deviceTableData = JSON.parse(JSON.stringify(newVal))
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.btns {
  text-align: right;
  margin: 10px 0;
}
::v-deep .el-form-item {
  margin-bottom: 16px;
  .el-form-item__content {
    .el-select {
      width: 100%;
    }
  }
  .el-form-item__label {
    font-size: 13px;
  }
}
::v-deep .el-form-item.last-form_item {
  .el-form-item__content {
    display: flex;
    .form-btns {
      margin-left: auto;
    }
  }
}
.pagination {
  text-align: right;
  margin-top: 20px;
}
// .wrap-dialog {
//   ::v-deep .el-dialog {
//     margin-top: 20px !important;
//     margin-bottom: 20px !important;
//     height: calc(100vh - 40px);
//     overflow: auto;
//   }
// }
</style>
