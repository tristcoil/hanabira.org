'use client';

// pages/index.js
import { useState } from 'react';

export default function Audio() {
    const [audioSrc, setAudioSrc] = useState('');

    const handlePlay = (filename) => {
        setAudioSrc(`http://localhost:5300/api/audio/${filename}`);
    };

    return (
        <div>
            <h1>Audio Player</h1>
            <ul>
                {/* Replace these list items with the actual file names you have */}
                <li>
                    <button onClick={() => handlePlay('v_ボールペン.mp3')}>Play v_ボールペン.mp3</button>
                </li>
                <li>
                    <button onClick={() => handlePlay('v_ホ短調.mp3')}>Play v_ホ短調.mp3</button>
                </li>
                <li>
                    <button onClick={() => handlePlay('v_其れに.mp3')}>Play v_其れに.mp3</button>
                </li>
            </ul>
            {audioSrc && (
                <audio controls>
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
}
