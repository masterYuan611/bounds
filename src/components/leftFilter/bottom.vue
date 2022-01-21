<template>
  <div class="filter-bottom">
    <CtrlSelect
      title="产品"
      :options="typCodeis"
      :selected.sync="condition.bottom.typ_codei"
      :hasChange.sync="hasChange"
      @change="handleCtrlSelectChange"
    >
      <template slot="extra">
        <span
          class="product-R"
          :class="[rActive && 'active']"
          @click="handleProductR"
        >R</span>
        <span
          class="product-C"
          :class="[cActive && 'active']"
          @click="handleProductC"
        >C</span>
        <span class="hidden">--</span>
        <span class="hidden">--</span>
      </template>
    </CtrlSelect>
    <CtrlSelect
      title="期限"
      :options="terms"
      :selected.sync="condition.bottom.term"
      :hasChange.sync="hasChange"
      @change="handleCtrlSelectChange"
    >
      <div class="terms">
        <a-tooltip>
          <template slot="title">
            输入内容需添加单位，D表示天，Y表示年，如30D/1.5Y
          </template>
          <a-input v-model="condition.bottom.term_s" />
        </a-tooltip>
        <span class="divide">-</span>
        <a-tooltip>
          <template slot="title">
            输入内容需添加单位，D表示天，Y表示年，如30D/1.5Y
          </template>
          <a-input v-model="condition.bottom.term_e" />
        </a-tooltip>
        <span class="unit">D/Y</span>
        <a-button
          type="primary"
          @click="handleTermCustomer"
        >筛选</a-button>
      </div>
    </CtrlSelect>
    <!-- 永续债、城投、主体、债项、金融债、含权、特殊 -->
    <CtrlSelect
      v-for="(item, index) in simpleCtrSelects"
      :key="index"
      :title="item.title"
      :options="$data[`${item.key1}`]"
      :selected.sync="condition.bottom[`${item.key2}`]"
      :hasChange.sync="hasChange"
      @change="handleCtrlSelectChange"
    />
  </div>
</template>

<script>
import CtrlSelect from '../ctrlSelect'
import {
  typCodeis,
  terms,
  perpetualBonds,
  cityInvestments,
  issrRats,
  debts,
  financialDebts,
  localDebts,
  withRights,
  specials,
  simpleCtrSelects,
} from '@/utils/const'
import { mapGetters } from 'vuex'

export default {
  components: {
    CtrlSelect,
  },
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
  },
  data() {
    return {
      typCodeis, // 产品列表
      terms, // 期限列表
      perpetualBonds, // 永续债列表
      cityInvestments, // 城投
      issrRats, // 主体
      debts, // 债项
      financialDebts, // 金融债
      localDebts, // 地方债
      withRights, // 含权
      specials, // 特殊
      simpleCtrSelects, // 简单的ctrSelect
      hasChange: false, // 按住ctrl后是否点选了多选区选项
    }
  },
  computed: {
    ...mapGetters(['isCtrl']),
    rActive() {
      const products = this.condition.bottom.typ_codei
      const rList = ['国债', '央票', '金融债', '地方债']
      let flag = true
      for (let i = 0; i < rList.length; i++) {
        if (!products.includes(rList[i])) {
          flag = false
          break
        }
      }
      return flag
    },
    cActive() {
      const products = this.condition.bottom.typ_codei
      const cList = [
        '短债',
        '中票',
        '企业债',
        '公司债',
        'PPN',
        'NCD',
        'ABS',
        'CRM',
        '其他',
      ]
      let flag = true
      for (let i = 0; i < cList.length; i++) {
        if (!products.includes(cList[i])) {
          flag = false
          break
        }
      }
      return flag
    },
  },
  methods: {
    handleCtrlSelectChange() {
      if (this.condition.bottom.term) {
        this.condition.bottom.term_s = ''
        this.condition.bottom.term_e = ''
      }
      this.$emit('bottom-change')
    },
    handleTermCustomer() {
      const { term_s: termS, term_e: termE } = this.condition.bottom
      if (!termS && !termE) {
        this.$message.warning('请输入自定义期限值')
        return
      }
      const reg = /\d+[DY]?$/
      if (termS && !reg.test(termS)) {
        this.$message.warning('起始期限格式错误，请重新输入！')
        return
      }
      if (termE && !reg.test(termE)) {
        this.$message.warning('截止期限格式错误，请重新输入！')
        return
      }
      this.condition.bottom.term = ''
      this.$emit('bottom-change')
    },
    handleProductR() {
      this.$emit(
        'handle-product',
        ['国债', '央票', '金融债', '地方债'].join(',')
      )
    },
    handleProductC() {
      this.$emit(
        'handle-product',
        [
          '短债',
          '中票',
          '企业债',
          '公司债',
          'PPN',
          'NCD',
          'ABS',
          'CRM',
          '其他',
        ].join(',')
      )
    },
  },
  watch: {
    isCtrl: {
      handler(val) {
        // 释放ctrl键
        if (!val && this.hasChange) {
          this.$emit('bottom-change')
        }
        if (val) {
          this.hasChange = false
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
.filter-bottom {
  .product-R,
  .product-C {
    display: inline-block;
    width: 70px;
    height: 28px;
    line-height: 28px;
    border-radius: 2px;
    background: #2286bd !important;
    &.active {
      background: #74caf9 !important;
    }
  }
  .terms {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    font-size: @fontSize_14;
    color: rgba(255, 255, 255, 0.65);
    input {
      width: 60px;
      height: 32px;
    }
    .divide {
      width: 6px;
      margin: 0 8px;
    }
    .unit {
      padding: 0 8px;
    }
  }
}
</style>
