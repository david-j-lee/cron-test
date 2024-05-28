import dayjs from "dayjs";
import CronTimeZoneSelect from "./CronTimeZoneSelect";
import { useCallback, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export type CronSettings = {
  timeZone: string;
  startDateTime?: dayjs.Dayjs;
};

type Props = {
  value: CronSettings;
  setValue: (value: CronSettings) => void;
};

export default function CronSettingsInput({ value, setValue }: Props) {
  const [show, setShow] = useState(false);

  const toggleSettings = useCallback(() => {
    setShow(!show);
  }, [show, setShow]);

  // Time Zone Settings

  const setTimeZone = useCallback(
    (timeZone: string) => {
      setValue({
        ...value,
        timeZone: timeZone,
      });
    },
    [value, setValue]
  );

  // Start Date Settings

  const handleStartDateInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      setValue({
        ...value,
        startDateTime: event.currentTarget.value
          ? dayjs(event.currentTarget.value)
          : null,
      });
    },
    [value, setValue]
  );

  return (
    <>
      {show && (
        <div class="cron-settings">
          <label>
            <span>cron time zone</span>
            <CronTimeZoneSelect value={value.timeZone} setValue={setTimeZone} />
          </label>
          <label>
            <span>cron start date</span>
            <input
              type="datetime-local"
              value={value.startDateTime?.format("YYYY-MM-DDTHH:mm") ?? ""}
              onInput={handleStartDateInput}
            />
          </label>
        </div>
      )}
      <button onClick={toggleSettings}>
        {show ? "hide additional settings" : "show additional settings"}
      </button>
    </>
  );
}
