type Props = {
  description: string
}

export default function CronReader({ description }: Props) {
  return <div class="description">{description || 'Input a cron string'}</div>
}
