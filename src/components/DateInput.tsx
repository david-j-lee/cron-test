import ChevronLeft from '../icons/ChevronLeft'
import ChevronRight from '../icons/ChevronRight'
import dayjs from 'dayjs'
import { useCallback } from 'preact/hooks'
import { JSX } from 'preact/jsx-runtime'

type Props = {
  date: string
  setDate: (date: string) => void
}

export default function DateInput({ date, setDate }: Props) {
  const handleValueInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      setDate(event.currentTarget.value)
    },
    [setDate]
  )

  const handleDateInputPrev = useCallback(() => {
    setDate(dayjs(date).add(-1, 'day').format('YYYY-MM-DD'))
  }, [date, setDate])

  const handleDateInputNext = useCallback(() => {
    setDate(dayjs(date).add(1, 'day').format('YYYY-MM-DD'))
  }, [date, setDate])

  return (
    <div class="date-input-container">
      <button onClick={handleDateInputPrev}>
        <ChevronLeft />
      </button>
      <input type="date" value={date} onInput={handleValueInput} />
      <button onClick={handleDateInputNext}>
        <ChevronRight />
      </button>
    </div>
  )
}
