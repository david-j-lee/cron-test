import dayjs from 'dayjs'

export type CronSettings = {
  timeZone: string
  startDateTime?: dayjs.Dayjs
}
