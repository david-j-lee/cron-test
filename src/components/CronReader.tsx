import { useMemo } from 'preact/hooks'

const possibleInputPlaceholderText = [
  'Ready to automate? Enter your cron string and watch the magic happen!',
  'Input your cron string and let us do the scheduling for you!',
  "Feed me a cron string, and I'll show you your schedule!",
  'Got a cron job in mind? Type it in and see the analysis!',
  "Let's get things moving! Enter your cron string to start automating.",
  'Your schedule awaits! Input your cron string now.',
  'Type your cron string and unveil your automation potential!',
  'Kickstart your automation! Enter a cron string to begin.',
  'Curious about your schedule? Input a cron string and find out!',
  'Unlock the power of automation! Enter your cron string here.',
]

type Props = {
  description: string
}

export default function CronReader({ description }: Props) {
  const inputPlaceholderText = useMemo(
    () =>
      possibleInputPlaceholderText[
        Math.floor(Math.random() * possibleInputPlaceholderText.length)
      ],
    []
  )
  return <div class="description">{description || inputPlaceholderText}</div>
}
