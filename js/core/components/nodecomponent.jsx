// nodecomponent.tsx
import * as React from 'react';
class NodeComponent extends React.Component {
    render() {
        let { x, y, index, data } = this.props;
        let nodeData = data[index];
        let { nodeType, name, fieldType } = nodeData;
        // console.log('nodeType',nodeType)
        if (!nodeType)
            return <div></div>;
        let component;
        if (nodeType == 'item') {
            // item
            component = <svg x={x - (80 / 2)} y={y - (80 / 2)} height="80" width="80" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <g>
            <path d="M 49 392.769 L 49.048 392.769 C 51.423 423.069 140.438 447.428 249.899 447.428 C 359.36 447.428 448.375 423.069 450.75 392.769 L 451.001 392.769 L 451.001 437.281 L 450.736 437.281 C 450.778 437.751 450.799 438.222 450.799 438.694 C 450.799 469.568 360.853 494.596 249.899 494.596 C 138.945 494.596 48.999 469.568 48.999 438.694 C 48.999 438.222 49.02 437.751 49.062 437.281 L 49 437.281 Z"/>
            <ellipse style={{ fill: "rgb(216, 216, 216)" }} cx="250" cy="393.486" rx="200.9" ry="55.902"/>
          </g>
          <g transform="matrix(1, 0, 0, 1, 0, 133.561798)">
            <path d="M 259.799 148.497 L 259.802 148.497 L 259.802 251.376 L 259.796 251.376 C 259.745 252.977 255.378 254.271 249.997 254.271 C 244.585 254.271 240.198 252.962 240.198 251.348 C 240.198 251.308 240.201 251.268 240.206 251.229 L 240.206 148.614 C 240.373 150.185 244.694 151.443 250 151.443 C 255.412 151.443 259.799 150.134 259.799 148.52 C 259.799 148.512 259.799 148.505 259.799 148.497 Z"/>
            <ellipse style={{ fill: "rgb(216, 216, 216)" }} cx="250" cy="148.52" rx="9.799" ry="2.923"/>
          </g>
          <g transform="matrix(1.233934, 0, 0, 1, -59.793827, 0)">
            <ellipse cx="250" cy="183.491" rx="177.358" ry="177.358" style={{ fill: "rgb(158, 158, 158)" }}/>
            <ellipse cx="250" cy="183.491" rx="167.126" ry="167.125" style={{ fill: "rgb(216, 216, 216)" }}/>
          </g>
          <g>
              <text id="Name" textAnchor="middle" fill="#010101" fontFamily="Arial-BoldMT, Arial" fontSize="100" fontWeight="bold">
                  <tspan x="250" y="100">{name}</tspan>
              </text>
          </g>
        </svg>;
        }
        else if (nodeType == 'field') {
            // field
            component = <svg x={x - (60 / 2)} y={y - (60 / 2)} height="60" width="60" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pattern-0" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" viewBox="0 0 100 100">
            <path d="M 0 0 L 50 0 L 50 100 L 0 100 Z" style={{ fill: "black" }}/>
          </pattern>
        </defs>
        <rect x="25.05" y="626.004" width="402" height="43.783" transform="matrix(1, 0, 0, 1.000001, 0, -175.373148)"/>
        <path d="M 478.068 370.062 L 426.565 453.202 L 426.772 493.231 L 477.208 410.939 L 478.068 370.062 Z" style={{ stroke: "black", fill: "rgb(132, 132, 132)" }}/>
        <path d="M 93.498 368.813 L 25.683 452.844 L 427.053 453.109 L 478.046 369.005 L 93.498 368.813 Z" style={{ stroke: "black", fill: "rgb(216, 216, 216)" }}/>
        <g transform="matrix(1, 0, 0, 1, 7.129097, 157.745102)">
          <path d="M 259.799 148.497 L 259.802 148.497 L 259.802 251.376 L 259.796 251.376 C 259.745 252.977 255.378 254.271 249.997 254.271 C 244.585 254.271 240.198 252.962 240.198 251.348 C 240.198 251.308 240.201 251.268 240.206 251.229 L 240.206 148.614 C 240.373 150.185 244.694 151.443 250 151.443 C 255.412 151.443 259.799 150.134 259.799 148.52 C 259.799 148.512 259.799 148.505 259.799 148.497 Z"/>
          <ellipse style={{ fill: "rgb(216, 216, 216)" }} cx="250" cy="148.52" rx="9.799" ry="2.923"/>
        </g>
        <g transform="matrix(1.157577, 0, 0, 1.087123, -29.310127, -33.252464)">
          <rect x="45.928" y="43.867" width="400.223" height="337.804" style={{ fill: "rgb(158, 158, 158)" }}/>
          <rect style={{ fill: "rgb(216, 216, 216)" }} x="57.861" y="57.636" width="375.104" height="311.184"/>
        </g>
          <g>
              <text id="FieldType" textAnchor="middle" fill="#010101" fontFamily="Arial-BoldMT, Arial" fontSize="50" fontWeight="bold">
                  <tspan x="250" y="100">{fieldType}</tspan>
              </text>
          </g>
    </svg>;
        }
        else if (nodeType == 'collection') {
            component = <svg width="500px" height="500px" viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>collection</title>
        <desc>Created with Sketch.</desc>
        <defs>
            <filter x="-1.1%" y="-1.0%" width="104.2%" height="104.1%" filterUnits="objectBoundingBox" id="filter-1">
                <feOffset dx="6" dy="6" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix>
                <feMerge>
                    <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
            </filter>
        </defs>
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="collection">
                <g filter="url(#filter-1)" transform="translate(12.000000, 0.000000)">
                    <g id="Group" transform="translate(0.000000, 17.000000)" fill-rule="nonzero">
                        <rect id="Rectangle-path" fill="#9E9E9E" x="0.0761553814" y="0.92470888" width="474.923845" height="360.115079"></rect>
                        <rect id="Rectangle-path" fill="#D8D8D8" x="14.2475355" y="15.6101951" width="445.465632" height="331.896895"></rect>
                    </g>
                    <g id="Group" transform="translate(0.000000, 378.000000)" fill-rule="nonzero">
                        <rect id="Rectangle-path" fill="#555353" x="0" y="0" width="475" height="106.449599"></rect>
                        <rect id="Rectangle-path" fill="#D8D8D8" x="14.2475355" y="5.53955233" width="445.465632" height="96.9080248"></rect>
                    </g>
                    <text id="Testing" fill="#010101" font-family="Arial-BoldMT, Arial" font-size="26" font-weight="bold">
                        <tspan x="192.241211" y="24">Testing</tspan>
                    </text>
                </g>
            </g>
        </g>
    </svg>;
        }
        else {
            console.error('unknown node type');
            // TODO: throw error
        }
        // console.log('component', component)
        return component;
    } // render
} // component
export default NodeComponent;
//# sourceMappingURL=nodecomponent.jsx.map