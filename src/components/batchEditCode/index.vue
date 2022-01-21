<template>
  <a-auto-complete
    :value="value"
    placeholder="请输入代码"
    option-label-prop="value"
    @search="onSearch"
    @select="handleCodeSelect"
    @change="handleChange"
  >
    <template slot="dataSource">
      <a-select-option
        v-for="item in dataSource"
        :key="item.code"
      >
        <a-tooltip placement="right">
          <template slot="title">
            {{item.code}}({{item.name}})
          </template>
          <span
            class="auto-span"
            style="display: inline-block;width: 30%"
          >{{item.code}}</span>
          <span
            class="auto-span"
            style="display: inline-block;width: 50%"
          >{{item.name}}</span>
        </a-tooltip>
      </a-select-option>
    </template>
  </a-auto-complete>
</template>

<script>
import { getBondListPreN } from '@/api/optimalBonds'
export default {
  name: 'BatchEditCode',
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
