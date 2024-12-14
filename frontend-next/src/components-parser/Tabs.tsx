'use client';

import { ReactNode, useEffect, useState } from "react";

// Define the props for the Tabs component
interface TabsProps {
  children: ReactNode[];
  activeTabIndex?: number;  // Add activeTabIndex as an optional prop
}

const Tabs: React.FC<TabsProps> = ({ children, activeTabIndex }) => {
  const [activeTab, setActiveTab] = useState(activeTabIndex || 0);

  // Ensure the external activeTabIndex prop updates the state when it changes
  useEffect(() => {
    if (activeTabIndex !== undefined) {
      setActiveTab(activeTabIndex);
    }
  }, [activeTabIndex]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200 text-black">
      <div className="flex border-b border-gray-200 mb-4">
        {children.map((tab, index) => (
          <button
            key={index}
            className={`text-xs px-2 py-2 -mb-px border-t border-l border-r rounded-t ${activeTab === index
              ? "text-blue-700 border-blue-700 bg-white"
              : "text-gray-500 border-transparent hover:text-blue-700 hover:border-gray-300"
              }`}
            onClick={() => setActiveTab(index)}
          >
            {(tab as React.ReactElement<any>).props.label}
          </button>
        ))}
      </div>
      <div className="p-6 border border-gray-200 rounded-b">
        {children.map((tab, index) =>
          activeTab === index ? <div key={index}>{tab}</div> : null
        )}
      </div>
    </div>
  );
};

export default Tabs;




























// 'use client';

// // ---------------------------- Helper Components -------------------------------------- //

// import { ReactNode, useState } from "react";

// // Define the props for the Tabs component
// interface TabsProps {
//   children: ReactNode[];
// }


// const Tabs: React.FC<TabsProps> = ({ children }) => {
//   const [activeTab, setActiveTab] = useState(0);

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200 text-black">
//       <div className="flex border-b border-gray-200 mb-4">
//         {children.map((tab, index) => (
//           <button
//             key={index}
//             className={`text-xs px-2 py-2 -mb-px border-t border-l border-r rounded-t ${activeTab === index
//               ? "text-blue-700 border-blue-700 bg-white"
//               : "text-gray-500 border-transparent hover:text-blue-700 hover:border-gray-300"
//               }`}
//             onClick={() => setActiveTab(index)}
//           >
//             {/* TypeScript needs to know that tab has a 'props' property with a 'label' */}
//             {(tab as React.ReactElement<any>).props.label}
//           </button>
//         ))}
//       </div>
//       <div className="p-6 border border-gray-200 rounded-b">
//         {children.map((tab, index) =>
//           activeTab === index ? <div key={index}>{tab}</div> : null
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tabs;