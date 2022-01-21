<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data() {
    return {
      locale: zhCN,
    }
  },
  mounted() {
    const me = this
    window.onresize = function () {
      if (
        document.querySelector('.oldBondsPage') ||
        document.querySelector('.myBondsPage') ||
        document.querySelector('.transactionDetailsPage')
      ) {
        me.oldBondsPage()
      } else if (
        document.querySelector('.newBondsPage') ||
        document.querySelector('.newTransactionPage')
      ) {
        me.newBondsPage()
      }
    }
  },
  methods: {
    // 表格高度计算
    oldBondsPage() {
      setTimeout(() => {
        var documenH = document.querySelector('.main').clientHeight
        var countHeight = document.querySelector('.searchDiv').clientHeight
        var tableTitle = document.querySelector('.tableTitle').clientHeight
        var tableDivHeight = documenH - countHeight - tableTitle
        document.querySelector('.tableDiv').style.height = `${
          tableDivHeight - 10
        }px`
        document.querySelector('.gridDiv').style.height = `${
          document.querySelector('.tableDiv').clientHeight -
          document.querySelector('.tableTitle').clientHeight -
          30
        }px`
      }, 20)
    },
    // 表格高度控制
    newBondsPage() {
      setTimeout(() => {
        var documenH = document.querySelector('.main').clientHeight
        var countHeight = document.querySelector('.topDiv').clientHeight
        countHeight += document.querySelector('.btnDiv').clientHeight
        var tableDivHeight = documenH - countHeight
        document.querySelector('.tableDiv').style.height = `${
          tableDivHeight - 10
        }px`
        document.querySelector('.gridDiv').style.height = `${
          document.querySelector('.gridDiv').clientHeight - document.querySelector('.btnDiv').clientHeight - 30
        }px`
      }, 20)
    },
  },
}
</script>
<style lang="less">
#app {
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: @fontSize_14;
}
::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
.vxe-table--render-default .vxe-table--body-wrapper {
  background-color: rgba(87, 172, 109, 0) !important;
}
</style>
