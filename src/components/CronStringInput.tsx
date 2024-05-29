import SettingsGear from '../icons/SettingsGear'
import { JSX } from 'preact/'
import { useCallback } from 'preact/hooks'

type Props = {
  value: string
  setValue: (value: string) => void
  toggleShowCronSettings: () => void
}

export default function CronStringInput({
  value,
  setValue,
  toggleShowCronSettings,
}: Props) {
  const handleCronStringInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      setValue(event.currentTarget.value)
    },
    [setValue]
  )

  return (
    <div class="cron-input">
      <input
        value={value}
        onInput={handleCronStringInput}
        placeholder={'0 0/10 * * * ? *'}
        autoFocus
      />
      <button onClick={toggleShowCronSettings}>
        <SettingsGear />
      </button>
    </div>
  )
}
