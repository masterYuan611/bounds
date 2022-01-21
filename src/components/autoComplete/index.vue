<template>
  <a-auto-complete
    :value="value"
    allowClear
    placeholder="请输入债券代码、简称搜索"
    option-label-prop="value"
    @focus="onFocus"
    @blur="blur"
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AutoComplete',
  data() {
    return {
      dataSource: [],
    }
  },
  props: {
    value: String,
  },
  computed: {
    ...mapGetters(['searchHistory']),
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
        if (!value) this.$emit('change', '') // 清除操作
        const item = this.dataSource.find((i) => i.code === value)
        if (item) {
          this.$emit('change', value || '')
          this.setSearchHistory(item)
        }
        if (!value) {
          this.dataSource = this.searchHistory
        }
      }, 500)
    },
  },
  methods: {
    ...mapMutations('app', ['setSearchHistory']),
    handleChange(value) {
      this.$emit('input', value || '')
      this.handleCodeChange(value)
    },
    blur(value) {
      this.$emit('blur', value)
    },
    handleCodeSelect(value) {
      //   const item = this.dataSource.find((i) => i.code === value)
      //   this.setSearchHistory(item)
      //   this.$emit('input', value)
      //   this.$emit('change', value)
      this.$emit('select', value)
    },
    onFocus() {
      if (!this.value) {
        this.dataSource = this.searchHistory
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>
