<template>
  <h1>页面已跳转</h1>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('app', ['currentDeviceCode', 'currentLevel']),
  },
  mounted() {
    // const url = process.env.VUE_APP_DIAGNOSE_URL + '?token=' + getToken() + '&RToken=' + getRefreshToken()
    let url = `${process.env.VUE_APP_DIAGNOSE_URL}?origin=dos`
    // if (this.currentLevel == '基地' || this.currentLevel == '厂部' || this.currentLevel == '产线' || this.currentLevel == '区域') {
    //   // pass
    // } else {
    //   url = url + '&deviceCode=' + this.currentDeviceCode
    // }
    if (
      this.currentLevel == 'base' ||
      this.currentLevel == '基地' ||
      this.currentLevel == 'factory' ||
      this.currentLevel == '厂部' ||
      this.currentLevel == 'productLine' ||
      this.currentLevel == '产线' ||
      this.currentLevel == 'area' ||
      this.currentLevel == '区域'
    ) {
      // pass
    } else {
      url = url + '&deviceCode=' + this.currentDeviceCode
    }
    window.open(url, '_blank')
    this.$router.push('/real/index')
  },
}
</script>

<style></style>
