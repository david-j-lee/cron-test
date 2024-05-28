import { JSX } from "preact/";
import { useCallback } from "preact/hooks";

type Props = {
  value: string;
  setValue: (value: string) => void;
};

export default function CronInput({ value, setValue }: Props) {
  const handleCronStringInput = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, InputEvent>) => {
      setValue(event.currentTarget.value);
    },
    [value, setValue]
  );

  return (
    <div class="cron-input">
      <input
        value={value}
        onInput={handleCronStringInput}
        placeholder={"0 0/10 * * * ? *"}
        autoFocus
      />
    </div>
  );
}
