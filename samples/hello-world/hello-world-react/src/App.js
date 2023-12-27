import './App.css';
import ImageContainer from './components/ImageContainer';
import CaptureViewer from './components/CaptureViewer';
import { useState } from 'react';

function App() {
  const [showCaptureViewer, setShowCaptureViewer] = useState(true)
  const [images, setImages] = useState({
    originalImage: '',
    detectedImage: ''
  })


  return (
    <>
      <CaptureViewer
          showCaptureViewer = { showCaptureViewer }
          setShowCaptureViewer = { setShowCaptureViewer }
          setImages = { setImages }
      /> 
      <ImageContainer
        showCaptureViewer = { showCaptureViewer }
        setShowCaptureViewer = { setShowCaptureViewer }
        images = { images }
      />
    </>
  );
}

export default App;
