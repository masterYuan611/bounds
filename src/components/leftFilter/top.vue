<template>
  <div class="filter-top">
    <AutoComplete
      style="width: 100%;"
      v-model="condition.top.key_word"
      @change="handleCodeChange"
    />
    <div class="all-top">
      <span
        class="all"
        @click="handleReset"
      >SHOW ALL</span>
      <a-checkbox
        :checked="hotTop"
        @change="handleHotTop"
      >
        热点债券置顶
      </a-checkbox>
    </div>
    <a-radio-group
      name="radioGroup"
      v-model="condition.top.is_valid"
      @change="$emit('top-change')"
    >
      <a-radio value="0">
        有效报价
      </a-radio>
      <a-radio value="1">
        双边
      </a-radio>
    </a-radio-group>
    <div class="bid-ofr">
      <div class="bid-wrapper">
        <div class="bid">
          <span class="label">Bid</span>
          <a-input v-model="condition.top.bid_s" />
          <span class="divide">-</span>
          <a-input v-model="condition.top.bid_e" />
        </div>
        <div class="bid-bonds">
          <span class="name">|Bid-中债|</span>
          <span
            class="operate"
            @click="toggleBidBonds"
          >
            <img :src="require(`../../assets/images/${bidBondsFlag? 'greater' : 'less'}.png`)" />
          </span>
          <a-input
            v-if="bidBondsFlag"
            v-model="condition.top.bid_eva_ge"
          />
          <a-input
            v-else
            v-model="condition.top.bid_eva_le"
          />
        </div>
      </div>
      <div class="ofr-wrapper">
        <div class="ofr">
          <span class="label ofr-label">Ofr</span>
          <a-input v-model="condition.top.ofr_s" />
          <span class="divide">-</span>
          <a-input v-model="condition.top.ofr_e" />
        </div>
        <div class="ofr-bonds">
          <span class="name">|中债-Ofr|</span>
          <span
            class="operate"
            @click="toggleOfrBonds"
          >
            <img :src="require(`../../assets/images/${ofrBondsFlag? 'greater' : 'less'}.png`)" />
          </span>
          <a-input
            v-if="ofrBondsFlag"
            v-model="condition.top.eva_ofr_ge"
          />
          <a-input
            v-else
            v-model="condition.top.eva_ofr_le"
          />
        </div>

      </div>
      <div class="btn-wrapper">
        <a-button
          type="primary"
          @click="handleBidOfr"
        >筛选</a-button>
        <a-button
          type="primary"
          @click="handleBidOfrBonds"
        >筛选</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    condition: {
      type: Object,
      default() {
        return {
          top: {},
          bottom: {},
        }
      },
    },
    hotTop: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      bidBondsFlag: true, // true代表>=  false代表<=
      ofrBondsFlag: true, // true代表>=  false代表<=
      dataSource: [],
    }
  },
  methods: {
    handleReset() {
      this.$emit('top-change', 'reset')
      this.$emit('hot-top', false)
    },
    handleHotTop(e) {
      this.$emit('hot-top', e.target.checked)
    },
    handleBidOfr() {
      const {
        bid_s: bidS,
        bid_e: bidE,
        ofr_s: ofrS,
        ofr_e: ofrE,
      } = this.condition.top
      if (
        (bidS && isNaN(parseFloat(bidS))) ||
        (bidE && isNaN(parseFloat(bidE)))
      ) {
        this.$message.warning('请输入正确的买入价格！')
        return
      }
      if (bidS && bidE && parseFloat(bidS) > parseFloat(bidE)) {
        this.$message.warning('Bid右侧值必须大于左侧值！')
        return
      }
      if (
        (ofrS && isNaN(parseFloat(ofrS))) ||
        (ofrE && isNaN(parseFloat(ofrE)))
      ) {
        this.$message.warning('请输入正确的卖出价格！')
        return
      }
      if (ofrS && ofrE && parseFloat(ofrS) > parseFloat(ofrE)) {
        this.$message.warning('Ofr右侧值必须大于左侧值！')
        return
      }
      this.$emit('top-change')
    },
    handleBidOfrBonds() {
      const {
        bid_eva_ge: bidEvaGe,
        bid_eva_le: bidEvaLe,
        eva_ofr_ge: evaOfrGe,
        eva_ofr_le: evaOfrLe,
      } = this.condition.top
      if (
        (bidEvaGe && isNaN(parseFloat(bidEvaGe))) ||
        (bidEvaLe && isNaN(parseFloat(bidEvaLe)))
      ) {
        this.$message.warning('请输入正确的Bid-中债！')
        return
      }
      if (
        (evaOfrGe && isNaN(parseFloat(evaOfrGe))) ||
        (evaOfrLe && isNaN(parseFloat(evaOfrLe)))
      ) {
        this.$message.warning('请输入正确的中债-Ofr！')
        return
      }
      this.$emit('top-change')
    },
    toggleBidBonds() {
      if (this.bidBondsFlag) {
        this.condition.top.bid_eva_le = this.condition.top.bid_eva_ge
        this.condition.top.bid_eva_ge = ''
      } else {
        this.condition.top.bid_eva_ge = this.condition.top.bid_eva_le
        this.condition.top.bid_eva_le = ''
      }
      this.bidBondsFlag = !this.bidBondsFlag
      //   this.condition.top.bid_eva_ge = ''
      //   this.condition.top.bid_eva_le = ''
    },
    toggleOfrBonds() {
      if (this.ofrBondsFlag) {
        this.condition.top.eva_ofr_le = this.condition.top.eva_ofr_ge
        this.condition.top.eva_ofr_ge = ''
      } else {
        this.condition.top.eva_ofr_ge = this.condition.top.eva_ofr_le
        this.condition.top.eva_ofr_le = ''
      }
      this.ofrBondsFlag = !this.ofrBondsFlag
      //   this.condition.top.eva_ofr_ge = ''
      //   this.condition.top.eva_ofr_le = ''
    },
    handleCodeChange() {
      this.$emit('top-change', 'code')
    },
  },
}
</script>

<style lang="less" scoped>
.filter-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  //   padding-right: 10px;
  padding: 12px 10px 0 12px;
  color: rgba(255, 255, 255, 0.65);
  .all-top {
    display: flex;
    margin: 8px 0;
    .all {
      display: inline-block;
      padding: 2px 8px;
      margin-right: 32px;
      background: @blockBackground;
      border-radius: 2px;
      font-size: @fontSize_14;
      color: @mainColor;
    }
  }
  .bid-ofr {
    display: flex;
    margin-top: 10px;
    .btn-wrapper {
      display: flex;
      flex-direction: column;
      .ant-btn:last-child {
        margin-top: 8px;
      }
    }
    .bid-wrapper {
      margin-right: 16px;
    }
    .bid-wrapper,
    .ofr-wrapper {
      display: flex;
      flex-direction: column;
      .bid,
      .ofr {
        display: flex;
        align-items: center;
        .label {
          margin-right: auto;
          font-size: @fontSize_14;
        }
        .divide {
          width: 8px;
          margin: 0 8px;
        }
      }
      .bid-bonds,
      .ofr-bonds {
        display: flex;
        align-items: center;
        margin-top: 8px;
      }
      img {
        width: 16px;
      }
      .operate {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        margin: 0 8px 0 10px;
        border-radius: 2px;
        background: @blockBackground;
      }
      input {
        width: 60px;
        height: 32px;
      }
    }
  }
}
</style>
