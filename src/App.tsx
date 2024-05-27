import { useMemo, useState } from "preact/hooks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import CronInput from "./components/CronInput";
import CronReader from "./components/CronReader";
import CronTimeline from "./components/CronTimeline";
import { useCronVisualizer } from "./hooks/useCronVisualizer";
import CronDateInput from "./components/CronDateInput";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function App() {
  const [cronString, setCronString] = useState("");
  const [timelineDateInput, setTimelineDateInput] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const usersTimeZone = useMemo(() => dayjs.tz.guess() ?? "UTC", []);
  const timeZones = useMemo(() => [usersTimeZone, "UTC"], [usersTimeZone]);
  const timelineDate = useMemo(() => {
    return dayjs
      .tz(timelineDateInput, "YYYY-MM-DD", usersTimeZone)
      .startOf("day");
  }, [timelineDateInput, usersTimeZone]);

  const { humanReadableDescription, cronDateTimes } = useCronVisualizer(
    cronString,
    timelineDate
  );

  return (
    <>
      <CronInput value={cronString} setValue={setCronString} />
      <CronReader description={humanReadableDescription} />
      <CronDateInput
        value={timelineDateInput}
        setValue={setTimelineDateInput}
      />
      <CronTimeline
        date={timelineDate}
        timeZones={timeZones}
        dateTimes={cronDateTimes}
      />
    </>
  );
}
