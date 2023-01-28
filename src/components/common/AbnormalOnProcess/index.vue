<template>
  <div class="four-angle-border">
    <el-row :gutter="10" class="row">
      <el-col :span="12">
        <div class="title">处理中异常</div>
      </el-col>
      <el-col :span="12">
        <div>按钮</div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row">
      <el-col :span="6">
        <span class="number">5</span>
      </el-col>
      <el-col :span="18">折线图</el-col>
    </el-row>
    <el-row :gutter="10" class="row">
      <el-col :span="12">最近30天异常</el-col>
      <el-col :span="12">3</el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>

<style>
.number {
  color: #3cd2a5;
}
.title {
  font-weight: bolder;
  text-align: center;
}
.row {
  height: 33%;
  text-align: center;
}
.four-angle-border {
  background: linear-gradient(to top, #dbdde2, #dbdde2) left top no-repeat, /*上左*/ linear-gradient(to right, #dbdde2, #dbdde2) left top no-repeat,
    /*左上*/ linear-gradient(to left, #dbdde2, #dbdde2) right top no-repeat, /*上右*/ linear-gradient(to bottom, #dbdde2, #dbdde2) right top no-repeat,
    /*上右*/ linear-gradient(to left, #dbdde2, #dbdde2) left bottom no-repeat,
    /*下左*/ linear-gradient(to bottom, #dbdde2, #dbdde2) left bottom no-repeat,
    /*左下*/ linear-gradient(to top, #dbdde2, #dbdde2) right bottom no-repeat,
    /*下右*/ linear-gradient(to left, #dbdde2, #dbdde2) right bottom no-repeat; /*右下*/
  background-size: 2px 16px, 16px 2px, 2px 16px, 16px 2px;
  /* background-color: rgba(36, 56, 128, 0.21); */
}
</style>
