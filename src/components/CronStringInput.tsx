import SettingsGear from '../icons/SettingsGear'
import { JSX } from 'preact/'
import { useCallback } from 'preact/hooks'

type Props = {
  cronString: string
  setCronString: (cronString: string) => void
  toggleShowCronSettings: () => void
}

export default function CronStringInput({
  cronString,
  setCronString,
  toggleShowCronSettings,
}: Props) {
  const handleCronStringInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      setCronString(event.currentTarget.value)
    },
    [setCronString]
  )

  return (
    <div class="cron-input">
      <input
        value={cronString}
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
