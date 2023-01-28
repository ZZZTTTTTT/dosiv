<template>
  <BorderWrap style="height: 100%; margin: 0px">
    <el-row>
      <div class="subtitledisplay">未闭环报警</div>
    </el-row>
    <div class="content">
      <div class="content-top">
        <el-row class="content-top-margin">
          <el-col :span="12"
            ><div class="warn total" style="text-align: center">{{ unclosedData && unclosedData.totalAmount }}</div></el-col
          >
          <el-col :span="12">
            <el-row class="display">
              <div class="displaytext">新产生</div>

              <div style="text-align: center; font-size: 1.5rem" class="warn">{{ unclosedData && unclosedData.newAmount }}</div>
            </el-row>
            <el-row class="display">
              <div class="displaytext">跟踪中</div>

              <div style="text-align: center; font-size: 1.5rem" class="warn">{{ unclosedData && unclosedData.confirmedAmount }}</div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <hr />
      <div class="content-bottom">
        <el-row class="content-bottom-margin">
          <el-col :span="8">
            <el-row><div class="displaytext">注意</div></el-row>
            <el-row
              ><div class="numberdisplay notice">{{ unclosedData && unclosedData.noticeAmount }}</div></el-row
            >
          </el-col>
          <el-col :span="8">
            <el-row><div class="displaytext">警告</div></el-row>
            <el-row
              ><div class="numberdisplay warn">{{ unclosedData && unclosedData.warnAmount }}</div></el-row
            >
          </el-col>
          <el-col :span="8">
            <el-row><div class="displaytext">危险</div></el-row>
            <el-row
              ><div class="numberdisplay danger">{{ unclosedData && unclosedData.dangerAmount }}</div></el-row
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <div class="subtitledisplay">未闭环报警</div> -->
    <!-- <div class="unclosed-block">
      <div class="warn total">30</div>
      <div>
        <div style="display: flex; margin: 10px">
          <div class="right-text">新产生</div>
          <div class="warn right-num">4</div>
        </div>
        <div style="display: flex">
          <div class="right-text">跟踪中</div>
          <div class="warn right-num">26</div>
        </div>
      </div>
    </div> -->
    <!-- <hr /> -->
    <!-- <div class="unclosed-block">
      <div>
        <div class="bottom-text">注意</div>
        <div class="numberdisplay notice" style="text-align: center">18</div>
      </div>
      <div>
        <div class="bottom-text">警告</div>
        <div class="numberdisplay warn">8</div>
      </div>
      <div>
        <div class="bottom-text">危险</div>
        <div class="numberdisplay danger">1</div>
      </div>
    </div> -->
  </BorderWrap>
</template>

<script>
export default {
  props: ['unclosedData'],
}
</script>

<style scoped>
.titledisplay {
  font-size: 25px;
  font-weight: bold;
}

.numberdisplay {
  text-align: center;
  font-weight: bold;
  margin: 10px;
  font-size: 2rem;
}

.danger {
  color: #fa1212;
}

.warn {
  color: #eb810f;
}

.notice {
  color: #fad212;
}

.total {
  font-size: 50px;
  font-weight: bold;
}

.bottom-text {
  text-align: center;
  font-size: 25px;
}

.right-text {
  margin-right: 10px;
  color: rgb(152, 165, 179);
  font-size: 23px;
}

.right-num {
  font-size: 23px;
  font-weight: bold;
}
.unclosed-block {
  display: flex;
  justify-content: space-between;
  margin: 50px;
}
.content {
  height: 84%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content-top,
.content-bottom {
  height: 100%;
  flex: 1;
}
.displaytext {
  text-align: center;
  font-size: 1rem;
}
.content-top-margin {
  margin-top: 20px;
  margin-bottom: 10px;
}
.content-bottom-margin {
  margin-top: 30px;
  margin-bottom: 5px;
}
</style>
