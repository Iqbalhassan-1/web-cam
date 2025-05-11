import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { usePhotoEditor } from 'react-photo-editor';
import { Button } from "@/components/ui/button"

const GreenSlider = ({ label, value, min, max, step = 1, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <label className="block text-sm font-medium text-green-700 mb-1">
        {label}: {typeof value === 'number' ? value.toFixed(2) : value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 rounded-lg appearance-none bg-gray-200"
        style={{
          background: `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
};

const CustomPhotoEditor = forwardRef(({ onSave, isImageSaved, setIsImageSaved }, ref) => {
  const videoRef = useRef(null);
  const canvasCaptureRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Camera error:", err));
  };

  const stopCamera = () => {
    const tracks = videoRef.current?.srcObject?.getTracks();
    tracks?.forEach(track => track.stop());
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasCaptureRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const newFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setFile(newFile);
        setIsCaptured(true);
        stopCamera();
      }
    }, 'image/jpeg');
  };
  const {
    canvasRef,
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturate,
    setSaturate,
    grayscale,
    setGrayscale,
    rotate,
    setRotate,
    flipHorizontal,
    setFlipHorizontal,
    flipVertical,
    setFlipVertical,
    zoom,
    setZoom,
    mode,
    setMode,
    setLineColor,
    lineColor,
    setLineWidth,
    lineWidth,
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    handleWheel,
    resetFilters,
  } = usePhotoEditor({ file });
  const retakeImage = () => {
    setFile(null);
    setIsCaptured(false);
    resetFilters()
    startCamera();
    setIsImageSaved(false)
  };

  const resultImageform = () => {
    resetFilters()
    setIsImageSaved(false)
  }
  const fullReset = () => {
    retakeImage()
    resultImageform()
  }
  useImperativeHandle(ref, () => ({
    fullReset
  }));



  const handleSave = () => {
    const dataUrl = canvasRef.current?.toDataURL();
    if (!dataUrl) return;
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const fileFromCanvas = new File([blob], 'edited-image.jpg', { type: mimeString });

    onSave(fileFromCanvas);
  };




  return (
    <>
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 16px;
          background-color: #22c55e;
          border-radius: 9999px;
          cursor: pointer;
          margin-top: -2px;
          border: none;
        }
        input[type='range']::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background-color: #22c55e;
          border-radius: 9999px;
          cursor: pointer;
          border: none;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="flex flex-col items-center justify-center">
          {!isCaptured ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow" />
              <button onClick={captureImage} className="mt-4 webcam-btn px-4 py-2 bg-blue-500 text-white rounded-lg">Capture</button>
              <canvas ref={canvasCaptureRef} className="hidden" />
            </>
          ) : (
            <>
              <div className="relative w-full flex justify-center items-center">
                <canvas
                  ref={canvasRef}
                  className="w-full"
                  style={{ maxHeight: '100%', touchAction: 'none' }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onWheel={handleWheel}
                />
                <Button
                  onClick={retakeImage}
                  className="absolute -bottom-10 bg-red-600 text-white"
                >
                  Retake
                </Button>
              </div>
            </>

          )}
        </div>
        {isCaptured && (
          <div className="flex flex-col space-y-4 mt-10">
            <GreenSlider label="Brightness" value={brightness} min={0} max={200} onChange={(e) => setBrightness(Number(e.target.value))} />
            <GreenSlider label="Contrast" value={contrast} min={0} max={200} onChange={(e) => setContrast(Number(e.target.value))} />
            <GreenSlider label="Saturate" value={saturate} min={0} max={100} onChange={(e) => setSaturate(Number(e.target.value))} />
            <GreenSlider label="Grayscale" value={grayscale} min={0} max={100} onChange={(e) => setGrayscale(Number(e.target.value))} />
            <GreenSlider label="Rotate" value={rotate} min={0} max={360} onChange={(e) => setRotate(Number(e.target.value))} />
            <GreenSlider label="Zoom" value={zoom} min={0.1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} />

            <div className="flex items-center space-x-4">
              <label className="text-sm">
                <input type="checkbox" checked={flipHorizontal} onChange={(e) => setFlipHorizontal(e.target.checked)} className="mr-2" />
                Flip Horizontal
              </label>
              <label className="text-sm">
                <input type="checkbox" checked={flipVertical} onChange={(e) => setFlipVertical(e.target.checked)} className="mr-2" />
                Flip Vertical
              </label>
            </div>

            <div>
              <label className="block text-sm">
                <input type="checkbox" checked={mode === 'draw'} onChange={(e) => setMode(e.target.checked ? 'draw' : 'pan')} className="mr-2" />
                Draw Mode
              </label>
              {mode === 'draw' && (
                <div className="flex items-center space-x-4 mt-2">
                  <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="w-10 h-10 rounded" />
                  <input type="number" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} min={2} max={100} className="w-16" />
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button onClick={resultImageform}
                className="text-white bg-gray-500 hover:bg-gray-400 rounded-lg shadow-md"
              >Reset</Button>
              <Button onClick={handleSave} className="bg-blue-500 text-white" disabled={isImageSaved}>Save</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
})

export default CustomPhotoEditor;
