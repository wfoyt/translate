import { useState } from 'react';

async function translateWithOllama(text, sourceLang, targetLang) {
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Only output the translation, nothing else:

${text}`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'translategemma',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || '';
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = async (text, sourceLang, targetLang) => {
    if (!text.trim()) return '';
    
    setIsTranslating(true);
    setError(null);
    
    try {
      const result = await translateWithOllama(text, sourceLang, targetLang);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  };

  return { translate, isTranslating, error };
}
