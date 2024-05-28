import { CronSettings } from '../components/CronSettingsInput'
import parser, { CronDate } from 'cron-parser'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo } from 'preact/hooks'

dayjs.extend(minMax)
dayjs.extend(utc)
dayjs.extend(timezone)

const getOptions = (
  timeZone: string,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs
) => ({
  currentDate: start.toDate(),
  endDate: end.toDate(),
  iterator: true,
  tz: timeZone,
})

const getDateTimes = ({
  cronString,
  timeZone,
  start,
  end,
}: {
  cronString: string
  timeZone: string
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}) => {
  const dateTimes: dayjs.Dayjs[] = []

  if (!cronString) {
    return { dateTimes, isValid: false }
  }

  try {
    const interval = parser.parseExpression(
      cronString,
      getOptions(timeZone, start, end)
    )
    while (interval.hasNext()) {
      dateTimes.push(
        dayjs(
          (
            interval.next() as IteratorResult<CronDate, CronDate>
          ).value.toISOString()
        )
      )
    }
    return { dateTimes, isValid: true }
  } catch (error) {
    return { dateTimes, isValid: false }
  }
}

export const useCronScheduler = (
  cronString: string,
  cronSettings: CronSettings,
  timelineDate: dayjs.Dayjs
) =>
  useMemo(() => {
    let isValid = false
    let scheduledDateTimes = []
    const timelineStart = dayjs(timelineDate).startOf('day')
    const timelineEnd = timelineDate.endOf('day')

    try {
      // Get human readable description
      const { isValid: isDateTimesValid, dateTimes } = getDateTimes({
        cronString,
        end: timelineEnd,
        start:
          cronSettings.startDateTime?.tz(cronSettings.timeZone, true) ||
          timelineStart,
        timeZone: cronSettings.timeZone,
      })
      scheduledDateTimes = dateTimes
      isValid = isDateTimesValid
    } catch (error) {
      // Do nothing
    }

    return {
      isValid,
      scheduledDateTimes,
    }
  }, [cronString, cronSettings, timelineDate])
