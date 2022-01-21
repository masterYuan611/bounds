const pxtoviewport = require('postcss-px-to-viewport')

module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '报价板'
      return args
    })
  },
  configureWebpack: config => {
    config.entry.app = ['babel-polyfill', './src/main.js']
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#136C5E',
          'tooltip-color': '#f7e1af',
          'text-color': '#f7e1af',
          'btn-primary-color': '#f7e1af',
          'component-background': '#172422',
          'input-hover-border-color': '#136C5E',
          'select-item-selected-bg': '#136C5E',
          'input-placeholder-color': 'rgba(255, 255, 255, 0.25)',
          'checkbox-check-color': '#172422',
          'border-color-base': 'rgba(255, 255, 255, 0.2)',
          'tooltip-bg': '#136C5E'
        },
        globalVars: {
          fontSize_12: '12px',
          fontSize_14: '14px',
          fontSize_16: '16px',
          fontSize_18: '18px',
          fontFamily:
            'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,Microsoft YaHei, Arial, sans-serif',
          mainColor: '#F7E1AF',
          blockBackground: '#136C5E'
        },
        javascriptEnabled: true
      },
      postcss: {
        plugins: [
          pxtoviewport({
            viewportWidth: 1920,
            minPixelValue: 0
            // propList: ['*', '!font-size']
            // exclude: /(\/|\\)(node_modules)(\/|\\)/
          })
        ]
      }
    }
  },
  devServer: {
    open: true,
    proxy: {
      '/bond': {
        target: 'https://tglmcs.ghzq.com.cn:5390', // target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: true // proxy websockets
      }
    }
  }
}
