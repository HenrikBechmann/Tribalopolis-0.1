// spacegraph.tsx
/*
    TODO:
    Incorporate ROLES as a filter somehow
*/
import * as React from 'react'

// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ContentAdd from 'material-ui/svg-icons/content/add';

import { styles as globalstyles } from '../utilities/styles'

import { range } from "lodash";

import { forceLink, forceManyBody, forceCenter, forceX, forceY } from "d3-force";

import VictoryForce from '../forks/victory-force'

import NodeComponent from './nodecomponent'

const nodes = range(120).map((i) => {
  return {
    index: i,
    nodeType: ((i % 2)==0)?'item':'list'
  };
});

// console.log('nodes',nodes)

const links = range(nodes.length - 1).map((i) => {
  return {
    source: Math.floor(Math.sqrt(i)),
    target: i + 1
  };
});

// console.log('links',links)

// <FloatingActionButton mini={true} secondary={true} style={styles.addbutton}>
//       <ContentAdd />
// </FloatingActionButton>


class Link extends React.Component<any,any> {

  render() {
    let {x, y, style, datum, scale, accessor} = this.props

    let x2 = scale.x(accessor.x(datum.target))
    let y2 = scale.y(accessor.y(datum.target))

    console.log('line props, x2, y2',this.props, x2, y2)

    let angleRadians = Math.atan2(y2 - y, x2 - x)

    let cx = (Math.cos(angleRadians) * 50) + x
    let cy = (Math.sin(angleRadians) * 50) + y

    return (
      <g>
      <circle cx = {cx} cy = {cy} r = "3" fill={style.stroke}/>
      <line
        style={style}
        x1={x}
        x2={x2}
        y1={y}
        y2={y2}
      />
      </g>
      );
  }
}

interface SpaceGraphProps {
    data:{
      nodes:Object,
      links:Object
    },
    paneid?:string,
    triggers?:string[],
    getTriggers?:Function,
}

class SpaceGraph extends React.Component<SpaceGraphProps,any> {

    state = {
        nodes:null,
        links:null,
        maps:null,
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

    componentDidMount() {
      // console.log('props',this.props)
      let { data } = this.props
      if (data.nodes) {
        let {nodes:sourcenodes, links:sourcelinks} = this.props.data

        // console.log('data',sourcenodes,sourcelinks)

        this.setState({
          nodes,
          links
        })
      }

    }

    updatecount = 0
    componentDidUpdate() {
      let { data } = this.props
      // console.log('data after did update', data)
      if (data.nodes && ( this.updatecount == 0 )) {
        this.updatecount++
        let {nodes:sourcenodes, links:sourcelinks} = this.props.data

        let graphdata = this.transformSourceGraph(sourcenodes,sourcelinks)

        console.log('update space data: graphdata.nodes, nodes, graphdata.links, links',graphdata.nodes, nodes, graphdata.links, links)

        this.setState({
          maps:graphdata.maps,
          nodes:graphdata.nodes,
          links:graphdata.links,
        })
      }
    }

// TODO: define links that are reciprocated as "bonds" so that they
// can be presented as bold lines
    transformSourceGraph = (nodes, links) => {
      console.log('transformSourceGraph: nodes, links', nodes, links)
      let data = {
        links:null,
        nodes:null,
        maps:{
          linkindextoidmap:null,
          linkidtoindexmap:null,
          nodeindextoidmap:null,
          nodeidtoindexmap:null,
        }
      }
      let graphlinks = []
      let graphnodes = []
      let linkindextoidmap = []
      let linkidtoindexmap = {}
      let nodeindextoidmap = []
      let nodeidtoindexmap = {}

      let nodeindex = 0
      let linkindex = 0
      // create graph node for each imported node
      for (let id in nodes) {
        let node = graphnodes[nodeindex] = {
          index:nodeindex,
          nodeType:'item',
          name:nodes[id].properties.name,
          fields:{},
          collections:{},
        }
        nodeindextoidmap[nodeindex]=id
        nodeidtoindexmap[id] = nodeindex
        nodeindex++
        // create graph node for each field of each node
        let fields = nodes[id].fields
        for (let fieldType in fields) {
          let fieldnode = graphnodes[nodeindex] = {
            index:nodeindex,
            nodeType:'field',
            itemid:id,
            fieldType,
          }
          node.fields[fieldType] = nodeindex

          graphlinks[linkindex] = {
            source:nodeidtoindexmap[fieldnode.itemid],
            target:nodeindex,
            strokeWidth:2,
            root:true,
            stroke:"black",
          }
          linkindex++
          nodeindex++
        }
      }
      data.nodes = graphnodes

      // create graph link for each imported link
      for (let id in links) {
        let link = links[id]
        let linktargetid = link.endNode
        // create target collection if necessary
        let linktargetnode = graphnodes[nodeidtoindexmap[linktargetid]]
        if (!linktargetnode.collections[link.type]) {
          graphnodes[nodeindex] = {
            index:nodeindex,
            nodeType:'collection',
            itemid:linktargetid,
            fieldType:link.type,
          }
          linktargetnode.collections[link.type] = nodeindex
          graphlinks[linkindex] = {
            source:linktargetnode.index,
            target:nodeindex,
            strokeWidth:2,
            root:true,
            stroke:"black",
          }
          nodeindex++
          linkindex++
        }
        // get target link
        let targetlink = linktargetnode.collections[link.type]
        // create link
        graphlinks[linkindex] = {
          source:graphnodes[nodeidtoindexmap[links[id].startNode]].fields[links[id].type],
          target:targetlink,
        }
        linkindextoidmap[linkindex] = id
        linkidtoindexmap[id] = linkindex
        linkindex++
      }
      data.maps = {
        linkindextoidmap,
        linkidtoindexmap,
        nodeindextoidmap,
        nodeidtoindexmap,
      }
      data.links = graphlinks
      return data
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
                  link: forceLink(this.state.links).distance((link)=>{
                    return link["root"]?2:72
                  }).strength((link)=>{
                    // console.log('link',link)
                    return link["root"]? 5:1
                  } ),
                  // gravity: 3,
                  center: forceCenter(1000,1000),
                  x: forceX(),
                  y: forceY()
                }}
                style={{
                  parent: parentStyle,
                  links: {
                    stroke: "rgba(0, 0, 0, 0.2)",
                    strokeWidth: 1,
                  }
                }}
                size={72}
                nodeComponent = {<NodeComponent />}
                linkComponent = {<Link />}
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