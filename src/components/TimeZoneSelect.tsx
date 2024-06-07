import { timeZoneOptions } from '../data/timeZoneOptions'
import { useCallback, useMemo } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

type Props = {
  timeZone: string
  setTimeZone: (value: string) => void
}

export default function TimeZoneSelect({ timeZone, setTimeZone }: Props) {
  const injectTimeZoneIntoOptions = useMemo(
    () =>
      timeZone &&
      !timeZoneOptions.some(
        (timeZoneOption) => timeZoneOption.zone === timeZone
      ),
    [timeZone]
  )

  const handleOnChange = useCallback(
    (event: JSX.TargetedEvent<HTMLSelectElement>) => {
      setTimeZone(event.currentTarget.value)
    },
    [setTimeZone]
  )

  return (
    <select
      value={timeZone}
      onChange={handleOnChange}
      placeholder="Select a time zone"
    >
      <option value="" disabled selected>
        Select a time zone
      </option>
      {injectTimeZoneIntoOptions && (
        <option key={timeZone} value={timeZone}>
          {timeZone}
        </option>
      )}
      {timeZoneOptions.map((timeZone) => (
        <option key={timeZone.zone} value={timeZone.zone}>
          {timeZone.utc} {timeZone.zone}
        </option>
      ))}
    </select>
  )
}
