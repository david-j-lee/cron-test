import { Timeline } from '../types/Timeline'
import { TimelineSlot } from '../types/TimelineSlot'
import parser, { CronDate } from 'cron-parser'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(minMax)
dayjs.extend(utc)
dayjs.extend(timezone)

export const getScheduledDateTimes = ({
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
    const interval = parser.parseExpression(cronString, {
      currentDate: start.toDate(),
      endDate: end.toDate(),
      iterator: true,
      tz: timeZone,
    })
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

const getTimelineSlot = ({
  hoursToAdd,
  scheduledDateTimes,
  startDate,
  timeZone,
  zonedCurrentHour,
}: {
  hoursToAdd: number
  scheduledDateTimes: dayjs.Dayjs[]
  startDate: dayjs.Dayjs
  timeZone: string
  zonedCurrentHour: dayjs.Dayjs
}) => {
  const zonedStartDate = startDate.add(hoursToAdd, 'hours').tz(timeZone)
  const startOfDay = zonedStartDate.format('H') === '0'

  return {
    date: zonedStartDate,
    displayBottom: startOfDay
      ? zonedStartDate.format('D')
      : zonedStartDate.format('A'),
    displayTop: startOfDay
      ? zonedStartDate.format('MMM')
      : zonedStartDate.format('h'),
    isCurrentHour: zonedStartDate.isSame(zonedCurrentHour, 'hour'),
    isStartOfDay: startOfDay,
    schedule: scheduledDateTimes
      .filter((scheduledDate) =>
        scheduledDate.startOf('hour').isSame(zonedStartDate, 'hour')
      )
      .map((scheduledDate) => ({
        date: scheduledDate,
        percentage:
          scheduledDate.diff(scheduledDate.startOf('hour'), 'ms') /
          (60 * 60 * 1000),
      })),
  } as TimelineSlot
}

export const getTimelines = (
  startDate: dayjs.Dayjs,
  timeZones: { editable: boolean; zone: string }[],
  scheduledDateTimes: dayjs.Dayjs[]
) => {
  const timelines: Timeline[] = []
  const currentHour = dayjs()

  for (const timeZone of timeZones) {
    const slots: TimelineSlot[] = []

    if (!timeZone.zone) {
      timelines.push({
        slots,
        timeZone: timeZone.zone,
        timeZoneEditable: timeZone.editable,
      })
      continue
    }

    for (let hoursToAdd = 0; hoursToAdd < 24; hoursToAdd++) {
      slots.push(
        getTimelineSlot({
          hoursToAdd,
          scheduledDateTimes,
          startDate,
          timeZone: timeZone.zone,
          zonedCurrentHour: currentHour.tz(timeZone.zone),
        })
      )
    }

    timelines.push({
      slots,
      timeZone: timeZone.zone,
      timeZoneEditable: timeZone.editable,
    })
  }

  return timelines
}
