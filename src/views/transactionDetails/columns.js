export default [
  {
    field: 'page',
    title: '',
    width: 40,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (row.is_hot === '1') {
          return [
            <img style="width:20px;" src={require('@/assets/images/hot.png')} />
          ]
        } else {
          return [<span></span>]
        }
      }
    }
  },
  { type: 'seq', title: '序号', width: 44 },
  {
    field: 'type',
    title: '类型',
    width: 62,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        return [<span class={getColor(row.type)}>{row.type}</span>]
      }
    }
  },
  {
    field: 'term',
    title: '剩余期限',
    width: 100,
    sortable: true
  },
  { field: 'code', title: '代码', width: 102, sortable: true },
  { field: 'name', title: '简称', width: 148, sortable: true },
  {
    field: 'eva',
    title: '中债估值',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.eva.toString()
        let beforeNum = ''
        let afterNum = ''
        if (!row.eva) {
          return [<span>--</span>]
        }
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  {
    field: 'level',
    title: '主/债',
    width: 70,
    sortable: true
  },
  {
    field: 'bo',
    title: '方向',
    width: 66,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (row.bo) {
          return [<span>{row.bo}</span>]
        } else {
          return [<span>--</span>]
        }
      }
    }
  },
  {
    field: 'seek_price',
    title: '报价',
    width: 88,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (!row.seek_price) {
          return [<span>--</span>]
        }
        const val = row.seek_price.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  {
    field: 'price',
    title: '成交价',
    width: 128,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.price.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  {
    field: 'seek_vol',
    title: '面额',
    width: 70,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (!row.seek_vol) {
          return [<span>--</span>]
        }
        const val = row.seek_vol.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  {
    field: 'amount',
    title: '成交额',
    width: 80,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.amount.toString()
        let beforeNum = ''
        let afterNum = ''
        if (val.indexOf('.') > -1) {
          beforeNum = val.substring(0, val.indexOf('.'))
          afterNum = val.substring(val.indexOf('.'))
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{beforeNum}</span>
              <span style="width: 50%;text-align: left;">{afterNum}</span>
            </div>
          ]
        } else {
          return [
            <div style="display: flex;justify-content: center;">
              <span style="width: 50%;text-align: right;">{val}</span>
              <span style="width: 50%;text-align: left;"></span>
            </div>
          ]
        }
      }
    }
  },
  { field: 'tran_user_name', title: '成交人', width: 80, sortable: true },
  { field: 'strategy_names', title: '策略类型', width: 97, sortable: true },
  { field: 'buy_org_name', title: '买方机构', width: 109, sortable: true },
  {
    field: 'buy_customer_name',
    title: '买方交易员',
    width: 105,
    sortable: true
  },
  { field: 'sell_org_name', title: '卖方机构', width: 98, sortable: true },
  {
    field: 'sell_customer_name',
    title: '卖方交易员',
    width: 149,
    sortable: true
  },
  {
    field: 'seek_src',
    title: '报价来源',
    width: 94,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (row.seek_src) {
          return [<span>{row.seek_src}</span>]
        } else {
          return [<span>--</span>]
        }
      }
    }
  },
  {
    field: 'src',
    title: '成交来源',
    width: 89,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        if (row.src === '1') {
          return [<span>非中介</span>]
        } else if (row.src === '2') {
          return [<span>中介</span>]
        } else {
          return [<span>--</span>]
        }
      }
    }
  },
  { field: 'tran_dt', title: '成交时间', width: 140, sortable: true },
  {
    field: 'cjzt',
    title: '操作',
    width: 89,
    fixed: 'right',
    slots: {
      default: ({ row }, h) => {
        return [
          <a-button
            class= {getAnnulableClass(row.annulable)}
            disabled={row.annulable}
            onClick={() => window.annul(row)}
          >
            撤销
          </a-button>
        ]
      }
    }
  }
]

function getColor(type) {
  let className = ''
  switch (type) {
    case 'GVN':
      className = 'redState'
      break
    case 'TRD':
      className = 'greenState'
      break
    case 'TKN':
      className = 'blueState'
      break
  }
  return className
}

function getAnnulableClass(isAnnulable) {
  if (!isAnnulable) {
    return 'annulable'
  }
  return 'unannulable'
}
