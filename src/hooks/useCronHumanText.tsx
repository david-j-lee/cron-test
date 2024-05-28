import cronstrue from 'cronstrue'
import { useMemo } from 'preact/hooks'

const getHumanReadableDescription = (cronString: string) => {
  if (!cronString) {
    return { description: '', isValid: false }
  }
  try {
    return { description: cronstrue.toString(cronString), isValid: true }
  } catch (error) {
    return { description: error.replace('Error: ', ''), isValid: false }
  }
}

export const useCronHumanText = (cronString: string) =>
  useMemo(() => {
    let isValid = false
    let humanReadableDescription = ''

    try {
      // Get human readable description
      const { isValid: isValidHumanReadableDescription, description } =
        getHumanReadableDescription(cronString)
      humanReadableDescription = description
      isValid = isValidHumanReadableDescription
    } catch (error) {
      // Do nothing
    }

    return {
      humanReadableDescription,
      isValid,
    }
  }, [cronString])
