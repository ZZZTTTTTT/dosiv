<template>
  <div id="general-count-content" class="d-flex flex-column jc-around">
    <div v-for="(item, key) in countList" :key="key" class="item">
      <div class="d-flex jc-between line-1">
        <div class="label">{{ item.name }}</div>
        <div class="num">{{ item.count }}</div>
      </div>
      <div class="count-bar-container">
        <div :class="['count-bar', 'bg-' + key]" :style="{ width: item.percent }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from './title'
// import dEchart from '../../echart'
export default {
  props: {
    dataList: {
      type: Array,
    },
  },
  data: function () {
    return {}
  },
  computed: {
    countList() {
      function getTotal(num) {
        return num ? Math.ceil(num * (1 + Math.random())) : 10
      }
      let data = this.dataList.map((el) => {
        el.total = getTotal(el.count || 0)
        el.percent = (el.count / el.total).toFixed(2) * 100 + '%'
        return el
      })

      return data
    },
  },
  components: {
    dTitle: Title,
    // dEchart,
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
#general-count-content {
  padding: 15px 30px 15px 15px;
  .item {
    position: relative;
    letter-spacing: 2px;
    font-size: 14px;
    .line-1 {
      padding-bottom: 10px;
      .label::before {
        content: '';
        padding: 0 2px;
        margin-right: 6px;
        background: #fff;
        background: linear-gradient(180deg, #3de6ff, #1968ff);
        border-radius: 6rem;
      }
      .num {
        color: #3de6ff;
        margin-right: 6px;
      }
    }

    .count-bar-container {
      width: 100%;
      height: 8px;
      background-color: rgba(25, 104, 255, 0.4);
      border-radius: 4rem;
      .count-bar {
        height: 100%;
        border-radius: 4rem;
      }
      .bg-0 {
        background: linear-gradient(270deg, #3de6ff 0%, #1968ff 100%);
      }
      .bg-1,
      .bg-3 {
        background: linear-gradient(270deg, #7547ff 0%, #1829ac 100%);
      }
      .bg-2,
      .bg-4 {
        background: linear-gradient(270deg, #ff7171 0%, #f02970 100%);
      }
    }
  }
}
</style>
