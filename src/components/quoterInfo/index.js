import quoter from './index.vue'

export default {
  install(Vue, options) {
    const QuoterInfo = Vue.extend(quoter)
    const component = new QuoterInfo({
      el: document.createElement('div')
    })
    document.body.appendChild(component.$el)

    if (options) {
    }

    const methods = {
      show({ position, list }) {
        component.show = false
        Vue.prototype.$nextTick(() => {
          component.show = true
          component.position = position
          component.list = list
        })
      },
      hide() {
        component.show = false
      }
    }
    Vue.prototype.$quoter = methods
  }
}
