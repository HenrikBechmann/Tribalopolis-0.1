// spacegraph.tsx
import * as React from 'react';
import { styles as globalstyles } from '../utilities/styles';
import { range } from "lodash";
import { forceLink, forceManyBody, forceX, forceY } from "d3-force";
import VictoryForce from '../forks/victory-force';
const nodes = range(200).map((i) => {
    return {
        index: i
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
            border: "1px solid #ccc",
            maxWidth: 500,
            maxHeight: 500
        };
        let styles = globalstyles.spacegraph;
        return <div style={styles.fixedframe}>
            <div style={styles.originframe}>
                <div style={styles.origin}>
                    Origin
                </div>
            </div>
            <div style={styles.frame}>
            <div style={{ textAlign: 'right' }}>Demo: Click on a node to remove it</div>
                <div style={styles.platform}>
              <VictoryForce nodes={this.state.nodes} links={this.state.links} forces={{
            charge: forceManyBody(),
            link: forceLink(this.state.links).distance(20).strength(1),
            x: forceX(),
            y: forceY()
        }} style={{
            parent: parentStyle,
            links: {
                stroke: "rgba(0, 0, 0, 0.2)",
                strokeWidth: 1
            }
        }} size={3} events={[
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
            </div>
        </div>;
    }
}
export default SpaceGraph;
//# sourceMappingURL=spacegraph.jsx.map