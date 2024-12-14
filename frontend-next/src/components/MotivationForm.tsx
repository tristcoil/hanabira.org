'use client';

// fieldsConfig.js

export const fields = [
    {
        key: 'minimalEffort',
        label: 'Minimal Daily Effort',
        placeholder:
            'What is the absolute minimal effort that you will do daily to learn?',
        type: 'textarea',
    },
    {
        key: 'personalVision',
        label: 'Personal Vision',
        placeholder:
            'Describe your ideal future where you are fluent in Japanese. How does this skill enhance your life?',
        type: 'textarea',
    },
    {
        key: 'coreMotivations',
        label: 'Core Motivations',
        placeholder:
            'Why is learning Japanese important to you personally? What values or passions does it fulfill?',
        type: 'textarea',
    },
    {
        key: 'specificGoals',
        label: 'Specific Goals',
        placeholder:
            'What are your short-term and long-term goals in learning Japanese? (e.g., passing JLPT N3, traveling to Japan, watching anime without subtitles)',
        type: 'textarea',
    },
    {
        key: 'dailyCommitment',
        label: 'Daily Commitment',
        placeholder:
            'How much time will you dedicate each day to learning Japanese? What specific activities will you focus on?',
        type: 'text',
    },
    {
        key: 'actionPlan',
        label: 'Action Plan',
        placeholder:
            'Outline the steps you will take to achieve your Japanese learning goals. What resources will you use?',
        type: 'textarea',
    },
    {
        key: 'anticipatedObstacles',
        label: 'Anticipated Obstacles',
        placeholder:
            'What challenges might you face during your learning journey? How do you plan to overcome them?',
        type: 'textarea',
    },
    {
        key: 'accountabilityPartner',
        label: 'Accountability Partner',
        placeholder:
            'Is there someone who can support and hold you accountable in your learning journey? How will you involve them?',
        type: 'text',
    },
    {
        key: 'progressMilestones',
        label: 'Progress Milestones',
        placeholder:
            'What milestones will you celebrate along the way? How will you reward yourself?',
        type: 'textarea',
    },
    {
        key: 'consequencesOfInaction',
        label: 'Consequences of Inaction',
        placeholder:
            'What are the potential negative outcomes if you do not commit to your learning goals?',
        type: 'textarea',
    },
    {
        key: 'valuesAlignment',
        label: 'Values Alignment',
        placeholder:
            'How does learning Japanese align with your personal values?',
        type: 'textarea',
    },
    {
        key: 'dailyReflectionJournal',
        label: 'Daily Reflection Journal',
        placeholder:
            "Reflect on today's learning experience. What did you accomplish? What can you improve tomorrow?",
        type: 'textarea',
    },
    {
        key: 'skillApplicationScenarios',
        label: 'Skill Application Scenarios',
        placeholder:
            'Describe situations where you will use your Japanese skills (e.g., attending a cultural event, conversing with native speakers).',
        type: 'textarea',
    },
    {
        key: 'personalResponsibilityStatement',
        label: 'Personal Responsibility',
        placeholder:
            'What responsibilities are you accepting to ensure your progress in learning Japanese?',
        type: 'textarea',
    },
    {
        key: 'supportResources',
        label: 'Support Resources',
        placeholder:
            'List resources or communities that can support your learning (e.g., study groups, online forums).',
        type: 'textarea',
    },
    {
        key: 'habitFormationGoals',
        label: 'Habit Formation Goals',
        placeholder:
            'What new habits will you adopt to support your learning? (e.g., studying every morning, using flashcards)',
        type: 'textarea',
    },
    {
        key: 'stayingFit',
        label: 'Fitness and wellbeing',
        placeholder:
            'What fitness, health and diet habits will I adopt so I have more energy to learn?',
        type: 'textarea',
    },
];



// ---------------------------- //



// hooks/useLocalStorage.js

//import { useState, useEffect } from 'react';

import { useEffect } from 'react';

// export function useLocalStorage(key, initialValue) {
//     const [storedValue, setStoredValue] = useState(initialValue);

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             try {
//                 const item = window.localStorage.getItem(key);
//                 setStoredValue(item ? JSON.parse(item) : initialValue);
//             } catch (error) {
//                 console.warn(error);
//             }
//         }
//     }, [key, initialValue]);

//     const setValue = (value) => {
//         try {
//             setStoredValue(value);
//             if (typeof window !== 'undefined') {
//                 window.localStorage.setItem(key, JSON.stringify(value));
//             }
//         } catch (error) {
//             console.warn(error);
//         }
//     };

//     return [storedValue, setValue];
// }

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window !== 'undefined') {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.warn(error);
          return initialValue;
        }
      }
      return initialValue;
    });
  
    const setValue = (value) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(error);
      }
    };
  
    return [storedValue, setValue];
  }
  




// ----------------------------------------------

// components/MotivationForm.js

import { useState } from 'react';


function MotivationForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useLocalStorage('motivationForm', {});

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
    };

    return (
        <div className="w-full mx-auto mt-8 p-4">
            {/* Accordion Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-500 text-white font-semibold rounded-md focus:outline-none"
            >
                <span>Learning Journey Form</span>
                <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <p className="text-sm p-4"> Learning Japanese is long term commitment.
                Above form might help you to consider multiple aspects of your learning journey
                and hopefully to assist you to stay on your learning track.
                Form data is stored in web browser Local Storage. Data is not sent to hanabira.org server.</p>

            {/* Accordion Content */}
            {isOpen && (

                <div className="border p-4 rounded-b-md mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-gray-700 font-medium mb-2">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={formData[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder={field.placeholder}
                          rows={4}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

            )}
        </div>
    );
}




export default MotivationForm;