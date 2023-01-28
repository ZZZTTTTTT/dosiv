<template>
  <div>
    <el-row style="margin-left: 20px; margin-top: 20px">
      <div style="font-weight: bold">异常设备</div>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="12">
        <div style="margin-left: 20px; font-size: 30px; font-weight: bold; color: #3cd2a5">{{ abnormalDeviceCount }}</div>
      </el-col>
      <el-col :span="12">
        <div style="text-align: center"><font-awesome-icon icon="fa-solid fa-bar-chart" style="font-size: 30px; color: #3cd2a5" /></div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; margin-left: 20px; margin-bottom: 20px">
      <div style="color: grey">设备数量 {{ allDeviceCount }}</div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['abnormalDeviceCount', 'allDeviceCount'],
}
</script>

<style></style>
