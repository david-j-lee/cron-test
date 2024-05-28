import { useMemo } from "preact/hooks";
import cronstrue from "cronstrue";

export const useCronHumanText = (cronString: string) => {
  return useMemo(() => {
    let isValid = false;
    let humanReadableDescription = "";

    try {
      // Get human readable description
      const { isValid: isValidHumanReadableDescription, description } =
        getHumanReadableDescription(cronString);
      humanReadableDescription = description;
      isValid = isValidHumanReadableDescription;
    } catch (error) {
      console.error(error);
    }

    return {
      isValid,
      humanReadableDescription,
    };
  }, [cronString]);
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
