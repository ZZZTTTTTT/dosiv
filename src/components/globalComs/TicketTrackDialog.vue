<template>
  <div class="ticketDialog">
    <el-row :gutter="10">
      <el-col :span="12">
        <div style="max-height: 750px; overflow: auto">
          <div v-for="timeline in timeLineList" :key="timeline.nodeId" style="margin-bottom: 10px; margin-left: 20px">
            <p style="font-weight: bold; font-size: 20px">{{ timeline.nodeName }}</p>
            <p>用户：{{ timeline.handlerName }}</p>
            <p>操作：{{ timeline.nodeMethod }}</p>
            <p>时间：{{ timeline.hanleTime }}</p>
            <p v-show="timeline.dataType == 1">详情：{{ timeline.content }}</p>
            <p v-show="timeline.dataType == 2">
              详情：<span :style="{ color: themeStyle ? '#3cd3a6' : 'rgb(48, 136, 244)' }" @click="showDetail(timeline)">查看</span>
            </p>
            <!-- <p
              style="color: rgb(60, 210, 165); cursor: pointer"
              @click="getDetail(timeline)"
              v-show="timeline.nodeName === '工单创建' || timeline.nodeName === '异常处理'"
            >
              详情
            </p> -->
            <hr style="margin-left: -10px" />
          </div>
          <!-- <el-timeline v-for="timeline in timeLineList" :key="timeline.nodeId">
            <el-timeline-item>
              <el-card style="margin-bottom: 5px">
                <p style="font-weight: bold">{{ timeline.nodeName }}</p>
                <p>处理人：{{ timeline.handlerName }}</p>
                <p>开始时间：{{ timeline.recCreateTime }}</p>
                <p>结束时间：{{ timeline.handleTime }}</p>
                <p
                  style="color: rgb(60, 210, 165); cursor: pointer"
                  @click="getDetail(timeline)"
                  v-show="timeline.nodeName === '工单创建' || timeline.nodeName === '异常处理'"
                >
                  详情
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline> -->
        </div>
      </el-col>
      <el-col :span="12">
        <div style="max-height: 750px; overflow: auto">
          <div style="margin-left: 20px" name="工单创建" v-if="currentNodeName === '工单创建'">
            <div class="detailTitle">工单创建详情</div>
            <el-table :data="alertList">
              <el-table-column label="报警编号" prop="alertId"></el-table-column>
              <el-table-column label="报警信息" prop="alertMessage"></el-table-column>
              <el-table-column label="工单编号" prop="taskId"></el-table-column>
            </el-table>
          </div>
          <div style="margin-left: 20px" name="诊断分析" v-if="currentNodeName === '诊断分析'">
            <div class="detailTitle">诊断分析</div>
            <p>
              <el-row>
                <el-col :span="5">判断依据：</el-col>
                <el-col :span="19">{{ currentStepDetail.judgmentBasis }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">检测部位：</el-col>
                <el-col :span="19">{{ currentStepDetail.detectionSite }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">异常部位：</el-col>
                <el-col :span="19">{{ currentStepDetail.abnormalPosition }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">综合判断结论：</el-col>
                <el-col :span="19">{{ currentStepDetail.judgmentConclusion }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">异常现象：</el-col>
                <el-col :span="19">{{ currentStepDetail.abnormalPhenomenon }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">报告提交时间：</el-col>
                <el-col :span="19">{{ currentStepDetail.recCreateTime }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">判断依据图片：</el-col>
                <!-- <el-col :span="19">{{ currentStepDetail.basisUrl }}</el-col> -->
                <el-col :span="19">
                  <span v-if="currentStepDetail.basisUrl == null || currentStepDetail.basisUrl == undefined || currentStepDetail.basisUrl == ''"
                    >无</span
                  ><span v-else class="check" @click="downloadAttach(currentStepDetail.basisUrl)">下载</span>
                </el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">注意事项：</el-col>
                <el-col :span="19">{{ currentStepDetail.attentionPoint }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">工艺状况：</el-col>
                <el-col :span="19">{{ currentStepDetail.processStatus }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">综合状态等级：</el-col>
                <el-col :span="19">{{ currentStepDetail.stateLevel }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">异常类型：</el-col>
                <el-col :span="19">{{ currentStepDetail.abnormalType }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">异常处理方案建议：</el-col>
                <el-col :span="19">{{ currentStepDetail.handleAdvise }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">报告编制人：</el-col>
                <el-col :span="19">{{ currentStepDetail.username }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">上传附件：</el-col>
                <el-col :span="19">
                  <span v-if="currentStepDetail.fileUrl == null || currentStepDetail.fileUrl == undefined || currentStepDetail.fileUrl == ''"
                    >无</span
                  >
                  <span v-else class="check" @click="downloadAttach(currentStepDetail.fileUrl)">下载</span></el-col
                >
              </el-row>
            </p>
          </div>
          <div style="margin-left: 20px" name="维修处理" v-if="currentNodeName === '异常处理' && currentNodeMethod === '维修处理'">
            <div class="detailTitle">维修处理</div>
            <p>
              <el-row>
                <el-col :span="5">异常处理负责人：</el-col>
                <el-col :span="19">{{ currentStepDetail.handlersReh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维修项目名称：</el-col>
                <el-col :span="19">{{ currentStepDetail.itemNameReh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维修开始时间：</el-col>
                <el-col :span="19">{{ currentStepDetail.beginTimeReh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维修完成时间：</el-col>
                <el-col :span="19">{{ currentStepDetail.endTimeReh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维修结果说明：</el-col>
                <el-col :span="19">{{ currentStepDetail.resultExplainReh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">备注：</el-col>
                <el-col :span="19">{{ currentStepDetail.remarksReh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">上传附件：</el-col>
                <el-col :span="19">
                  <span v-if="currentStepDetail.fileReh == null || currentStepDetail.fileReh == undefined || currentStepDetail.fileReh == ''"
                    >无</span
                  >
                  <span v-else class="check" @click="downloadAttach(currentStepDetail.fileReh)">下载</span></el-col
                >
              </el-row>
            </p>
            <!-- <p>异常处理负责人：{{ currentStepDetail.handlersReh }}</p>
            <p>维修项目名称：{{ currentStepDetail.itemNameReh }}</p>
            <p>维修开始时间：{{ currentStepDetail.beginTimeReh }}</p>
            <p>维修完成时间：{{ currentStepDetail.endTimeReh }}</p>
            <p>维修结果说明：{{ currentStepDetail.resultExplainReh }}</p>
            <p>备注：{{ currentStepDetail.remarksReh }}</p>
            <p>附件：<span @click="downloadAttach(currentStepDetail.fileReh)" style="color: rgb(60, 210, 165); cursor: pointer">查看</span></p> -->
          </div>
          <div style="margin-left: 20px" name="维护处理" v-if="currentNodeName === '异常处理' && currentNodeMethod === '维护处理'">
            <div class="detailTitle">维护处理</div>
            <p>
              <el-row>
                <el-col :span="5">异常处理负责人：</el-col>
                <el-col :span="19">{{ currentStepDetail.handlersMah }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维护项目名称：</el-col>
                <el-col :span="19">{{ currentStepDetail.itemNameMah }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维护开始时间：</el-col>
                <el-col :span="19">{{ currentStepDetail.beginTimeMah }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维护完成时间：</el-col>
                <el-col :span="19">{{ currentStepDetail.endTimeMah }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维护结果说明：</el-col>
                <el-col :span="19">{{ currentStepDetail.resultExplainMah }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">备注：</el-col>
                <el-col :span="19">{{ currentStepDetail.remarksMah }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">上传附件：</el-col>
                <el-col :span="19">
                  <span v-if="currentStepDetail.fileMah == null || currentStepDetail.fileMah == undefined || currentStepDetail.fileMah == ''"
                    >无</span
                  >
                  <span v-else class="check" @click="downloadAttach(currentStepDetail.fileMah)">下载</span></el-col
                >
              </el-row>
            </p>
            <!-- <p>异常处理负责人：{{ currentStepDetail.handlersMah }}</p>
            <p>维护项目名称：{{ currentStepDetail.itemNameMah }}</p>
            <p>维护开始时间：{{ currentStepDetail.beginTimeMah }}</p>
            <p>维护完成时间：{{ currentStepDetail.endTimeMah }}</p>
            <p>维护结果说明：{{ currentStepDetail.resultExplainMah }}</p>
            <p>备注：{{ currentStepDetail.remarksMah }}</p>
            <p>附件：<span @click="downloadAttach(currentStepDetail.fileMah)" style="color: rgb(60, 210, 165); cursor: pointer">查看</span></p> -->
          </div>
          <div style="margin-left: 20px" name="无异常" v-if="currentNodeName === '异常处理' && currentNodeMethod === '无异常'">
            <div class="detailTitle">无异常</div>
            <p>
              <el-row>
                <el-col :span="5">异常处理负责人：</el-col>
                <el-col :span="19">{{ currentStepDetail.handlersUnAbh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">处理结果说明：</el-col>
                <el-col :span="19">{{ currentStepDetail.resultExplainUnAbh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">备注：</el-col>
                <el-col :span="19">{{ currentStepDetail.remarksUnAbh }}</el-col>
              </el-row>
            </p>
            <!-- <p>异常处理负责人：{{ currentStepDetail.handlersUnAbh }}</p>
            <p>处理结果说明：{{ currentStepDetail.resultExplainUnAbh }}</p>
            <p>备注：{{ currentStepDetail.remarksUnAbh }}</p> -->
          </div>
          <div style="margin-left: 20px" name="暂不处理" v-if="currentNodeName === '异常处理' && currentNodeMethod === '暂不处理'">
            <div class="detailTitle">暂不处理</div>
            <p>
              <el-row>
                <el-col :span="5">异常处理负责人：</el-col>
                <el-col :span="19">{{ currentStepDetail.handlersUnh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">暂不处理说明：</el-col>
                <el-col :span="19">{{ currentStepDetail.resultExplainUnh }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">备注：</el-col>
                <el-col :span="19">{{ currentStepDetail.remarksUnh }}</el-col>
              </el-row>
            </p>
            <!-- <p>异常处理负责人：{{ currentStepDetail.handlersUnh }}</p>
            <p>暂不处理说明：{{ currentStepDetail.resultExplainUnh }}</p>
            <p>备注：{{ currentStepDetail.remarksUnh }}</p> -->
          </div>
          <div style="margin-left: 20px" name="业务系统反馈" v-if="currentNodeName === '异常处理'">
            <hr style="margin-left: -5px; margin-right: -10px" />
            <div class="detailTitle">业务系统反馈</div>
            <p>
              <el-row>
                <el-col :span="5">异常处理负责人：</el-col>
                <el-col :span="19">{{ feedbackObj.eqmsEvaluateUserName }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">评价等级：</el-col>
                <el-col :span="19">{{ feedbackObj.eqmsDegree }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">评价时间：</el-col>
                <el-col :span="19">{{ feedbackObj.eqmsTallyEvaluateDate }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">异常处理方式：</el-col>
                <el-col :span="19">{{ feedbackObj.eqmsDealMode }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">维修项目名称：</el-col>
                <el-col :span="19">{{ feedbackObj.eqmsFiled5 }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">处理过程：</el-col>
                <el-col :span="19">{{ feedbackObj.eqmsDealProcess }}</el-col>
              </el-row>
            </p>
            <p>
              <el-row>
                <el-col :span="5">评价说明：</el-col>
                <el-col :span="19">{{ feedbackObj.eqmsEvaluate }}</el-col>
              </el-row>
            </p>
            <!-- <p>异常处理负责人：{{ feedbackObj.eqmsEvaluateUserName }}</p>
            <p>评价等级：{{ feedbackObj.eqmsDegree }}</p>
            <p>评价时间：{{ feedbackObj.eqmsTallyEvaluateDate }}</p>
            <p>异常处理方式：{{ feedbackObj.eqmsDealMode }}</p>
            <p>维修项目名称：{{ feedbackObj.eqmsFiled5 }}</p>
            <p>维修履历：此功能暂未上线</p>
            <p>处理过程：{{ feedbackObj.eqmsDealProcess }}</p>
            <p>评价说明：{{ feedbackObj.eqmsEvaluate }}</p> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTicketProcessListByTaskId, findTaskById } from '@/api/area'
export default {
  props: ['taskId'],
  // watch: {
  //   taskId(newVal, oldVal) {
  //     this.currentTaskId = newVal
  //     this.getTrackList()
  //   },
  // },
  data() {
    return {
      eqmsDegreeDict: [
        {
          value: '1',
          label: '正确',
        },
        {
          value: '2',
          label: '基本正确',
        },
        {
          value: '3',
          label: '不正确',
        },
      ],
      feedbackObj: {
        eqmsEvaluateUserName: '',
        eqmsDegree: '1',
        eqmsTallyEvaluateDate: null,
        eqmsDealMode: '',
        eqmsFiled5: '',
        eqmsFiled6: '',
        eqmsDealProcess: '',
        eqmsEvaluate: '',
      },
      defaultFeedbackObj: {
        eqmsEvaluateUserName: '',
        eqmsDegree: '',
        eqmsTallyEvaluateDate: null,
        eqmsDealMode: '',
        eqmsFiled5: '',
        eqmsFiled6: '',
        eqmsDealProcess: '',
        eqmsEvaluate: '',
      },
      currentTaskId: '',
      timeLineList: [],
      currentStepDetail: {},
      currentNodeName: '',
      currentNodeMethod: '',
      alertList: [],
      mockTimeLineList: [
        {
          nodeName: '工单创建',
          nodeMethod: '确认转诊断',
          hanleTime: 1655808414000,
          handlerId: '171465',
          recCreateTime: '2022-06-21 18:46:54',
          dataType: 2,
          handlerName: '王帅',
          nodeId: 733,
          contentType: 'array',
          taskId: '202206211846530001',
          content: [
            {
              alertMessage: '第8条测试',
              alertId: '1008',
              taskId: '202206211846530001',
            },
          ],
        },
        {
          nodeName: '诊断分析',
          nodeMethod: '确认',
          hanleTime: 1655808561000,
          handlerId: '171465',
          recCreateTime: '2022-06-21 18:49:21',
          dataType: 2,
          handlerName: '王帅',
          nodeId: 734,
          contentType: 'map',
          taskId: '202206211846530001',
          content: {
            detectionSite: '检测部位', // 监测部位
            attentionPoint: '注意事项', // 注意事项
            siteOperation: '[{"userId":"171465","userName":"王帅"}]',
            judgmentCriteria: '判断标准', // 判断标准
            processStatus: '工艺状况', // 工艺状况
            handleAdvise: '异常处理方案建议', // 异常处理方案建议
            abnormalType: '异常类型', // 异常类型
            contentId: 50,
            judgmentConclusion: '综合判断结论', // 综合判断结论
            abnormalPosition: '异常部位', // 异常部位
            remark:
              '备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长', // 备注
            reviewer: '[{"userId":"171459","userName":"陆运盛"}]',
            stateLevel: '综合状态等级，不确定返回类型', // 综合状态等级，不确定返回值类型
            judgmentBasis: '判断依据', // 判断依据
            recCreateTime: 1655808561000, // 提交报告时间
            fileUrl: 'http://www.baidu.com', // 附件，链接形式下载
            abnormalPhenomenon: '异常现象', // 异常现象
            basisUrl: 'http://www.baidu.com', // 判断依据图片，链接形式下载
            nodeId: 734,
            taskId: '202206211846530001',
            userName: '报告编制人', // 报告编制人
          },
        },
        {
          nodeName: '诊断审核',
          nodeMethod: '诊断审核',
          hanleTime: 1655808722000,
          handlerId: '171459',
          recCreateTime: '2022-06-21 18:52:02',
          dataType: 0,
          handlerName: '陆运盛',
          nodeId: 735,
          taskId: '202206211846530001',
        },
        {
          nodeName: '异常处理',
          nodeMethod: '无异常',
          hanleTime: 1655809389000,
          handlerId: '171465',
          recCreateTime: '2022-06-21 19:03:09',
          dataType: 2,
          handlerName: '王帅',
          nodeId: 739,
          contentType: 'map',
          taskId: '202206211846530001',
          content: {
            无异常: [
              {
                resultExplainUnAbh: '处理结果说明',
                taskIdUnAbh: '202206211846530001',
                remarksUnAbh:
                  '备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长',
                recCreateTimeUnAbh: 1655809390000,
                fileUnAbh: '',
                contentIdUnAbh: 21,
                nodeIdUnAbh: 739,
                handlersUnAbh: '处理人',
              },
            ],
            业务系统反馈: [
              {
                eqmsEvaluateUserName: '处理负责人',
                eqmsDegree: '2',
                eqmsTallyEvaluateDate: 1655809390000,
                eqmsDealMode: '异常处理方式',
                eqmsFiled5: '维修项目名称',
                eqmsFiled6: '维修履历',
                eqmsDealProcess: '处理过程',
                eqmsEvaluate: '评价说明',
              },
            ],
          },
        },
        {
          nodeName: '异常处理',
          nodeMethod: '维修处理',
          hanleTime: 1655809389000,
          handlerId: '171465',
          recCreateTime: '2022-06-21 19:03:09',
          dataType: 2,
          handlerName: '王帅',
          nodeId: 740,
          contentType: 'map',
          taskId: '202206211846530001',
          content: {
            维修处理: [
              {
                resultExplainReh: '处理结果说明',
                itemNameReh: '项目名称',
                remarksReh:
                  '备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长',
                fileReh: '',
                beginTimeReh: 1655809390000,
                endTimeReh: 1655809390000,
                handlersReh: '处理人',
              },
            ],
            业务系统反馈: [
              {
                eqmsEvaluateUserName: '处理负责人',
                eqmsDegree: '3',
                eqmsTallyEvaluateDate: 1655809390000,
                eqmsDealMode: '异常处理方式',
                eqmsFiled5: '维修项目名称',
                eqmsFiled6: '维修履历',
                eqmsDealProcess: '处理过程',
                eqmsEvaluate: '评价说明',
              },
            ],
          },
        },
        {
          nodeName: '异常处理',
          nodeMethod: '维护处理',
          hanleTime: 1655809389000,
          handlerId: '171465',
          recCreateTime: '2022-06-21 19:03:09',
          dataType: 2,
          handlerName: '王帅',
          nodeId: 741,
          contentType: 'map',
          taskId: '202206211846530001',
          content: {
            维护处理: [
              {
                resultExplainMah: '处理结果说明',
                itemNameMah: '项目名称',
                remarksMah:
                  '备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长',
                fileMah: '',
                beginTimeMah: 1655809390000,
                endTimeMah: 1655809390000,
                handlersMah: '处理人',
              },
            ],
            业务系统反馈: [
              {
                eqmsEvaluateUserName: '处理负责人',
                eqmsDegree: '1',
                eqmsTallyEvaluateDate: 1655809390000,
                eqmsDealMode: '异常处理方式',
                eqmsFiled5: '维修项目名称',
                eqmsFiled6: '维修履历',
                eqmsDealProcess: '处理过程',
                eqmsEvaluate: '评价说明',
              },
            ],
          },
        },
        {
          nodeName: '异常处理',
          nodeMethod: '暂不处理',
          hanleTime: 1655809389000,
          handlerId: '171465',
          recCreateTime: '2022-06-21 19:03:09',
          dataType: 2,
          handlerName: '王帅',
          nodeId: 742,
          contentType: 'map',
          taskId: '202206211846530001',
          content: {
            暂不处理: [
              {
                resultExplainUnh: '处理结果说明',
                remarksUnh:
                  '备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长备注很长',
                fileUnh: '',
                handlersUnh: '处理人',
              },
            ],
            业务系统反馈: [
              {
                eqmsEvaluateUserName: '处理负责人',
                eqmsDegree: '2',
                eqmsTallyEvaluateDate: 1655809390000,
                eqmsDealMode: '异常处理方式',
                eqmsFiled5: '维修项目名称',
                eqmsFiled6: '维修履历',
                eqmsDealProcess: '处理过程',
                eqmsEvaluate: '评价说明',
              },
            ],
          },
        },
        {
          nodeName: '关闭说明',
          nodeMethod: '关闭说明',
          hanleTime: 1655809554000,
          handlerId: '171459',
          recCreateTime: '2022-06-21 19:05:54',
          dataType: 1,
          handlerName: '陆运盛',
          nodeId: 743,
          contentType: 'text',
          taskId: '202206211846530001',
          content: '说明内容：frg',
        },
        {
          nodeName: '关闭确认',
          nodeMethod: '关闭确认',
          hanleTime: 1655809615000,
          handlerId: '171465',
          recCreateTime: '2022-06-21 19:06:55',
          dataType: 0,
          handlerName: '王帅',
          nodeId: 744,
          taskId: '202206211846530001',
        },
      ],
    }
  },
  methods: {
    downloadAttach(url) {
      if (url === null || url === undefined || url === '') {
        return this.$message.info('无附件')
      }
      window.open(url, '_blank')
    },
    // getDetail(timeline) {
    //   const that = this
    //   console.log(timeline)
    //   this.currentNodeName = timeline.nodeName
    //   this.currentNodeMethod = timeline.nodeMethod
    //   const params = {
    //     nodeId: timeline.nodeId,
    //     taskId: timeline.taskId,
    //     nodeName: timeline.nodeName,
    //     nodeMethod: timeline.nodeMethod,
    //   }
    //   // const params = {
    //   //   nodeId: '311',
    //   //   taskId: 'd367daf9fe5e4909bc9a1d7be357d520',
    //   //   nodeName: '异常处理',
    //   //   nodeMethod: '无异常',
    //   // }
    //   findTaskById(params).then((res) => {
    //     if (res.status !== 200) {
    //       return this.$message.error('获取工单节点处理详情失败')
    //     }
    //     if (res.data.code !== 200) {
    //       return this.$message.error('获取工单节点处理详情失败')
    //     }
    //     if (that.currentNodeName === '工单创建') {
    //       that.alertList = res.data.result
    //     } else {
    //       if (res.data.result.length > 0) {
    //         that.currentStepDetail = res.data.result[0]
    //       }
    //     }
    //     // that.currentStepDetail = res.data.result
    //     // that.currentStepDetail.tag = that.currentNodeName
    //     console.log('this.currentStepDetail', this.currentStepDetail)
    //   })
    // },
    showDetail(timeline) {
      if (timeline.nodeName == '工单创建') {
        // this.currentStepDetail = timeline.content
        this.alertList = timeline.content
        this.currentNodeName = timeline.nodeName
        this.currentNodeMethod = timeline.nodeName
      } else if (timeline.nodeName == '诊断分析') {
        this.currentStepDetail = timeline.content
        if (this.currentStepDetail.recCreateTime) {
          let time = new Date(this.currentStepDetail.recCreateTime)
          this.currentStepDetail.recCreateTime = time.toLocaleString()
        }
        this.currentNodeName = timeline.nodeName
        this.currentNodeMethod = timeline.nodeName
      } else if (timeline.nodeName == '异常处理') {
        if (timeline.nodeMethod == '无异常') {
          this.currentStepDetail = timeline.content.无异常[0]
          if (this.currentStepDetail.recCreateTimeUnAbh) {
            let time = new Date(this.currentStepDetail.recCreateTimeUnAbh)
            this.currentStepDetail.recCreateTimeUnAbh = time.toLocaleString()
          }
        }
        if (timeline.nodeMethod == '维修处理') {
          this.currentStepDetail = timeline.content.维修处理[0]
          if (this.currentStepDetail.beginTimeReh) {
            let time = new Date(this.currentStepDetail.beginTimeReh)
            this.currentStepDetail.beginTimeReh = time.toLocaleString()
          }
          if (this.currentStepDetail.endTimeReh) {
            let time = new Date(this.currentStepDetail.endTimeReh)
            this.currentStepDetail.endTimeReh = time.toLocaleString()
          }
        }
        if (timeline.nodeMethod == '维护处理') {
          this.currentStepDetail = timeline.content.维护处理[0]
          if (this.currentStepDetail.beginTimeMah) {
            let time = new Date(this.currentStepDetail.beginTimeMah)
            this.currentStepDetail.beginTimeMah = time.toLocaleString()
          }
          if (this.currentStepDetail.endTimeMah) {
            let time = new Date(this.currentStepDetail.endTimeMah)
            this.currentStepDetail.endTimeMah = time.toLocaleString()
          }
        }
        if (timeline.nodeMethod == '暂不处理') {
          this.currentStepDetail = timeline.content.暂不处理[0]
        }
        this.feedbackObj = timeline.content.业务系统反馈[0]
        if (this.feedbackObj == null || this.feedbackObj == undefined) {
          this.$message.warning('未获取到业务反馈数据')
          this.feedbackObj = this.defaultFeedbackObj
        } else {
          if (this.feedbackObj.eqmsTallyEvaluateDate) {
            let time = new Date(this.feedbackObj.eqmsTallyEvaluateDate)
            this.feedbackObj.eqmsTallyEvaluateDate = time.toLocaleString()
          }
          if (this.feedbackObj.eqmsDegree) {
            this.feedbackObj.eqmsDegree = this.formatEqmsDegree(this.feedbackObj.eqmsDegree)
          }
        }

        this.currentNodeName = timeline.nodeName
        this.currentNodeMethod = timeline.nodeMethod
      }
    },
    formatEqmsDegree(degree) {
      let degreeStr = degree
      for (let item of this.eqmsDegreeDict) {
        if (item.value == degree) {
          degreeStr = item.label
        }
      }
      return degreeStr
    },
    getTrackList() {
      // 暂时使用测试数据
      // this.timeLineList = this.mockTimeLineList
      // for (let item of this.timeLineList) {
      //   if (item.hanleTime) {
      //     let time = new Date(item.hanleTime)
      //     item.hanleTime = time.toLocaleString()
      //   }
      // }
      // return
      const params = {
        taskId: this.currentTaskId,
      }
      getTicketProcessListByTaskId(params).then((res) => {
        if (res.status !== 200) {
          return this.$message.error('获取工单过程跟踪列表失败')
        }
        if (res.data.code !== 200) {
          return this.$message.error('获取工单过程跟踪列表失败')
        }
        this.timeLineList = res.data.result
        if (process.env.NODE_ENV == 'development') {
          if (this.timeLineList.length < 1) {
            this.timeLineList = this.mockTimeLineList
          }
        }
        for (let item of this.timeLineList) {
          if (item.hanleTime) {
            let time = new Date(item.hanleTime)
            item.hanleTime = time.toLocaleString()
          }
        }
        // for (let i = 0; i < this.timeLineList.length; i++) {
        //   let createTime = new Date(this.timeLineList[i].recCreateTime)
        //   this.timeLineList[i].recCreateTime = createTime.toLocaleString()
        //   if (i == this.timeLineList.length - 1) {
        //     this.timeLineList[i].handleTime = this.timeLineList[i].recCreateTime
        //   } else {
        //     let endTime = this.timeLineList[i + 1].recCreateTime
        //     endTime = new Date(endTime)
        //     this.timeLineList[i].handleTime = endTime.toLocaleString()
        //   }
        // }
      })
    },
  },
  mounted() {
    this.currentTaskId = this.taskId
    this.getTrackList()
  },
  computed: {
    themeStyle() {
      return this.$store.state.user.themeStyle
    },
  },
}
</script>

<style scoped>
.detailTitle {
  font-weight: bold;
  font-size: 20px;
}
</style>
