import CronSettingsInput from './components/CronSettingsInput'
import CronStringInput from './components/CronStringInput'
import DateInput from './components/DateInput'
import GitHubLink from './components/GitHubLink'
import ReadableDescription from './components/ReadableDescription'
import ThemePicker from './components/ThemePicker'
import TimelineGraphs from './components/TimelineGraphs'
import { CronSettings } from './types/CronSettings'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useMemo, useState } from 'preact/hooks'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function App() {
  const userTimeZone = useMemo(() => dayjs.tz.guess() ?? 'UTC', [])
  const timeZones = useMemo(() => [userTimeZone, 'UTC'], [userTimeZone])

  const [cronString, setCronString] = useState('')
  const [cronSettings, setCronSettings] = useState<CronSettings>({
    startDateTime: null,
    timeZone: userTimeZone,
  })
  const [showCronSettings, setShowCronSettings] = useState(false)
  const [timelineDateInput, setTimelineDateInput] = useState(
    dayjs().format('YYYY-MM-DD')
  )

  const timelineDate = useMemo(
    () =>
      dayjs.tz(timelineDateInput, 'YYYY-MM-DD', userTimeZone).startOf('day'),
    [timelineDateInput, userTimeZone]
  )

  const toggleShowCronSettings = useCallback(() => {
    setShowCronSettings(!showCronSettings)
  }, [showCronSettings, setShowCronSettings])

  return (
    <>
      <ThemePicker />
      <div class="cron-input-container">
        <CronStringInput
          cronString={cronString}
          setCronString={setCronString}
          toggleShowCronSettings={toggleShowCronSettings}
        />
        <CronSettingsInput
          settings={cronSettings}
          setSettings={setCronSettings}
          show={showCronSettings}
        />
      </div>
      <ReadableDescription cronString={cronString} />
      <DateInput date={timelineDateInput} setDate={setTimelineDateInput} />
      <TimelineGraphs
        cronString={cronString}
        cronSettings={cronSettings}
        date={timelineDate}
        timeZones={timeZones}
      />
      <GitHubLink />
    </>
  )
}
