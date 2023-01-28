<template>
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <template v-for="(item, key) in routerList">
        <el-breadcrumb-item :key="key" :to="item.path" v-if="key + 1 != routerList.length">{{ item.name }}</el-breadcrumb-item>
        <el-breadcrumb-item :key="key" :to="item.path" v-if="key + 1 == routerList.length && (!getSiblings || !getSiblings.length)">{{
          item.name
        }}</el-breadcrumb-item>
        <el-dropdown
          :hide-on-click="false"
          v-if="key + 1 == routerList.length && getSiblings && getSiblings.length"
          :key="key"
          size="small"
          placement="bottom-start"
          @command="handleCommand"
        >
          <div :key="key">
            <el-breadcrumb-item :to="item.path">{{ item.name }}</el-breadcrumb-item>
          </div>
          <el-dropdown-menu slot="dropdown" class="rr">
            <el-dropdown-item v-for="(dm, idx) in getSiblings" :key="idx + '_dropdown'" :command="dm">{{ dm.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
import { getDomainById, getNextLevelNodes } from '@/api/bigscreen'
// import Axios from 'axios';
// import All from './json/alarmNumListData.json'
export default {
  data() {
    return {
      routerList: [],
      sameLevelDomainList: [],
      nodeId: null,
      domain: [],
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    queryDomainId() {
      let params = {
        domainId: this.nodeId,
      }
      getDomainById(params).then((res) => {
        console.log('getDomainById', res)
        let group = []
        let base = []
        this.routerList = []
        for (const item of res.data.result.domainPath.split('/')) {
          group.push(item)
        }
        for (const item of res.data.result.domainNamePath.split('/')) {
          base.push(item)
        }
        group.forEach((item, i) => {
          this.routerList.push({
            id: item,
            name: base[i],
            path: '/bigscreen/' + item,
          })
        })
        this.domain = res.data.result.domainPath.split('/')
        console.log('domain: ', this.domain)
        if (this.domain.length > 1) {
          var domains = this.domain[this.domain.length - 2]
          console.log('domains', domains)
        }else{
          this.sameLevelDomainList = [];
        }
        this.queryDomainIds(domains)
      })
    },
    queryDomainIds(domains) {
      let nodeId = domains
      let params = {
        nodeId,
      }
      this.sameLevelDomainList = [];
      getNextLevelNodes(params).then((res) => {
        console.log(res.data.result);
        this.sameLevelDomainList = res.data.result.filter((item => item.id != nodeId))
        this.sameLevelDomainList.map((item, i) => {
          this.sameLevelDomainList[i].path = '/bigscreen/' + item.id
        })
        console.log('sameLevelDomainList', this.sameLevelDomainList)
        this.$store.commit('setBreadcrumb', this.routerList)
        localStorage.setItem('breadcrumb', JSON.stringify(this.routerList))
        this.$nextTick()
      })
    },
    handleCommand(dm) {
      console.log('dm', dm)
      this.$router.push(dm.path)
      this.$store.commit('setcurrentDomain', dm.id)
    },
  },
  computed: {
    getSiblings() {
      console.log('sameLevelDomainList', this.sameLevelDomainList)
      return this.sameLevelDomainList.filter((el) => el['id'] != this.$route.params.nodeId).sort((a, b) => a.name - b.name)
    },
  },
  watch: {
    $route() {
      this.nodeId = this.$route.params.nodeId // console.log('centerContent, this.nodeId', this.domainId)
      console.log('路由跳转')
      this.queryDomainId()
    },
  },
}
</script>

<style lang="scss" scope>
.breadcrumb {
  letter-spacing: 2px;
  width: 724px;
  height: 40px;
  line-height: 30px;
  margin-left: 10px;
  margin-bottom: 2px;
  background: linear-gradient(270deg, rgba(31, 76, 162, 0) 0%, #1f4ca2 100%);
  opacity: 0.9;
  padding: 8px 10px;
  .el-breadcrumb {
    font-size: 14px;
    line-height: 1.5;
  }
}
.el-breadcrumb__inner {
  color: #3de6ff !important;
  opacity: 1;
  .is-link {
    color: #3de6ff;
    opacity: 1;
  }
  .is-link:hover {
    color: #3de6ff;
    opacity: 1;
    cursor: pointer;
  }
}
.el-breadcrumb__item i {
  color: #3dddff !important;
}
.el-breadcrumb__separator[class*='icon'] {
  margin: 0;
}

.el-dropdown-menu.el-popper.rr {
  border-color: #7ea9f890;
  background-color: #1f4ca2cc;
  border-radius: 0;
  .popper__arrow {
    display: none !important;
  }
  .el-dropdown-menu__item {
    letter-spacing: 2px;
    padding-right: 30px;
    padding-left: 10px;
    color: #3de6ff;
  }
}

.el-message {
  border: none;
  background: #051437aa;
  box-shadow: inset 0px 0px 39px 0px #0492f8;
}
</style>
