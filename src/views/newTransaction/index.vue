<template>
  <div class="main newTransactionPage">
    <a-spin :tip="tip" size="large" :spinning="spinningFlag">
      <div class="topDiv">
        <p>智能输入</p>
        <div>
          <a-textarea
            v-model="newTransaction"
            placeholder="智能识别注意事项：
          格式A：190214 2.71 1.4E 中银理财 交易员A 出给 易方达基金 交易员B 国海证券（f）
          格式B：190214 2.71 1.4E 中银理财(发交易员A) 出给 易方达基金(交易员B) 国海证券（f）
          过桥成交示例：
          格式A：200210 3.525 5000 玉山银行 出给 银华基金 双方发 国海证券 刘伟
          格式B：200210 3.525 5000 玉山银行 出给 银华基金 双方发 国海证券(刘伟)"
            :auto-size="{ minRows: 10, maxRows: 10 }"
          />
          <ul>
            <li>智能识别注意事项：</li>
            <li>
              格式A：190214 2.71 1.4E 中银理财 交易员A 出给 易方达基金 交易员B
              国海证券（f）
            </li>
            <li>
              格式B：190214 2.71 1.4E 中银理财（发交易员A） 出给
              易方达基金（交易员B） 国海证券（f）
            </li>
            <li>过桥成交示例：</li>
            <li>
              格式A：200210 3.525 5000 玉山银行 出给 银华基金 双方发 国海证券
              刘伟
            </li>
            <li>
              格式B：200210 3.525 5000 玉山银行 出给 银华基金 双方发
              国海证券（刘伟）
            </li>
            <li>策略类型映射关系：</li>
            <li>
              ①国海证券（a）- 利率策略&nbsp;&nbsp;&nbsp;&nbsp;②国海证券（b）-
              利率策略b&nbsp;&nbsp;&nbsp;&nbsp; ③海海证券（c）- 信用策略
            </li>
            <li>
              ④海海证券（d）-
              销售组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⑤海海证券（e）-
              存单策略&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⑥海海证券（f）-
              交易组&nbsp;&nbsp;&nbsp;&nbsp;⑦其他 - 其他
            </li>
            <li>未选择策略将统计为”空策略“</li>
          </ul>
        </div>
      </div>
      <div class="bottomDiv">
        <div class="btnDiv">
          <a-button
            :disabled="newTransaction.trim() == '' ? true : false"
            @click="distinguish"
            type="primary"
            :loading="btnLoading"
            >识别</a-button
          >
          <a-button @click="add" type="primary">新增</a-button>
          <a-button type="primary" @click="batchEdit">批量修改</a-button>
          <a-button @click="deal" type="primary">成交({{tranNumber}})</a-button>
        </div>
        <div class="gridDiv">
          <vxe-grid
            ref="transaction"
            v-bind="gridOptions"
            :loading="topLoading"
            :columns="columns"
            :data="tableList"
            :highlightCurrentRow="false"
            :checkbox-config="{
              checkAll: true,
            }"
          ></vxe-grid>
        </div>
      </div>
      <div v-if="visible" class="popDiv">
        <div v-drag class="moveDiv">
          <p>
            批量修改
            <a-icon @mousedown.stop="" @click="visible = false" type="close" />
          </p>
          <ul @mousedown.stop="">
            <li>
              <span>代码</span>
              <AutoComplete
                style="width: 200px"
                v-model="batchEditInfo.code"
              />
            </li>
            <li>
              <span>成交价</span>
              <a-input
                v-model="batchEditInfo.price"
                style="width: 200px"
                placeholder="请输入成交价"
                @blur="checkPrice"
              />
            </li>
            <li>
              <span>策略类型</span>
              <a-select
                v-model="batchEditInfo.strategy_type_id"
                style="width: 200px"
                mode="multiple"
                placeholder="可多选"
                showArrow
              >
                <a-select-option value="a"> 利率策略a </a-select-option>
                <a-select-option value="b"> 利率策略b </a-select-option>
                <a-select-option value="c"> 信用策略 </a-select-option>
                <a-select-option value="d"> 销售组 </a-select-option>
                <a-select-option value="e"> 存单策略 </a-select-option>
                <a-select-option value="f"> 交易组 </a-select-option>
                <a-select-option value="g"> 其他 </a-select-option>
                <a-select-option value="h"> 空 </a-select-option>
              </a-select>
            </li>
            <li>
              <span>成交额</span>
              <a-input
                v-model="batchEditInfo.amount"
                style="width: 200px"
                placeholder="请输入成交额"
                @blur="checkAmount"
              />
            </li>
            <li>
              <span>买方机构</span>
              <a-input
                v-model="batchEditInfo.buy_org_name"
                style="width: 200px"
                placeholder="请输入买方机构"
              />
            </li>
            <li>
              <span>买方交易员</span>
              <a-input
                v-model="batchEditInfo.buy_customer_name"
                style="width: 200px"
                placeholder="请输入买方交易员"
              />
            </li>
            <li>
              <span>卖方机构</span>
              <a-input
                v-model="batchEditInfo.sell_org_name"
                style="width: 200px"
                placeholder="请输入卖方机构"
              />
            </li>
            <li>
              <span>卖方交易员</span>
              <a-input
                v-model="batchEditInfo.sell_customer_name"
                style="width: 200px"
                placeholder="请输入卖方交易员"
              />
            </li>
          </ul>
          <div>
            <a-button size="large" @click="batchEditSubmit" @mousedown.stop="">提交</a-button>
            <a-button
              size="large"
              type="primary"
              @click="visible = false"
              @mousedown.stop=""
              >取消</a-button
            >
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import gridMixin from '@/mixins/grid'
import columns from './columns'
import { getBondInfo } from '@/api/newBonds.js'
import { parseTranList, addTranBatch } from '@/api/newTranscation'
export default {
  mixins: [gridMixin],
  data() {
    return {
      tip: '',
      spinningFlag: false,
      btnLoading: false,
      visible: false,
      topLoading: false,
      columns,
      newTransaction: '',
      tableList: [],
      tranNumber: 0,
      batchEditInfo: {
        code: '',
        price: '', // 成交价
        strategy_type_id: [], // 策略类型
        amount: '', // 成交额
        buy_org_name: '', // 买方机构
        buy_customer_name: '', // 买方交易员
        sell_org_name: '', // 卖方机构
        sell_customer_name: '', // 卖方交易员
      },
    }
  },
  mounted() {
    // 去vuex中复制批量成交数据
    if (this.$store.getters.transcationList.length > 0) {
      this.copyAdd(this.$store.getters.transcationList)
    }
    window.delItem = this.delItem
    window.queryBondInfo = this.queryBondInfo
    window.tip1 = this.tip1
    window.tip2 = this.tip2
    this.$nextTick(() => {
      this.setTableHeight()
    })
  },
  computed: {
    getTranscationList() {
      return this.$store.getters.transcationList
    },
  },
  methods: {
    tip1() {
      this.$message.error('策略类型为‘空’，不能选择其他策略', 3)
    },
    tip2() {
      this.$message.error('已选择‘非空’策略，不能再选‘空’', 3)
    },
    checkPrice() {
      if (this.batchEditInfo.price) {
        if (
          /^\d{1,4}$|^\d{1,4}[.]\d{1,5}$/.test(this.batchEditInfo.price) &&
          this.batchEditInfo.price !== '0'
        ) {
        } else {
          this.batchEditInfo.price = ''
          this.$message.warning('成交价限制范围4位整数，5位小数，不能为0', 3)
        }
      }
    },
    checkAmount() {
      if (this.batchEditInfo.amount) {
        if (
          /^\d{1,8}$|^\d{1,8}[.]\d{1,4}$/.test(this.batchEditInfo.amount) &&
          this.batchEditInfo.amount !== '0'
        ) {
        } else {
          this.batchEditInfo.amount = ''
          this.$message.warning('成交额限制范围8位整数，4位小数，不能为0', 3)
        }
      }
    },
    copyAdd(val) {
      val.forEach((item) => {
        this.tableList.push({
          type: item.tran_type || '', // 类型
          term: item.term || '', // 剩余期限
          code: item.code || '', // 代码
          name: item.name || '', // 简称
          eva: item.eva || '', // 中债估值
          level: item.level || '', // 主/债
          bo: item.bo || '', // 方向
          seek_price: item.price === '--' ? '' : item.price || '', // 报价
          price: item.price === '--' ? '' : item.price || '', // 成交价
          seel_amount: item.vol || '', // 面额 tran_amt_total
          amount: Number(item.vol) - Number(item.tran_amt_total) || '', // 成交额
          tran_user_name: this.$store.getters.userInfo.name, // 成交人
          buy_org_name: item.bo === 'Bid' ? item.org_name : '国海证券', // 买方机构名称
          buy_customer_name:
            item.bo === 'Bid'
              ? item.customer_name
              : this.$store.getters.userInfo.name, // 买方交易员
          sell_org_name: item.bo === 'Ofr' ? item.org_name : '国海证券', // 卖方机构
          sell_customer_name:
            item.bo === 'Ofr'
              ? item.customer_name
              : this.$store.getters.userInfo.name, // 卖方交易员
          price_id: item.id, // 报价主键id
          seek_src: item.src || '', // 报价来源
          strategy_type_id: [], // 策略类型
          src: '1', // 成交来源
        })
        this.$nextTick(() => {
          val.forEach((item, index) => {
            this.$refs.transaction.setCheckboxRow(
              this.tableList[this.tableList.length - (index + 1)],
              true
            )
          })
        })
      })
    },
    blur(val) {
      getBondInfo({ code: val })
        .then(({ data }) => {
          if (data) {
            const item = {
              tran_user_name: this.$store.getters.userInfo.name,
              eva: data.eva,
              level: data.level,
              name: data.name,
              term: data.term,
            }
            data.operator_name = this.$store.getters.userInfo.name
            this.$set(this, 'popData', item)
            console.log(this.popData)
          } else {
            this.$message.error('未查询到该证券信息，请重新查询', 1)
            this.popData.code = ''
          }
        })
        .catch(() => {})
    },
    // 表格高度控制
    setTableHeight() {
      setTimeout(() => {
        var documenH = document.querySelector('.main').clientHeight
        var countHeight = document.querySelector('.topDiv').clientHeight
        countHeight += document.querySelector('.btnDiv').clientHeight
        var tableDivHeight = documenH - countHeight
        document.querySelector('.gridDiv').style.height = `${
          tableDivHeight - 40
        }px`
        document.querySelector('.gridDiv').style.height = `${
          document.querySelector('.gridDiv').clientHeight - 10
        }px`
      }, 20)
    },
    // 新增
    add() {
      this.tableList.push({
        is_hot: null,
        type: 'TRD', // 类型
        term: null, // 剩余期限
        code: null, // 代码
        name: null, // 简称
        eva: null, // 中债估值
        level: null, // 主/债
        bo: null, // 方向
        seek_price: null, // 报价
        price: null, // 成交价
        seel_amount: null, // 面额
        amount: null, // 成交额
        tran_user_name: this.userInfo.name, // 成交人
        strategy_type_id: [], // 策略类型
        buy_org_name: null, // 买方机构名称
        buy_customer_name: null, // 买方交易员
        sell_org_name: null, // 卖方机构
        sell_customer_name: null, // 卖方交易员
        seek_src: '手动', // 报价来源
        src: '1', // 成交来源
      })
      this.$nextTick(() => {
        this.$refs.transaction.setCheckboxRow(
          this.tableList[this.tableList.length - 1],
          true
        )
      })
    },
    // 删除
    delItem(row) {
      this.spinningFlag = true
      this.tip = '删除中'
      for (let i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i] === row) {
          this.tableList.splice(i, 1)
          this.spinningFlag = false
          this.$message.success('删除成功', 2)
        }
      }
    },
    // 识别
    distinguish() {
      this.btnLoading = true
      parseTranList({
        loginOperator: this.userInfo.code,
        data: this.newTransaction,
      })
        .then(({ data, message }) => {
          this.$message.success(message, 3)
          this.tableList = []
          data.dataList.forEach((item) => {
            const tableItem = {
              type: item.type || '',
              term: item.term || '',
              code: item.code || '',
              name: item.name || '',
              eva: item.eva || '',
              level: item.level || '',
              bo: item.bo || '',
              seek_price: item.seek_price || '',
              price: item.price || '',
              seel_amount: item.seel_amount || '',
              amount: item.amount || '',
              tran_user_name: this.$store.getters.userInfo.name,
              strategy_type_id: item.strategy_type_id.split(',') || [],
              buy_org_name: item.buy_org_name || '',
              buy_customer_name: item.buy_user_name || '',
              sell_org_name: item.sell_org_name || '',
              sell_customer_name: item.sell_user_name || '',
              seek_src: item.seek_src || '',
              src: item.src || '1',
            }
            this.tableList.push(tableItem)
            this.$nextTick(() => {
              this.$refs.transaction.setAllCheckboxRow(true)
            })
          })
        })
        .catch(() => {
          this.$message.error('无法识别的格式', 3)
        })
        .finally(() => {
          this.btnLoading = false
        })
    },
    // 根据债券代码，获取债券信息
    queryBondInfo(row, rowIndex) {
      return getBondInfo({ code: row.code })
        .then(({ data }) => {
          if (data) {
            this.$set(this.tableList[rowIndex], 'term', data.term)
            this.$set(this.tableList[rowIndex], 'eva', data.eva)
            this.$set(this.tableList[rowIndex], 'level', data.level)
            this.$set(this.tableList[rowIndex], 'name', data.name)
            this.$set(this.tableList[rowIndex], 'code', data.code)
            this.$set(
              this.tableList[rowIndex],
              'tran_user_name',
              this.$store.getters.userInfo.name
            )
          } else {
            this.$message.error('未查询到该证券信息，请重新查询', 1)
            row.code = ''
          }
        })
        .catch(() => {})
    },
    // 成交
    deal() {
      const dataList = this.$refs.transaction.getCheckboxRecords()
      console.log('成交数据', dataList)
      if (dataList.length < 1) {
        return this.$message.warning('请选择要成交的数据', 3)
      }
      // 错误行统计
      const errorIndexArr = []
      const goodIndexArr = []
      const tipInfo = {}
      dataList.forEach((item, index) => {
        if (
          !item.code ||
          !item.name ||
          !item.level ||
          !item.price ||
          !item.amount ||
          !item.buy_org_name ||
          !item.sell_org_name ||
          !item.sell_customer_name
        ) {
          const itemIndex = this.$refs.transaction.getRowIndex(item) + 1 + ''
          errorIndexArr.push(itemIndex)
          tipInfo[itemIndex] = {}
          tipInfo[itemIndex].emptyarr = []
          if (!item.code) {
            tipInfo[itemIndex].emptyarr.push('代码')
          }
          if (!item.name) {
            tipInfo[itemIndex].emptyarr.push('简称')
          }
          if (!item.price) {
            tipInfo[itemIndex].emptyarr.push('成交价')
          }
          if (!item.amount) {
            tipInfo[itemIndex].emptyarr.push('成交额')
          }
          if (!item.buy_org_name) {
            tipInfo[itemIndex].emptyarr.push('买方机构')
          }
          if (!item.sell_org_name) {
            tipInfo[itemIndex].emptyarr.push('卖方机构')
          }
          if (!item.sell_customer_name) {
            tipInfo[itemIndex].emptyarr.push('卖方交易员')
          }
        } else {
          goodIndexArr.push(item)
        }
      })
      if (errorIndexArr.length === dataList.length) {
        return this.$warning({
          title: <p style="color:#fef3bc;">没有可成交的报价</p>,
          content: (
            <div style="text-align:left;">
              {errorIndexArr.map((item) => (
                <p>
                  序号 {item}&nbsp;{tipInfo[item].emptyarr.join('、')}不能为空
                </p>
              ))}
            </div>
          ),
          width: 440,
        })
      }
      const me = this
      if (errorIndexArr.length > 0) {
        this.$confirm({
          title: <p style="color:#fef3bc;">提示</p>,
          content: (
            <div style="text-align:left;">
              {errorIndexArr.map((item) => (
                <p>
                  序号 {item}&nbsp;{tipInfo[item].emptyarr.join('、')}不能为空
                </p>
              ))}
              <p style="color:#fef3bc;">是否继续发布其他报价？</p>
            </div>
          ),
          width: 440,
          okText: '是',
          cancelText: '否',
          onCancel() {},
          onOk() {
            me.addDeal(goodIndexArr, '部分报价已成交')
          },
        })
      }
      if (goodIndexArr.length === dataList.length) {
        this.addDeal(goodIndexArr, '报价已设置为成交状态')
      }
    },
    addDeal(dataList, successInfo) {
      // 需要做数据转换
      this.spinningFlag = true
      this.tip = '发布中，请稍后'
      const transDataList = []
      dataList.forEach((item) => {
        if (Array.isArray(item.strategy_type_id)) {
          item.strategy_type_id = item.strategy_type_id.join(',')
        }
        const transItem = {
          code: item.code,
          price: item.price,
          amount: item.amount,
          type: item.type,
          strategy_type: item.strategy_type_id || 'h',
          buy_org_id: '',
          buy_org_name: item.buy_org_name,
          buy_customer_id: '',
          buy_customer_name: item.buy_customer_name,
          sell_org_id: '',
          sell_org_name: item.sell_org_name,
          sell_customer_id: '',
          sell_customer_name: item.sell_customer_name,
          price_id: item.price_id,
          src: item.src,
          tran_user_id: item.tran_user_name,
        }
        transDataList.push(transItem)
      })
      const req = {
        loginOperator: this.$store.getters.userInfo.code,
        dataList: transDataList,
      }
      addTranBatch(req)
        .then((res) => {
          this.spinningFlag = false
          this.$message.success(successInfo, 3)
          for (let i = 0; i < this.tableList.length; i++) {
            dataList.forEach((itemSon) => {
              if (this.tableList[i] === itemSon) {
                this.tableList.splice(i, 1)
                i--
              }
            })
          }
        }).finally(
          this.spinningFlag = false
        )
    },
    // 批量修改
    batchEdit() {
      if (this.$refs.transaction.getCheckboxRecords() < 1) {
        return this.$message.warning('请选择要批量修改的报价')
      }
      this.visible = true
    },
    // 批量修改提交
    batchEditSubmit() {
      const selectList = this.$refs.transaction.getCheckboxRecords()
      if (this.batchEditInfo.code) {
        if (this.batchEditInfo.price && this.batchEditInfo.price <= 0) {
          return this.$message.warning('成交价不能小于等于0')
        }
        if (this.batchEditInfo.amount && this.batchEditInfo.amount <= 0) {
          return this.$message.warning('成交额不能小于等于0')
        }
        getBondInfo({ code: this.batchEditInfo.code }).then(({ data }) => {
          selectList.forEach((item) => {
            const itemIndex = this.$refs.transaction.getRowIndex(item)
            this.$set(this.tableList[itemIndex], 'term', data.term)
            this.$set(this.tableList[itemIndex], 'eva', data.eva)
            this.$set(this.tableList[itemIndex], 'level', data.level)
            this.$set(this.tableList[itemIndex], 'name', data.name)
          })
        })
      }
      selectList.forEach((item) => {
        const itemIndex = this.$refs.transaction.getRowIndex(item)
        Object.keys(this.batchEditInfo).forEach((key) => {
          if (
            key === 'strategy_type_id' &&
            this.batchEditInfo[key].length === 0
          ) {
          } else if (this.batchEditInfo[key]) {
            this.$set(this.tableList[itemIndex], key, this.batchEditInfo[key])
          }
        })
      })
      this.visible = false
      this.batchEditInfo.code = ''
    },
    counterNumber() {
      this.tranNumber = 0
      this.tableList.forEach(item => {
        if (!item.term && !item.code && !item.name && !item.price && !item.amount && item.strategy_type_id.length === 0 &&
          !item.buy_org_name && !item.buy_customer_name && !item.sell_org_name && !item.sell_customer_name) {
        } else {
          this.tranNumber++
        }
      })
    }
  },
  watch: {
    tableList: {
      handler: function() {
        this.counterNumber()
      },
      deep: true
    },
    visible: {
      handler: function (val) {
        if (!val) {
          this.batchEditInfo.price = ''
          this.batchEditInfo.strategy_type_id = []
          this.batchEditInfo.amount = ''
          this.batchEditInfo.tran_user_name = ''
          this.batchEditInfo.buy_org_name = ''
          this.batchEditInfo.buy_customer_name = ''
          this.batchEditInfo.sell_org_name = ''
          this.batchEditInfo.sell_customer_name = ''
        }
      }
    },
    getTranscationList(val) {
      this.copyAdd(val)
    },
    'batchEditInfo.strategy_type_id': {
      handler: function (val, oldval) {
        if (val.indexOf('h') === 0 && val.length > 1) {
          this.batchEditInfo.strategy_type_id = oldval
          return window.tip1()
        }
        if (val.indexOf('h') > 0 && val.length > 1) {
          this.batchEditInfo.strategy_type_id = oldval
          return window.tip2()
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
textarea::-webkit-input-placeholder {
  color: #509e66;
}
/deep/ .vxe-cell--placeholder {
  opacity: 0.5;
}
/deep/.ant-select-selection__choice {
  background-color: gray;
  border: none;
}
/deep/ .ant-select-arrow {
  color: @mainColor;
}
/deep/ input {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none !important;
  }
}
/deep/.ant-input-clear-icon {
  color: @mainColor;
}
@themeColor: rgba(19, 108, 94, 0.5);
/deep/ .vxe-table--render-default .vxe-body--row.row--current {
  background-color: #aa6e3f;
}
/deep/ thead {
  background-color: #090f0e;
}
/deep/ .vxe-body--row {
  background-color: #1c3323;
}
/deep/ .vxe-cell {
  line-height: 37px;
}
/deep/ .vxe-select input {
  background: none;
  color: @mainColor;
}
.main {
  .topDiv {
    padding: 12px;
    border: 1px solid @themeColor;
    border-radius: 2px;
    margin-bottom: 16px;
    p {
      text-align: left;
      margin-bottom: 10px;
    }
    > div {
      display: flex;
      textarea {
        width: 50%;
      }
      ul {
        margin-left: 16px;
        li {
          text-align: left;
          margin-bottom: 8px;
        }
      }
    }
  }
  .bottomDiv {
    padding: 12px;
    border: 1px solid @themeColor;
    border-radius: 2px;
    .btnDiv {
      display: flex;
      margin-bottom: 12px;
      button {
        display: flex;
        width: 100px;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
      }
    }
  }
}
.popDiv {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
    width: 900px;
    background: #203e3e;
    color: #c3cbcb;
    border-radius: 3px;
    > p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 12px;
      font-size: @fontSize_18;
      i {
        cursor: pointer;
      }
    }
    > ul {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 10px 0 10px;
      border-top: 1px solid #2c4949;
      border-bottom: 1px solid #2c4949;
      li {
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        width: 50%;
        justify-content: flex-end;
        span {
          margin-right: 10px;
        }
        &:nth-child(2n + 1) {
          width: 45%;
        }
        &:nth-child(2n) {
          width: 55%;
        }
      }
    }
    > div {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        &:first-child {
          margin-right: 50px;
        }
      }
    }
  }
}
</style>
