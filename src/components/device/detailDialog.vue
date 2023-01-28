<template>
  <el-dialog title="详细信息" :visible.sync="dialogVisible" width="60%" append-to-body>
    <div style="height: 300px; display: flex">
      <div style="padding-right: 20px; margin-right: 20px; border-right: 2px solid #1890ff">
        <el-steps direction="vertical">
          <el-step v-for="(item, index) in processData" :key="index"
            ><template slot="title">
              <div>{{ item.title }}</div>
            </template>
            <template slot="description">
              <div>{{ item.handler }}</div>
              <div>{{ item.endtime }}</div>
              <div class="detail" @click="showDetail">{{ item.detail }}</div>
            </template></el-step
          >
        </el-steps>
      </div>
      <div style="width: 65%">
        <h3>工单创建详情</h3>
        <el-table :data="sheetTableData" style="width: 100%">
          <el-table-column prop="num" label="报警编号" width="width"> </el-table-column>
          <el-table-column prop="info" label="报警信息" width="width"> </el-table-column>
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['dialogVisible', 'processData', 'sheetTableData'],
  methods: {
    cancel() {
      this.$emit('updateValue')
    },
    save() {
      this.$emit('updateValue')
    },
    showDetail() {},
  },
}
</script>

<style scoped>
::v-deep .el-step__icon-inner {
  display: none !important;
}

::v-deep .el-step__line {
  background-color: #1890ff;
}

::v-deep .el-step__head.is-wait {
  color: #1890ff;
  border-color: #1890ff;
}

::v-deep .el-step.is-vertical .el-step__line {
  left: 8px;
}

::v-deep .el-step__icon {
  width: 16px;
  height: 16px;
}
.detail {
  color: #86bcef;
}
::v-deep table {
  color: #080808bf !important;
  background-color: #fff !important;
}
::v-deep .el-table th {
  color: black;
}

::v-deep .el-dialog,
::v-deep .el-dialog__body {
  background: rgb(243, 243, 243);
}
</style>
