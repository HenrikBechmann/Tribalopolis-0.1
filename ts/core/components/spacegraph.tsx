// spacegraph.tsx
import * as React from 'react'

// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles as globalstyles } from '../utilities/styles'

import { range } from "lodash";

import {forceLink, forceManyBody, forceX, forceY} from "d3-force";

import VictoryForce from '../forks/victory-force'

import NodeComponent from './nodecomponent'

const nodes = range(120).map((i) => {
  return {
    index: i,
  };
});

console.log('nodes',nodes)

const links = range(nodes.length - 1).map((i) => {
  return {
    source: Math.floor(Math.sqrt(i)),
    target: i + 1
  };
});

console.log('links',links)

// <FloatingActionButton mini={true} secondary={true} style={styles.addbutton}>
//       <ContentAdd />
// </FloatingActionButton>

interface SpaceGraphProps {
    data:Object,
    paneid?:string,
    triggers?:string[],
    getTriggers?:Function,
}

class SpaceGraph extends React.Component<SpaceGraphProps,any> {

    state = {
        nodes,
        links,
    }

    styles = JSON.parse(JSON.stringify(globalstyles.spacegraph))

    componentWillMount() {
      if (this.props.getTriggers) {
          let triggers = {}
          for (let trigger of this.props.triggers) {
             if (this[trigger]) {
               triggers[trigger] = this[trigger]
             }
          }
          this.props.getTriggers(this.props.paneid,triggers)
      }
    }

    stylesmemo = {
      overflow:null
    }

    frameElement:HTMLElement = null

    onStartSplitterDrag = () => {
      // console.log('running onStartSplitterDrag')
      this.stylesmemo.overflow = this.frameElement.style.overflow
      this.frameElement.style.overflow = 'hidden'
      // styles.frame.overflow = 'hidden'
      // this.forceUpdate()
    }

    onEndSplitterDrag = () => {
      this.frameElement.style.overflow = this.stylesmemo.overflow
      // styles.frame.overflow = this.stylesmemo.overflow
      this.stylesmemo.overflow = null
      // this.forceUpdate()
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
          maxWidth: 5000,
          maxHeight: 5000
        };
        let styles = this.styles
        let frame = Object.assign({},styles.frame)
        // console.log('spacegraph styles',styles)
        return <div style={styles.fixedframe} >
            <div style={styles.originframe}>
                <div style={styles.origin}
                >
                    Origin
                </div>
            </div>
            <div 
              ref = {(node) => {
                this.frameElement = node
              }}
              style = {frame}>
              <VictoryForce
                nodes={this.state.nodes}
                links={this.state.links}
                height = {2000}
                width = {2000}
                forces={{
                  charge: forceManyBody(),
                  link: forceLink(this.state.links).distance(72).strength(1),
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
                size={72}
                nodeComponent = {<NodeComponent />}
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
    }
}

export default SpaceGraph