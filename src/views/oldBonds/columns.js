export default [
  {
    field: 'page',
    title: '',
    width: 40,
    fixed: 'left',
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
  // { type: 'checkbox', width: 43, fixed: 'left' },
  { type: 'seq', title: '序号', width: 44, fixed: 'left' },
  {
    field: 'tran_type',
    title: '类型',
    width: 62,
    fixed: 'left',
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        let renderColor = ''
        switch (row.tran_type) {
          case 'GVN':
            renderColor = 'redState'
            break
          case 'TRD':
            renderColor = 'greenState'
            break
          case 'TKN':
            renderColor = 'blueState'
            break
        }
        return [<span class={renderColor}>{row.tran_type}</span>]
      }
    }
  },
  {
    field: 'term',
    title: '剩余期限',
    width: 100,
    fixed: 'left',
    sortable: true
  },
  { field: 'code', title: '代码', width: 102, fixed: 'left', sortable: true },
  { field: 'name', title: '简称', width: 148, fixed: 'left', sortable: true },
  { field: 'bo', title: '方向', width: 62, sortable: true },
  {
    field: 'price',
    title: '报价',
    width: 100,
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
    field: 'my_tran_price',
    title: '成交价',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.my_tran_price.toString()
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
  { field: 'is_ask', title: '是否请示', width: 88, sortable: true },
  {
    field: 'pri_eva',
    title: '报价-中债(BP)',
    width: 128,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.pri_eva.toString()
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
    field: 'vol',
    title: '面额',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.vol.toString()
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
    field: 'tran_amt_total',
    title: '成交额',
    width: 100,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.tran_amt_total.toString()
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
  { field: 'volxh', title: '备注', width: 70, sortable: true },
  { field: 'org_name', title: '对手机构', width: 120, sortable: true },
  { field: 'customer_name', title: '对手交易员', width: 120, sortable: true },
  {
    field: 'eva',
    title: '中债估值',
    width: 105,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        const val = row.eva.toString()
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
  { field: 'level', title: '主/债', width: 98, sortable: true },
  { field: 'operator_name', title: '报价人', width: 120, sortable: true },
  { field: 'price_dt', title: '报价时间', width: 149, sortable: true },
  { field: 'src', title: '报价来源', width: 94, sortable: true },
  {
    field: 'state',
    title: '成交状态',
    width: 89,
    sortable: true,
    slots: {
      // 使用 JSX 渲染
      default: ({ row }, h) => {
        let renderText = ''
        switch (row.state) {
          case '1':
            renderText = '未成交'
            break
          case '2':
            renderText = '部分成交'
            break
          case '3':
            renderText = '已成交'
            break
          case '4':
            renderText = 'END'
            break
          case '5':
            renderText = '失效'
            break
        }
        return [<span>{renderText}</span>]
      }
    }
  }
]
