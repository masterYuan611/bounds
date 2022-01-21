/* eslint-disable indent */
import { handleOnesDigitAlign } from '@/utils/util'

export default [
  {
    field: 'is_hot',
    width: '50px',
    slots: {
      default: ({ row }, h) => {
        return row.is_hot === '1'
          ? [<img src={require('../../assets/images/hot.png')} width="22" />]
          : null
      }
    }
  },
  {
    field: 'type',
    width: '70px',
    title: '类型',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        const color =
          row.type === 'TKN'
            ? '#177DDC'
            : row.type === 'GVN'
            ? '#BD7B22'
            : row.type === 'TRD'
            ? '#8CBA16'
            : null
        return [<span style={{ color }}>{row.type}</span>]
      }
    }
  },
  { field: 'term', title: '剩余期限', sortable: true },
  { field: 'code', title: '代码', sortable: true },
  {
    field: 'name',
    title: '简称',
    sortable: true,
    align: 'left',
    width: '140px'
  },
  {
    field: 'price',
    width: '100px',
    title: '成交价格',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return [
          <div domPropsInnerHTML={handleOnesDigitAlign(row.price, 4)}></div>
        ]
      }
    }
  },
  {
    field: 'eva',
    width: '100px',
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
    field: 'tran_eva',
    title: '成交-中债（BP）',
    sortable: true,
    width: '130px',
    slots: {
      default: ({ row }, h) => {
        return [
          <div domPropsInnerHTML={handleOnesDigitAlign(row.tran_eva, 4)}></div>
        ]
      }
    }
  },
  {
    field: 'tran_dt',
    title: '最后更新时间',
    sortable: true,
    width: '150px'
  }
]
