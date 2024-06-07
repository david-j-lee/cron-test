import dayjs from 'dayjs'

export type TimelineSlot = {
  date: dayjs.Dayjs
  displayTop: string
  displayBottom: string
  isStartOfDay: boolean
  isCurrentHour: boolean
  schedule: {
    date: dayjs.Dayjs
    percentage: null | number
  }[]
}
