"use client";

import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface LoginData {
  date: string;
  count: number;
}

// Define an interface for the value that matches the expected type
interface CalendarValue {
  date: string;
  count: number;
}

const LoginStreakGraph: React.FC<{ data: LoginData[] }> = ({ data }) => {
  // Function to map count to Tailwind CSS color
  const getColorForCount = (count: number): string => {
    switch (count) {
      case 0:
        return "#ebedf0"; // Light gray for no activity
      case 1:
        return "#d6e685"; // Light green
      case 2:
        return "#8cc665"; // Medium green
      case 3:
        return "#44a340"; // Dark green
      case 4:
        return "#1e6823"; // Darker green
      case 5:
        return "#196127"; // Darkest green for the highest activity
      default:
        return "#ebedf0"; // Default color for undefined counts
    }
  };

  // Dynamically generate styles for color scales
  const dynamicStyles = `
    .color-scale-1 { fill: ${getColorForCount(1)}; }
    .color-scale-2 { fill: ${getColorForCount(2)}; }
    .color-scale-3 { fill: ${getColorForCount(3)}; }
    .color-scale-4 { fill: ${getColorForCount(4)}; }
  `;

  // Calculate 12 months back from the current date
  const nMonthsAgo = new Date();
  nMonthsAgo.setMonth(nMonthsAgo.getMonth() - 12);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <style>{dynamicStyles}</style>
      <CalendarHeatmap
        startDate={nMonthsAgo}
        endDate={new Date()}
        values={data.map((d) => ({ ...d, date: d.date }))}
        showWeekdayLabels={true}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          return `color-scale-${Math.min(value.count, 4)}`;
        }}
        // tooltipDataAttrs={(value) => {
        //   // Correct type for the value parameter
        //   if (!value) {
        //     return { "data-tooltip": "No data" }; // Handle undefined case
        //   }
        //   return { "data-tooltip": `${value.date} has count: ${value.count}` };
        // }}
        onClick={(value) => {
          if (value) {
            alert(`Clicked on ${value.date} with count: ${value.count}`);
          }
        }}
      />
      <ReactTooltip />
    </div>
  );
};

export default LoginStreakGraph;




// // --- //

// "use client";

// import React from "react";
// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css";
// import { Tooltip as ReactTooltip } from "react-tooltip";

// interface LoginData {
//   date: string;
//   count: number;
// }

// // Define an interface for the value
// interface CalendarValue {
//   date: string;
//   count: number;
// }

// const LoginStreakGraph: React.FC<{ data: LoginData[] }> = ({ data }) => {
//   // Function to map count to Tailwind CSS color
//   const getColorForCount = (count: number): string => {
//     switch (count) {
//       case 0:
//         return "#ebedf0"; // Light gray for no activity
//       case 1:
//         return "#d6e685"; // Light green
//       case 2:
//         return "#8cc665"; // Medium green
//       case 3:
//         return "#44a340"; // Dark green
//       case 4:
//         return "#1e6823"; // Darker green
//       case 5:
//         return "#196127"; // Darkest green for the highest activity
//       default:
//         return "#ebedf0"; // Default color for undefined counts
//     }
//   };

//   // Dynamically generate styles for color scales
//   const dynamicStyles = `
//     .color-scale-1 { fill: ${getColorForCount(1)}; }
//     .color-scale-2 { fill: ${getColorForCount(2)}; }
//     .color-scale-3 { fill: ${getColorForCount(3)}; }
//     .color-scale-4 { fill: ${getColorForCount(4)}; }
//   `;

//   // Calculate 6 months back from the current date
//   const nMonthsAgo = new Date();
//   nMonthsAgo.setMonth(nMonthsAgo.getMonth() - 12);

//   return (
//     <div className="p-4 bg-gray-100 rounded-lg">
//       <style>{dynamicStyles}</style>
//       <CalendarHeatmap
//         startDate={nMonthsAgo}
//         endDate={new Date()}
//         values={data.map((d) => ({ ...d, date: d.date }))}
//         showWeekdayLabels={true}
//         classForValue={(value) => {
//           if (!value) {
//             return "color-empty";
//           }
//           return `color-scale-${Math.min(value.count, 4)}`;
//         }}
//         tooltipDataAttrs={(value: CalendarValue | undefined) => {
//           // Handling possible 'undefined' value
//           if (!value) {
//             return { "data-tooltip": "No data" }; // Or any other default value you see fit
//           }
//           return { "data-tooltip": `${value.date} has count: ${value.count}` };
//         }}
//         onClick={(value) => {
//           // Similarly, check for undefined before using 'value'
//           if (value) {
//             alert(`Clicked on ${value.date} with count: ${value.count}`);
//           }
//         }}
//       />
//       <ReactTooltip />
//     </div>
//   );
// };

// export default LoginStreakGraph;
