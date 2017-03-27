// spacegraph.tsx
import * as React from 'react';
import { styles as globalstyles } from '../utilities/styles';
let styles = globalstyles.spacegraph;
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
        this.stylesmemo = {
            overflow: null
        };
        this.startDragChangeStyles = () => {
            // console.log('running startDragChangeStyles')
            this.stylesmemo.overflow = styles.frame.overflow;
            styles.frame.overflow = 'hidden';
            this.forceUpdate();
        };
        this.endDragRestoreStyles = () => {
            styles.frame.overflow = this.stylesmemo.overflow;
            this.stylesmemo.overflow = null;
            this.forceUpdate();
        };
    }
    componentWillMount() {
        if (this.props.getPaneTriggers) {
            let triggers = {};
            for (let trigger of this.props.triggers) {
                if (this[trigger]) {
                    triggers[trigger] = this[trigger];
                }
            }
            this.props.getPaneTriggers(this.props.paneid, triggers);
        }
        // console.log('SpaceGraph props',this.props)
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
        let frame = Object.assign({}, styles.frame);
        // console.log('spacegraph styles',styles)
        return <div style={styles.fixedframe}>
            <div style={styles.originframe}>
                <div style={styles.origin}>
                    Origin
                </div>
            </div>
            <div style={frame}>
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
        }} size={36} events={[
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