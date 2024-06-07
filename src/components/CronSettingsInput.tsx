import { CronSettings } from '../types/CronSettings'
import TimeZoneSelect from './TimeZoneSelect'
import dayjs from 'dayjs'
import { useCallback } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

type Props = {
  show: boolean
  settings: CronSettings
  setSettings: (settings: CronSettings) => void
}

export default function CronSettingsInput({
  show,
  settings,
  setSettings,
}: Props) {
  // Time Zone Settings
  const setTimeZone = useCallback(
    (timeZone: string) => {
      setSettings({ ...settings, timeZone })
    },
    [settings, setSettings]
  )

  // Start Date Settings
  const handleStartDateInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      const newStartDateTime = event.currentTarget.value
      setSettings({
        ...settings,
        startDateTime: newStartDateTime ? dayjs(newStartDateTime) : null,
      })
    },
    [settings, setSettings]
  )

  if (!show) {
    return null
  }

  return (
    <div class="cron-settings">
      <label>
        <span>time zone</span>
        <TimeZoneSelect
          timeZone={settings.timeZone}
          setTimeZone={setTimeZone}
        />
      </label>
      <label>
        <span>start date time</span>
        <input
          type="datetime-local"
          value={settings.startDateTime?.format('YYYY-MM-DDTHH:mm') ?? ''}
          onInput={handleStartDateInput}
        />
      </label>
    </div>
  )
}
