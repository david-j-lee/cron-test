import { CronSettings } from '../types/CronSettings'
import { getScheduledDateTimes, getTimelines } from '../utils/timelineUtils'
import { TimelineGraph } from './TimelineGraph'
import dayjs from 'dayjs'
import { useMemo, useState } from 'preact/hooks'

type Props = {
  cronString: string
  cronSettings: CronSettings
  date: dayjs.Dayjs
  timeZones: string[]
}

export default function Timelines({
  cronString,
  cronSettings,
  date,
  timeZones,
}: Props) {
  const [customTimeZone, setCustomTimeZone] = useState('')

  const scheduleResults = useMemo(() => {
    const timelineStart = dayjs(date).startOf('day')
    const timelineEnd = date.endOf('day')

    const { isValid: isDateTimesValid, dateTimes } = getScheduledDateTimes({
      cronString,
      end: timelineEnd,
      start:
        cronSettings.startDateTime?.tz(cronSettings.timeZone, true) ||
        timelineStart,
      timeZone: cronSettings.timeZone,
    })

    return {
      isValid: isDateTimesValid,
      schedule: dateTimes,
    }
  }, [cronString, cronSettings, date])

  const timelines = useMemo(
    () =>
      getTimelines(
        date,
        [
          ...timeZones.map((zone) => ({ editable: false, zone })),
          { editable: true, zone: customTimeZone },
        ],
        scheduleResults.schedule
      ),
    [date, scheduleResults, customTimeZone, timeZones]
  )

  const totalScheduled = useMemo(
    () =>
      timelines[0].slots.reduce(
        (accumulator, slot) => accumulator + slot.schedule.length,
        0
      ),
    [timelines]
  )

  return (
    <>
      <div class="timelines">
        {timelines &&
          timelines.map((timeline) => (
            <TimelineGraph
              key={timeline.timeZone}
              timeline={timeline}
              setTimeZone={setCustomTimeZone}
            />
          ))}
      </div>
      {Boolean(totalScheduled) && (
        <div class="number-of-events">
          Number of events scheduled: <span>{totalScheduled}</span>
        </div>
      )}
    </>
  )
}
