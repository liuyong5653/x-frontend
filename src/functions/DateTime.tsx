/**
 * @author weixuefeng@diynova.com
 * @time  2021/8/20 2:10 下午
 * @description:
 * @copyright (c) 2021 Newton Foundation. All rights reserved.
 */
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
// import DateCountdown from 'react-date-countdown-timer'

// timestamp using unix timestamp in milliseconds

// Convert timestamp to YYYY-MM-DD HH:MM:SS
export function DateTime(timestamp = Date.now()) {
  return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
}

// Convert timestamp to relative time string
export function RelativeTime(timestamp = Date.now()) {
  let { t } = useTranslation()
  moment.locale(t('time locale'))
  return moment(timestamp).fromNow()
}

export function RelativeTimeLocale(timestamp = Date.now(), locale = 'en-us') {
  moment.locale(locale)
  return moment(timestamp * 1000).fromNow()
}

// Countdown using DateCountdown
// export function Countdown(timestampInS = 0) {
//   let { t } = useTranslation()
//   return CountdownLocale(timestampInS, t('time locale'))
// }

// export function CountdownLocale(timestampInS = 0, locale = 'en-us') {
//   const _time = moment(timestampInS * 1000)
//   let _ls = ['Y', 'M', 'D', 'h', 'm', 's']
//   if (locale.toLowerCase() === 'zh-cn') {
//     _ls = ['年', '月', '天', '时', '分', '秒']
//   }
//   return <DateCountdown dateTo={_time.toString()} locales={_ls} locales_plural={_ls} numberOfFigures={3} />
// }
