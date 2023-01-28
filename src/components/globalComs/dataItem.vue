<template>
  <div class="titledisplay display">
    <div style="font-size: 1.2rem"><slot></slot></div>

    <div class="statisticsData">{{ statisticsData }}</div>
  </div>
</template>

<script>
export default {
  props: ['statisticsData'],
}
</script>

<style scoped>
.titledisplay {
  font-weight: normal;
  margin-left: 10px;
  margin-right: 10px;
}
.configitem {
  display: flex;
  align-items: center;
}
.statisticsData {
  color: #3bd2a5;
}
</style>
