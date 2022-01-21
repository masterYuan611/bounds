<template>
  <div class="main">
    <a-spin
      tip="加载中..."
      size="large"
      :spinning="spinningFlag"
    >
      <div class="searchDiv transactionDetailsPage">
        <div class="cxLeftDiv">
          <ul>
            <li>
              <span>债券搜索</span>
              <AutoComplete
                style="width: 100%;"
                v-model="searchData.searchInfo.key_word"
              />
            </li>
            <li>
              <span>成交人</span>
              <a-input
                v-model="searchData.searchInfo.operator_name"
                placeholder="请输入成交人"
                style="width: 65%;margin-right:0px;text-align:left;"
                allow-clear
              ></a-input>
            </li>
            <li>
              <span>起始时间</span>
              <a-date-picker
                v-model="searchData.searchInfo.beg_d"
                placeholder="请选择起始时间"
                valueFormat="YYYY-MM-DD"
                :disabledDate='disabledDate'
              />
            </li>
            <li>
              <span>结束时间</span>
              <a-date-picker
                v-model="searchData.searchInfo.end_d"
                placeholder="请选择结束时间"
                valueFormat="YYYY-MM-DD"
                :disabledDate='disabledDate'
              />
            </li>
            <li>
              <span>买方机构</span>
              <OrgSelect
                v-model="searchData.searchInfo.buy_org_name"
                placeholder="请输入买方机构"
                @selectOrgIdEmit="getBuyOrgId"
              />
            </li>
            <li>
              <span>买方交易员</span>
              <CustomerSelect
                v-model="searchData.searchInfo.buy_customer_name"
                placeholder="请输入买方交易员"
                :orgId="buyOrgId"
              />
            </li>
            <li>
              <span>卖方机构</span>
              <OrgSelect
                v-model="searchData.searchInfo.sell_org_name"
                placeholder="请输入卖方机构"
                @selectOrgIdEmit="getSellOrgId"
              />
            </li>
            <li>
              <span>卖方交易员</span>
              <CustomerSelect
                v-model="searchData.searchInfo.sell_customer_name"
                placeholder="请输入卖方交易员"
                :orgId="sellOrgId"
                aria-placeholder=""
              />
            </li>
          </ul>
          <div v-if="isCtrlShow">
            <CtrlSelect
              v-for="(item, index) in transactionSelects"
              :key="index"
              :title="item.title"
              ref="ctrlSelect"
              :options="$data[`${item.key1}`]"
              :selected.sync="condition[`${item.key2}`]"
              :hasChange.sync="hasChange"
              @change="search(true, false)"
            />
          </div>
          <div
            style="margin-bottom:10px;"
            class="mar20"
          >
            <a-button
              type="primary"
              @click="showCtrl"
              v-if="!isCtrlShow"
            >
              更多筛选条件
              <a-icon type="caret-down" />
            </a-button>
            <div v-else>
              <p style="text-align:left;color:gray;padding-left:30%">
                <a-icon type="exclamation-circle" />按住ctrl点击可多选
              </p>
              <a-button
                type="primary"
                @click="showCtrl"
              >
                收起
                <a-icon type="caret-up" />
              </a-button>
            </div>
          </div>
        </div>
        <div class="cxBtnDiv">
          <a-button
            type="primary"
            @click="search"
          > 查询 </a-button>
          <a-button
            type="primary"
            @click="reset"
          > 重置 </a-button>
        </div>
      </div>
      <div class="tableDiv">
        <div class="tableTitle">
          <div class="tip">
            <span v-html="filterCount"></span>
          </div>
          <img
            v-show="dcShow"
            src="../../assets/images/download.png"
            @click="exp"
            title="导出"
          />
          <a-icon
            v-if="!dcShow"
            style="font-size: 16px"
            type="loading"
          />
        </div>
        <div class="gridDiv">
          <vxe-grid
            ref="transaction"
            v-bind="gridOptions"
            :loading="topLoading"
            :columns="columns"
            :data="tableList"
            @scroll="handleScroll"
            @sort-change='sortChange'
            @cell-dblclick="handleCellDbclick"
            @menu-click="(menu) => handleContextMenuClick(menu, 'hangqing')"
          ></vxe-grid>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import columns from './columns'
import CtrlSelect from '../../components/ctrlSelect'
import OrgSelect from '../../components/orgSelect'
import CustomerSelect from '../../components/customerSelect'
import gridMixin from './grid'
import { product, term, dealsource, transactionSelects } from '@/utils/const'
import { getTody } from '@/utils/util'
import moment from 'moment'
import {
  getTranPage,
  exportTranPage,
  delMyselfTran,
} from '@/api/transactionDetail'
import { mapGetters } from 'vuex'
export default {
  mixins: [gridMixin],
  components: {
    CtrlSelect,
    OrgSelect,
    CustomerSelect,
  },
  data() {
    return {
      spinningFlag: false,
      dcShow: true,
      sellOrgId: '', // 买方机构ID
      buyOrgId: '', // 买方机构ID
      filter_count: '', // 成交明细描述信息
      isCtrlShow: false,
      isNextPage: true,
      moment,
      searchData: {
        currPage: 1,
        pageSize: 30,
        softType: 'desc',
        sortFields: 'tran_dt',
        searchInfo: {
          key_word: '', // 代码或名称
          beg_d: moment().format('YYYY-MM-DD'), // 开始时间 默认是当天 YYYY-MM-DD
          end_d: moment().format('YYYY-MM-DD'), // 结束时间 默认是当天 YYYY-MM-DD
          operator_name: '', // 报价人姓名
          buy_org_name: '', // 买方机构名称
          buy_customer_name: '', // 买方交易员名称
          sell_org_name: '', // 卖方机构名称
          sell_customer_name: '', // 卖方交易员名称
          loginOperator: '', // 登录用户code
          typ_codei: '', // 产品
          term: '', // 期限
          src: '', // 成交来源 1非中介 2中介
        },
      },
      buy_org: [], // 买方机构
      topLoading: false,
      columns,
      tableList: [],
      product,
      term,
      dealsource,
      transactionSelects,
      condition: {
        product: [], // 产品
        term: [], // 期限
        dealsource: [], // 成交来源
      },
      hasChange: false,
    }
  },
  created() {
    this.searchData.searchInfo.loginOperator = this.userInfo.code
    this.search(false, true)
  },
  computed: {
    ...mapGetters(['userInfo', 'socketDataList', 'isCtrl']),
    filterCount() {
      let htmlContent = ''
      if (this.filter_count && this.filter_count.stra_list) {
        if (this.filter_count.stra_list.length === 0) {
          return `成交明细（总笔数&nbsp;&nbsp;<span style="color:@blockBackground;">${this.filter_count.rec_sum}</span>、总金额：<span style="color:@blockBackground;">${this.filter_count.amo_sum || 0}亿元</span>）`
        }
        htmlContent = `成交明细（总笔数&nbsp;&nbsp;<span style="color:@blockBackground;">${this.filter_count.rec_sum}</span>、总金额：<span style="color:@blockBackground;">${this.filter_count.amo_sum || 0}亿元</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        this.filter_count.stra_list.forEach((item, index) => {
          htmlContent += `${item.strategy_name}：<span style="color:@blockBackground;">${item.rec}笔、${item.amo}亿元</span>`
          if (index === this.filter_count.stra_list.length - 1) {
            htmlContent += '）'
          } else {
            htmlContent += '；'
          }
        })
      }
      return htmlContent
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight()
    })
    window.annul = this.annul
  },
  watch: {
    buyOrgId: {
      handler() {
        this.searchData.searchInfo.buy_customer_name = ''
      },
    },
    sellOrgId: {
      handler() {
        this.searchData.searchInfo.sell_customer_name = ''
      },
    },
    isCtrl: {
      handler(val) {
        // 释放ctrl键
        if (!val && this.hasChange) {
          this.spinningFlag = true
          this.searchData.searchInfo.typ_codei = this.condition.product1 // 产品
          this.searchData.searchInfo.term = this.condition.term1 // 期限
          this.searchData.searchInfo.src = this.condition.dealsource1 // 成交来源 1非中介 2中介
          this.search(true, false)
        }
        if (val) {
          this.hasChange = false
        }
      },
    },
    socketDataList: {
      deep: true,
      handler({ message_type: messageType, dataList }) {
        if (messageType === 'Type_tran_detail') {
          // 菜单的成交明细列表
          this.handlerTranDetail(dataList)
        }
      },
    },
  },
  methods: {
    disabledDate(current) {
      return current && current > Date.now()
    },
    handlerTranDetail(list) {
      list.forEach((item) => {
        if (item.flag === 'insert') {
          this.tableList.unshift(item.map)
        }
        if (item.flag === 'del') {
          const index = this.tableList.findIndex(
            (data) => data.id === item.map.id
          )
          this.tableList.splice(index, 1)
        }
      })
    },
    exp() {
      // 导出
      this.dcShow = false
      exportTranPage(this.searchData)
        .then((res) => {
          if (res.type === 'application/octet-stream') {
            const blob = new Blob([res])
            const elink = document.createElement('a')
            elink.download = '成交明细.xls'
            elink.href = URL.createObjectURL(blob)
            elink.click()
          } else if (res.type === 'application/json') {
            this.$message.error('数据量超过5万，请缩小筛选结果再导出')
          }
          this.dcShow = true
        })
        .catch(() => {
          this.dcShow = true
          this.$message.error('导出失败', 1)
        })
    },
    // 接收买方机构ID
    getBuyOrgId(val) {
      this.buyOrgId = val
    },
    // 接受卖方机构ID
    getSellOrgId(val) {
      this.sellOrgId = val
    },
    // 表格高度计算
    setTableHeight() {
      setTimeout(() => {
        var documenH = document.querySelector('.main').clientHeight
        var countHeight = document.querySelector('.searchDiv').clientHeight
        var tableDivHeight = documenH - countHeight
        document.querySelector('.tableDiv').style.height = `${
          tableDivHeight - 10
        }px`
        document.querySelector('.gridDiv').style.height = `${
          document.querySelector('.tableDiv').clientHeight -
          document.querySelector('.tableTitle').clientHeight -
          20
        }px`
      }, 20)
    },
    // 重置
    reset() {
      Object.keys(this.searchData.searchInfo).forEach((key) => {
        this.searchData.searchInfo[key] = ''
      })
      this.searchData.searchInfo.loginOperator = this.userInfo.code
      this.$refs.ctrlSelect[0].handleAll()
      this.$refs.ctrlSelect[1].handleAll()
      this.$refs.ctrlSelect[2].handleAll()
    },
    // 排序
    sortChange(sortObj) {
      if (!sortObj.order || !sortObj.property) {
        this.searchData.softType = 'desc'
        this.searchData.sortFields = 'tran_dt'
      } else {
        this.searchData.softType = sortObj.order
        this.searchData.sortFields = sortObj.property
      }
      this.tableList = []
      this.searchData.currPage = 1
      this.search(true, false)
    },
    handleScroll({ type, scrollTop, scrollLeft, isX, isY, $event }) {
      if (isY) {
        const scrollHeight = document.querySelector(
          '.vxe-table--body-wrapper'
        ).scrollHeight
        const clientHeight = document.querySelector(
          '.vxe-table--body-wrapper'
        ).clientHeight
        if (this.isNextPage) {
          if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            !this.topLoading
          ) {
            this.topLoading = true
            this.searchData.currPage++
            this.getTranPage()
          }
        } else {
          this.$message.info('已经是最后一页了', 1)
        }
      }
    },
    showCtrl() {
      this.isCtrlShow = !this.isCtrlShow
      this.setTableHeight()
    },
    search(isNeedLoading, topLoading) {
      this.spinningFlag = isNeedLoading
      this.searchData.searchInfo.typ_codei = this.condition.product1 // 产品
      this.searchData.searchInfo.term = this.condition.term1 // 期限
      this.searchData.searchInfo.src = this.condition.dealsource1 // 成交来源 1非中介 2中介
      this.topLoading = topLoading
      this.tableList = []
      this.searchData.currPage = 1
      this.getTranPage()
    },
    getTranPage() {
      getTranPage(this.searchData).then(({ data }) => {
        this.spinningFlag = false
        this.topLoading = false
        if (this.searchData.currPage === 1) {
          this.filter_count = data.filter_count
        }
        this.tableList.push(...data.dataList)
        this.checkTodayData()
        this.judgeAnnulable()
        this.isNextPage = data.isNextPage
        setTimeout(() => {
          this.$nextTick(() => {
            this.setTableHeight()
          })
        }, 50)
      })
    },
    judgeAnnulable() {
      this.tableList.forEach((item) => {
        if (item.tran_user_id === this.userInfo.id) {
          item.annulable = false
        } else {
          item.annulable = true
        }
      })
    },
    checkTodayData() {
      // 默认勾选今日数据
      if (
        this.searchData.searchInfo.beg_d === getTody() &&
        this.searchData.searchInfo.end_d === getTody()
      ) {
        this.$nextTick(() => {
          this.tableList.forEach((item, index) => {
            if (item.tran_dt.indexOf(getTody()) > -1) {
              this.$refs.transaction.setCheckboxRow(this.tableList[index], true)
            }
          })
        })
      }
    },
    annul(row) {
      event.stopPropagation()
      if (this.userInfo.id !== row.tran_user_id) {
        return this.$message.warning('非本人成交，无法撤销', 3)
      }
      const content = row.src === '1' ? '非中介' : '中介'
      const me = this
      this.$confirm({
        title: '提示',
        content: `${content}成交撤销后，无法恢复`,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          delMyselfTran({ user_id: me.userInfo.id, ids: row.id }).then(() => {
            me.$message.success('成交已撤销！', 3)
          })
        },
        onCancel() {},
      })
    },
  },
}
</script>

<style lang="less" scoped>
@themeColor: rgba(19, 108, 94, 0.5);
.fontColor {
  cursor: pointer;
  color: @themeColor;
  opacity: 1;
  font-size: @fontSize_14;
  font-family: PingFangSC-Regular;
}
/deep/.ant-btn:hover,
.ant-btn:focus {
  color: @mainColor;
}
/deep/ .ctrl-select .main .top > span[data-v-4027031a]:nth-child(5n) {
  margin-right: 8px !important;
}
/deep/ .ant-select-selection__clear {
  color: @mainColor !important;
}
/deep/ .vxe-cell {
  line-height: 37px;
}
// 表格枚举颜色
/deep/ .redState {
  color: #BD7B22;
}
/deep/ .blueState {
  color: #177DDC;
}
/deep/ .greenState {
  color: #8CBA16;
}
/deep/ .vxe-table--render-default .vxe-body--row.row--current {
  background-color: #aa6e3f;
}
/deep/ thead {
  background-color: #090f0e;
}
/deep/ .vxe-body--row {
  background-color: #1c3323;
  height: 37px;
}
/deep/ .vxe-cell {
  height: 37px;
  line-height: 37px;
}
.ctrl-select {
  /deep/ .title {
    width: 80px;
  }
}
/deep/.annulable {
  background: #136C5E;
  color:#f7e1af;
  height: 30px;
  line-height: 30px;
}
/deep/.unannulable {
  background: gray;
  color:#f7e1af;
  height: 30px;
  line-height: 30px;
}
/deep/.unannulable:hover {
  background: gray;
  color:#f7e1af;
}
.numColor {
  color: @themeColor;
}
.bonds-main {
  padding-bottom: 0px !important;
}
.main {
  .searchDiv {
    display: flex;
    .cxLeftDiv {
      width: 85%;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          display: flex;
          align-items: center;
          width: 25%;
          margin-bottom: 20px;
          span {
            width: 23%;
            text-align: right;
            margin-right: 10px;
          }
          /deep/ svg {
            color: @mainColor;
          }
          .ant-input,
          .ant-calendar-picker {
            width: 65% !important;
            min-width: 0 !important;
            margin-right: 0;
          }
          /deep/.ant-select {
            width: 65% !important;
            margin-right: 0;
          }
        }
      }
    }
    .cxBtnDiv {
      width: 15%;
      display: flex;
      justify-content: space-around;
      padding: 0 30px;
      button {
        &:last-child {
          background: #3053eb;
          border-color: #3053eb;
        }
      }
    }
  }
  .tableDiv {
    border: 1px solid @themeColor;
    padding: 10px;
    overflow: hidden;
    box-sizing: border-box;
    .tableTitle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .tip {
        text-align: left;
        color: #fef3bc;
        line-height: 20px;
      }
      img {
        width: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
