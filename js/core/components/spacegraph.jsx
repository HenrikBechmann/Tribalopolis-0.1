// spacegraph.tsx
import * as React from 'react';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';
import { styles as globalstyles } from '../utilities/styles';
import { range } from "lodash";
import { forceLink, forceManyBody, forceX, forceY } from "d3-force";
import VictoryForce from '../forks/victory-force';
import NodeComponent from './nodecomponent';
const nodes = range(120).map((i) => {
    return {
        index: i,
        nodeType: ((i % 2) == 0) ? 'item' : 'list'
    };
});
// console.log('nodes',nodes)
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
            nodes: null,
            links: null,
            maps: null,
        };
        this.styles = JSON.parse(JSON.stringify(globalstyles.spacegraph));
        this.updatecount = 0;
        // TODO: define links that are reciprocated as "bonds" so that they
        // can be presented as bold lines
        this.transformSourceGraph = (nodes, links) => {
            console.log('transformSourceGraph: nodes, links', nodes, links);
            let data = {
                links: null,
                nodes: null,
                maps: {
                    linkindextoidmap: null,
                    linkidtoindexmap: null,
                    nodeindextoidmap: null,
                    nodeidtoindexmap: null,
                }
            };
            let graphlinks = [];
            let graphnodes = [];
            let linkindextoidmap = [];
            let linkidtoindexmap = {};
            let nodeindextoidmap = [];
            let nodeidtoindexmap = {};
            let nodeindex = 0;
            let linkindex = 0;
            // create graph node for each imported node
            for (let id in nodes) {
                let node = graphnodes[nodeindex] = {
                    index: nodeindex,
                    nodeType: 'item',
                    name: nodes[id].properties.name,
                    fields: {}
                };
                nodeindextoidmap[nodeindex] = id;
                nodeidtoindexmap[id] = nodeindex;
                nodeindex++;
                // create graph node for each field of each node
                let fields = nodes[id].fields;
                for (let fieldType in fields) {
                    let fieldnode = graphnodes[nodeindex] = {
                        nodeindex,
                        nodeType: 'field',
                        itemid: id,
                        fieldType,
                    };
                    node.fields[fieldType] = nodeindex;
                    graphlinks[linkindex] = {
                        source: nodeidtoindexmap[fieldnode.itemid],
                        target: nodeindex,
                    };
                    linkindex++;
                    nodeindex++;
                }
            }
            data.nodes = graphnodes;
            // create graph link for each imported link
            for (let id in links) {
                graphlinks[linkindex] = {
                    source: graphnodes[nodeidtoindexmap[links[id].startNode]].fields[links[id].type],
                    target: nodeidtoindexmap[links[id].endNode],
                };
                linkindextoidmap[linkindex] = id;
                linkidtoindexmap[id] = linkindex;
                linkindex++;
            }
            data.maps = {
                linkindextoidmap,
                linkidtoindexmap,
                nodeindextoidmap,
                nodeidtoindexmap,
            };
            data.links = graphlinks;
            return data;
        };
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
    componentDidMount() {
        // console.log('props',this.props)
        let { data } = this.props;
        if (data.nodes) {
            let { nodes: sourcenodes, links: sourcelinks } = this.props.data;
            // console.log('data',sourcenodes,sourcelinks)
            this.setState({
                nodes,
                links
            });
        }
    }
    componentDidUpdate() {
        let { data } = this.props;
        // console.log('data after did update', data)
        if (data.nodes && (this.updatecount == 0)) {
            this.updatecount++;
            let { nodes: sourcenodes, links: sourcelinks } = this.props.data;
            let graphdata = this.transformSourceGraph(sourcenodes, sourcelinks);
            console.log('update space data: graphdata.nodes, nodes, graphdata.links, links', graphdata.nodes, nodes, graphdata.links, links);
            this.setState({
                maps: graphdata.maps,
                nodes: graphdata.nodes,
                links: graphdata.links,
            });
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