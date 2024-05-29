import ChevronLeft from '../icons/ChevronLeft'
import ChevronRight from '../icons/ChevronRight'
import dayjs from 'dayjs'
import { useCallback } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

type Props = {
  value: string
  setValue: (value: string) => void
}

export default function CronDateInput({ value, setValue }: Props) {
  const handleValueInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      setValue(event.currentTarget.value)
    },
    [setValue]
  )

  const handleDateInputPrev = useCallback(() => {
    setValue(dayjs(value).add(-1, 'day').format('YYYY-MM-DD'))
  }, [value, setValue])

  const handleDateInputNext = useCallback(() => {
    setValue(dayjs(value).add(1, 'day').format('YYYY-MM-DD'))
  }, [value, setValue])

  return (
    <div class="date-input-container">
      <button onClick={handleDateInputPrev}>
        <ChevronLeft />
      </button>
      <input type="date" value={value} onInput={handleValueInput} />
      <button onClick={handleDateInputNext}>
        <ChevronRight />
      </button>
    </div>
  )
}
