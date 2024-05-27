import { useCallback, useMemo, useState } from "preact/hooks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CronTimeZoneSelect from "./CronTimeZoneSelect";
import { JSX } from "preact/jsx-runtime";

dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  date: dayjs.Dayjs;
  timeZones: string[];
  dateTimes: dayjs.Dayjs[];
};

export default function CronTimeline({ date, timeZones, dateTimes }: Props) {
  const [customTimeZone, setCustomTimeZone] = useState("");

  const cronSchedules = useMemo(() => {
    return getSchedule(
      date,
      [
        ...timeZones.map((zone) => ({ editable: false, zone })),
        { editable: true, zone: customTimeZone },
      ],
      dateTimes
    );
  }, [date, dateTimes, customTimeZone]);

  const handleTimeZoneChange = useCallback(
    (event: JSX.TargetedEvent<HTMLSelectElement>) => {
      setCustomTimeZone(event.currentTarget.value);
    },
    [setCustomTimeZone]
  );

  return (
    <div class="schedules">
      {cronSchedules &&
        cronSchedules.map((cronSchedule) => (
          <div key={cronSchedule.timeZone} class="schedule">
            {!cronSchedule.timeZone || cronSchedule.timeZoneEditable ? (
              <CronTimeZoneSelect
                value={customTimeZone}
                onChange={handleTimeZoneChange}
              />
            ) : (
              <div class="timezone">
                {cronSchedule.timeZone.replace(/\//g, " / ")}
              </div>
            )}
            {cronSchedule.schedule.map((item) => (
              <div
                key={item.date.toString()}
                class={[
                  "slot",
                  item.isStartOfDay ? "start-of-day" : "",
                  item.isCurrentHour ? "current" : null,
                ].join(" ")}
              >
                <div>{item.displayTop}</div>
                <div>{item.displayBottom}</div>
                <div class="divider" />
                {item.scheduledDates.map((date) => (
                  <div
                    class="dot"
                    style={{ left: `${date.percentage * 100}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

type CronSchedules = {
  timeZone: string;
  timeZoneEditable: boolean;
  schedule: CronSchedule[];
};

type CronSchedule = {
  date: dayjs.Dayjs;
  displayTop: string;
  displayBottom: string;
  isStartOfDay: boolean;
  isCurrentHour: boolean;
  scheduledDates: {
    date: dayjs.Dayjs;
    percentage: null | number;
  }[];
};

const getSchedule = (
  date: dayjs.Dayjs,
  timeZones: { editable: boolean; zone: string }[],
  scheduledDates: dayjs.Dayjs[]
) => {
  const schedules: CronSchedules[] = [];
  const currentHour = dayjs();

  for (const timeZone of timeZones) {
    const schedule: CronSchedule[] = [];

    if (!timeZone.zone) {
      schedules.push({
        timeZone: timeZone.zone,
        timeZoneEditable: timeZone.editable,
        schedule,
      });
      continue;
    }

    const zonedCurrentHour = currentHour.tz(timeZone.zone).format("H");

    for (let i = 0; i < 24; i++) {
      const zonedHour = date.add(i, "hours").tz(timeZone.zone);
      const zonedHourValue = zonedHour.format("H");
      const startOfDay = zonedHourValue === "0";
      const hourSchedule = scheduledDates
        .filter((scheduledDate) =>
          scheduledDate.startOf("hour").isSame(zonedHour, "hour")
        )
        .map((scheduledDate) => ({
          date: scheduledDate,
          percentage:
            scheduledDate.diff(scheduledDate.startOf("hour"), "ms") /
            (60 * 60 * 1000),
        }));

      schedule.push({
        date: zonedHour,
        displayTop: startOfDay
          ? zonedHour.format("MMM")
          : zonedHour.format("h"),
        displayBottom: startOfDay
          ? zonedHour.format("D")
          : zonedHour.format("A"),
        isStartOfDay: startOfDay,
        isCurrentHour: zonedHourValue === zonedCurrentHour,
        scheduledDates: hourSchedule,
      });
    }

    schedules.push({
      timeZone: timeZone.zone,
      timeZoneEditable: timeZone.editable,
      schedule,
    });
  }

  return schedules;
};
