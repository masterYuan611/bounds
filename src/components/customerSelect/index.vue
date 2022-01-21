<template>
  <a-auto-complete
    :value="value"
    placeholder="请输入买方交易员"
    option-label-prop="value"
    @focus="onFocus"
    @search="onSearch"
    @select="handleCodeSelect"
    @change="handleCodeChange"
    allow-clear
  >
    <template slot="dataSource">
      <a-select-option
        v-for="item in dataSource"
        :key="item.name"
      >
        <span>{{item.name}}</span>
      </a-select-option>
    </template>
  </a-auto-complete>
</template>

<script>
import { getCustomerList } from '@/api/transactionDetail'
export default {
  name: 'CustomerSelect',
  data() {
    return {
      dataSource: [],
    }
  },
  props: {
    value: String,
    placeholder: String,
    orgId: String
  },
  computed: {
    onSearch() {
      return this.$XEUtils.debounce((value) => {
        if (!this.orgId) return
        getCustomerList({ name: value, org_id: this.orgId }).then(({ data }) => {
          this.dataSource = data.dataList
        })
        // this.getCustomerList(value)
      }, 300)
    },
  },
  methods: {
    getCustomerList(name) {
      getCustomerList({ name: name, org_id: this.orgId }).then(({ data }) => {
        this.dataSource = data.dataList
      })
    },
    onFocus() {
      this.onSearch()
    },
    handleCodeChange(value) {
      this.$emit('input', value)
      // 清空输入框时触发
      if (!value) {
        this.$emit('change', '')
      }
    },
    handleCodeSelect(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
  },
}
</script>

<style lang="less" scoped>
</style>
