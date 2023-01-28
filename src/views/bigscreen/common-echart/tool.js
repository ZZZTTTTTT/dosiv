import moment from 'moment';
import Vue from 'vue';
const MONTH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

/** 获取上个月第一天以及最后一天日期 */
export function getStartEndDayOfLastMonth(){
    let date = moment().subtract(1, 'month');
    let start = date.startOf('month').format('yyyy-MM-DD');
    let end = date.endOf('month').format('yyyy-MM-DD');
    return [ start, end ];
}


/** 设置传参的limit数量，默认10 */
export function getBlockLimit( limit = 10){
    return {
        '__blocks__':{
            'result':{
                'attr':{
                    'limit': limit,
                    'offset': '0',
                    'showCount': 'true'
                }
            }
        }
    }
}

/**
 * 根据日期数组获取对应的月份数组
 * 主要用于echarts图坐标轴显示
 * eg: ['2020-12', '2021-01', '2021-01']
 * out：['十二月', '一月', '二月']
  */
export function getMonthMap( arr = [] ){
    return arr.map( el => MONTH[moment( el ).month()] );
}

/** 根据domain信息获取当前要跳转的路由参数 */
export function getRouterParamsByDomainInfo( domainInfo ){
    if(domainInfo && typeof domainInfo == 'object' && !Array.isArray(domainInfo) ) {
        let routerLevelMap = {
            'group': 'home',
            'base': 'base',
            'factory': 'base',
            'prodLine': 'prodLine'
        };
        let res = {'name': routerLevelMap[domainInfo['DOMAIN_LEVEL']], params: { id: domainInfo['DOMAIN_ID'] }};
        if(res.name == 'home') delete res.params;
        return res;
    }
    return null;
}


/**
 * 快捷选择今日，本周，本月，上月
 */
export function getToday(){
    const end = new Date()
    const start = new Date()
    return [start,end]
}
export function getThisWeek(){
    const start = new Date()
    const end = new Date()
    const nows = start.getDay() || 7
    start.setTime(start.getTime() - 3600 * 1000 * 24 * ((nows - 1)))
    return [start,end]
}
export function getThisMonth(){
    const end = new Date()
    const start = new Date()
    start.setDate(1)
    return [start,end]
}
export function getLastMonth(){
    const oDate = new Date();
    var year = oDate.getFullYear();
    var month = oDate.getMonth();
    var start, end;
    if (month == 0) {
        year--
        start = new Date(year, 12, 1)
        end = new Date(year, 12, 31)
    } else {
        start = new Date(year, month - 1, 1)
        end = new Date(year, month, 0);
    }
    return [start,end]
}

// 根据 domains 获取 domainId
export function domains2domainId(domains){
    return domains.slice(0,-1).split("/")[domains.slice(0,-1).split("/").length-1];
}


// 节流
export function throttle(callback,wait){
    // 定义开始时间
    let start=0;
    // 返回结果是一个函数
    return function(e){
        let now = Date.now();
        if(now-start>=wait){
            // 如果满足条件，则执行回调函数
            callback.call(this,e);
            // 修改开始时间
            start=now;
        }
    }
}

//防抖
export function debounce(callback,time){
    // 定时器变量
    let timeId=null;
    return function(e){
        if(timeId !==null){
            // 清空定时器
            clearTimeout(timeId);
        }
        // 启动定时器
        timeId = setTimeout(()=>{
            // 执行回调
            callback.call(this,e);
            // 重置定时器
            timeId=null;
        },time);
    }
}

// 回调地址
export function getCallbackUrl(){
    var host = "eplattest.baoiem.com"
    var callbackUrl = Vue.prototype.$localCallbackUrl
    if(window.location.host == "eplattest.baoiem.com"){
        callbackUrl = Vue.prototype.$testCallbackUrl
    }else if(window.location.host == "eplat.baoiem.com"){
        callbackUrl = Vue.prototype.$prodCallbackUrl
        host = "eplat.baoiem.com"
    }
    return {
        host:host,
        callbackUrl:callbackUrl
    }
}

// 重定向地址
export function getRedirectUrl(){
    var host = "eplattest.baoiem.com"
    var Url = Vue.prototype.$localRedirectUrl
    if(window.location.host == "eplattest.baoiem.com"){
        Url = Vue.prototype.$testRedirectUrl
    }else if(window.location.host == "eplat.baoiem.com"){
        Url = Vue.prototype.$prodRedirectUrl
        host = "eplat.baoiem.com"
    }
    return {
        host:host,
        Url:Url
    }
}

// 格式化x轴 formatter
export function formateX(val){
    if(!val) return val;
    let arr = (val + '').split('');
    if(arr.length>10){
        for(let i=0; i < 10; i+=2) {
            if(!( (/[a-z0-9]/i).test(arr[i]) && (/[a-z0-9]/i).test(arr[i+1]))) {
                arr[i] = arr[i] + arr[i+1];
                arr[i+1] = ""
            }
        }
        arr=arr.slice(0,10)
        arr[9] = "..."
    }
    if(arr.length>=5 && arr.length<=10){
        for(let i=0; i < arr.length-1; i+=2) {
            if(!( (/[a-z0-9]/i).test(arr[i]) && (/[a-z0-9]/i).test(arr[i+1]))) {
                if(i>1&&(/[a-z0-9]/i).test(arr[i-1])){
                    arr[i] ='\n' + arr[i] + arr[i+1] +  '\n';
                }else{
                    arr[i] = arr[i] + arr[i+1] +  '\n';
                }
                arr[i+1] = ""
            }
        }
    }
    if(arr.length <5){
        for(let i=0; i < arr.length-1; i++) {
            if(!( (/[a-z0-9]/i).test(arr[i]) && (/[a-z0-9]/i).test(arr[i+1]))) {
                arr[i] += '\n';
            }
        }
    }
    return arr.join('');
}

// 获取HOST和url
export function getHostAndUrl(){
    var res = {
        IP:"10.70.70.72:8080",
        // HOST:"finereporttest.baoiem.com",
        HOST:"http://10.70.70.72:8080",
        url:"https://eplattest.baoiem.com/eplat/"
    }
    var host = window.location.host
    if(host == "eplat.baoiem.com"){
        res.IP="10.80.12.9:8080"
        res.HOST="https://finereport.baoiem.com"
        res.url="https://eplat.baoiem.com/eplat/"
    }
    return res
}