import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import nprogress from 'nprogress'

// 跳转相同路径页面报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login')
  },
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/layout',
    component: () => import('@/views/layouts'),
    redirect: '/layout/optimalBonds',
    children: [
      {
        name: 'optimalBonds',
        path: 'optimalBonds',
        component: () =>
          import(/* webpackChunkName: "optimalBonds" */ '@/views/optimalBonds'),
        meta: {
          title: '最优报价'
        }
      },
      {
        name: 'tradeGroup',
        path: 'tradeGroup',
        component: () =>
          import(/* webpackChunkName: "tradeGroup" */ '@/views/tradeGroup'),
        meta: {
          title: '现券报价'
        }
      },
      {
        name: 'newTransaction',
        path: 'newTransaction',
        component: () =>
          import(
            /* webpackChunkName: "newTransaction" */ '@/views/newTransaction'
          ),
        meta: {
          title: '新增成交'
        }
      },
      {
        name: 'transactionDetails',
        path: 'transactionDetails',
        component: () =>
          import(
            /* webpackChunkName: "transactionDetails" */ '@/views/transactionDetails'
          ),
        meta: {
          title: '成交明细'
        }
      },
      {
        name: 'newBonds',
        path: 'newBonds',
        component: () =>
          import(/* webpackChunkName: "newBonds" */ '@/views/newBonds'),
        meta: {
          title: '新增报价'
        }
      },
      {
        name: 'oldBonds',
        path: 'oldBonds',
        component: () =>
          import(/* webpackChunkName: "oldBonds" */ '@/views/oldBonds'),
        meta: {
          title: '历史报价'
        }
      },
      {
        name: 'myBonds',
        path: 'myBonds',
        component: () =>
          import(/* webpackChunkName: "myBonds" */ '@/views/myBonds'),
        meta: {
          title: '我的报价'
        }
      },
      {
        name: 'bondsDetail',
        path: 'bondsDetail',
        component: () =>
          import(/* webpackChunkName: "bondsDetail" */ '@/views/bondsDetail'),
        meta: {
          title: '报价详情'
        }
      },
      {
        name: 'setting',
        path: 'setting',
        component: () =>
          import(/* webpackChunkName: "setting" */ '@/views/setting'),
        meta: {
          title: '系统设置'
        }
      },
      {
        name: 'communicateBar',
        path: 'communicateBar',
        component: () =>
          import(
            /* webpackChunkName: "communicateBar" */ '@/views/communicateBar'
          ),
        meta: {
          title: '交流吧'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  nprogress.start()
  store.commit('app/setCurrentPath', to.fullPath)
  next()
})

router.afterEach(() => {
  nprogress.done()
})

export default router
