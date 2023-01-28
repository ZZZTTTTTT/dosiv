<template>
  <div class="realtime">{{ dateYear }} {{ dateDay }}</div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  data() {
    return {
      dateYear: null,
      dateDay: null,
      timer: null,
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      const date = dayjs(new Date())
      this.dateYear = date.format('YYYY-MM-DD')
      this.dateDay = date.format('HH:mm:ss')
    }, 1000)
  },
}
</script>

<style scoped>
.realtime {
  position: absolute;
  bottom: 5px;
  width: 150px;
  right: 0px;
}
</style>
