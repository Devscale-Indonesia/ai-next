export function parseJSON(input) {
  const jsonBlockRegex = /```json([\s\S]*?)```/;
  const match = jsonBlockRegex.exec(input);

  if (match) {
    const jsonString = match[1].trim();
    try {
      const parsedObject = JSON.parse(jsonString);
      return parsedObject;
    } catch (error) {
      console.error("Invalid JSON:", error);
      return null;
    }
  } else {
    console.error("No JSON block found");
    return null;
  }
}
