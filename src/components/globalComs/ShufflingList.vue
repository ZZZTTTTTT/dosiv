<template>
  <BorderWrap style="height: 100%; width: 100%; margin: 0; overflow: hidden">
    <div style="padding: 20px">
      <!-- <dv-scroll-board :config="deviceListMessage" style="width: 500px; height: 500px" /> -->
      <dv-scroll-board :config="deviceListMessage" style="width: 100%; height: 420px" :key="key" />
    </div>
  </BorderWrap>
</template>

<script>
import { basemix } from '@/mixin/base'
export default {
  props: ['deviceListMessage'],
  data() {
    return {
      key: 1,
    }
  },
  mixins: [basemix],
  mounted() {
    this.pieOutlineFunc()
  },
}
</script>

<style scoped>
.dv-scroll-board .header {
  font-size: 1.5rem;
  font-weight: bold;
}
.dv-scroll-board .rows .ceil {
  text-align: center;
}
</style>
