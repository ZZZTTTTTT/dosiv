<template>
  <div>
    <h1>新打开标签至大屏</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  activated() {
    let bigscreenUrl = window.location.href.replace('bigscreenentry', 'bigscreen')
    window.open(bigscreenUrl, '_blank')
    this.$router.push('/real/index')
  },
}
</script>

<style scoped></style>
