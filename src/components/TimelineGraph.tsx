import { Timeline } from '../types/Timeline'
import TimeZoneSelect from './TimeZoneSelect'

type Props = {
  timeline: Timeline
  setTimeZone: (timeZone: string) => void
}

export const TimelineGraph = ({ timeline, setTimeZone }: Props) => (
  <div class="timeline">
    {!timeline.timeZone || timeline.timeZoneEditable ? (
      <TimeZoneSelect timeZone={timeline.timeZone} setTimeZone={setTimeZone} />
    ) : (
      <div class="timezone">{timeline.timeZone.replace(/\//gu, ' / ')}</div>
    )}
    {timeline.slots.map((slot) => (
      <div
        key={slot.date.toString()}
        class={[
          'slot',
          slot.isStartOfDay ? 'start-of-day' : '',
          slot.isCurrentHour ? 'current' : null,
        ].join(' ')}
      >
        <div>{slot.displayTop}</div>
        <div>{slot.displayBottom}</div>
        <div class="divider" />
        {slot.schedule.map((date) => (
          <div
            key={date}
            class="dot"
            style={{ left: `${date.percentage * 100}%` }}
          />
        ))}
      </div>
    ))}
  </div>
)
