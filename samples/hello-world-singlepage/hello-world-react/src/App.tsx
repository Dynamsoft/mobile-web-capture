import { useState } from 'react';
import './App.css';
import reactLogo from './assets/logo.svg';
import VideoNormalizer from './components/VideoNormalizer/VideoNormalizer';
import ImageNormalizer from './components/ImageNormalizer/ImageNormazlier';

function App() {
  const [mode, setMode] = useState("video");
  return (
    <div className='App'>
      <div className='title'>
        <h2 className='title-text'>Hello World for React</h2>
        <img className='title-logo' src={reactLogo} alt="logo"></img>
      </div>
      <div className='top-btns'>
        <button onClick={() => { setMode("video") }} style={{ backgroundColor: mode === "video" ? "rgb(255, 174, 55)" : "#fff" }}>VideoNormalizer</button>
        <button onClick={() => { setMode("image") }} style={{ backgroundColor: mode === "image" ? "rgb(255, 174, 55)" : "#fff" }}>ImageNormalizer</button>
      </div>
      {mode === "video" ? <VideoNormalizer /> : <ImageNormalizer />}
    </div>
  );
}

export default App;
