// spacegraph.tsx
import * as React from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles as globalstyles } from '../utilities/styles'

let styles = globalstyles.spacegraph

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
    data:Object,
    paneid?:string,
    triggers?:string[],
    getPaneTriggers?:Function,
}

class SpaceGraph extends React.Component<SpaceGraphProps,any> {

    state = {
        nodes,
        links,
    }

    componentWillMount() {
      if (this.props.getPaneTriggers) {
          let triggers = {}
          for (let trigger of this.props.triggers) {
             if (this[trigger]) {
               triggers[trigger] = this[trigger]
             }
          }
          this.props.getPaneTriggers(this.props.paneid,triggers)
      }
      // console.log('SpaceGraph props',this.props)
    }

    stylesmemo = {
      overflow:null
    }

    startDragChangeStyles = () => {
      // console.log('running startDragChangeStyles')
      this.stylesmemo.overflow = styles.frame.overflow
      styles.frame.overflow = 'hidden'
      this.forceUpdate()
    }

    endDragRestoreStyles = () => {
      styles.frame.overflow = this.stylesmemo.overflow
      this.stylesmemo.overflow = null
      this.forceUpdate()
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
        let frame = Object.assign({},styles.frame)
        // console.log('spacegraph styles',styles)
        return <div style={styles.fixedframe} >
            <div style={styles.originframe}>
                <div style={styles.origin}
                >
                    Origin
                </div>
            </div>
            <div style = {frame}>
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
                size={36}
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