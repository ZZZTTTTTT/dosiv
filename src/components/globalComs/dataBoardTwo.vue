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
    <table class="table" style="text-align: center; width: 100%; margin-top: 20px">
      <thead>
        <tr>
          <th>测点</th>
          <th>检测指标</th>
          <th>数值</th>
          <th>上报时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>测点</td>
          <td>TMA温度</td>
          <td>196.25°C</td>
          <td>2022-02-25 10:21:22</td>
          <td style="vertical-align: middle">
            <div class="status">
              <div class="indicator-light-red" />
              <div class="indicator-light-red" />
              <div class="indicator-light-yellow" />
              <div class="indicator-light-blue" />
              <div class="indicator-light-gray" />
            </div>
          </td>
        </tr>
        <tr>
          <td>测点</td>
          <td>TMA温度</td>
          <td>196.25°C</td>
          <td>2022-02-25 10:21:22</td>
          <td style="vertical-align: middle">
            <div class="status">
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
            </div>
          </td>
        </tr>
        <tr>
          <td>测点</td>
          <td>TMA温度</td>
          <td>196.25°C</td>
          <td>2022-02-25 10:21:22</td>
          <td style="vertical-align: middle">
            <div class="status">
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
            </div>
          </td>
        </tr>
        <tr>
          <td>测点</td>
          <td>TMA温度</td>
          <td>196.25°C</td>
          <td>2022-02-25 10:21:22</td>
          <td style="vertical-align: middle">
            <div class="status">
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
            </div>
          </td>
        </tr>
        <tr>
          <td>测点</td>
          <td>TMA温度</td>
          <td>196.25°C</td>
          <td>2022-02-25 10:21:22</td>
          <td style="vertical-align: middle">
            <div class="status">
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
              <div class="indicator-light-gray" />
            </div>
          </td>
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
.table > :not(caption) > * > * {
  padding: 0.5rem 0.5rem;
  font-size: 20px;
  border-bottom: 2px solid #ccc;
}

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

.indicator-light-red {
  height: 0.875rem;
  width: 0.875rem;
  border-radius: 50%;
  background-color: #f85a5a;
}

.indicator-light-gray {
  height: 0.875rem;
  width: 0.875rem;
  border-radius: 50%;
  background-color: gray;
}

.indicator-light-blue {
  height: 0.875rem;
  width: 0.875rem;
  border-radius: 50%;
  background-color: #508bba;
}

.indicator-light-yellow {
  height: 0.875rem;
  width: 0.875rem;
  border-radius: 50%;
  background-color: #ffa13c;
}
</style>
