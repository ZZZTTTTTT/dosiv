<template>
  <div class="d-flex ai-center jc-around" id="present-time-content">
    <span class="label">北京时间</span>
    <div class="d-flex h-100">
      <template v-for="(ele, idx) in dateArray">
        <div
          :key="idx"
          v-if="ele != ' '"
          class="d-flex jc-center ai-center h-100"
          style="position: relative; width: 2.4rem; padding-left: 3px; margin: 0 1px; background: linear-gradient(180deg, #001741, #2280b9, #001741)"
        >
          <div :class="['date-border-top', idx == 9 ? 'date-border-top-r' : '']"></div>
          <div :class="['date-border-bottom', idx == 9 ? 'date-border-bottom-r' : '']"></div>
          {{ ele }}
        </div>
        <div
          :key="idx"
          v-else
          class="d-flex jc-center ai-center h-100"
          style="position: relative; width: 0.4rem; padding-left: 3px; margin-right: 8px"
        >
          <div class="date-border-top"></div>
          <div class="date-border-bottom"></div>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </template>
    </div>
    <span class="time">{{ time }}</span>
  </div>
</template>

<script>
import { formatTime } from './utils/index.js'
export default {
  data() {
    return {
      timer: null,
      dateArray: formatTime(new Date(), 'yyyy MM dd').split(''),
      time: formatTime(new Date(), 'HH: mm: ss'),
    }
  },

  methods: {
    getTime() {
      this.dateArray = formatTime(new Date(), 'yyyy MM dd').split('')
      this.time = formatTime(new Date(), 'HH: mm: ss')
    },
  },

  mounted() {
    this.timer = setInterval(() => {
      this.getTime()
    }, 1000)
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="scss" scoped>
@import './scss/style.scss';
#present-time-content {
  width: 90%;
  margin: 0 auto;
  border: 1px solid #2280b9;
  letter-spacing: 3px;
  font-size: 20px;
  .label {
    font-size: 16px;
  }
  .date-border-top,
  .date-border-bottom {
    position: absolute;
    border-left: 2px solid #2280b9;
    width: calc(0.4rem + 2px);
    height: 30%;
    top: 0;
    left: -1px;
    top: 0;
  }
  .date-border-bottom {
    top: unset;
    bottom: 0 !important;
  }
  .date-border-top-r,
  .date-border-bottom-r {
    border-right: 2px solid #2280b9;
  }
}
</style>
