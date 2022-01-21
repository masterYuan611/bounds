<template>
  <div class="main oldBondsPage">
    <div class="searchDiv">
      <div class="cxLeftDiv">
        <ul>
          <li>
            <span class="iptSpan">债券搜索</span>
            <AutoComplete
              style="width: 100%;"
              v-model="searchData.searchInfo.key_word"
              @change="handleCodeChange"
            />
          </li>
          <li>
            <span class="iptSpan">交易方向</span>
            <a-tree-select
              v-model="searchData.searchInfo.bo"
              style="width: 100%"
              class="selectBo"
              placeholder="请选择报价机构类型"
              allow-clear
              tree-default-expand-all
            >
              <a-tree-select-node
                value="b"
                title="Bid"
              />
              <a-tree-select-node
                value="o"
                title="Ofr"
              />
            </a-tree-select>
          </li>
          <li>
            <span class="iptSpan">起始日期</span>
            <a-date-picker
              :disabledDate='disabledDate'
              valueFormat='YYYY-MM-DD'
              v-model="searchData.searchInfo.beg_d"
              placeholder="请选择起始时间"
            />
          </li>
          <li>
            <span class="iptSpan">结束日期</span>
            <a-date-picker
              :disabledDate='disabledDate'
              valueFormat='YYYY-MM-DD'
              v-model="searchData.searchInfo.end_d"
              placeholder="请选择结束时间"
            />
          </li>
          <li>
            <span class="iptSpan">对手机构</span>
            <a-input
              allow-clear
              v-model="searchData.searchInfo.org_name"
              placeholder="请输入买方机构"
            ></a-input>
          </li>
          <li>
            <span class="iptSpan">对手交易员</span>
            <a-input
              allow-clear
              v-model="searchData.searchInfo.customer_name"
              placeholder="请输入买方机构"
            ></a-input>
          </li>
          <li>
            <span class="iptSpan">报价人</span>
            <a-input
              allow-clear
              v-model="searchData.searchInfo.operator_name"
              placeholder="请输入报价人"
            ></a-input>
          </li>
        </ul>
        <CtrlSelect
          v-show="zk"
          v-for="(item, index) in oldCtrSelects"
          :key="index"
          ref="ctrlSelect"
          :title="item.title"
          :options="$data[`${item.key1}`]"
          :selected.sync="condition[`${item.key2}`]"
          :hasChange.sync="hasChange"
          @change="handleCtrlSelectChange"
        />
        <div
          style="margin-bottom:10px;"
          class="mar20"
        >
          <a-button
            type="primary"
            @click="openXx"
            v-if="!zk"
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
              @click="openXx"
            >
              收起
              <a-icon type="caret-up" />
            </a-button>
          </div>
        </div>
      </div>
      <div class="cxBtnDiv">
        <a-button
          @click="search"
          type="primary"
        > 查询 </a-button>
        <a-button
          @click="reset"
          type="primary"
        > 重置 </a-button>
      </div>
    </div>
    <div class="tableDiv">
      <div class="tableTitle">
        <div>历史报价（总笔数{{rec_total || 0}}、总金额：{{amo_total || 0}}亿元）</div>
        <img
          v-if="dcShow"
          @click="dc"
          src="../../assets/images/download.png"
        />
        <a-icon
          v-if="!dcShow"
          style="font-size: 16px"
          type="loading"
        />
      </div>
      <div class="gridDiv">
        <vxe-grid
          :style="{'user-select':isShift ? 'none' : null}"
          ref="hangqing"
          v-bind="gridOptions"
          show-overflow
          :loading="topLoading"
          :columns="columns"
          :data="tableList"
          :highlight-current-row='false'
          :cell-class-name="getRowClassName"
          @cell-dblclick="handleCellDbclick"
          @scroll="handleScroll"
          @sort-change='sortChange'
          @menu-click="(menu) => handleContextMenuClick(menu, 'hangqing')"
          @cell-click="handleCellClick"
        ></vxe-grid>
      </div>
    </div>
  </div>
</template>

<script>
import columns from './columns'
import CtrlSelect from '../../components/ctrlSelect'
import gridMixin from './grid.js'
import { dealState, typCodei, qx, oldCtrSelects } from '@/utils/const'
import moment from 'moment'
import { getOldBondsList, exportBond } from '@/api/oldBonds.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [gridMixin],
  components: {
    CtrlSelect,
  },
  data() {
    return {
      zk: false,
      dcShow: true,
      moment,
      isNextPage: true,
      rec_total: 0,
      amo_total: 0,
      searchData: {
        currPage: 1,
        pageSize: 20,
        softType: 'desc',
        sortFields: 'price_dt',
        searchInfo: {
          key_word: '',
          loginOperator: '',
          beg_d: '',
          end_d: '',
          bo: null,
          org_name: '',
          customer_name: '',
          operator_name: '',
          state: '1',
          typ_codei: '',
          term: '',
        },
      },
      topLoading: false,
      columns,
      tableList: [],
      dealState,
      typCodei,
      qx,
      oldCtrSelects,
      condition: {
        dealState: [], // 成交状态
        typCodei: [], // 期限
        qx: [], // 产品
      },
      hasChange: false, // 按住ctrl后是否点选了多选区选项
    }
  },
  computed: {
    ...mapGetters(['isCtrl']),
  },
  watch: {
    isCtrl: {
      handler(val) {
        // 释放ctrl键
        if (!val && this.hasChange) {
          this.handleCtrlSelectChange()
        }
        if (val) {
          this.hasChange = false
        }
      },
    },
  },
  created() {
    this.searchData.searchInfo.operator_name = this.$store.getters.userInfo.name
    this.searchData.searchInfo.beg_d = this.moment()
      .subtract('days', 2)
      .format('YYYY-MM-DD')
    this.searchData.searchInfo.end_d = this.moment()
      .subtract('days', 1)
      .format('YYYY-MM-DD')
    this.getTableList()
  },
  mounted() {
    this.$nextTick(() => {
      this.setTableHeight()
      this.$refs.ctrlSelect[2].choseIndx('1', true)
    })
  },
  methods: {
    disabledDate(currentDate) {
      if (
        this.moment(currentDate).format('YYYY-MM-DD') >
        this.moment().format('YYYY-MM-DD')
      ) {
        return true
      } else {
        return false
      }
    },
    // 表格行特殊class
    getRowClassName({ row }) {
      if (this.selectedRowIds.includes(row._XID)) {
        return 'row--current'
      } else if (row.active) {
        return 'newest-row'
      }
    },
    // 筛选
    handleCtrlSelectChange() {
      console.log(this.condition)
      this.searchData.searchInfo.typ_codei = this.condition.typCodei1
      this.searchData.searchInfo.term = this.condition.qx1
      this.searchData.searchInfo.state = this.condition.state1
      this.search()
    },
    // 导出
    dc() {
      var data = JSON.parse(JSON.stringify(this.searchData))
      if (!data.searchInfo.bo) {
        data.searchInfo.bo = ''
      }
      // data.searchInfo.loginOperator = 'huh'
      data.searchInfo.loginOperator = this.$store.getters.userInfo.code
      this.dcShow = false
      exportBond(data)
        .then((res) => {
          console.log(res.type)
          if (res.type === 'application/octet-stream') {
            var blob = new Blob([res])
            const elink = document.createElement('a')
            elink.download = '历史报价.xls'
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
    openXx() {
      this.zk = !this.zk
      this.setTableHeight()
    },
    // 查询
    search() {
      this.tableList = []
      this.searchData.currPage = 1
      this.getTableList()
    },
    // 排序
    sortChange(sortObj) {
      this.searchData.softType = sortObj.order
      this.searchData.sortFields = sortObj.property
      this.tableList = []
      this.searchData.currPage = 1
      this.getTableList()
    },
    // 获取表格列表
    getTableList() {
      this.topLoading = true
      var cxdata = JSON.parse(JSON.stringify(this.searchData))
      if (!cxdata.searchInfo.bo) {
        cxdata.searchInfo.bo = ''
      }
      cxdata.searchInfo.loginOperator = this.$store.getters.userInfo.code
      getOldBondsList(cxdata)
        .then((res) => {
          this.isNextPage = res.data.isNextPage
          if (
            !this.isNextPage &&
            res.data.dataList.length > 0 &&
            this.searchData.currPage > 1
          ) {
            this.$message.info({
              content: '已经是最后一页了',
              duration: 1,
              onClose: () => {},
            })
          }
          if (this.searchData.currPage === 1) {
            this.rec_total = res.data.data_count.rec_total
            this.amo_total = res.data.data_count.amo_total
          }
          res.data.dataList.forEach((item) => {
            this.tableList.push(item)
          })
          this.topLoading = false
        })
        .catch(() => {})
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
    handleScroll({ type, scrollTop, scrollLeft, isX, isY, $event }) {
      if (isY) {
        console.log(scrollTop)
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
            this.getTableList()
          }
        }
      }
    },
    // 重置
    reset() {
      this.searchData.searchInfo = {
        key_word: '',
        loginOperator: '',
        beg_d: '',
        end_d: '',
        bo: null,
        org_name: '',
        customer_name: '',
        operator_name: '',
        state: '1',
        typ_codei: '',
        term: '',
      }
      this.searchData.searchInfo.operator_name =
        this.$store.getters.userInfo.name
      this.searchData.searchInfo.beg_d = this.moment()
        .subtract('days', 2)
        .format('YYYY-MM-DD')
      this.searchData.searchInfo.end_d = this.moment()
        .subtract('days', 1)
        .format('YYYY-MM-DD')
      this.$refs.ctrlSelect[0].handleAll(true)
      this.$refs.ctrlSelect[1].handleAll(true)
      this.$refs.ctrlSelect[2].choseIndx('1', true)
      this.search()
    },
    handleCodeChange() {
      this.$emit('top-change', 'code')
    },
  },
}
</script>

<style lang="less" scoped>
@themeColor: rgba(19, 108, 94, 0.5);
// 表格枚举颜色
/deep/ .redState {
  color: #df6565;
}
/deep/ .blueState {
  color: #6d75db;
}
/deep/ .greenState {
  color: @themeColor;
}
/deep/ .row--current {
  background-color: #aa6e3f !important;
}
/deep/ thead {
  background-color: #090f0e;
}
/deep/ .vxe-body--row {
  background-color: #1c3323;
}
.ctrl-select {
  /deep/ .title {
    width: 80px;
  }
}
/deep/ .ctrl-select .main .top > span:nth-child(5n) {
  margin-right: 8px !important;
}
/deep/ .ctrl-select .main .top > span {
  width: 90px;
}
/deep/ .ant-input-clear-icon {
  color: @mainColor;
}
/deep/ .ant-calendar-picker-clear {
  z-index: 4;
  opacity: 1;
  color: @mainColor;
  /deep/ svg {
    opacity: 1 !important;
  }
}
/deep/ .ant-select-arrow-icon,
/deep/ .ant-calendar-picker-icon {
  color: rgba(255, 255, 255, 0.2);
}
/deep/ .selectBo{
  .ant-select-selection__clear{
    display: inline-block !important;
    &:hover{
      display: inline-block !important;
    }
  }
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
          padding-left: 0.8%;
          .iptSpan {
            width: 22%;
            text-align: left;
            margin-right: 10px;
          }
          .ant-input,
          .ant-input-affix-wrapper,
          .ant-calendar-picker {
            width: 65%;
            margin-right: 0;
            min-width: 0 !important;
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
      > div {
        color: #fef3bc;
      }
      img {
        width: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
