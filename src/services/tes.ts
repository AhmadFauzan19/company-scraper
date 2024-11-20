function limitWords(text: string, maxWords: number): string {
    const words = text.split(/\s+/); // Split text into words
    if (words.length > maxWords) {
        console.log(`Truncating text to ${maxWords} words (original word count: ${words.length})`);
    }
    return words.slice(0, maxWords).join(" ").trim();
  }
  
  const cleanedText = limitWords("dahsjkdh dsajkdas sadbjkasd hjasdkhjsa sadhjkdsa dsa", 4); 
  console.log(cleanedText)