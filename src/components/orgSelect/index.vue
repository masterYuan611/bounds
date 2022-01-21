<template>
  <a-auto-complete
    :value="value"
    :placeholder="placeholder"
    option-label-prop="value"
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
import { getOrgList } from '@/api/transactionDetail'
export default {
  name: 'OrgSelect',
  data() {
    return {
      dataSource: [],
    }
  },
  props: {
    value: String,
    placeholder: String
  },
  computed: {
    onSearch() {
      console.log(this.place)
      return this.$XEUtils.debounce((value) => {
        if (!value) return
        getOrgList({ name: value }).then(({ data }) => {
          this.dataSource = data.dataList
        })
      }, 300)
    },
  },
  methods: {
    handleCodeChange(value) {
      console.log(this.place)
      this.$emit('input', value)
      // 清空输入框时触发
      if (!value) {
        this.$emit('change', '')
      }
    },
    handleCodeSelect(value) {
      this.$emit('input', value)
      this.$emit('change', value)
      const select = this.dataSource.filter(item => item.name === value)
      this.$emit('selectOrgIdEmit', select[0].id)
      console.log(select)
    },
  },
}
</script>

<style lang="less" scoped>
</style>
