// spacegraph.tsx
import * as React from 'react';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';
import { styles as globalstyles } from '../utilities/styles';
import { range } from "lodash";
import { forceLink, forceManyBody, forceX, forceY } from "d3-force";
import VictoryForce from '../forks/victory-force';
class NodeComponent extends React.Component {
    render() {
        let x = this.props.x;
        let y = this.props.y;
        // console.log(this.props)
        return (<svg x={x - (53.6 / 2)} y={y - (65.13 / 2)} viewBox="0 0 15000 15000" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path d="M 49 392.769 L 49.048 392.769 C 51.423 423.069 140.438 447.428 249.899 447.428 C 359.36 447.428 448.375 423.069 450.75 392.769 L 451.001 392.769 L 451.001 437.281 L 450.736 437.281 C 450.778 437.751 450.799 438.222 450.799 438.694 C 450.799 469.568 360.853 494.596 249.899 494.596 C 138.945 494.596 48.999 469.568 48.999 438.694 C 48.999 438.222 49.02 437.751 49.062 437.281 L 49 437.281 Z"/>
    <ellipse style={{ fill: "rgb(216, 216, 216)" }} cx="250" cy="393.486" rx="200.9" ry="55.902"/>
  </g>
  <g transform="matrix(1, 0, 0, 1, 0, 133.561798)">
    <path d="M 259.799 148.497 L 259.802 148.497 L 259.802 251.376 L 259.796 251.376 C 259.745 252.977 255.378 254.271 249.997 254.271 C 244.585 254.271 240.198 252.962 240.198 251.348 C 240.198 251.308 240.201 251.268 240.206 251.229 L 240.206 148.614 C 240.373 150.185 244.694 151.443 250 151.443 C 255.412 151.443 259.799 150.134 259.799 148.52 C 259.799 148.512 259.799 148.505 259.799 148.497 Z"/>
    <ellipse style={{ fill: "rgb(216, 216, 216)" }} cx="250" cy="148.52" rx="9.799" ry="2.923"/>
  </g>
  <g>
    <ellipse cx="250" cy="183.491" rx="177.358" ry="177.358" style={{ fill: "rgb(158, 158, 158)" }}/>
    <ellipse style={{ fill: "rgb(216, 216, 216)" }} cx="250" cy="183.491" rx="167.126" ry="167.125"/>
  </g>
</svg>);
    }
}
const nodes = range(100).map((i) => {
    return {
        index: i,
    };
});
const links = range(nodes.length - 1).map((i) => {
    return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1
    };
});
class SpaceGraph extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            nodes,
            links,
        };
        this.styles = JSON.parse(JSON.stringify(globalstyles.spacegraph));
        this.stylesmemo = {
            overflow: null
        };
        this.frameElement = null;
        this.onStartSplitterDrag = () => {
            // console.log('running onStartSplitterDrag')
            this.stylesmemo.overflow = this.frameElement.style.overflow;
            this.frameElement.style.overflow = 'hidden';
            // styles.frame.overflow = 'hidden'
            // this.forceUpdate()
        };
        this.onEndSplitterDrag = () => {
            this.frameElement.style.overflow = this.stylesmemo.overflow;
            // styles.frame.overflow = this.stylesmemo.overflow
            this.stylesmemo.overflow = null;
            // this.forceUpdate()
        };
    }
    componentWillMount() {
        if (this.props.getTriggers) {
            let triggers = {};
            for (let trigger of this.props.triggers) {
                if (this[trigger]) {
                    triggers[trigger] = this[trigger];
                }
            }
            this.props.getTriggers(this.props.paneid, triggers);
        }
    }
    removeNode(datum) {
        const { nodes, links } = this.state;
        this.setState({
            nodes: nodes.filter((node) => node.index !== datum.index),
            links: links.filter(({ source, target }) => {
                return source.index !== datum.index && target.index !== datum.index;
            })
        });
    }
    render() {
        const containerStyle = {};
        const parentStyle = {
            backgroundColor: "#f7f7f7",
            maxWidth: 5000,
            maxHeight: 5000
        };
        let styles = this.styles;
        let frame = Object.assign({}, styles.frame);
        // console.log('spacegraph styles',styles)
        return <div style={styles.fixedframe}>
            <div style={styles.originframe}>
                <div style={styles.origin}>
                    Origin
                </div>
            </div>
            <div ref={(node) => {
            this.frameElement = node;
        }} style={frame}>
              <VictoryForce nodes={this.state.nodes} links={this.state.links} height={2000} width={2000} forces={{
            charge: forceManyBody(),
            link: forceLink(this.state.links).distance(72).strength(1),
            x: forceX(),
            y: forceY()
        }} style={{
            parent: parentStyle,
            links: {
                stroke: "rgba(0, 0, 0, 0.2)",
                strokeWidth: 1
            }
        }} size={72} nodeComponent={<NodeComponent />} events={[
            {
                target: "data",
                eventHandlers: {
                    onClick: (e, { datum }) => {
                        this.removeNode(datum);
                    }
                }
            }
        ]}/>
            </div>
        </div>;
    }
}
export default SpaceGraph;
//# sourceMappingURL=spacegraph.jsx.map