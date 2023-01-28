<template>
  <div>
    <button class="btn-outline-theme">下载</button>

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

    <table class="table" style="text-align: center; width: 100%; margin-top: 20px">
      <thead>
        <tr>
          <th>报告编号</th>
          <th>报告名称</th>
          <th>完成时间</th>
          <th>下次检验时间</th>
          <th>诊断负责人</th>
          <th>专业</th>
          <th>报告结论</th>
          <th>诊断描述</th>
          <th>检修建议</th>
          <th>备注</th>
          <th>报告来源</th>
          <th>上传用户</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td>xx</td>

          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
      </tbody>
    </table>
    <div style="display: flex; justify-content: space-between; margin: 30px">
      <span>显示第 1 至 5 项记录，共 5 项</span>
      <el-pagination
        background
        layout=" prev, pager, next"
        :total="100"
        prev-text="上页"
        next-text="下页"
        :popper-class="themeStyle ? 'select_dark' : 'select_light'"
      />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
}
</script>
<style scoped>
.status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 30%;
  margin: 0 auto;
}
table {
  border-collapse: collapse;
  margin: 20px;
}

input {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  height: 30px;
}

.btn-outline-theme {
  border: 1px solid rgb(42, 168, 118);
  background: rgba(0, 0, 0, 0.1);
  color: rgb(42, 168, 118);
  padding: 10px;
  border-radius: 5px;
}

.btn-outline-theme:hover {
  background-color: rgb(42, 168, 118) !important;
  color: #fff !important;
  transition: 0.7s;
}

.form-select {
  padding: 0.5rem 0.7rem;
  margin-right: 1rem;
  background: transparent;
  color: #fff;
  border-radius: 5px;
}

option {
  color: #292d38;
  font-size: 10px;
  background: #fff;
}
</style>
