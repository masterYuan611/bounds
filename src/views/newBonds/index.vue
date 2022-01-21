<template>
  <div class="main newBondsPage">
    <a-spin :tip="tip" size="large" :spinning="spinningFlag">
    <div class="topDiv">
      <p>智能输入</p>
      <div>
        <a-textarea
          v-model="sbVal"
          placeholder="智能识别示例：
          格式A：152465.SH    5.11   3800   bid
          格式B：张三-国海证券
                       152465.SH    5.11   3800   bid
          格式C：8.72Y    152465.SH     20晋建01     5.11/5.12    3800/2500     AAA/AAA    中债    4.6938
          格式D：张三-国海证券
                       8.72Y    152465.SH     20晋建01      --/5.12        --/2500         AAA/AAA    中债    4.6938"
          :auto-size="{ minRows: 8, maxRows: 8 }"
        />
        <ul>
          <li>智能识别注意事项：</li>
          <li>（1）完整报价格式</li>
          <li>首行：对手交易员-对手交易机构</li>
          <li>次行：期限 债券代码 债券名称 bid价格/ofr价格 bid量/ofr量 主体/债项 中债 中债估值 </li>
          <li>（2）部分报价格式</li>
          <li>必须有完整的债券代码或简称，其他要素以空格间隔</li>
        </ul>
      </div>
    </div>
    <div class="bottomDiv">
      <div class="btnDiv">
        <a-button
          :disabled="sbVal.trim() == '' ? true : false"
          @click="distinguish"
          type="primary"
          :loading='btnLoading'
        >识别</a-button>
        <a-button
          @click="add"
          type="primary"
        >新增</a-button>
        <a-button
          @click="batchEdit"
          type="primary"
        >批量修改</a-button>
        <a-button
          @click="zzbj"
          type="primary"
        >中债=>报价</a-button>
        <a-button
          @click="release"
          type="primary"
        >发布({{jss}})</a-button>
      </div>
      <div class="gridDiv">
        <vxe-grid
          ref="hangqing"
          v-bind="gridOptions"
          :loading="topLoading"
          :columns="columns"
          :data="tableList"
          :highlightCurrentRow="false"
          :checkbox-config="{
            checkAll: true
          }"
          :menuConfig="{enabled: false}"
        ></vxe-grid>
      </div>
    </div>
    <div
      v-if="visible"
      class="popDiv"
    >
      <!-- <div v-if="visible" class="popDiv" @click="popClose"> -->
      <div
        v-drag
        class="moveDiv"
      >
        <p>批量修改
          <a-icon
            @click="popClose"
            type="close"
          />
        </p>
        <ul @mousedown.stop=''>
          <li>
            <span>代码</span>
            <AutoComplete
              style="width:200px"
              v-model="popData.code"
              @input="((val)=>{popData.code=val})"
            />
          </li>
          <li>
            <span>方向</span>
            <a-tree-select
              v-model="popData.bo"
              style="margin-right:0px;"
              placeholder="请选择"
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
            <span>面额</span>
            <a-input
              @input="inputNumber($event, popData.vol, 'vol')"
              v-model="popData.vol"
              placeholder="请输入数量"
            />
          </li>
          <li>
            <span>对手机构</span>
            <a-input
              v-model="popData.org_name"
              placeholder="请输入对手机构"
            />
          </li>
          <li>
            <span>价格</span>
            <a-input
              @input="inputNumber($event, popData.price, 'price')"
              v-model="popData.price"
              placeholder="请输入价格"
            />
          </li>
          <li>
            <span>对手交易员</span>
            <a-input
              v-model="popData.customer_name"
              placeholder="对手交易员"
            />
          </li>
        </ul>
        <div>
          <a-button
            @click="confirmEdit"
            size="large"
          >提交</a-button>
          <a-button
            size="large"
            type="primary"
            @click="popClose"
          >取消</a-button>
        </div>
      </div>
    </div>
    </a-spin>
  </div>
</template>

<script>
import gridMixin from '@/mixins/grid'
import columns from './columns'
import {
  toDistinguish,
  getBondInfo,
  toRelease,
  getNewBondInfo,
} from '@/api/newBonds.js'
// import { getBondInfoByName } from '@/api/newTranscation'
export default {
  mixins: [gridMixin],
  data() {
    return {
      tsInfo: [],
      goodArr: [],
      gsIndexArr: [],
      visible: false,
      jss: 0,
      tip: '',
      spinningFlag: false,
      btnLoading: false,
      popData: {
        is_hot: null,
        term: null,
        code: null,
        name: null,
        bo: undefined,
        price: null,
        xh: undefined,
        pri_eva: null,
        vol: null,
        volxh: null,
        org_name: null,
        customer_name: null,
        eva: null,
        level: null,
        operator_name: this.$store.getters.userInfo.name,
      },
      topLoading: false,
      columns,
      sbVal: '',
      tableList: [
        // {
        //   is_hot: 1,
        //   term: '1.80Y',
        //   code: '122240.SH',
        //   name: '17盛京银行二期',
        //   bo: 'b',
        //   price: 362,
        //   xh: '必须请示',
        //   pri_eva: 511,
        //   vol: 2000.8,
        //   volxh: '+1',
        //   org_name: '国海证券',
        //   customer_name: '张三',
        //   eva: '522',
        //   level: 'AAA/AA+',
        //   operator_name: '李四',
        // }
      ],
    }
  },
  computed: {
    getBondsInfo() {
      return this.$store.getters.newBondsList
    },
    getMyBondsInfo() {
      return this.$store.getters.myBondsList
    },
  },
  watch: {
    getBondsInfo(val) {
      if (val.length > 0) {
        this.copyAdd(JSON.parse(JSON.stringify(val)))
      }
    },
    getMyBondsInfo(val) {
      if (val.length > 0) {
        this.copyOrAdd(val)
        this.$store.commit('newBonds/setMyBondsList', [])
      }
    },
    tableList: {
      handler(newVal, oldVal) {
        this.calculateNum()
      },
      deep: true
    }
  },
  // created () {
  //   document.oncontextmenu = function () {
  //     return false
  //   }
  // },
  mounted() {
    // 第一次进入页面没缓存去去vuex中复制新增数据
    if (this.$store.getters.newBondsList.length > 0) {
      this.copyAdd(JSON.parse(JSON.stringify(this.$store.getters.newBondsList)))
    }
    // 第一次进入页面没缓存去去vuex中复制新增数据
    if (this.$store.getters.myBondsList.length > 0) {
      this.copyOrAdd(this.$store.getters.myBondsList)
      this.$store.commit('newBonds/setMyBondsList', [])
    }
    // this.copyAdd(this.$store.getters.newBondsList)
    window.newBondsdelItem = this.newBondsdelItem
    window.newBondsqueryBondInfo = this.newBondsqueryBondInfo
    // window.queryBondInfoByName = this.queryBondInfoByName

    this.$nextTick(() => {
      this.setTableHeight()
    })
  },
  methods: {
    // 计算选中报价不为空的条数
    calculateNum() {
      this.jss = 0
      this.tableList.forEach(item => {
        if (!item.term && !item.code && !item.name && !item.price && !item.xh && !item.pri_eva && !item.vol && !item.org_name && !item.customer_name && !item.eva && !item.level) {
        } else {
          this.jss++
        }
      })
    },
    zzbj() {
      const selectList = this.$refs.hangqing.getCheckboxRecords()
      selectList.forEach(item => {
        item.price = item.eva
      })
    },
    inputNumber($event, val, key) {
      this.popData[key] = $event.target.value.replace(/[^0-9.-]/g, '')
      console.log(this.popData[key])
    },
    // 复制新增
    copyAdd(val) {
      var ids = []
      val.forEach((item) => {
        ids.push(item.id)
      })
      console.log(ids)
      this.$store.commit('newBonds/setNewBondsList', [])
      getNewBondInfo({ ids: ids.join(',') })
        .then((res) => {
          console.log(res.data)
          for (const key in res.data) {
            getBondInfo({ code: res.data[key][0].code })
              .then(({ data }) => {
                if (data) {
                  res.data[key].forEach((item) => {
                    item.operator_name = this.$store.getters.userInfo.name
                    this.tableList.push(
                      JSON.parse(JSON.stringify(Object.assign(data, item)))
                    )
                    this.$refs.hangqing.setCheckboxRow(
                      this.tableList[this.tableList.length - 1],
                      true
                    )
                  })
                } else {
                  this.$message.error('未查询到该证券信息，请重新查询', 1)
                }
              })
              .catch(() => {})
          }
        })
        .catch(() => {})
    },
    // 复制新增
    copyOrAdd(val) {
      const row = JSON.parse(JSON.stringify(val))
      console.log(row)
      row.forEach((item) => {
        if (item.volxh === '--') {
          item.volxh = null
        }
        if (!(item.price > 0)) {
          item.price = ''
        }
        if (!(item.vol > 0)) {
          item.vol = ''
        }
        if (item.is_ask === '否') {
          item.xh = ''
        } else if (item.is_ask === '需请示') {
          item.xh = '*'
        } else if (item.is_ask === '必需请示') {
          item.xh = '**'
        }
        if (item.bo === 'Ofr') {
          item.bo = 'o'
        } else if (item.bo === 'Bid') {
          item.bo = 'b'
        }
        if (!item.operator_name) {
          item.operator_name = this.$store.getters.userInfo.name
        }
        this.tableList.push(item)
        this.$refs.hangqing.setCheckboxRow(
          this.tableList[this.tableList.length - 1],
          true
        )
      })
    },
    // 弹窗关闭
    popClose() {
      this.popData = {
        is_hot: null,
        term: null,
        code: null,
        name: null,
        bo: undefined,
        price: null,
        xh: undefined,
        pri_eva: null,
        vol: null,
        volxh: null,
        org_name: null,
        customer_name: null,
        eva: null,
        level: null,
        operator_name: this.$store.getters.userInfo.name,
      }
      this.visible = false
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
        term: null,
        code: null,
        name: null,
        bo: 'o',
        price: null,
        xh: undefined,
        pri_eva: null,
        vol: null,
        volxh: null,
        org_name: null,
        customer_name: null,
        eva: null,
        level: null,
        operator_name: this.$store.getters.userInfo.name,
      })
      this.$nextTick(() => {
        this.$refs.hangqing.setCheckboxRow(
          this.tableList[this.tableList.length - 1],
          true
        )
      })
    },
    // 删除
    newBondsdelItem(rowIndex) {
      this.tableList.splice(rowIndex, 1)
    },
    // 识别
    distinguish() {
      this.btnLoading = true
      toDistinguish({
        data: this.sbVal,
        loginOperator: this.$store.getters.userInfo.code,
      })
        .then(({ data }) => {
          if (data.dataList.length > 0) {
            this.$message.success('识别成功', 1)
            this.tableList = []
            data.dataList.forEach((item) => {
              // this.sbVal = ''
              console.log(item)
              item.operator_name = this.$store.getters.userInfo.name
              this.tableList.push(item)
              this.$nextTick(() => {
                // 选中表格内所有行
                this.$refs.hangqing.setAllCheckboxRow(true)
              })
            })
          }
          this.btnLoading = false
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    // 根据债券代码，获取债券信息
    newBondsqueryBondInfo(row, rowIndex) {
      return getBondInfo({ code: row.code })
        .then(({ data }) => {
          if (data) {
            // data.operator_name = this.$store.getters.userInfo.name
            this.$set(this.tableList[rowIndex], 'term', data.term)
            this.$set(this.tableList[rowIndex], 'eva', data.eva)
            this.$set(this.tableList[rowIndex], 'level', data.level)
            this.$set(this.tableList[rowIndex], 'name', data.name)
            this.$set(this.tableList[rowIndex], 'code', data.code)
            // this.$refs.hangqing.setCheckboxRow(this.tableList[rowIndex], true)
          } else {
            this.$message.error('未查询到该证券信息，请重新查询', 1)
            row.code = ''
          }
        })
        .catch(() => {})
    },
    // 批量修改
    batchEdit() {
      if (this.$refs.hangqing.getCheckboxRecords().length < 1) {
        this.$message.warning('请选择需要批量修改的表格数据行', 1)
        return false
      }
      this.visible = true
    },
    // 确认批量修改
    async confirmEdit() {
      const me = this
      if (this.popData.code) {
        await getBondInfo({ code: this.popData.code })
          .then(({ data }) => {
            if (data) {
              data.operator_name = this.$store.getters.userInfo.name
              this.$set(this.popData, 'term', data.term)
              this.$set(this.popData, 'eva', data.eva)
              this.$set(this.popData, 'level', data.level)
              this.$set(this.popData, 'name', data.name)
              console.log(this.popData)
            } else {
              this.$message.error('未查询到该证券信息，请重新查询', 1)
              this.popData.code = ''
            }
          })
          .catch(() => {})
      }
      if (me.popData.vol) {
        if (!/^\d{1,8}$|^\d{1,8}[.]\d{1,4}$/.test(me.popData.vol) && me.popData.vol !== '-' && me.popData.vol !== '--') {
          this.$message.warning('面额限制范围8位整数，4位小数', 1)
          return false
        }
      }
      if (me.popData.price) {
        if (!/^\d{1,4}$|^\d{1,4}[.]\d{1,4}$/.test(me.popData.price) && me.popData.price !== '-' && me.popData.price !== '--') {
          this.$message.warning('价格限制范围4位整数，4位小数', 1)
          return false
        }
      }
      // 获取所有选中行
      const selectListData = this.$refs.hangqing.getCheckboxRecords()
      const copyPopData = JSON.parse(JSON.stringify(me.popData))
      selectListData.forEach((item) => {
        // 根据row获取索引（数组下标）
        var itemIndex = me.$refs.hangqing.getRowIndex(item)
        if (
          me.popData.vol < 0 ||
          me.popData.vol === null ||
          me.popData.vol === ''
        ) {
          copyPopData.vol = item.vol
        }
        if (
          me.popData.price < 0 ||
          me.popData.price === null ||
          me.popData.price === ''
        ) {
          copyPopData.price = item.price
        }
        if (me.popData.vol === '0' || me.popData.vol === '-' || me.popData.vol === '--') {
          copyPopData.vol = null
        }
        if (me.popData.price === '0' || me.popData.price === '-' || me.popData.price === '--') {
          copyPopData.price = null
        }
        // this.$set(this.tableList, itemIndex, JSON.parse(JSON.stringify(this.popData)))
        if (copyPopData.code) {
          me.$set(me.tableList[itemIndex], 'code', copyPopData.code)
          me.$set(me.tableList[itemIndex], 'name', copyPopData.name)
          me.$set(me.tableList[itemIndex], 'term', copyPopData.term)
          me.$set(me.tableList[itemIndex], 'eva', copyPopData.eva)
          me.$set(me.tableList[itemIndex], 'level', copyPopData.level)
        }
        me.$set(me.tableList[itemIndex], 'vol', copyPopData.vol)
        me.$set(me.tableList[itemIndex], 'price', copyPopData.price)
        if (copyPopData.bo) {
          me.$set(me.tableList[itemIndex], 'bo', copyPopData.bo)
        }
        if (copyPopData.org_name) {
          me.$set(me.tableList[itemIndex], 'org_name', copyPopData.org_name)
        }
        if (copyPopData.customer_name) {
          me.$set(
            me.tableList[itemIndex],
            'customer_name',
            copyPopData.customer_name
          )
        }
        me.$refs.hangqing.setCheckboxRow(me.tableList[itemIndex], true)
      })
      this.$message.success('批量修改数据成功', 1)
      this.visible = false
      this.popData = {
        is_hot: null,
        term: null,
        code: null,
        name: null,
        bo: undefined,
        price: null,
        xh: undefined,
        pri_eva: null,
        vol: null,
        volxh: null,
        org_name: null,
        customer_name: null,
        eva: null,
        level: null,
        operator_name: this.$store.getters.userInfo.name,
      }
    },
    release() {
      const me = this
      if (this.tableList.length < 1) {
        this.$message.error('没有可发布的报价', 1)
        return false
      }
      // 获取所有选中行
      var dataList = this.$refs.hangqing.getCheckboxRecords()
      if (dataList.length < 1) {
        this.$message.warning('请选择要发布的报价', 1)
        return false
      }
      // 错误行统计
      me.gsIndexArr = []
      me.goodArr = []
      me.tsInfo = []
      dataList.forEach((item) => {
        if (!item.org_name) {
          item.org_name = '国海证券'
        }
        if (!item.customer_name) {
          item.customer_name = this.$store.getters.userInfo.name
        }
        if (!item.code || !item.bo) {
          // 根据row获取索引（数组下标）
          me.gsIndexArr.push(this.$refs.hangqing.getRowIndex(item) + 1)
          var tsArr1 = []
          // var tsArr2 = []
          if (!item.code) {
            tsArr1.push('代码')
          }
          if (!item.bo) {
            tsArr1.push('方向')
          }
          if (tsArr1.length > 0) {
            this.tsInfo.push(
              `序号${this.$refs.hangqing.getRowIndex(item) + 1}${tsArr1.join(
                '、'
              )}不能为空;`
            )
          }
        } else {
          delete item.src
          me.goodArr.push(item)
        }
      })
      // 有错误数据进错误提示
      if (me.gsIndexArr.length > 0) {
        this.$confirm({
          title: <p style="color:#fef3bc;">提示</p>,
          content: (
            <div style="text-align:left;">
              {me.tsInfo.map((item) => (
                <p>{item}</p>
              ))}
              <p style="color:#fef3bc;">{dataList.length > 1 ? '是否继续发布其他报价？' : ''}</p>
            </div>
          ),
          width: 440,
          okText: '是',
          cancelText: '否',
          onCancel() {},
          onOk() {
            me.haveErrFb()
          },
        })
      } else {
        // 相同报价收集
        const qcArr = me.distinct(me.goodArr)
        qcArr.forEach((item, index) => {
          dataList.forEach((itemSon, indexSon) => {
            delete itemSon.src
            if (
              item.code === itemSon.code &&
              item.price === itemSon.price &&
              item.vol === itemSon.vol &&
              item.org_name === itemSon.org_name
            ) {
              if (!qcArr[index].countArr) {
                qcArr[index].countArr = [indexSon + 1]
              } else {
                qcArr[index].countArr.push(indexSon + 1)
              }
            }
          })
        })
        var titleArr = []
        qcArr.forEach((item) => {
          if (item.countArr.length > 1) {
            titleArr.push(item.countArr.join(','))
          }
        })
        console.log(titleArr)
        if (titleArr.length > 0) {
          this.$confirm({
            title: '提示',
            content: `序号${titleArr.join(
              '；'
            )}的报价、数量、机构名称完全相同，是否继续发布其他报价？`,
            okText: '是',
            cancelText: '否',
            onOk() {
              me.addBonds(dataList, 'sy')
            },
            onCancel() {},
          })
        } else {
          me.addBonds(dataList, 'sy')
        }
      }
    },
    // 选择数据有错误发布
    haveErrFb() {
      var dataList = this.$refs.hangqing.getCheckboxRecords()
      const me = this
      // 相同报价收集
      const qcArr = me.distinct(me.goodArr)
      qcArr.forEach((item, index) => {
        dataList.forEach((itemSon, indexSon) => {
          if (
            item.code === itemSon.code &&
            item.price === itemSon.price &&
            item.vol === itemSon.vol &&
            item.org_name === itemSon.org_name
          ) {
            if (!qcArr[index].countArr) {
              qcArr[index].countArr = [indexSon + 1]
            } else {
              qcArr[index].countArr.push(indexSon + 1)
            }
          }
        })
      })
      var titleArr = []
      qcArr.forEach((item) => {
        if (item.countArr.length > 1) {
          titleArr.push(item.countArr.join(','))
        }
      })
      if (me.gsIndexArr.length === dataList.length) {
        me.$message.error('没有可发布的报价', 1)
        return false
      }
      if (titleArr.length > 0) {
        me.$confirm({
          title: '提示',
          content: `序号${titleArr.join(
            '；'
          )}的报价、数量、机构名称完全相同，是否继续发布其他报价？`,
          okText: '是',
          cancelText: '否',
          onOk() {
            me.addBonds(me.goodArr, 'bf')
          },
          onCancel() {},
        })
      } else {
        me.addBonds(me.goodArr, 'bf')
      }
    },
    // 数组对象相同属性去重
    distinct(dataArr) {
      const cache = []
      for (const t of dataArr) {
        if (
          cache.find(
            (c) =>
              c.price === t.price &&
              c.vol === t.vol &&
              c.org_name === t.org_name
          )
        ) {
          continue
        }
        cache.push(t)
      }
      return JSON.parse(JSON.stringify(cache))
    },
    addBonds(dataList, successInfo) {
      this.tip = '发布中，请稍后'
      this.spinningFlag = true
      toRelease({
        loginOperator: this.$store.getters.userInfo.code,
        dataList: dataList,
      })
        // toRelease({ loginOperator: 'huh', dataList: dataList })
        .then((res) => {
          this.spinningFlag = false
          if (successInfo === 'bf') {
            this.$message.warning('部分报价发布成功', 1)
          } else if (successInfo === 'sy') {
            this.$message.success('所有报价发布成功', 1)
          }
          for (let i = 0; i < this.tableList.length; i++) {
            dataList.forEach((itemSon) => {
              if (this.tableList[i] === itemSon) {
                this.tableList.splice(i, 1)
                i--
              }
            })
          }
        })
        .catch(() => {
          this.spinningFlag = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
@themeColor: rgba(19, 108, 94, 0.5);
/deep/ .row--current {
  background-color: #aa6e3f !important;
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
/deep/ .vxe-cell--placeholder {
  opacity: 0.5;
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
/deep/ .col_12 {
  input {
    text-align: right;
  }
}
/deep/ .ant-select-selection__clear {
  display: none;
}
/deep/ .ant-input-clear-icon {
  color: @mainColor;
}
textarea::-webkit-input-placeholder {
  color: #509e66;
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
  > div {
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
    width: 800px;
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
        span {
          margin-right: 10px;
        }
        &:nth-child(2n + 1) {
          width: 45%;
          justify-content: flex-start;
        }
        &:nth-child(2n) {
          width: 55%;
          justify-content: flex-end;
        }
        input {
          width: 300px;
        }
        /deep/ .ant-select {
          width: 300px !important;
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
