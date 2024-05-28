import { useMemo } from "preact/hooks";
import parser, { CronDate } from "cron-parser";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { CronSettings } from "../components/CronSettingsInput";

dayjs.extend(minMax);
dayjs.extend(utc);
dayjs.extend(timezone);

export const useCronScheduler = (
  cronString: string,
  cronSettings: CronSettings,
  timelineDate: dayjs.Dayjs
) => {
  return useMemo(() => {
    let isValid = false;
    let scheduledDateTimes = [];
    const timelineStart = dayjs(timelineDate).startOf("day");
    const timelineEnd = timelineDate.endOf("day");

    try {
      // Get human readable description
      const { isValid: isDateTimesValid, dateTimes } = getDateTimes(
        cronString,
        cronSettings.timeZone,
        cronSettings.startDateTime?.tz(cronSettings.timeZone, true) ||
          timelineStart,
        timelineEnd
      );
      scheduledDateTimes = dateTimes;
      isValid = isDateTimesValid;
    } catch (error) {
      console.error(error);
    }

    return {
      isValid,
      scheduledDateTimes,
    };
  }, [cronString, cronSettings, timelineDate]);
};

const getDateTimes = (
  cronString: string,
  cronTimeZone: string,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs
) => {
  const dateTimes: dayjs.Dayjs[] = [];

  if (!cronString) {
    return { isValid: false, dateTimes };
  }

  const options = {
    currentDate: start.toDate(),
    endDate: end.toDate(),
    tz: cronTimeZone,
    iterator: true,
  };

  try {
    const interval = parser.parseExpression(cronString, options);

    while (true) {
      try {
        const obj = interval.next() as IteratorResult<CronDate, CronDate>;
        dateTimes.push(dayjs(obj.value.toISOString()));
      } catch (error) {
        break;
      }
    }
  } catch (error) {
    console.error(error);
    return { isValid: false, dateTimes };
  }

  return { isValid: true, dateTimes };
};
