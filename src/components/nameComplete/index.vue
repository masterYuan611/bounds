<template>
  <a-auto-complete
    :value="value"
    placeholder="请输入简称"
    option-label-prop="value"
    @search="onSearch"
    @select="handleCodeSelect"
    @change="handleChange"
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
import { getBondListPreN } from '@/api/optimalBonds'
export default {
  name: 'NameComplete',
  data() {
    return {
      dataSource: [],
    }
  },
  props: {
    value: String,
  },
  computed: {
    onSearch() {
      return this.$XEUtils.debounce((value) => {
        if (!value) return
        getBondListPreN({ code: value, n: 5 }).then(({ data }) => {
          this.dataSource = data.dataList
        })
      }, 300)
    },
    handleCodeChange() {
      return this.$XEUtils.debounce((value) => {
        this.$emit('change', value || '')
      }, 500)
    },
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value || '')
      this.handleCodeChange(value)
    },
    handleCodeSelect(value) {
      this.$emit('select', value)
    },
  },
}
</script>

<style lang="less" scoped>
</style>
