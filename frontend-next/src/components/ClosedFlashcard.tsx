// ClosedFlashcard.tsx

import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

interface ClosedFlashcardProps {
  p_tag: string;
  s_tag?: string;
  badgeText: string;
  badgeColor?: string; // Tailwind CSS classes for badge background and text
  description: string;
  openModal: () => void;
  buttonText?: string;
}

const ClosedFlashcard: React.FC<ClosedFlashcardProps> = ({
  p_tag,
  s_tag = '',
  badgeText,
  badgeColor = 'bg-blue-100 text-blue-800', // Default badge color
  description,
  openModal,
  buttonText = 'Open Flashcard',
}) => {
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-slate-100 dark:bg-gray-800 shadow-md rounded-lg p-6">
      {/* Top Section (Title + Badge) */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          {/* Primary Tag (Headline) */}
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {p_tag}
          </h3>
          {/* Secondary Tag (Optional) */}
          {s_tag && (
            <h4 className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {s_tag}
            </h4>
          )}
        </div>
        <span
          className={`ml-4 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${badgeColor}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 whitespace-normal">
        {description}
      </p>

      {/* Button */}
      <div className="mt-4 ">
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center w-full sm:w-auto rounded-md border border-blue-600 text-blue-600 text-sm font-medium px-4 py-2 transition duration-150 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronRightIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ClosedFlashcard;




















// ---------------------------------------------------------------------

// // ClosedFlashcard.tsx

// import React from 'react';
// import { ChevronRightIcon } from '@heroicons/react/20/solid';

// interface ClosedFlashcardProps {
//   p_tag: string;
//   s_tag?: string;
//   badgeText: string;
//   badgeColor?: string; // Tailwind CSS classes for badge background and text
//   description: string;
//   openModal: () => void;
//   buttonText?: string;
// }

// const ClosedFlashcard: React.FC<ClosedFlashcardProps> = ({
//   p_tag,
//   s_tag = '',
//   badgeText,
//   badgeColor = 'bg-blue-100 text-blue-800', // Default badge color
//   description,
//   openModal,
//   buttonText = 'Open Flashcard',
// }) => {
//   return (
//     <div className="col-span-1 rounded-lg bg-white dark:bg-gray-800 shadow-md p-6 max-w-md">
//       {/* Content Section */}
//       <div className="flex flex-col space-y-4">
//         {/* Title and Badge */}
//         <div className="flex items-center space-x-3">
//           <h3 className="truncate text-base font-medium text-gray-900 dark:text-gray-100">
//             {p_tag}
//           </h3>
//           <h4 className="truncate text-base font-sm text-gray-900 dark:text-gray-100">
//             {s_tag}
//           </h4>
//           <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeColor}`}>
//             {badgeText}
//           </span>
//         </div>
//         {/* Description */}
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           {description}
//         </p>
//         {/* Open Flashcard Button */}
//         <button
//           type="button"
//           onClick={openModal}
//           className="inline-flex items-center justify-center rounded-md border border-blue-600 text-blue-600 text-sm font-medium px-4 py-2 transition duration-150 bg-transparent hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto"
//         >
//           <ChevronRightIcon className="h-5 w-5 mr-2" aria-hidden="true" />
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ClosedFlashcard;
