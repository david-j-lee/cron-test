import { useMemo } from "preact/hooks";
import parser, { CronDate } from "cron-parser";
import cronstrue from "cronstrue";
import dayjs from "dayjs";

export const useCronVisualizer = (
  cronString: string,
  timelineDate: dayjs.Dayjs
) => {
  return useMemo(() => {
    let isValid = false;
    let humanReadableDescription = "";
    let cronDateTimes = [];
    const start = dayjs(timelineDate).startOf("day");
    const end = timelineDate.endOf("day");

    try {
      // Get human readable description
      const { isValid: isValidHumanReadableDescription, description } =
        getHumanReadableDescription(cronString);
      humanReadableDescription = description;

      const { isValid: isDateTimesValid, dateTimes } = getDateTimes(
        cronString,
        start,
        end
      );
      cronDateTimes = dateTimes;

      isValid = isValidHumanReadableDescription && isDateTimesValid;
    } catch (error) {
      console.error(error);
    }

    return {
      isValidCronString: isValid,
      humanReadableDescription,
      cronDateTimes,
    };
  }, [cronString, timelineDate]);
};

const getHumanReadableDescription = (cronString: string) => {
  if (!cronString) {
    return { isValid: false, description: "" };
  }
  try {
    return { isValid: true, description: cronstrue.toString(cronString) };
  } catch (error) {
    return { isValid: false, description: error.replace("Error: ", "") };
  }
};

const getDateTimes = (
  cronString: string,
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
