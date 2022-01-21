<template>
  <div class="login">
    <a-spin :tip="tip" />
  </div>
</template>

<script>
import { Spin } from 'ant-design-vue'
import { getQueryString } from '@/utils/util'
import { login } from '@/api/user'
import { mapMutations } from 'vuex'

export default {
  components: {
    [Spin.name]: Spin,
  },
  data() {
    return {
      code: '',
      tip: '正在登录',
    }
  },
  mounted() {
    // 重新进入应用时先清除登录信息
    this.setUserInfo({})
    this.setAuthorization()
    // this.updateCachedPath([])

    const code = getQueryString('code')
    if (!code) {
      this.$message.error('未取到身份信息,请重新进入')
      this.tip = '请重新进入应用'
      return
    }
    this.code = code
    this.handleLogin()
  },
  methods: {
    ...mapMutations('user', ['setUserInfo', 'setAuthorization']),
    ...mapMutations('app', ['updateCachedPath']),
    handleLogin() {
      login({ code: this.code })
        .then(({ data }) => {
          this.$message.success('登录成功')
          this.setUserInfo(data)
          this.setAuthorization(data.Authorization)
          const state = getQueryString('state')
          this.$router.push(`/layout/${state}`, () => {
            window.location.reload()
          })
        })
        .catch(() => {
          this.tip = '登录失败'
        })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
