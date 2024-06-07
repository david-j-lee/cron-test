import { cronInputMessages } from '../data/cronInputMessages'
import cronstrue from 'cronstrue'
import { useMemo } from 'preact/hooks'

type Props = {
  cronString: string
}

export default function ReadableDescription({ cronString }: Props) {
  const description = useMemo(() => {
    if (!cronString) {
      return { description: '', isValid: false }
    }

    let isValid = false
    let humanReadableDescription = ''

    try {
      // Get human readable description
      humanReadableDescription = cronstrue.toString(cronString)
      isValid = true
    } catch (error) {
      humanReadableDescription = error.replace('Error: ', '')
    }

    return {
      humanReadableDescription,
      isValid,
    }
  }, [cronString])

  const inputPlaceholderText = useMemo(
    () =>
      cronInputMessages[Math.floor(Math.random() * cronInputMessages.length)],
    []
  )

  return (
    <div class="description">
      {description.humanReadableDescription || inputPlaceholderText}
    </div>
  )
}
