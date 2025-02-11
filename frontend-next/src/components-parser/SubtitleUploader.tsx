'use client';

import React, { useState, useEffect } from 'react';
import { CloudArrowUpIcon, CloudArrowDownIcon } from '@heroicons/react/24/solid';
import SrtParser from 'srt-parser-2';

// Define the props interface
interface SubtitleUploaderProps {
  url: string; // YouTube video URL
}

// Define the structure of the parsed subtitle from srt-parser-2
interface ParsedSubtitle {
  id: string;
  startTime: string; // e.g., "00:00:00,100"
  startSeconds: number; // e.g., 0.1
  endTime: string; // e.g., "00:00:01,550"
  endSeconds: number; // e.g., 1.55
  text: string; // Subtitle text
}

// Define the structure of the transformed subtitle for localStorage
interface TransformedSubtitle {
  text: string;
  duration: number;
  offset: number;
  lang: string; // 'en' or 'ja'
}

const SubtitleUploader: React.FC<SubtitleUploaderProps> = ({ url }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(url);

  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  console.log('YouTube URL for subtitles:', currentUrl);

  /**
   * Transforms ParsedSubtitle to TransformedSubtitle
   */
  const transformSubtitles = (parsedSubtitles: ParsedSubtitle[], lang: string): TransformedSubtitle[] => {
    return parsedSubtitles.map((subtitle) => ({
      text: subtitle.text,
      duration: parseFloat((subtitle.endSeconds - subtitle.startSeconds).toFixed(2)),
      offset: parseFloat(subtitle.startSeconds.toFixed(2)),
      lang: lang,
    }));
  };

  /**
   * Handles the upload and parsing of subtitle files
   */
  const handleSubtitleUpload = (event: React.ChangeEvent<HTMLInputElement>, lang: 'en' | 'ja') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;

        if (typeof result === 'string') {
          try {
            const parser = new SrtParser();
            const parsedSubtitles: ParsedSubtitle[] = parser.fromSrt(result).map((subtitle) => ({
              ...subtitle,
              // Assuming srt-parser-2 provides startSeconds and endSeconds
              // If not, you might need to implement them
              // For example:
              // startSeconds: parseTimeToSeconds(subtitle.startTime),
              // endSeconds: parseTimeToSeconds(subtitle.endTime),
            }));

            console.log(`Parsed ${lang === 'en' ? 'English' : 'Japanese'} Subtitles:`, parsedSubtitles);

            const transformedSubtitles = transformSubtitles(parsedSubtitles, lang);
            console.log(`Transformed ${lang === 'en' ? 'English' : 'Japanese'} Subtitles:`, transformedSubtitles);

            // Save to localStorage
            const storageKey = `${currentUrl}_${lang}`;
            localStorage.setItem(storageKey, JSON.stringify(transformedSubtitles));
            alert(`${lang === 'en' ? 'English' : 'Japanese'} subtitles uploaded and saved successfully!`);
          } catch (error) {
            console.error(`Error parsing ${lang === 'en' ? 'English' : 'Japanese'} subtitles:`, error);
            alert(`Failed to parse the ${lang === 'en' ? 'English' : 'Japanese'} subtitle file. Please ensure it is a valid .srt file.`);
          }
        } else {
          console.error('File result is not a string.');
          alert('Unexpected file format. Please upload a valid .srt file.');
        }
      };

      reader.onerror = () => {
        console.error('Error reading the subtitle file.');
        alert('An error occurred while reading the subtitle file. Please try again.');
      };

      reader.readAsText(file);
    }
  };

  /**
   * Generates the download URL for subtitles
   */
  const generateDownloadUrl = (): string => {
    if (!currentUrl) {
      alert('No YouTube URL provided.');
      return '#';
    }
    const encodedUrl = encodeURIComponent(currentUrl);
    return `https://www.downloadyoutubesubtitles.com/?u=${encodedUrl}`;
  };

  /**
   * Handles the download button click
   */
  const handleDownloadClick = () => {
    if (!currentUrl) {
      alert('No YouTube URL provided. Please provide a URL to download subtitles.');
      return;
    }
    const downloadUrl = generateDownloadUrl();
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Subtitle Upload Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        {/* Japanese Subtitle Upload */}
        <label
          htmlFor="upload-japanese-subtitle"
          className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
        >
          <CloudArrowUpIcon className="h-5 w-5 mr-2 text-gray-500" />
          Upload Japanese .srt
          <input
            id="upload-japanese-subtitle"
            type="file"
            accept=".srt"
            className="hidden"
            onChange={(e) => handleSubtitleUpload(e, 'ja')}
          />
        </label>

        {/* English Subtitle Upload */}
        <label
          htmlFor="upload-english-subtitle"
          className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
        >
          <CloudArrowUpIcon className="h-5 w-5 mr-2 text-gray-500" />
          Upload English .srt
          <input
            id="upload-english-subtitle"
            type="file"
            accept=".srt"
            className="hidden"
            onChange={(e) => handleSubtitleUpload(e, 'en')}
          />
        </label>

        {/* Download Subtitles Button */}
        <button
          onClick={handleDownloadClick}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          aria-label="Download Subtitles"
        >
          <CloudArrowDownIcon className="h-5 w-5 mr-2" />
          Download Subtitles
        </button>
      </div>
      <p className="text-xs mt-1">If you upload .srt after playing the video, reload the page so subtitles get loaded.</p>
    </div>
  );
};

export default SubtitleUploader;


































// -------------------------------------------------------------------------------------------------------


// WELL FUNCTIONING BASE FOR SUBTITLE HANDLING ------------------

// 'use client';

// import React, { useState, useEffect } from 'react';
// import YouTubeComponent from './YouTubeComponent'; // Ensure this path is correct
// import { CloudArrowUpIcon, CloudArrowDownIcon } from '@heroicons/react/24/solid';

// import SrtParser from 'srt-parser-2';

// //srt parser looks like cool package 
// //https://www.npmjs.com/package/srt-parser-2


// // Define the props interface
// interface SubtitleUploaderProps {
//   url: string;
// }



// const SubtitleUploader = ({ url }) => {

//   const [currentUrl, setCurrentUrl] = useState<string>(url);

//   useEffect(() => {
//     setCurrentUrl(url);
//   }, [url]);

//   console.log('YouTube URL for subtitles:', currentUrl);


//     // TODO: add upload logic, think about injection attacks
//     // const handleJapaneseSubtitleUpload = (event) => {
//     //     const file = event.target.files[0];
//     //     if (file) {
//     //       // Implement file upload logic for Japanese subtitles
//     //       alert('Subtitle upload functionality is not fully implemented yet.');
//     //       console.log('Japanese Subtitle Uploaded:', file.name);
//     //       // Example: Parse the .srt file or send it to a server
//     //     }
//     //   };
    
//       const handleEnglishSubtitleUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//           // Implement file upload logic for English subtitles
//           alert('Subtitle upload functionality is not fully implemented yet.');
//           console.log('English Subtitle Uploaded:', file.name);
//           // Example: Parse the .srt file or send it to a server
//         }
//       };
    
//     //   const handleJapaneseSubtitleUpload = (event) => {
//     //     const file = event.target.files[0];
//     //     if (file) {
//     //       const reader = new FileReader();
//     //       reader.onload = (e) => {
//     //         const parser = new SrtParser();
//     //         const subtitles = parser.fromSrt(e.target.result);
//     //         console.log('Parsed Subtitles:', subtitles);
//     //         // Further processing...
//     //       };
//     //       reader.readAsText(file);
//     //     }
//     //   };      

   
//     const handleJapaneseSubtitleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//           const reader = new FileReader();
      
//           reader.onload = (e: ProgressEvent<FileReader>) => {
//             const result = e.target?.result;
      
//             if (typeof result === 'string') {
//               try {
//                 const parser = new SrtParser();
//                 const subtitles = parser.fromSrt(result);
//                 console.log('Parsed Japanese Subtitles:', subtitles);
//                 // Further processing...
//               } catch (error) {
//                 console.error('Error parsing Japanese subtitles:', error);
//                 alert('Failed to parse the Japanese subtitle file. Please ensure it is a valid .srt file.');
//               }
//             } else {
//               console.error('File result is not a string.');
//               alert('Unexpected file format. Please upload a valid .srt file.');
//             }
//           };
      
//           reader.onerror = () => {
//             console.error('Error reading the Japanese subtitle file.');
//             alert('An error occurred while reading the Japanese subtitle file. Please try again.');
//           };
      
//           reader.readAsText(file);
//           alert('Subtitle upload functionality is not fully implemented yet. Just browser .srt parsing console logging works.');
//         }
//       };


//     // Function to generate the download URL
//     const generateDownloadUrl = () => {
//       if (!url) {
//           alert('No YouTube URL provided.');
//           return '#';
//       }
//       const encodedUrl = encodeURIComponent(url);
//       return `https://www.downloadyoutubesubtitles.com/?u=${encodedUrl}`;
//   };

//   // Handler for Download button click
//   const handleDownloadClick = () => {
//     if (!currentUrl) {
//       alert('No YouTube URL provided. Please provide a URL to download subtitles.');
//       return;
//     }
//     const downloadUrl = generateDownloadUrl();
//     window.open(downloadUrl, '_blank', 'noopener,noreferrer');
//   };




//     return (
//     <div className="max-w-2xl mx-auto p-0 bg-white rounded-lg shadow-md">
//       {/* Subtitle Upload Buttons */}
//       <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
//         {/* Japanese Subtitle Upload */}
//         <label
//           htmlFor="upload-japanese-subtitle"
//           className="flex items-center justify-center px-4 py-0 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
//         >
//           <CloudArrowUpIcon className="h-5 w-5 mr-2 text-gray-500" />
//           Upload Japanese .srt
//           <input
//             id="upload-japanese-subtitle"
//             type="file"
//             accept=".srt"
//             className="hidden"
//             onChange={handleJapaneseSubtitleUpload}
//           />
//         </label>

//         {/* English Subtitle Upload */}
//         <label
//           htmlFor="upload-english-subtitle"
//           className="flex items-center justify-center px-4 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
//         >
//           <CloudArrowUpIcon className="h-5 w-5 mr-2 text-gray-500" />
//           Upload English .srt
//           <input
//             id="upload-english-subtitle"
//             type="file"
//             accept=".srt"
//             className="hidden"
//             onChange={handleEnglishSubtitleUpload}
//           />
//         </label>


//         {/* Download Subtitles Button */}
//         <button
//           onClick={handleDownloadClick}
//           className="flex items-center justify-center px-4 py-2 bg-blue-500 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
//           aria-label="Download Subtitles"
//         >
//           <CloudArrowDownIcon className="h-5 w-5 mr-2" />
//           Download Subtitles
//         </button>








//       </div>
//     </div>
//   );
// };

// export default SubtitleUploader;
