<template>
  <BorderWrap style="height: 100%; width: 100%; margin: 0">
    <div style="display: flex; flex-direction: column; justify-content: space-around">
      <div class="subtitledisplay">过去七天报警</div>

      <div>
        <div id="alarmBarChart" class="chart" />
      </div>
    </div>
  </BorderWrap>
</template>

<script>
export default {
  watch: {
    '$store.state.user.themeStyle'(newVal, oldVal) {
      this.$emit('updateConfig')
    },
  },
}
</script>

<style>
.chart {
  /*
  aspect-ratio: 5/3;
  max-height: 220px;*/
  height: 220px;
}

.ringchart {
  height: 150px;
}
</style>
<style scoped>
.subtitledisplay {
  font-size: 20px;
}
</style>
