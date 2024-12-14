'use client';


import React from 'react';
//import AudioRecorder from '../components/AudioRecorder';

const RecordPage = () => {
  return (
    <div>
      <h1>Record Your Voice</h1>
      <AudioRecorder />
    </div>
  );
};

export default RecordPage;
















// ------------------------------------------- //
// works amazingly well, it is amazing

//import React, { useState, useEffect, useRef } from 'react';


import { useState, useEffect, useRef } from 'react';


const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [error, setError] = useState(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    // Ask for microphone permission and set up the MediaRecorder
    const getMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          audioChunks.current = []; // Reset audio chunks
        };

        setMediaRecorder(recorder);
      } catch (err) {
        setError('Microphone access denied.');
      }
    };

    getMicrophone();
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      setIsRecording(true);
      mediaRecorder.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={startRecording} disabled={isRecording || !mediaRecorder}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording || !mediaRecorder}>
        Stop Recording
      </button>

      {audioURL && (
        <div>
          <h3>Recorded Audio</h3>
          <audio controls src={audioURL}></audio>
        </div>
      )}
    </div>
  );
};

//export default AudioRecorder;
