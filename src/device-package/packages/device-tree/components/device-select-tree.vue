<template>
  <el-form
    :class="{ 'device-form': !inline }"
    class="select-device-tree"
    :inline="inline"
    :model="form"
    :rules="onlyDevice ? {} : rules"
    :label-width="inline ? '' : '80px'"
    label-position="right"
    ref="deviceForm"
    v-loading="formLoading"
  >
    <el-form-item
      v-for="(item, index) in dynamicForm"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
    >
      <el-select
        v-model="form[item.prop]"
        filterable
        placeholder="请选择"
        @change="dynamicChange(item, form[item.prop], index)"
      >
        <el-option v-for="item in item.options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <a v-show="loading && onlyDevice" style="display:inline-block;padding:5px 5px 0 0">
      <i class="el-icon-loading"></i>
    </a>
    <el-form-item label="设备" prop="device">
      <el-select
        v-if="!onlyDevice"
        v-model="form.device"
        filterable
        placeholder="请选择"
        @change="deviceChange"
      >
        <el-option
          v-for="item in deviceOptions"
          :key="item.deviceCode"
          :label="item.name"
          :value="item.deviceCode"
        >
        </el-option>
      </el-select>
      <el-input
        v-else
        v-model="form.device"
        clearable
        placeholder="请输入设备名称或编码"
      ></el-input>
    </el-form-item>
    <el-form-item label="测点" prop="point" v-if="!onlyDevice">
      <el-select v-model="form.point" filterable placeholder="请选择" @change="pointChange">
        <el-option
          v-for="item in pointOptions"
          :key="item.pointId"
          :label="item.pointName"
          :value="item.pointId"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="数据项" prop="kpi" v-if="!onlyDevice">
      <el-select v-model="form.kpi" filterable placeholder="请选择">
        <el-option
          v-for="item in kpiOptions"
          :key="item.kpiId"
          :label="item.kpiName"
          :value="item.kpiId"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name:'DeviceSelectTree',
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
    onlyDevice: {
      type: Boolean,
      default: false,
    },
    initDevice: {
      type: String,
      default:'',
    },
  },
  data() {
    return {
      loading:false,
      form: {
        device: '',
        point: '',
        kpi: '',
      },
      rules: {
        domain: [{ required: true, message: '请选择集团' }],
        base: [{ required: true, message: '请选择基地' }],
        factory: [{ required: true, message: '请选择厂部' }],
        product: [{ required: true, message: '请选择产线' }],
        area: [{ required: true, message: '请选择区域' }],
        device: [{ required: true, message: '请选择设备' }],
        point: [{ required: true, message: '请选择测点' }],
        kpi: [{ required: true, message: '请选择数据项' }],
      },
      deviceOptions: [],
      pointOptions: [],
      kpiOptions: [],
      isShow: {},
      levelObj: {
        baseLevel: 0,
        factoryLevel: 0,
        productionLineLevel: 0,
        areaLevel: 0,
        deviceLevel: 0,
      },
      dynamicForm: [],
      formLoading: false,
      currentDeviceId: '',
    }
  },
  async mounted() {
    this.initOptions( this.initDevice )
  },
  methods: {
    emptyForm( arr ) {
      arr.forEach( item => {
        if ( !this.onlyDevice ) {
          this.form[item] = ''
        } else if ( item !== 'device' ) {
          this.form[item] = ''
        }
      } )
      if ( arr.length == 4 ) {
        this.deviceOptions = []
      }
      this.pointOptions = []
      this.kpiOptions = []
    },
    async dynamicChange( formItem, val, idx ) {
      this.loading = true
      let preOptions = this.dynamicForm[idx].options
      let nameObj = preOptions.find( item => item.id == val )
      const { domainType, deviceCode, name } = nameObj
      const { prop } = formItem
      if ( !domainType ) {
        if ( !this.onlyDevice ) {
          this.form.device = deviceCode
          this.deviceOptions = [{ name: name, deviceCode: deviceCode }]
          this.deviceChange( deviceCode )
        }
        this.dynamicForm = this.dynamicForm.filter( ( item, index ) => index <= idx )
      } else {
        const options = await this.$deviceStore.commit( 'getNextLevelNodes', val, idx )
        let hasDevice = options.every( item => !item.domainType ) || options.length == 0
        let hasProduct = options.some( item => item.domainType == '产线' )
        let hasArea = options.some( item => item.domainType == '区域' )
        let hasFactory = options.some( item => item.domainType == '厂部' )
        if ( hasProduct || hasArea || hasFactory ) {
          let formLength = this.dynamicForm.length
          if ( formLength > idx + 1 ) {
            this.dynamicForm = this.dynamicForm.filter( ( item, index ) => index <= idx + 1 )
          } else {
            let label
            if ( options.some( item => !item.domainType ) ) {
              label = options[0].domainType + '设备'
            } else {
              label = options[0].domainType
            }
            this.dynamicForm.push( {
              label: label,
              prop: String( idx + 1 ),
              options,
            } )
          }
          this.dynamicForm[this.dynamicForm.length - 1].options = options
          let formKeys = Object.keys( this.form )
          let nextIndex = formKeys.findIndex( item => item == prop )
          let nextProp = formKeys[nextIndex + 1]
          this.emptyForm( [ nextProp, 'device', 'point', 'kpi' ] )
        }
        if ( hasDevice ) {
          this.dynamicForm = this.dynamicForm.filter( ( item, index ) => index <= idx )
          this.deviceOptions = options
          this.emptyForm( [ 'device', 'point', 'kpi' ] )
          this.pointOptions = []
          this.kpiOptions = []
        }
      }
      this.loading = false
    },
    async initOptions( initDevice ) {
      try {
        this.formLoading = true
        this.form = this.$options.data().form
        this.$refs.deviceForm.clearValidate()
        this.dynamicForm = []
        const { type, id } = this.$route.params
        this.currentDeviceId = type == 'group' ? id + '&' + 'group' : initDevice
        const allOptions = await this.$deviceStore.commit( 'getSelectOptions', this.currentDeviceId )
        // console.log('allOptions',allOptions);
        const { options, domainArr, deviceCode } = allOptions
        // 设备查询，选择设备组
        if ( !initDevice && this.onlyDevice ) {
          this.dynamicForm = [
            {
              label: options[0][0] ? options[0][0].domainType : options[0].domainType,
              prop: '0',
              options: options[0][0] ? options[0] : options,
            },
          ]
          this.$set( this.form, '0', '' )
          this.formLoading = false
          return
        }
        let tempOptions = JSON.parse( JSON.stringify( options ) )
        tempOptions.reverse()
        if ( domainArr ) {
          let idsArr = initDevice.split( '&' )
          if ( idsArr.length > 1 ) {
            this.deviceOptions = tempOptions[2]
            this.pointOptions = tempOptions[1] || []
            this.kpiOptions = tempOptions[0] || []
          } else {
            this.deviceOptions = tempOptions[1]
            this.pointOptions = tempOptions[0] || []
            this.kpiOptions = tempOptions[0][0] ? tempOptions[0][0].kpiList : []
          }
          this.$set( this.form, 'device', deviceCode )
          this.$set( this.form, 'point', this.pointOptions[0] ? this.pointOptions[0].pointId : '' )
          this.$set(
            this.form,
            'pointName',
            this.pointOptions[0] ? this.pointOptions[0].pointName : '',
          )
          this.$set( this.form, 'kpi', this.kpiOptions[0] ? this.kpiOptions[0].kpiId : '' )
          this.$set( this.form, 'kpiName', this.kpiOptions[0] ? this.kpiOptions[0].kpiName : '' )
          this.$set( this.form, 'unit', this.kpiOptions[0] ? this.kpiOptions[0].unit : '' )
          let otherOptions = tempOptions.slice( idsArr.length > 1 ? 3 : 2 )
          otherOptions.reverse()
          otherOptions.forEach( ( item, index ) => {
            let hasDevice = item.some( i => !i.domainType )
            let hasProduct = item.some( i => i.domainType == '产线' )
            let hasArea = item.some( i => i.domainType == '区域' )
            let hasFactory = item.some( i => i.domainType == '厂部' )
            let hasBase = item.some( i => i.domainType == '基地' )
            let label
            if ( hasArea ) {
              label = '区域'
            }
            if ( hasProduct ) {
              label = '产线'
            }
            if ( hasFactory ) {
              label = '厂部'
            }
            if ( hasBase ) {
              label = '基地'
            }
            if ( hasDevice ) {
              label += '设备'
            }
            let prop = index + ''
            this.dynamicForm.push( {
              label: label,
              prop: prop,
              options: item,
            } )
            this.$set( this.form, prop, domainArr[index] )
          } )
        } else {
          // 选择设备组，并且设备组下无设备，只展示根域
          this.dynamicForm = [
            {
              label: options[0].domainType,
              prop: '0',
              options: options,
            },
          ]
          this.$set( this.form, '0', '' )
        }
        this.formLoading = false
        this.$emit( 'finishLoadData', this.form )
      } catch ( error ) {
        console.error( error )
        this.formLoading = false
        this.$emit( 'finishLoadData', this.form )
      }
    },
    async deviceChange( val ) {
      this.pointOptions = await this.$deviceStore.commit( 'getPointAndKpiListByCondition', {
        deviceCodeList: [val],
        isSignal:false,
      } )
      this.form.point = ''
      this.form.kpi = ''
      this.kpiOptions = []
    },
    async pointChange( val ) {
      this.kpiOptions = this.pointOptions.find( item => item.pointId === val ).kpiList
      this.form.kpi = ''
    },
    validateForm( cb ) {
      this.$refs.deviceForm.validate( valid => {
        if ( valid ) {
          cb( this.reactForm() )
        } else {
          cb( false )
        }
      } )
    },
    reactForm() {
      let dynamicFormLength = this.dynamicForm.length
      let { device, point, kpi } = this.form
      let lastVal = this.form[String( dynamicFormLength - 1 )]
      let lastOptions = this.dynamicForm[dynamicFormLength - 1].options
      let area
      if ( lastVal ) {
        let tempObj = lastOptions.find( item => item.id == lastVal )
        let tempDeviceObj = lastOptions.find( item => item.deviceCode == lastVal )
        let lastObj = tempObj ? tempObj : tempDeviceObj
        const { domainType } = lastObj
        if ( !domainType ) {
          area = this.form[String( dynamicFormLength - 2 )]
          lastOptions = this.dynamicForm[dynamicFormLength - 2].options
        } else {
          area = this.form[String( dynamicFormLength - 1 )]
        }
      } else {
        area = this.form[String( dynamicFormLength - 2 )]
      }
      let areaObj = lastOptions.find( item => item.id == area )
      let deviceObj = this.deviceOptions.find( item => item.deviceCode == device )
      let pointObj = this.pointOptions.find( item => item.pointId == point )
      let kpiObj = this.kpiOptions.find( item => item.kpiId == kpi )
      this.form.areaName = areaObj ? areaObj.name : ''
      this.form.deviceName = deviceObj ? deviceObj.name : ''
      this.form.pointName = pointObj ? pointObj.pointName : ''
      this.form.kpiName = kpiObj ? kpiObj.kpiName : ''
      this.form.unit = kpiObj ? kpiObj.unit : ''
      return Object.assign( this.form, { area } )
    },
    getValues( cb ) {
      cb( this.reactForm() )
    },
    resetForm() {
      this.$refs.deviceForm.resetFields()
      this.dynamicForm.forEach( ( item, index ) => {
        if ( index > 0 ) {
          item.options = []
        }
      } )
    },
  },
  watch: {
    // model: {
    //   deep: true,
    //   handler(newVal) {
    //     this.modelChange(newVal)
    //   }
    // },
    initDevice( newVal ) {
      if ( newVal === this.currentDeviceId ) return
      this.initOptions( newVal )
    },
  },
}
</script>
<style lang="scss" scoped>
.select-device-tree {
  ::v-deep .el-form-item {
    margin-bottom: 18px !important;
  }
}
.device-form .el-select {
  width: 100%;
}
</style>
