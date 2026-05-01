import { useState, useCallback } from 'react';
import { LanguageSelect, LANGUAGES } from './components/LanguageSelect';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState('english');
  const [targetLang, setTargetLang] = useState('spanish');
  const { translate, isTranslating, error } = useTranslation();

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;
    
    try {
      const result = await translate(inputText, sourceLang, targetLang);
      setOutputText(result);
    } catch (err) {
      console.error('Translation failed:', err);
    }
  }, [inputText, sourceLang, targetLang, translate]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-black">Translate</h1>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex gap-4 mb-6">
          <LanguageSelect 
            value={sourceLang} 
            onValueChange={setSourceLang} 
            label="From" 
          />
          <div className="flex items-end pb-2">
            <span className="text-black/40">→</span>
          </div>
          <LanguageSelect 
            value={targetLang} 
            onValueChange={setTargetLang} 
            label="To" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <textarea
              className="w-full h-64 p-4 rounded-lg border border-black/20 resize-none focus:outline-none focus:ring-2 focus:ring-black/20 text-black placeholder:text-black/30"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim()}
              className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-full h-64 p-4 rounded-lg border border-black/20 bg-black/5 overflow-auto">
              {outputText ? (
                <p className="text-black whitespace-pre-wrap">{outputText}</p>
              ) : (
                <p className="text-black/30">Translation will appear here...</p>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
