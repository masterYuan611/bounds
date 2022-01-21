import Vue from 'vue'
import keepAlive from './keep-alive'

export default {
  install: () => {
    Vue.component('keep-cache', keepAlive)
  }
}
