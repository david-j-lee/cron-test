import { useMemo, useState } from "preact/hooks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import CronStringInput from "./components/CronStringInput";
import CronReader from "./components/CronReader";
import CronTimeline from "./components/CronTimeline";
import { useCronHumanText } from "./hooks/useCronHumanText";
import { useCronScheduler } from "./hooks/useCronScheduler";
import CronDateInput from "./components/CronDateInput";
import CronSettingsInput, {
  CronSettings,
} from "./components/CronSettingsInput";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function App() {
  const userTimeZone = useMemo(() => dayjs.tz.guess() ?? "UTC", []);
  const timeZones = useMemo(() => [userTimeZone, "UTC"], [userTimeZone]);

  const [cronString, setCronString] = useState("");
  const [cronSettings, setCronSettings] = useState<CronSettings>({
    timeZone: userTimeZone,
    startDateTime: null,
  });
  const [timelineDateInput, setTimelineDateInput] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const timelineDate = useMemo(() => {
    return dayjs
      .tz(timelineDateInput, "YYYY-MM-DD", userTimeZone)
      .startOf("day");
  }, [timelineDateInput, userTimeZone]);

  const { humanReadableDescription } = useCronHumanText(cronString);
  const { scheduledDateTimes } = useCronScheduler(
    cronString,
    cronSettings,
    timelineDate
  );

  return (
    <>
      <div class="cron-input-container">
        <CronStringInput value={cronString} setValue={setCronString} />
        <CronSettingsInput value={cronSettings} setValue={setCronSettings} />
      </div>
      <CronReader description={humanReadableDescription} />
      <CronDateInput
        value={timelineDateInput}
        setValue={setTimelineDateInput}
      />
      <CronTimeline
        date={timelineDate}
        timeZones={timeZones}
        scheduledDateTimes={scheduledDateTimes}
      />
    </>
  );
}
