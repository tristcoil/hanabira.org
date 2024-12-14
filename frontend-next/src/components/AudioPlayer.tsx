// components/AudioPlayer.tsx
import React, { useRef, useState } from 'react';

interface AudioPlayerProps {
    src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    return (
        <div className="p-4 z-[-50]">
            <audio ref={audioRef} src={src} controls className="mt-4 w-full"></audio>
        </div>
    );
}

export default AudioPlayer;
