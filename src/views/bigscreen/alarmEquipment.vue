<template>
  <div id="left-num-content">
    <d-title :title="title" :width="'150px'" style="padding-bottom: 10px" />
    <div class="d-flex num-wrap">
      <div v-for="(item, key) in alarmCount" :key="key" class="num-container h-100">
        <div class="num-container-inner d-flex ai-center">
          <span class="num-item">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from './title.vue'
export default {
  props: {
    title: {
      type: String,
      default: '当前告警设备',
    },
    count: {
      type: [String, Number],
      default: '0',
    },
  },

  computed: {
    alarmCount() {
      return this.count || this.count + '' === '0' ? (this.count + '' || '').split('') : ['0']
    },
  },

  components: {
    dTitle: Title,
  },
}
</script>

<style lang="scss" scoped>
@import './scss/style.scss';
#left-num-content {
  padding-left: 12px;
  .num-wrap {
    padding-left: 30px;
    height: calc(100% - 56px);
    .num-container {
      background: linear-gradient(180deg, #23b2ed, #7dd5ed, #0253b8);
      margin-right: 20px;
    }
    .num-container:last-child {
      margin-right: 0;
    }
    .num-container-inner {
      margin: 1px;
      height: calc(100% - 2px);
      background-color: #011f58;
      .num-item {
        font-size: 3.5rem;
        color: #3de6ff;
        padding: 0 1.15rem;
        line-height: 1rem;
      }
    }
  }
}
</style>
