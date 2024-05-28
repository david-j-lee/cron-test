import CronTimeZoneSelect from './CronTimeZoneSelect'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo, useState } from 'preact/hooks'

dayjs.extend(utc)
dayjs.extend(timezone)

type CronSchedule = {
  date: dayjs.Dayjs
  displayTop: string
  displayBottom: string
  isStartOfDay: boolean
  isCurrentHour: boolean
  scheduledDates: {
    date: dayjs.Dayjs
    percentage: null | number
  }[]
}

type CronSchedules = {
  timeZone: string
  timeZoneEditable: boolean
  schedule: CronSchedule[]
}

const getHourlySchedule = (
  scheduledDateTimes: dayjs.Dayjs[],
  zonedDateTime: dayjs.Dayjs
) =>
  scheduledDateTimes
    .filter((scheduledDate) =>
      scheduledDate.startOf('hour').isSame(zonedDateTime, 'hour')
    )
    .map((scheduledDate) => ({
      date: scheduledDate,
      percentage:
        scheduledDate.diff(scheduledDate.startOf('hour'), 'ms') /
        (60 * 60 * 1000),
    }))

const getScheduleRecord = ({
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
  const zonedHour = startDate.add(hoursToAdd, 'hours').tz(timeZone)
  const zonedHourValue = zonedHour.format('H')
  const startOfDay = zonedHourValue === '0'
  const hourSchedule = getHourlySchedule(scheduledDateTimes, zonedHour)

  return {
    date: zonedHour,
    displayBottom: startOfDay ? zonedHour.format('D') : zonedHour.format('A'),
    displayTop: startOfDay ? zonedHour.format('MMM') : zonedHour.format('h'),
    isCurrentHour: zonedHour.isSame(zonedCurrentHour, 'hour'),
    isStartOfDay: startOfDay,
    scheduledDates: hourSchedule,
  }
}

const getSchedule = (
  startDate: dayjs.Dayjs,
  timeZones: { editable: boolean; zone: string }[],
  scheduledDateTimes: dayjs.Dayjs[]
) => {
  const schedules: CronSchedules[] = []
  const currentHour = dayjs()

  for (const timeZone of timeZones) {
    const schedule: CronSchedule[] = []

    if (!timeZone.zone) {
      schedules.push({
        schedule,
        timeZone: timeZone.zone,
        timeZoneEditable: timeZone.editable,
      })
      continue
    }

    const zonedCurrentHour = currentHour.tz(timeZone.zone)

    for (let hoursToAdd = 0; hoursToAdd < 24; hoursToAdd++) {
      schedule.push(
        getScheduleRecord({
          hoursToAdd,
          scheduledDateTimes,
          startDate,
          timeZone: timeZone.zone,
          zonedCurrentHour,
        })
      )
    }

    schedules.push({
      schedule,
      timeZone: timeZone.zone,
      timeZoneEditable: timeZone.editable,
    })
  }

  return schedules
}

const forwardSlashRegex = /\//gu

const TimelineSchedule = ({ schedule }: { schedule: CronSchedule }) => (
  <div
    key={schedule.date.toString()}
    class={[
      'slot',
      schedule.isStartOfDay ? 'start-of-day' : '',
      schedule.isCurrentHour ? 'current' : null,
    ].join(' ')}
  >
    <div>{schedule.displayTop}</div>
    <div>{schedule.displayBottom}</div>
    <div class="divider" />
    {schedule.scheduledDates.map((date) => (
      <div
        key={date}
        class="dot"
        style={{ left: `${date.percentage * 100}%` }}
      />
    ))}
  </div>
)

type Props = {
  date: dayjs.Dayjs
  timeZones: string[]
  scheduledDateTimes: dayjs.Dayjs[]
}

export default function CronTimeline({
  date,
  timeZones,
  scheduledDateTimes,
}: Props) {
  const [customTimeZone, setCustomTimeZone] = useState('')

  const cronSchedules = useMemo(
    () =>
      getSchedule(
        date,
        [
          ...timeZones.map((zone) => ({ editable: false, zone })),
          { editable: true, zone: customTimeZone },
        ],
        scheduledDateTimes
      ),
    [date, scheduledDateTimes, customTimeZone, timeZones]
  )

  return (
    <div class="schedules">
      {cronSchedules &&
        cronSchedules.map((cronSchedule) => (
          <div key={cronSchedule.timeZone} class="schedule">
            {!cronSchedule.timeZone || cronSchedule.timeZoneEditable ? (
              <CronTimeZoneSelect
                value={customTimeZone}
                setValue={setCustomTimeZone}
              />
            ) : (
              <div class="timezone">
                {cronSchedule.timeZone.replace(forwardSlashRegex, ' / ')}
              </div>
            )}
            {cronSchedule.schedule.map((item) => (
              <TimelineSchedule key={item.date} schedule={item} />
            ))}
          </div>
        ))}
    </div>
  )
}
