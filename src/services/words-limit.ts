export async function cutTextToWordLimit(text: string, wordLimit: number): Promise<string> {
  if (wordLimit <= 0) {
      throw new Error("Word limit must be greater than 0");
  }

  // Use a generator approach to handle large texts efficiently
  const words: string[] = [];
  let wordCount = 0;

  // Efficiently split the text into words without creating unnecessary intermediate arrays
  for (const word of text.split(/\s+/)) {
      if (wordCount < wordLimit) {
          words.push(word);
          wordCount++;
      } else {
          break; // Stop once the limit is reached
      }
  }

  // Join the words back into a single string
  return words.join(' ');
}
