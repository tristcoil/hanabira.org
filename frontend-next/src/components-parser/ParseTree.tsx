// ---------------------- graph component ------------------------- //

// --- //

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface TreeNode {
  value: string;
  translation?: string;
  children?: TreeNode[];
}

interface ParseTreeProps {
  data: TreeNode;
}

const ParseTree: React.FC<ParseTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredNodeData, setHoveredNodeData] =
    useState<Partial<TreeNode> | null>(null);

  useEffect(() => {
    const margin = { top: 20, right: 120, bottom: 20, left: 200 };
    const width = 1200 - margin.right - margin.left;
    const height = 800 - margin.top - margin.bottom;

    // Clear any existing SVG elements before rendering
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr(
        "viewBox",
        `0 0 ${width + margin.right + margin.left} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("background-color", "#f1f5f9") // Set the background color directly
      .style("font", "12px sans-serif")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tree layout with decreased horizontal spacing
    const treeLayout = d3.tree<TreeNode>().size([height, width / 1.5]);

    const root = d3.hierarchy<TreeNode>(data);
    treeLayout(root);

    // Links (branches)
    svg
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal<
            d3.HierarchyLink<TreeNode>,
            d3.HierarchyPointNode<TreeNode>
          >()
          .x((d) => d.y * 0.8)
          .y((d) => d.x + 40)
      )
      .attr("stroke", (d) => (d.target.depth === 0 ? "#1f77b4" : "#94a3b8"))
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("stroke-opacity", 0.6);

    // Nodes (circles + text)
    const node = svg
      .selectAll<SVGGElement, d3.HierarchyNode<TreeNode>>(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y * 0.8},${d.x + 40})`)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 10)
          .attr("fill", "#ff7f0e");
        d3.select(this)
          .selectAll("text")
          .transition()
          .duration(200)
          .style("font-weight", "bold")
          .style("fill", "#ff7f0e");

        const { children, ...nodeData } = d.data;
        setHoveredNodeData(nodeData);
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 6)
          // @ts-ignore: Ignore the potential undefined error on 'depth'
          .attr("fill", (d) => (d.depth! === 0 ? "#1f77b4" : "#4daf4a"));
        d3.select(this)
          .selectAll("text")
          .transition()
          .duration(200)
          .style("font-weight", "normal")
          .style("fill", "#333");
        setHoveredNodeData(null);
      });

    node
      .append("circle")
      .attr("r", 6)
      .attr("fill", (d) => (d.depth === 0 ? "#1f77b4" : "#4daf4a")) // This is where the error was
      .attr("stroke", "#555")
      .attr("stroke-width", 1);

    node
      .append("text")
      .attr("dy", (d) => (d.children ? "-1.5em" : ".35em"))
      .attr("x", (d) => (d.children ? -10 : 10))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("class", (d) =>
        d.children ? "text-right text-gray-700" : "text-left text-gray-700"
      )
      .text((d) => (d.depth === 0 ? "" : `${d.data.value}`))
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .style("fill", "#333");

    node
      .append("text")
      .attr("dy", (d) => (d.children ? "-.5em" : "1.5em"))
      .attr("x", (d) => (d.children ? -10 : 10))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("class", (d) =>
        d.children
          ? "text-right text-gray-500 italic"
          : "text-left text-gray-500 italic"
      )
      .text((d) =>
        d.depth === 0 ? "" : d.data.translation ? `(${d.data.translation})` : ""
      )
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif")
      .style("fill", "#555");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>() // The second type argument can be `unknown` if you're not specifying a custom data type.
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      });

    d3.select(svgRef.current).call(zoom);
  }, [data]);


  return (
    <div className="flex flex-col items-center w-full h-screen bg-white-200">
      
      
      
      {/* <div className="flex space-x-4 w-full max-w-6xl">

        <div className="p-4 bg-gray-100 border-b mb-4 flex-2">
          <h2 className="font-bold text-xl mb-2">Original Sentence:</h2>
          <p className="mb-1">{data.value}</p>
          <h2 className="font-bold text-xl mb-2">Translation:</h2>
          <p>{data.translation}</p>
        </div>

        <div className="p-4 bg-gray-100 border-b mb-4 w-full max-w-2xl min-h-48 h-48 overflow-y-auto flex-1">
          {hoveredNodeData ? (
            <div>
              <h3 className="font-bold text-lg mb-2">Node Data:</h3>
              {Object.entries(hoveredNodeData).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <strong>{key}:</strong>{" "}
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic h-full flex items-center justify-center">
              Hover over a node to see details
            </div>
          )}
        </div>
      </div> */}

<div className="flex flex-col md:flex-row space-y-4 md:space-x-4 w-full max-w-6xl">
  {/* Left block: 2/3 width on large screens, full width on smaller screens */}
  <div className="p-4 bg-gray-100 border-b md:border-b-0 md:mb-0">
    <h2 className="font-bold text-xl mb-2">Original Sentence:</h2>
    <p className="mb-1">{data.value}</p>
    <h2 className="font-bold text-xl mb-2">Translation:</h2>
    <p>{data.translation}</p>
  </div>

  {/* Right block: 1/3 width on large screens, full width on smaller screens */}
  <div className="p-4 bg-gray-100 border-b md:border-b-0 md:mb-0 w-full md:max-w-2xl min-h-48 h-48 overflow-y-auto md:flex-1">
    {hoveredNodeData ? (
      <div>
        <h3 className="font-bold text-lg mb-2">Node Data:</h3>
        {Object.entries(hoveredNodeData).map(([key, value]) => (
          <div key={key} className="mb-1">
            <strong>{key}:</strong>{" "}
            {typeof value === "object" ? JSON.stringify(value) : value}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-500 italic h-full flex items-center justify-center">
        Hover over a node to see details
      </div>
    )}
  </div>
</div>







      <div className="flex-grow w-full max-w-8xl mt-4">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default ParseTree;

// ------------------------------------------------------------ //

//export default ParseTree;

// --- //

// import React from 'react';
// import ParseTree from '../components/ParseTree';

// const HomePage = () => {

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold text-center mb-8">Japanese Parse Tree Visualization (like mirinae.io)</h1>
//       <div className="flex justify-center">
//         <ParseTree data={data} />
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// --- //

// REGULAR SPACING - FOR SHORTER SENTENCES

// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const ParseTree = ({ data }) => {
//   const svgRef = useRef();

//   useEffect(() => {
//     const margin = { top: 20, right: 120, bottom: 20, left: 150 };
//     const width = 800 - margin.right - margin.left;
//     const height = 1200 - margin.top - margin.bottom;  // Further increased height

//     // Clear any existing SVG elements before rendering
//     d3.select(svgRef.current).selectAll('*').remove();

//     const svg = d3.select(svgRef.current)
//       .attr('viewBox', `0 0 ${width + margin.right + margin.left} ${height + margin.top + margin.bottom}`)
//       .style('font', '12px sans-serif')
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     // Significantly increased vertical spacing
//     const treeLayout = d3.tree().size([height, width]);

//     const root = d3.hierarchy(data);
//     treeLayout(root);

//     // Links (branches)
//     svg.selectAll('.link')
//       .data(root.links())
//       .enter()
//       .append('path')
//       .attr('class', 'link')
//       .attr('d', d3.linkHorizontal()
//         .x(d => d.y)
//         .y(d => d.x + 40)  // Further increased vertical spacing between nodes
//       )
//       .attr('stroke', d => d.target.depth === 0 ? '#1f77b4' : '#94a3b8')
//       .attr('stroke-width', 2)
//       .attr('fill', 'none')
//       .attr('stroke-opacity', 0.6);

//     // Nodes (circles + text)
//     const node = svg.selectAll('.node')
//       .data(root.descendants())
//       .enter()
//       .append('g')
//       .attr('class', 'node')
//       .attr('transform', d => `translate(${d.y},${d.x + 40})`)  // Adjusted node positioning for more space
//       .on('mouseover', function (event, d) {
//         d3.select(this).select('circle').transition().duration(200)
//           .attr('r', 10)
//           .attr('fill', '#ff7f0e');
//         d3.select(this).selectAll('text').transition().duration(200)
//           .style('font-weight', 'bold')
//           .style('fill', '#ff7f0e');  // Change text color on hover
//       })
//       .on('mouseout', function (event, d) {
//         d3.select(this).select('circle').transition().duration(200)
//           .attr('r', 6)
//           .attr('fill', d => d.depth === 0 ? '#1f77b4' : '#4daf4a');
//         d3.select(this).selectAll('text').transition().duration(200)
//           .style('font-weight', 'normal')
//           .style('fill', '#333');  // Revert text color on mouseout
//       });

//     node.append('circle')
//       .attr('r', 6)
//       .attr('fill', d => d.depth === 0 ? '#1f77b4' : '#4daf4a')
//       .attr('stroke', '#555')
//       .attr('stroke-width', 2);

//     // Skip displaying the value for the root node
//     node.append('text')
//       .attr('dy', d => d.children ? '-1.5em' : '.35em')  // Position text above parent nodes
//       .attr('x', d => (d.children ? -10 : 10))  // Position text to the left of parent nodes and to the right of leaf nodes
//       .attr('text-anchor', d => d.children ? 'end' : 'start')  // Adjust text alignment
//       .attr('class', d => d.children ? 'text-right text-gray-700' : 'text-left text-gray-700')
//       .text(d => d.depth === 0 ? '' : `${d.data.value}`)  // Exclude value for the root node
//       .attr('font-size', '12px')
//       .attr('font-family', 'sans-serif')
//       .style('fill', '#333');  // Ensure consistent text color

//     // Adding the translation below the original text
//     node.append('text')
//       .attr('dy', d => d.children ? '-.5em' : '1.5em')  // Position translation below the original text
//       .attr('x', d => (d.children ? -10 : 10))  // Align translation text similarly
//       .attr('text-anchor', d => d.children ? 'end' : 'start')  // Adjust text alignment
//       .attr('class', d => d.children ? 'text-right text-gray-500 italic' : 'text-left text-gray-500 italic')
//       .text(d => d.depth === 0 ? '' : d.data.translation ? `(${d.data.translation})` : '')  // Exclude translation for the root node
//       .attr('font-size', '10px')
//       .attr('font-family', 'sans-serif')
//       .style('fill', '#555');  // Lighter color for translations

//     // Adding Zoom and Pan functionality
//     const zoom = d3.zoom()
//       .scaleExtent([0.5, 2])
//       .on('zoom', (event) => {
//         svg.attr('transform', event.transform);
//       });

//     d3.select(svgRef.current).call(zoom);

//   }, [data]);

//   return <svg ref={svgRef} className="w-full h-full"></svg>;
// };

//export default ParseTree;

// --- //

// HORIZONTALLY ADAPTIVE - FOR LONG SENTENCES
// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// const ParseTree = ({ data }) => {
//   const svgRef = useRef();

//   useEffect(() => {
//     const margin = { top: 20, right: 120, bottom: 20, left: 200 }; // Adjusted left margin for more space
//     const width = 1200 - margin.right - margin.left;  // Increased width for more horizontal space
//     const height = 1200 - margin.top - margin.bottom;  // Adjusted height

//     // Clear any existing SVG elements before rendering
//     d3.select(svgRef.current).selectAll('*').remove();

//     const svg = d3.select(svgRef.current)
//       .attr('viewBox', `0 0 ${width + margin.right + margin.left} ${height + margin.top + margin.bottom}`)
//       .style('font', '12px sans-serif')
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     // Tree layout with increased horizontal spacing
//     const treeLayout = d3.tree().size([height, width]);

//     const root = d3.hierarchy(data);
//     treeLayout(root);

//     // Links (branches)
//     svg.selectAll('.link')
//       .data(root.links())
//       .enter()
//       .append('path')
//       .attr('class', 'link')
//       .attr('d', d3.linkHorizontal()
//         .x(d => d.y * 1.2) // Increase horizontal spacing by scaling y-values
//         .y(d => d.x + 40))  // Vertical positioning
//       .attr('stroke', d => d.target.depth === 0 ? '#1f77b4' : '#94a3b8')
//       .attr('stroke-width', 2)
//       .attr('fill', 'none')
//       .attr('stroke-opacity', 0.6);

//     // Nodes (circles + text)
//     const node = svg.selectAll('.node')
//       .data(root.descendants())
//       .enter()
//       .append('g')
//       .attr('class', 'node')
//       .attr('transform', d => `translate(${d.y * 1.2},${d.x + 40})`)  // Increased horizontal spacing
//       .on('mouseover', function (event, d) {
//         d3.select(this).select('circle').transition().duration(200)
//           .attr('r', 10)
//           .attr('fill', '#ff7f0e');
//         d3.select(this).selectAll('text').transition().duration(200)
//           .style('font-weight', 'bold')
//           .style('fill', '#ff7f0e');  // Change text color on hover
//       })
//       .on('mouseout', function (event, d) {
//         d3.select(this).select('circle').transition().duration(200)
//           .attr('r', 6)
//           .attr('fill', d => d.depth === 0 ? '#1f77b4' : '#4daf4a');
//         d3.select(this).selectAll('text').transition().duration(200)
//           .style('font-weight', 'normal')
//           .style('fill', '#333');  // Revert text color on mouseout
//       });

//     node.append('circle')
//       .attr('r', 6)
//       .attr('fill', d => d.depth === 0 ? '#1f77b4' : '#4daf4a')
//       .attr('stroke', '#555')
//       .attr('stroke-width', 2);

//     // Skip displaying the value for the root node
//     node.append('text')
//       .attr('dy', d => d.children ? '-1.5em' : '.35em')  // Position text above parent nodes
//       .attr('x', d => (d.children ? -10 : 10))  // Position text to the left of parent nodes and to the right of leaf nodes
//       .attr('text-anchor', d => d.children ? 'end' : 'start')  // Adjust text alignment
//       .attr('class', d => d.children ? 'text-right text-gray-700' : 'text-left text-gray-700')
//       .text(d => d.depth === 0 ? '' : `${d.data.value}`)  // Exclude value for the root node
//       .attr('font-size', '12px')
//       .attr('font-family', 'sans-serif')
//       .style('fill', '#333');  // Ensure consistent text color

//     // Adding the translation below the original text
//     node.append('text')
//       .attr('dy', d => d.children ? '-.5em' : '1.5em')  // Position translation below the original text
//       .attr('x', d => (d.children ? -10 : 10))  // Align translation text similarly
//       .attr('text-anchor', d => d.children ? 'end' : 'start')  // Adjust text alignment
//       .attr('class', d => d.children ? 'text-right text-gray-500 italic' : 'text-left text-gray-500 italic')
//       .text(d => d.depth === 0 ? '' : d.data.translation ? `(${d.data.translation})` : '')  // Exclude translation for the root node
//       .attr('font-size', '10px')
//       .attr('font-family', 'sans-serif')
//       .style('fill', '#555');  // Lighter color for translations

//     // Adding Zoom and Pan functionality
//     const zoom = d3.zoom()
//       .scaleExtent([0.5, 2])
//       .on('zoom', (event) => {
//         svg.attr('transform', event.transform);
//       });

//     d3.select(svgRef.current).call(zoom);

//   }, [data]);

//   return <svg ref={svgRef} className="w-full h-full"></svg>;
// };

//export default ParseTree;

// --------------------------- //

// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';

// const ParseTree = ({ data }) => {
//   const svgRef = useRef();
//   const [hoveredNodeData, setHoveredNodeData] = useState(null); // State to hold hovered node data

//   useEffect(() => {
//     const margin = { top: 20, right: 120, bottom: 20, left: 200 };
//     const width = 1200 - margin.right - margin.left;  // Adjusted width for more horizontal space
//     const height = 800 - margin.top - margin.bottom;  // Adjusted height for a better aspect ratio

//     // Clear any existing SVG elements before rendering
//     d3.select(svgRef.current).selectAll('*').remove();

//     const svg = d3.select(svgRef.current)
//       .attr('viewBox', `0 0 ${width + margin.right + margin.left} ${height + margin.top + margin.bottom}`)
//       .attr('preserveAspectRatio', 'xMidYMid meet')  // Ensure the SVG scales while maintaining aspect ratio
//       .attr('width', '100%')
//       .attr('height', '100%')
//       .style('font', '12px sans-serif')
//       .append('g')
//       .attr('transform', `translate(${margin.left},${margin.top})`);

//     // Tree layout with decreased horizontal spacing
//     const treeLayout = d3.tree().size([height, width / 1.5]);

//     const root = d3.hierarchy(data);
//     treeLayout(root);

//     // Links (branches)
//     svg.selectAll('.link')
//       .data(root.links())
//       .enter()
//       .append('path')
//       .attr('class', 'link')
//       .attr('d', d3.linkHorizontal().x(d => d.y * 0.8).y(d => d.x + 40))
//       .attr('stroke', d => d.target.depth === 0 ? '#1f77b4' : '#94a3b8')
//       .attr('stroke-width', 2)
//       .attr('fill', 'none')
//       .attr('stroke-opacity', 0.6);

//     // Nodes (circles + text)
//     const node = svg.selectAll('.node')
//       .data(root.descendants())
//       .enter()
//       .append('g')
//       .attr('class', 'node')
//       .attr('transform', d => `translate(${d.y * 0.8},${d.x + 40})`)  // Decreased horizontal spacing
//       .on('mouseover', function (event, d) {
//         d3.select(this).select('circle').transition().duration(200)
//           .attr('r', 10)
//           .attr('fill', '#ff7f0e');
//         d3.select(this).selectAll('text').transition().duration(200)
//           .style('font-weight', 'bold')
//           .style('fill', '#ff7f0e');  // Change text color on hover

//         // Extract only direct data (no children)
//         const { children, ...nodeData } = d.data;
//         setHoveredNodeData(nodeData);  // Update the state with hovered node data
//       })
//       .on('mouseout', function () {
//         d3.select(this).select('circle').transition().duration(200)
//           .attr('r', 6)
//           .attr('fill', d => d.depth === 0 ? '#1f77b4' : '#4daf4a');
//         d3.select(this).selectAll('text').transition().duration(200)
//           .style('font-weight', 'normal')
//           .style('fill', '#333');  // Revert text color on mouseout
//         setHoveredNodeData(null);  // Clear the state when the mouse leaves the node
//       });

//     node.append('circle')
//       .attr('r', 6)
//       .attr('fill', d => d.depth === 0 ? '#1f77b4' : '#4daf4a')
//       .attr('stroke', '#555')
//       .attr('stroke-width', 2);

//     // Skip displaying the value for the root node
//     node.append('text')
//       .attr('dy', d => d.children ? '-1.5em' : '.35em')  // Position text above parent nodes
//       .attr('x', d => (d.children ? -10 : 10))  // Position text to the left of parent nodes and to the right of leaf nodes
//       .attr('text-anchor', d => d.children ? 'end' : 'start')  // Adjust text alignment
//       .attr('class', d => d.children ? 'text-right text-gray-700' : 'text-left text-gray-700')
//       .text(d => d.depth === 0 ? '' : `${d.data.value}`)  // Exclude value for the root node
//       .attr('font-size', '12px')
//       .attr('font-family', 'sans-serif')
//       .style('fill', '#333');  // Ensure consistent text color

//     // Adding the translation below the original text
//     node.append('text')
//       .attr('dy', d => d.children ? '-.5em' : '1.5em')  // Position translation below the original text
//       .attr('x', d => (d.children ? -10 : 10))  // Align translation text similarly
//       .attr('text-anchor', d => d.children ? 'end' : 'start')  // Adjust text alignment
//       .attr('class', d => d.children ? 'text-right text-gray-500 italic' : 'text-left text-gray-500 italic')
//       .text(d => d.depth === 0 ? '' : d.data.translation ? `(${d.data.translation})` : '')  // Exclude translation for the root node
//       .attr('font-size', '10px')
//       .attr('font-family', 'sans-serif')
//       .style('fill', '#555');  // Lighter color for translations

//     // Adding Zoom and Pan functionality
//     const zoom = d3.zoom()
//       .scaleExtent([0.5, 2])
//       .on('zoom', (event) => {
//         svg.attr('transform', event.transform);
//       });

//     d3.select(svgRef.current).call(zoom);

//   }, [data]);

//   return (
//     <div className="flex flex-col items-center w-full h-screen bg-slate-100">

//       <div className="p-4 bg-gray-100 border-b mb-4 w-full max-w-4xl">
//         <h2 className="font-bold text-xl mb-2">Original Sentence:</h2>
//         <p className="mb-1">{data.value}</p>
//         <h2 className="font-bold text-xl mb-2">Translation:</h2>
//         <p>{data.translation}</p>
//       </div>

//       <div className="p-4 bg-gray-100 border-b mb-4 w-full max-w-4xl h-48 overflow-y-auto">
//         {hoveredNodeData ? (
//           <div>
//             <h3 className="font-bold text-lg mb-2">Node Data:</h3>
//             {Object.entries(hoveredNodeData).map(([key, value]) => (
//               <div key={key} className="mb-1">
//                 <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-gray-500 italic h-full flex">Hover over a node to see details</div>
//         )}
//       </div>

//       <div className="flex-grow w-full max-w-5xl">
//         <svg ref={svgRef} className="w-full h-full"></svg>
//       </div>
//     </div>
//   );
// };

//export default ParseTree;
