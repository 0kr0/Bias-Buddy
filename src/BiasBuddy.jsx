import React, { useState } from 'react';

const BiasBuddy = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('localhost/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to fetch analysis');
      const serverData = await response.json();

      if (
        serverData &&
        Array.isArray(serverData.analysis) &&
        serverData.analysis.length > 0
      ) {
        setResult(serverData.analysis[0]);
      } else {
        setError('Invalid or empty data from the server.');
      }
    } catch (err) {
      setError('An error occurred. Please check the server and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      {/* Header with Logo */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <img src="/Logo.svg" alt="BiasBuddy logo" style={{ height: '50px' }} />
      </div>

      {/* Layout: Text input and result side by side */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch' }}>
        {/* Text Input Area (60%) */}
        <div style={{ flex: 0.6, display: 'flex', flexDirection: 'column', height: '300px' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>🖊️ Text input</span>
          </div>
          <textarea
            style={{
              flex: 1,
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              borderRadius: '10px',
              border: '1px solid #ccc',
              resize: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="Type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Result Area (40%) */}
        <div
          style={{
            flex: 0.4,
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '12px',
            color: '#666',
            boxSizing: 'border-box',
          }}
        >
          {result ? (
            <div
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                width: '100%',
                marginLeft: '0.5rem',
                marginRight: '0.5rem',
              }}
            >
              <h4 style={{ color: '#7c3aed', marginTop: 0 }}>{result.bias_category}</h4>
              <p><strong>Explanation:</strong> {result.explanation}</p>
              <p><strong>Text:</strong> {result.text}</p>
            </div>
          ) : (
            <>
              <img
                src="/no_bias_detected.svg"
                alt="No bias detected"
                style={{ width: '160px', height: '160px', marginBottom: '1rem' }}
              />
              <p style={{ fontSize: '1.5rem', marginTop: 'auto' }}>No bias detected</p>
            </>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <div style={{ marginTop: '1.5rem' }}>
        <button
          onClick={handleAnalyze}
          style={{
            padding: '0.75rem 1.5rem',
            width: '100%',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default BiasBuddy;
