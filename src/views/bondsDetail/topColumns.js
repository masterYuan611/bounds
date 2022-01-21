import { handleOnesDigitAlign } from '@/utils/util'

const getHoverTitle = (row, field, titleField, h) => {
  if (row[titleField]) {
    return [
      <div
        domPropsInnerHTML={handleOnesDigitAlign(row[field], 4)}
        title={row[titleField]}
      ></div>
    ]
  } else {
    return [<div domPropsInnerHTML={handleOnesDigitAlign(row[field], 4)}></div>]
  }
}

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
  { field: 'term', title: '剩余期限', sortable: true },
  { field: 'code', title: '代码', sortable: true },
  {
    field: 'name',
    title: '简称',
    sortable: true,
    width: '120px'
  },
  {
    field: 'vol_bid',
    title: 'Vol.Bid',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return getHoverTitle(row, 'vol_bid', 'vol_bid_title', h)
      }
    }
  },
  {
    field: 'bid',
    title: 'Bid',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return getHoverTitle(row, 'bid', 'bid_title', h)
      }
    }
  },
  {
    field: 'vol_ofr',
    title: 'Vol.Ofr',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return getHoverTitle(row, 'vol_ofr', 'vol_ofr_title', h)
      }
    }
  },
  {
    field: 'ofr',
    title: 'Ofr',
    sortable: true,
    slots: {
      default: ({ row }, h) => {
        return getHoverTitle(row, 'ofr', 'ofr_title', h)
      }
    }
  },
  { field: 'b_coupon', title: '票息', sortable: true },
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
    field: 'tran_eva',
    title: '成交-中债（BP）',
    sortable: true,
    width: '150px',
    slots: {
      default: ({ row }, h) => {
        return [
          <div domPropsInnerHTML={handleOnesDigitAlign(row.tran_eva, 4)}></div>
        ]
      }
    }
  },
  { field: 'modified_d', title: '中债久期', sortable: true },
  { field: 'level', title: '主/债', sortable: true },
  {
    field: 'bid_eva',
    title: 'bid-中债（BP）',
    sortable: true,
    width: '150px'
  },
  {
    field: 'eva_ofr',
    title: '中债-ofr(BP)',
    sortable: true,
    width: '150px'
  },
  { field: 'group_names', title: '员工组', sortable: true },
  {
    field: 'price_dt',
    title: '最后更新时间',
    sortable: true,
    width: '150px'
  }
]
