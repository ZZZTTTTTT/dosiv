<template>
  <div class="device-search de-flex">
    <el-input v-model.trim="searchValue" clearable @keydown.enter.native="initSearch" placeholder="设备名称/编码"></el-input>
    <el-button @click="initSearch">搜索</el-button>
    <el-dialog
      title="高级搜索"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      @close="cancel"
      width="60%"
      size="medium"
    >
      <el-form :model="form" label-width="120px" ref="searchForm" v-loading="formLoading">
        <el-form-item label="设备名称/编码" prop="deviceCodeOrName">
          <el-input
            v-model.trim="searchValue"
            style="width: 250px"
            @keydown.enter.native.prevent.stop="onSearch"
            clearable
            placeholder="请输入内容..."
          ></el-input>
        </el-form-item>
        <el-form-item label="专业项目分类" prop="specialtyCodeList">
          <el-checkbox-group v-model="form.specialtyCodeList">
            <el-checkbox v-for="(item, index) in specialDeviceOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="管理属性" prop="attrs">
          <el-checkbox v-model="form.careService">看护服务设备</el-checkbox>
          <el-checkbox v-model="form.meteringDevice">计量设备</el-checkbox>
          <el-checkbox v-model="form.specialDevice">特种设备</el-checkbox>
        </el-form-item>
        <el-form-item label="重要程度" prop="importanceDegreeCodeList" class="de-last-form-item">
          <el-checkbox-group v-model="form.importanceDegreeCodeList">
            <el-checkbox v-for="(item, index) in importanceDegreeOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          <div class="de-form-btns">
            <el-button type="primary" @click="onSearch">查 询</el-button>
            <el-button @click="onReset">重 置</el-button>
          </div>
        </el-form-item>
      </el-form>

      <div>
        <el-table :data="tableData" style="width: 100%" height="410" v-loading="tableLoading">
          <el-table-column prop="deviceCode" label="设备编码"> </el-table-column>
          <el-table-column prop="deviceName" label="设备名称"> </el-table-column>
          <el-table-column prop="mgrAttrs" label="管理属性" :formatter="formatVal"> </el-table-column>
          <el-table-column prop="importanceDegree" label="重要程度" :formatter="formatVal"> </el-table-column>
          <el-table-column prop="domainNamePath" label="管理域"> </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="{ row }">
              <el-link type="primary" :underline="false" @click="onSubmit(row)">选 择</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="de-pagination">
          <p>显示第 {{ pageInfo.start }} 至 {{ pageInfo.end }} 项记录，共 {{ total }} 项</p>
          <el-pagination
            prev-text="上页"
            next-text="下页"
            background
            layout="sizes,prev, pager, next"
            :page-size="pagination.pageSize"
            :current-page="pagination.pageNum"
            :total="total"
            @current-change="changeCurrentPage"
            @size-change="handleSizeChange"
            :popper-class="themeStyle ? 'select_dark' : 'select_light'"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchValue: '',
      dialogVisible: false,
      form: {
        careService: false,
        meteringDevice: false,
        specialDevice: false,
        specialtyCodeList: [],
        importanceDegreeCodeList: [],
      },
      formLoading: false,
      specialDeviceOptions: [],
      importanceDegreeOptions: [],
      tableData: [],
      tableLoading: false,
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      total: 0,
    }
  },
  computed: {
    pageInfo() {
      let { pageSize, pageNum } = this.pagination
      let start = (pageNum - 1) * pageSize + 1
      let end = start + this.tableData.length - 1
      return {
        start,
        end,
      }
    },
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
  created() {
    this.getDictionary()
  },
  methods: {
    initSearch() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.onSearch()
      })
    },
    async getDictionary() {
      try {
        this.formLoading = true
        const res = await this.$deviceStore.commit('getDeviceDictionary')
        const { importanceDegree, specialty } = res
        this.importanceDegreeOptions = importanceDegree
        this.specialDeviceOptions = specialty
        this.formLoading = false
      } catch (error) {
        this.formLoading = false
        this.$message.error(error)
      }
    },
    async getDeviceList() {
      try {
        this.tableLoading = true
        const { pageSize, pageNum } = this.pagination
        const { careService, meteringDevice, specialDevice } = this.form
        let params = {
          deviceCodeOrName: this.searchValue,
          ...this.form,
          limit: pageSize,
          offset: (pageNum - 1) * pageSize,
          showCount: true,
        }
        params.careService = careService ? 1 : null
        params.meteringDevice = meteringDevice ? 1 : null
        params.specialDevice = specialDevice ? 1 : null
        const res = await this.$deviceStore.commit('getDeviceListByConditionWithPage', params)
        const { total, data } = res
        this.tableData = data
        this.total = total
        this.tableLoading = false
      } catch (error) {
        // console.log('error',error);
        this.tableLoading = false
        this.$message.error(error.msg ? error.msg : error)
      }
    },
    cancel() {
      this.dialogVisible = false
    },
    onSubmit(row) {
      this.$parent.setSelectedNode({ category: 'device',domainType:'device', ...row })
      this.cancel()
    },
    isEmpty() {
      const { careService, meteringDevice, specialDevice, specialtyCodeList, importanceDegreeCodeList } = this.form
      if (
        !this.searchValue &&
        !careService &&
        !meteringDevice &&
        !specialDevice &&
        specialtyCodeList.length === 0 &&
        importanceDegreeCodeList.length === 0
      ) {
        this.$message.warning('请选择筛选条件！')
        return true
      }
      return false
    },
    onSearch() {
      this.pagination.pageNum = 1
      if (this.isEmpty(this.form)) {
        this.tableData = []
      } else {
        this.getDeviceList()
      }
    },
    onReset() {
      this.searchValue = ''
      this.form = this.$options.data().form
      this.tableData = []
      this.total = 0
    },
    changeCurrentPage(pageNum) {
      this.pagination.pageNum = pageNum
      this.getDeviceList()
    },
    handleSizeChange(pageSize) {
      this.pagination.pageNum = 1
      this.pagination.pageSize = pageSize
      this.getDeviceList()
    },
    formatVal(row, column, cellValue, index) {
      return cellValue || '-'
    },
  },
}
</script>
