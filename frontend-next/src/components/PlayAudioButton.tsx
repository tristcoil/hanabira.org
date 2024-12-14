// PlayAudioButton.tsx

'use client'

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

interface PlayAudioButtonProps {
  audioSrc: string;
  ariaLabel?: string;
}

const PlayAudioButton: React.FC<PlayAudioButtonProps> = ({ audioSrc, ariaLabel = "Play audio", }) => {
  const handlePlayAudio = () => {
    const audio = new Audio(audioSrc);
    audio.play();
  };

  // Assuming the FontAwesome icon's size is close to 24x24 pixels, adjust as needed
  return (
    <button 
      className="mr-2 inline-flex justify-center items-center w-5 h-5" 
      onClick={handlePlayAudio}
      style={{ minWidth: '5px', minHeight: '5px' }} // Ensure button has a minimum size
      aria-label={ariaLabel}
    >
      <FontAwesomeIcon icon={faPlayCircle} />
    </button>
  );
};

export default PlayAudioButton;


















// ------------------------------- old code - causes layout shift ---------------------------

// PlayAudioButton.tsx

// 'use client'

// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';


// interface PlayAudioButtonProps {
//   audioSrc: string;
// }

// const PlayAudioButton: React.FC<PlayAudioButtonProps> = ({ audioSrc }) => {
//   const handlePlayAudio = () => {
//     const audio = new Audio(audioSrc);
//     audio.play();
//   };

//   return (
//     <button className="mr-2" onClick={handlePlayAudio}>
//       <FontAwesomeIcon icon={faPlayCircle} />
//     </button>
//   );
// };

// export default PlayAudioButton;
