export async function cutTextToWordLimit(text: string, wordLimit: number): Promise<string> {
    // Split the text into an array of words
    const words = text.split(/\s+/);  // Split by whitespace characters
  
    // Check if the word count exceeds the limit, if so, slice the array
    const wordsToKeep = words.slice(0, wordLimit);
  
    // Join the words back into a single string
    const truncatedText = wordsToKeep.join(' ');
  
    return truncatedText;
  }
  