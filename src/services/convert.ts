export async function extractJsonFromString(input: string): Promise<Record<string, string> | null> {
    // Regular expression to extract the JSON object
    const regex = /{[\s\S]*}/;

    // Match the JSON object in the string
    const match = input.match(regex);

    if (match) {
        try {
        // Parse the JSON string into an object
        const jsonObject = JSON.parse(match[0]);

        // Convert the parsed object to Record<string, string>
        const recordString: Record<string, string> = {};

        // Iterate over the keys and values in the parsed JSON
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
            const value = jsonObject[key];

            // Convert arrays or objects to strings
            if (Array.isArray(value)) {
                recordString[key] = value.join(", "); // Join array items into a string
            } else if (typeof value === 'object') {
                recordString[key] = JSON.stringify(value); // Convert object to string
            } else {
                recordString[key] = String(value); // Convert other types to string
            }
            }
        }

        return recordString; // Return the resulting Record<string, string>
        } catch (error) {
        console.error("Failed to parse JSON:", error);
        return null;
        }
    } else {
        console.log("No JSON object found in the string.");
        return null;
    }
    }
  