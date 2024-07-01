// src/app/CodeRunner.js
'use client';
import { useState } from 'react';

const supportedLanguages = ['java',
'nodejs',
 'ruby',
 'promptv1',
 'promptv2',
 'multifile',
 'sqlite3',
 'php',
 'go',
 'rust'];

const CodeRunner = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(supportedLanguages[0]);
  const [output, setOutput] = useState('');
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [snippetName, setSnippetName] = useState('');

  const handleRunCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, script: code }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error('Error running code:', error);
      setOutput('Error running code');
    }
    setIsLoading(false);
  };

  const handleSaveSnippet = () => {
    const newSnippet = { name: snippetName, language, code };
    setSavedSnippets([...savedSnippets, newSnippet]);
    setSnippetName('');
  };

  const handleLoadSnippet = (snippet) => {
    setLanguage(snippet.language);
    setCode(snippet.code);
  };
  return (
    <div className="container">
      <h1 className="header">Code Runner</h1>
      <div className="formGroup">
        <label htmlFor="language" className="label">Select Language</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <div className="formGroup">
        <label htmlFor="code" className="label">Enter Code</label>
        <textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="textarea"
        />
      </div>
      <button onClick={handleRunCode} className="button">Run Code</button>
      <div className="formGroup">
        <label htmlFor="snippetName" className="label">Save Code Snippet</label>
        <input
          id="snippetName"
          value={snippetName}
          onChange={(e) => setSnippetName(e.target.value)}
          className="input"
        />
        <button onClick={handleSaveSnippet} className="button">Save Snippet</button>
      </div>
      <div className="snippetsContainer">
        <h2 className="snippetsHeader">Saved Snippets</h2>
        {savedSnippets.map((snippet, index) => (
          <div key={index} className="snippet">
            <h3 className="snippetName">{snippet.name}</h3>
            <button onClick={() => handleLoadSnippet(snippet)} className="button">Load Snippet</button>
          </div>
        ))}
      </div>
      {output && (
        <div className="outputContainer">
          <h2 className="outputHeader">Output</h2>
          <pre className="output">{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeRunner;