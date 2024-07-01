'use client';
import React, { useState } from 'react';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress, Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Save, PlayArrow, Code } from '@mui/icons-material';
import AceEditor from 'react-ace';

// Rest of your component code remains the same...

const supportedLanguages = [
  'java',
  'nodejs',
  'ruby',
  'promptv1',
  'promptv2',
  'multifile',
  'sqlite3',
  'php',
  'go',
  'rust'
];

const CodeRunner = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(supportedLanguages[0]);
  const [output, setOutput] = useState('');
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [snippetName, setSnippetName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Code Runner
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="language-label">Select Language</InputLabel>
            <Select
              labelId="language-label"
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {supportedLanguages.map((lang) => (
                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <AceEditor
            height="400px"
            language={language}
            value={code}
            onChange={(newValue) => setCode(newValue)}
            theme="vs-dark"
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={handleRunCode}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? <CircularProgress size={24} /> : 'Run Code'}
            </Button>
          </Box>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Snippet Name"
              value={snippetName}
              onChange={(e) => setSnippetName(e.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Save />}
              onClick={handleSaveSnippet}
              fullWidth
            >
              Save Snippet
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            Output
          </Typography>
          <Paper style={{ padding: 16, minHeight: '400px', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
            <pre>{output}</pre>
          </Paper>
          <Typography variant="h4" component="h2" gutterBottom style={{ marginTop: '20px' }}>
            Saved Snippets
          </Typography>
          {savedSnippets.map((snippet, index) => (
            <Paper key={index} style={{ padding: 16, marginBottom: 16 }}>
              <Typography variant="h6" component="h3">
                {snippet.name}
              </Typography>
              <Button
                variant="contained"
                color="default"
                startIcon={<Code />}
                onClick={() => handleLoadSnippet(snippet)}
                fullWidth
              >
                Load Snippet
              </Button>
            </Paper>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CodeRunner;
