<template>
  <div class="bonds-detail">
    <div class="bonds-info">
      <div class="top">
        <span>{{bondsInfo.name}}</span>
        <span>{{bondsInfo.code}}</span>
        <span>{{bondsInfo.bIssuer}}</span>
      </div>
      <div class="bottom">
        <span>剩余期限：{{bondsInfo.term}}</span>
        <span>票面利率：{{bondsInfo.bCoupon}}</span>
        <span>主体评级：<i class="special">{{bondsInfo.issrRat}}</i></span>
        <span>债项评级：<i class="special">{{bondsInfo.ratLvl}}</i></span>
        <span>中债：{{bondsInfo.eveNetprice.split(' ')[0] }}<i class="special number">{{bondsInfo.eveNetprice.split(' ')[1] || '--' }}</i></span>
        <span>中证：{{bondsInfo.tzzEveNetprice.split(' ')[0] }}<i class="special number">{{bondsInfo.tzzEveNetprice.split(' ')[1] || '--' }}</i></span>
      </div>
    </div>
    <div class="main">
      <div class="top">
        <!-- <div class="header">
          <span>最优报价</span>
        </div> -->
        <div class="operate-line">
          <span class="title">最优报价</span>
          <img
            src="../../assets/images/download.png"
            @click="handleTopDownload"
          />
        </div>
        <div class="table-wrapper">
          <vxe-grid
            ref="hangqing"
            v-bind="gridOptions"
            :columns="topColumns"
            :data="topData"
            :row-class-name="getRowClassName"
            @menu-click="handleContextMenuClick"
            @cell-menu="handleCellMenu"
            @cell-click="handleCellClick"
          ></vxe-grid>
        </div>
      </div>
      <div class="bottom">
        <div class="header">
          <Grouping :active.sync="bottomGroup" />
        </div>
        <div class="operate-line">
          <span class="title">市场动向({{priceCount}})</span>
          <span class="title total">今日全市场成交笔数：{{tranCount}}</span>
          <a-checkbox v-model="isOnlyTran">
            仅显示成交
          </a-checkbox>
          <img
            src="../../assets/images/download.png"
            @click="handleBottomDownload"
          />
        </div>
        <div class="table-wrapper">
          <BottomGrid
            ref="bottomGrid"
            :bottomGroup="bottomGroup"
            :id="id"
            :code="code"
            :isOnlyTran="isOnlyTran"
            @updateCount="handleCount"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Grouping from '@/components/grouping'
import topColumns from './topColumns'
import topGrid from './topGrid.js'
import {
  getBondPriceDetailByCode,
  exportDetailBestPage,
} from '@/api/bondsDetail'
import { mapGetters } from 'vuex'
import BottomGrid from './bottomGrid.vue'
import { downloadFile } from '@/utils/util'

export default {
  mixins: [topGrid],
  components: {
    Grouping,
    BottomGrid,
  },
  data() {
    return {
      bottomGroup: '',
      topColumns,
      topData: [],
      bondsInfo: {
        name: '',
        code: '',
        bIssuer: '',
        issrRat: '',
        ratLvl: '',
        eveNetprice: '',
        tzzEveNetprice: '',
      },
      tranCount: 0,
      priceCount: 0,
      isOnlyTran: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'socketDataList']),
    id() {
      return this.$route.query.id
    },
    code() {
      return this.$route.query.code
    },
  },
  created() {
    this.getTopData()
  },
  mounted() {
    document.addEventListener('click', () => {
      this.$quoter.hide()
    })
  },
  methods: {
    handleCount(obj) {
      this.tranCount = obj.tranCount
      this.priceCount = obj.priceCount
    },
    handleTopDownload() {
      this.$nprogress.start()
      exportDetailBestPage({
        code: this.code,
        user_id: this.userInfo.id,
      })
        .then((data) => {
          return downloadFile(data, '最优报价')
        })
        .then(() => {
          this.$nprogress.done()
        })
    },
    handleBottomDownload() {
      this.$refs.bottomGrid.download()
    },
    getTopData() {
      getBondPriceDetailByCode({
        code: this.code,
        user_id: this.userInfo.id,
      }).then(({ data }) => {
        const {
          priceBest,
          name,
          code,
          b_issuer: bIssuer,
          issr_rat: issrRat,
          rat_lvl: ratLvl,
          eve_netprice: eveNetprice,
          tzz_eve_netprice: tzzEveNetprice,
          b_coupon: bCoupon,
          term,
        } = data
        this.topData = Object.keys(priceBest).length > 0 ? [priceBest] : []
        this.bondsInfo = {
          name,
          code,
          bIssuer,
          issrRat,
          ratLvl,
          eveNetprice,
          tzzEveNetprice,
          bCoupon,
          term,
        }
      })
    }, // 表格行特殊class
    getRowClassName({ row }) {
      if (row.active) {
        return 'newest-row'
      } else if (
        row.price_user_ids &&
        row.price_user_ids.includes(this.userInfo.id)
      ) {
        return 'my-row'
      }
    },
    setStatus(item) {
      this.$set(item, 'active', true)
      setTimeout(() => {
        this.$set(item, 'active', false)
      }, 5000)
    },
    // 行情数据更新推送
    handleSocketData(list) {
      for (let i = 0; i < list.length; i++) {
        const { flag, map } = list[i]
        if (flag === 'update') {
          const index = this.topData.findIndex((item) => item.id === map.id)
          if (index === -1) return
          this.topData.splice(
            index,
            1,
            Object.assign({}, this.topData[index], map)
          )
          this.setStatus(this.topData[index])
        } else if (flag === 'del') {
          const index = this.topData.findIndex((item) => item.id === map.id)
          if (index > -1) {
            this.topData.splice(index, 1)
            this.$refs.bottomGrid.clearData()
          }
        }
      }
    },
    // 热点更新推送
    handleSocketHotData(list) {
      for (let i = 0; i < list.length; i++) {
        const { map } = list[i]
        const { fine_id: fineId, is_hot: isHot } = map
        const index = this.topData.findIndex((item) => item.id === fineId)
        if (index === -1) return
        if (isHot === '1') {
          this.topData[index].is_hot = '1'
          this.setStatus(this.topData[index])
        } else {
          this.topData[index].is_hot = '0'
          this.setStatus(this.topData[index])
        }
      }
    },
    // 行情成交-中债更新
    handleSocketTranEvaData(list) {
      for (let i = 0; i < list.length; i++) {
        const { map } = list[i]
        const { fine_id: fineId, tran_eva: tranEva } = map
        if (!fineId) return
        const index = this.topData.findIndex((item) => item.id === fineId)
        if (index > -1) {
          this.topData[index].tran_eva = tranEva
          this.setStatus(this.topData[index])
        }
      }
    },
  },
  watch: {
    socketDataList: {
      deep: true,
      handler({ message_type: messageType, dataList }) {
        if (messageType === 'Type_homepage_fine') {
          this.handleSocketData(dataList)
        }
        if (messageType === 'Type_homepage_hot_bond') {
          this.handleSocketHotData(dataList)
        }
        if (messageType === 'Type_homepage_tran_eva') {
          this.handleSocketTranEvaData(dataList)
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
.bonds-detail {
  display: flex;
  flex-direction: column;
  .bonds-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 74px;
    padding: 13px;
    text-align: left;
    border: 1px solid rgba(19, 108, 94, 0.5);
    .top {
      color: #fef3bc;
      > span {
        margin-right: 28px;
      }
    }
    .bottom {
      font-size: @fontSize_14;
      > span {
        margin-right: 24px;
        .special {
          color: #bd7b22;
          &.number {
            margin-left: 8px;
          }
        }
      }
    }
  }
  .main {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    .top,
    .bottom {
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(19, 108, 94, 0.5);
      border-radius: 2px;
      .header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }
      .table-wrapper {
        flex: 1;
        height: 0;
        margin: 0 12px 8px 12px;
      }
    }
    .top {
      height: 140px;
      .header span {
        width: 95px;
        height: 32px;
        line-height: 32px;
        margin-right: 8px;
        border-radius: 2px 2px 0px 0px;
        cursor: pointer;
        background: @blockBackground;
      }
      .title {
        margin-right: auto;
      }
    }
    .bottom {
      flex: 1;
      margin-top: 16px;
    }
    .operate-line {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 48px;
      .title {
        font-size: @fontSize_16;
        color: rgba(255, 255, 255, 0.65);
        &.total {
          margin-left: 80px;
          margin-right: auto;
        }
      }
      > img {
        width: 20px;
        margin-left: 22px;
        cursor: pointer;
      }
    }
  }
  /deep/ .ant-dropdown {
    .quoter-list {
      width: 680px;
      height: 206px;
      padding: 20px 0 20px 20px;
      background-color: #203e3e;
      font-size: @fontSize_14;
      text-align: left;
      .title {
        font-size: @fontSize_16;
        margin-bottom: 4px;
      }
      > li {
        display: flex;
        margin-top: 9px;
        .bovol {
          width: 80px;
        }
        .name {
          width: 140px;
        }
        .phone {
          width: 170px;
        }
        .qq {
          width: 180px;
        }
        .is_ask {
          flex: 1;
        }
      }
    }
    .hover-title {
      padding: 12px;
      background-color: #203e3e;
      font-size: @fontSize_14;
    }
  }
}
</style>
