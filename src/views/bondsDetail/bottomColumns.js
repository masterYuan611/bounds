import { handleOnesDigitAlign, getTranDetailType } from '@/utils/util'

export default [
  {
    field: 'tran_type',
    title: '类型',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return getTranDetailType(row, h)
      }
    }
  },
  { field: 'term', title: '剩余期限', sortable: true },
  { field: 'code', title: '代码', sortable: true },
  {
    field: 'name',
    title: '简称',
    sortable: true,
    width: '160px'
  },
  {
    field: 'my_tran_price',
    title: '成交价格',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return [
          <div
            domPropsInnerHTML={handleOnesDigitAlign(row.my_tran_price, 4)}
          ></div>
        ]
      }
    }
  },
  {
    field: 'eva',
    title: '中债估值',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return [
          <div domPropsInnerHTML={handleOnesDigitAlign(row.eva, 4)}></div>
        ]
      }
    }
  },
  {
    field: 'pri_eva',
    // title: '成交-中债（BP）',
    title: '报价-中债（BP）',
    sortable: true,
    width: '150px',
    slots: {
      default: ({ row }, h) => {
        return [
          <div domPropsInnerHTML={handleOnesDigitAlign(row.pri_eva, 4)}></div>
        ]
      }
    }
  },
  {
    field: 'price_dt',
    title: '最后更新时间',
    sortable: true,
    width: '150px'
  },
  {
    field: 'state',
    title: '成交状态',
    sortable: true,
    width: '150px',
    slots: {
      default: ({ row }, h) => {
        const stateMap = {
          1: '未成交',
          2: '部分成交',
          3: '已成交',
          4: 'END'
        }
        return stateMap[row.state] || ''
      }
    }
  }
]
