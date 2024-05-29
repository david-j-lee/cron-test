import CronTimeZoneSelect from './CronTimeZoneSelect'
import dayjs from 'dayjs'
import { useCallback, useState } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

export type CronSettings = {
  timeZone: string
  startDateTime?: dayjs.Dayjs
}

type Props = {
  show: boolean
  value: CronSettings
  setValue: (value: CronSettings) => void
}

export default function CronSettingsInput({ show, value, setValue }: Props) {
  // Time Zone Settings
  const setTimeZone = useCallback(
    (timeZone: string) => {
      setValue({ ...value, timeZone })
    },
    [value, setValue]
  )

  // Start Date Settings
  const handleStartDateInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      const newValue = event.currentTarget.value
      setValue({ ...value, startDateTime: newValue ? dayjs(newValue) : null })
    },
    [value, setValue]
  )

  if (!show) {
    return null
  }

  return (
    <div class="cron-settings">
      <label>
        <span>cron time zone</span>
        <CronTimeZoneSelect value={value.timeZone} setValue={setTimeZone} />
      </label>
      <label>
        <span>cron start date</span>
        <input
          type="datetime-local"
          value={value.startDateTime?.format('YYYY-MM-DDTHH:mm') ?? ''}
          onInput={handleStartDateInput}
        />
      </label>
    </div>
  )
}
