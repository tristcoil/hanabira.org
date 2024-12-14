'use client';

// components/EmailForm.js
import { useState } from 'react';

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/f-api/v1/submit_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Email submitted successfully:', result);

      // Set success message and show it
      setSuccessMessage('Email submitted successfully! Thank you for subscribing.');
      setShowSuccessMessage(true);

      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      // Clear the email input
      setEmail('');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  return (
    <div>
      {/* Success Message */}
      {showSuccessMessage && (
        <div
          className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>{" "}
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 sm:flex sm:w-full sm:max-w-lg">
        <div className="min-w-0 flex-1">
          <label htmlFor="hero-email" className="sr-only">
            Email address
          </label>
          <input
            id="hero-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mt-4 sm:ml-3 sm:mt-0">
          <button
            type="submit"
            className="block w-full rounded-md border border-transparent bg-rose-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
          >
            Notify me
          </button>
        </div>
      </form>
    </div>
  );
}
















// --------------------------------------------------------------- //


// 'use client';




// // components/EmailForm.js
// import { useState } from 'react';

// export default function EmailForm() {
//     const [email, setEmail] = useState('');

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//         const response = await fetch('/f-api/v1/submit_email', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email }),
//         });
  
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
  
//         const result = await response.json();
//         console.log('Email submitted successfully:', result);
//       } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//       }
//     };
  

//   return (
//     <form onSubmit={handleSubmit} className="mt-6 sm:flex sm:w-full sm:max-w-lg">
//       <div className="min-w-0 flex-1">
//         <label htmlFor="hero-email" className="sr-only">
//           Email address
//         </label>
//         <input
//           id="hero-email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
//           placeholder="Enter your email"
//         />
//       </div>
//       <div className="mt-4 sm:ml-3 sm:mt-0">
//         <button
//           type="submit"
//           className="block w-full rounded-md border border-transparent bg-rose-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
//         >
//           Notify me
//         </button>
//       </div>
//     </form>
//   );
// }
