// spacegraph.tsx
import * as React from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles as globalstyles } from '../utilities/styles'

import { range } from "lodash";

import {forceLink, forceManyBody, forceX, forceY} from "d3-force";

import VictoryForce from '../forks/victory-force'

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


// <FloatingActionButton mini={true} secondary={true} style={styles.addbutton}>
//       <ContentAdd />
// </FloatingActionButton>

interface SpaceGraphProps {
    data:Object
}

class SpaceGraph extends React.Component<SpaceGraphProps,any> {

    state = {
        nodes,
        links,
    }


    removeNode(datum) {
       const {nodes, links} = this.state;
       this.setState({
           nodes: nodes.filter((node) => node.index !== datum.index),
           links: links.filter(({source, target}) => {
               return source.index !== datum.index && target.index !== datum.index;
            })
        });
    }

    render() {
        const containerStyle = {
          // display: "flex",
          // flexDirection: "row",
          // flexWrap: "wrap",
          // alignItems: "center",
          // justifyContent: "center"
        };

        const parentStyle = {
          backgroundColor: "#f7f7f7",
          border: "1px solid #ccc",
          maxWidth: 500,
          maxHeight: 500
        };
        let styles = globalstyles.spacegraph
        return <div style={styles.fixedframe} >
            <div style={styles.originframe}>
                <div style={styles.origin}
                >
                    Origin
                </div>
            </div>
            <div style = {styles.frame}>
                <div style={styles.platform}>
              <VictoryForce
                nodes={this.state.nodes}
                links={this.state.links}
                forces={{
                  charge: forceManyBody(),
                  link: forceLink(this.state.links).distance(20).strength(1),
                  x: forceX(),
                  y: forceY()
                }}
                style={{
                  parent: parentStyle,
                  links: {
                    stroke: "rgba(0, 0, 0, 0.2)",
                    strokeWidth: 1
                  }
                }}
                size={3}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onClick: (e, {datum}) => {
                        this.removeNode(datum);
                      }
                    }
                  }
                ]}
              />
                </div>
            </div>
        </div>        
    }
}

export default SpaceGraph