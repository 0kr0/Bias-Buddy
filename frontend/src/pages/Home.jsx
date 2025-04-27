import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'; //  Подключаем стили для Home

function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/check', { text });
      setResult(response.data.result);
    } catch (error) {
      setResult('Ошибка при отправке запроса');
    }
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="buttons-container">
          <button className="analyze-button">
            <i className="fas fa-align-left"></i>
            Analyze text
            <span>type text</span>
          </button>
          <button className="analyze-button">
            <i className="fas fa-file-alt"></i>
            Analyze file
            <span>.pdf .docx</span>
          </button>
        </div>

        <div className="text-input-container">
          <div className="text-input-header">
            <i className="fas fa-edit"></i>
            Text input
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here. ###PRESS HERE TO INPUT TEXT FOR PRESENTATION"
          />
          <button className="clear-button" onClick={handleClear}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <button className="analyze-main-button" onClick={handleSubmit}>
          Analyze
        </button>

        <div className="result-container">
          <i className="far fa-file-alt"></i>
          <p>{result || 'No bias detected'}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
