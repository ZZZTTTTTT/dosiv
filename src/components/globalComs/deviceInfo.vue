<template>
  <div style="font-size: 14px" class="pane-content">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-row><div class="info-title">设备基本信息</div></el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">设备编号：</el-col>
          <el-col :span="12">{{ deviceInfo.deviceCode }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">设备名称：</el-col>
          <el-col :span="12">{{ deviceInfo.deviceName }}</el-col> </el-row
        ><el-row style="margin-top: 10px">
          <el-col :span="12">所属管理域：</el-col>
          <el-col :span="12">{{ deviceInfo.domainNamePath }}</el-col> </el-row
        ><el-row style="margin-top: 10px">
          <el-col :span="12">设备类型：</el-col>
          <el-col :span="12">{{ deviceInfo.deviceTypeName }}</el-col> </el-row
        ><el-row style="margin-top: 10px">
          <el-col :span="12">接入时间：</el-col>
          <el-col :span="12">{{ deviceInfo.createTime }}</el-col>
        </el-row>

        <el-row><div class="info-title" style="margin-top: 20px">设备属性信息</div></el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">报警是否自动确认：</el-col>
          <el-col :span="12">{{ deviceInfo.alertAutoConfirm }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">生产厂商：</el-col>
          <el-col :span="12">{{ deviceInfo.manufacturer }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">规格型号：</el-col>
          <el-col :span="12">{{ deviceInfo.specModel }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">投产（使用）日期：</el-col>
          <el-col :span="12">{{ deviceInfo.startProductionDate }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">设备重要程度：</el-col>
          <el-col :span="12">{{ deviceInfo.importanceDegree }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">是否特种设备：</el-col>
          <el-col :span="12">{{ deviceInfo.specialDevice }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">专业项目分类：</el-col>
          <el-col :span="12">{{ deviceInfo.deviceSpecialty }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">智维管控设备：</el-col>
          <el-col :span="12">{{ deviceInfo.baoiemControlled }}</el-col>
        </el-row>

        <el-row style="margin-top: 10px">
          <el-col :span="12">是否计量设备：</el-col>
          <el-col :span="12">{{ deviceInfo.meteringDevice }}</el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">是否看护设备：</el-col>
          <el-col :span="12">{{ deviceInfo.careService }}</el-col>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-row>
          <div class="info-title">设备图库</div>
        </el-row>
        <el-row style="margin-top: 10px">图库功能暂未上线</el-row>
      </el-col>
    </el-row>
    <!--
    <el-row>
      <el-row style="margin-top: 20px"><div class="info-title">自定义属性</div></el-row>
      <el-row style="margin-top: 10px">此功能暂未上线</el-row>
    </el-row>-->
  </div>
</template>

<script>
import BorderWrap from '@/components/BorderWrap'
import { findDeviceByDeviceCode } from '@/api/device'
import { getCurrentNodeId } from '@/utils/auth'

export default {
  props: ['deviceCode'],
  computed: {
    innerDeviceCode() {
      return this.deviceCode
    },
  },
  watch: {
    innerDeviceCode(newVal, oldVal) {
      this.initDeviceInfo()
    },
  },
  methods: {
    initDeviceInfo() {
      if (!this.innerDeviceCode) {
        this.innerDeviceCode = getCurrentNodeId()
      }
      const params = {
        deviceCode: this.innerDeviceCode,
      }
      findDeviceByDeviceCode(params).then((res) => {
        if (res.status !== 200 || res.data.code !== 200) {
          this.$message.error('获取设备信息出错，请重试')
          this.deviceInfo = this.mockDeviceInfo
        }
        this.deviceInfo = res.data.result
      })
    },
  },
  components: { BorderWrap },
  data() {
    return {
      deviceInfo: {},
      mockDeviceInfo: {
        deviceCode: 'M45329804',
        deviceId: '811214252189',
        deviceName: '模拟设备',
        deviceTypeName: '模拟设备类型',
        domainNamePath: '宝山基地-dev/炼钢厂-dev/炼钢一产线-dev/炼钢区域一-dev',
        domainPath: '348764527/918825219/583116588/149162588',
        importanceDegree: '一般设备',
        manufacturer: 'abc',
        specModel: 'a200',
        specialDevice: '否',
        startProductionDate: '2022-04-06',
      },
    }
  },
}
</script>

<style>
.info-title {
  color: #3cd2a5 !important;
  font-weight: bold;
  font-size: 14px;
}
</style>
