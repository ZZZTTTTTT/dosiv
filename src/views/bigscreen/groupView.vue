<template>
  <dv-border-box-7 :color="['#002e76', '#3DDDFF']">
    <transition name="fade" :duration="2000">
      <div class="d-flex flex-wrap jc-start ai-stretch base-container h-100" style="position: relative">
        <!-- <div class="time">数据更新时间：{{ updataTime }}</div> -->
        <template v-for="(item, key) in baseData">
          <div :key="key" class="base-box">
            <div class="h-100 d-flex flex-column jc-center ai-center base-box-inner">
              <div class="base-name" :data-customer="item.domainName">
                {{ item.domainName ? item.domainName : '' }}
              </div>
              <div v-if="routeName == 'base'" class="base-content">监测台数</div>
              <div class="base-count">{{ item['deviceCount'] }}</div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </dv-border-box-7>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    baseData: {
      require: true,
    },
  },
  data() {
    return {
      routeName: this.$route.name,
      // updataTime: '',
    }
  },
  beforeMount() {
    // this.updataTime = moment().format('YYYY-MM-DD HH:mm:ss')
  },
  watch: {
    baseData(n) {
      this.baseData = n
    },
  },
  computed: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.base-container {
  padding: 18px;
}
.base-box {
  width: 25%;
  max-height: 50%;
  background: linear-gradient(180deg, #052e7f 0%, #001337 100%);
  border-image: linear-gradient(180deg, rgba(34, 127, 253, 1), rgba(0, 108, 255, 0.8)) 1 1;
  border-top: 1px solid;
  border-bottom: 1px solid;
  margin-bottom: 12px;
  .base-box-inner {
    border-right: 1px solid;
    border-image: linear-gradient(180deg, #0000, #0000, #36a1ff93, #36a1ff, #36a1ff93, #0000, #0000) 1 1;
  }
  .base-name {
    font-size: 12px;
    color: #fff;
    line-height: 14px;
    padding: 7px 2px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .base-name:hover::after {
    // 关键代码，伪类实现
    content: attr(data-customer);
    position: absolute;
    top: -20px; // 设置位置
    left: 20px; // 设置位置
    background: #f2f2f2;
    box-shadow: 0 2px 4px 0 rgba(56, 62, 71, 0.1);
    border-radius: 2px;
    padding: 2px 6px;
    font-size: 13px;
    background-color: transparent;
    max-width: 90%;
    word-break: break-word;
    white-space: normal;
  }
  .base-content {
    flex-shrink: 1;
    line-height: 12px;
    color: #a5b0c4;
    font-size: 12px;
  }
  .base-count {
    padding: 3px 0 8px;
    color: #3dddff;
    font-size: 18px;
  }
  .base-count-bigger {
    font-size: 18px;
    padding: 5px 0 8px;
  }
}

// .base-box:nth-child(-n+5){
//     margin-bottom: 12px;
// }
.base-box:nth-child(2),
.base-box:nth-child(6) {
  border-left: 1px solid;
}
.base-box:last-child,
.base-box:nth-child(5) {
  border-right: 1px solid;
  .base-box-inner {
    border-right: none;
  }
}
.time {
  height: 15px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 18px;
}
</style>
