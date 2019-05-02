// quadrant.view.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

/*
    TODO: keep scrollbox pos in settings when navigating stack levels
*/
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'
import { toast } from 'react-toastify'

import QuadOrigin from './quadrant/quadorigin.view'
import QuadContextBar from './quadrant/quadcontextbar.view'
import DataDrawer from './common/datadrawer.view'
import DataPane from './common/datapane.view'

import DataBox from './databox.controller'
import { FixedSizeList as List } from 'react-window'

import quadanimations from './quadrant/quadanimations.class'
import quadoperations from './quadrant/quadoperations.class'

import { DocTokenStruc } from '../services/interfaces'
// import UserDataContext from '../services/userdata.context'
// import ControlData from '../services/controldata.context'
import { DataPaneContext } from '../services/interfaces'

let styles = createStyles({
   quadcontent: {
        boxSizing: 'border-box',
        border: '3px outset gray',
        position:'relative',
        borderRadius:'8px',
        width:'100%',
        height:'100%',
        overflow:'hidden',
    },
    viewportFrame: {
        position:'absolute',
        top:'calc(32px + 2%)',
        left:'2%',
        bottom:'2%',
        right:'2%',
        borderRadius:'8px',
        overflow:'hidden',
    },

    viewport: {
        width: '100%',
        height:'100%',
        overflow:'auto',
        webkitOverflowSrolling:'touch',
        border: '1px solid gray',
        boxSizing: 'border-box',
        borderRadius: '8px',
        position:'relative',
    },
    startscreen:{
        display:'flex',
        position:'absolute',
        height:'100%',
        width:'100%',
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
        fontSize:'larger',
        fontStyle:'italic',
        fontWeight:'bold',
        opacity:.54,
    }
})

// List item
class Quadrant extends React.Component<any,any>  {

/********************************************************
----------------------[ initialize ]---------------------
*********************************************************/

    constructor(props) {
        super(props)

        // ----------[ refs ]----------
        // animation elements
        this.drillanimationblock = React.createRef()
        this.originanimationblock = React.createRef()
        this.maskanimationblock = React.createRef()
        // animation source elements
        this.quadcontentelement = React.createRef()
        this.scrollboxelement = React.createRef()
        this.originelement = React.createRef()

        // ------------[ data ]-------------
        this.datastack = this.props.datastack
        this.systemdata = this.props.systemdata
        this.userdata = this.props.userdata

        // ------------[ components ]-------------
        this.listcomponent = React.createRef()
        this.datadrawerelement = React.createRef()

        // ----------[ callbacks ]----------
        this.setDocpackPairListener = this.props.callbacks.setDocpackPairListener
        this.removeDocpackPairListener = this.props.callbacks.removeDocpackPairListener

        // ------[ delegation classes: animations and operations ]------
        this.animations = new quadanimations({

            scrollboxelement:this.scrollboxelement,
            originelement:this.originelement,
            quadcontentelement:this.quadcontentelement,
            originanimationblock:this.originanimationblock,
            maskanimationblock:this.maskanimationblock,
            drillanimationblock:this.drillanimationblock,

        })

        this.operations = new quadoperations({

            quadrant:this, 
            animations: this.animations,
            listcomponent:this.listcomponent, 
            scrollboxelement:this.scrollboxelement,

        })

        // -----------[ window listener ]-----------
        window.addEventListener('resize',this.onResize)

    }

    state = {
        stackpointer:0,
        boxwidth:300,
        draweropen:false,
    }

    datastack = null
    activeTargetProxy = null

    activeaccountreference
    systemdata
    userdata
    activemember
    activeaccount

    // dom refs
    quadcontentelement
    originelement
    scrollboxelement
    drillanimationblock
    originanimationblock
    maskanimationblock

    // component ref
    listcomponent
    datadrawerelement

    // callbacks get database records
    setDocpackPairListener
    removeDocpackPairListener

    // delegation classes
    operations
    animations

    // data drawer message
    drawerdatapackage:DataPaneContext

    // startIndex
    // stopIndex

    // control var; controls second cyle of render to get dom ref values
    cycleForReferences = false

/********************************************************
------------------[ lifecycle methods ]------------------
*********************************************************/

    componentDidMount() {

        if (this.cycleForReferences) this.forceUpdate()

    }

    componentDidUpdate() {

        let activeTargetProxy = this.activeTargetProxy

        // animation and visibility based on return from descendant stack level
        if (!activeTargetProxy) return

        this.operations.setTargetProxy(null)

        setTimeout( () => { // defer to currently running code

            if (this.listcomponent && (this.datastack[this.state.stackpointer].items.length > 1)) {

                let scrollindex = activeTargetProxy.index
                this.listcomponent.current.scrollToItem(scrollindex)

            }

            setTimeout(()=>{ // time for scroll to take place

                this.forceUpdate(() => {
                    this.activeTargetProxy = null
                })

            },300) // very timing sensitive

        },1000) // very timing sensitive
    }

    _findlinkIndex = (instanceid) => {

        return (itemDocumentProxy) => {
            // console.log('_findlinkIndex', itemDocumentProxy.instanceid, instanceid)
            return itemDocumentProxy.instanceid == instanceid
        }

    }

    componentWillUnmount() {

        window.removeEventListener('resize',this.onResize)

    }

    // for reset of containerHeight
    onResize = () => {
        this.forceUpdate()
    }

/********************************************************
----------------[ control data assembly ]----------------
*********************************************************/

    getActiveMemberData = (systemdata, userdata, activemember, activeaccount) => {
    // TODO fetch activememberdata from cache or from db
        if (!activemember) {
            return null
        } else {
            return activemember
        }
    }

    getActiveAccountData = (systemdata, userdata, activemember, activeaccount) => {
    // TODO fetch activeaccountdata from cache or from db
        if (!activeaccount) {
            return {} //userdata.account
        } else {
            return {} //activeaccount // as found in database or cache
        }
    }

/********************************************************
-------------------[ databox assembly ]------------------
*********************************************************/

    setBoxWidth = (width) => {

        this.setState({
            boxwidth:width,
        })
    }

    closeDrawer = () => {
        this.drawerdatapackage = null
        this.setState({
            draweropen:false,
        })
    }

    callDataDrawer = ({docproxy,options}:DataPaneContext) => {
        if (this.state.draweropen) {
            this.setState({
                draweropen:false
            },() => {
                this.drawerdatapackage = {docproxy,options, callbacks:{}}
                this.setState({
                    draweropen:true
                })
            })
            // toast.info('The data shelf is in use. Close the shelf and try again.')
            return
        }
        this.drawerdatapackage = {docproxy, options, callbacks:{}}
        this.setState({
            draweropen:true,
        })
    }

    setDefault = () => {

        let datastack = this.datastack
        datastack[this.state.stackpointer].items = datastack[this.state.stackpointer].defaultitems
        this.forceUpdate()

    }

    getBox = ({index,style}) => {

        return this.Box({index,style})

    }

    Box = ({index, style = null}) => {

        let datastack = this.datastack

        let { stackpointer } = this.state

        // console.log('Box in quadrant, datastack, scrollboxelement',datastack, this.scrollboxelement)

        if (!datastack) return null

        this.cycleForReferences = !this.scrollboxelement.current

        if (this.cycleForReferences) return null

        let itemProxy = datastack[stackpointer].items[index]

        if (!itemProxy) return null

        let stacklayer = datastack[stackpointer]
        let haspeers = (stacklayer && (stacklayer.items.length > 1))

        return this.getBoxComponent(
        {
            itemProxy,
            index,
            haspeers,
            style
        })
    }

    getBoxComponent = ({itemProxy, index, haspeers, style}) => {

        let containerHeight = this.scrollboxelement.current.offsetHeight

        let matchForTarget = false
        let activeTargetProxy = this.activeTargetProxy // this.operations.getTargetProxy()
        if (activeTargetProxy) {
            matchForTarget = (!haspeers || (activeTargetProxy.index == index))
            // console.log('matchfortarget',!haspeers,(activeTargetProxy.index == index), haspeers, activeTargetProxy.index ,index)
            if (matchForTarget) this.activeTargetProxy = null
        }

        // console.log('getBoxComponent itemProxy, activeTargetProxy, index, matchForTarget',itemProxy, activeTargetProxy, index, matchForTarget)

        let boxcallbacks = {
            // data fulfillment
            setDocpackPairListener:this.setDocpackPairListener,
            removeDocpackPairListener:this.removeDocpackPairListener,

            // animations and operations
            highlightBox:this.animations.highlightBox,
            splayBox:(domSource, listcomponent,listdoctoken) => {
                this.operations.splayBox(index, domSource, listcomponent,listdoctoken)},
            expandFromSplay:(domSource) => {
                this.operations.expandFromSplay(index,domSource)},
            expandDirectoryItem:(doctoken:DocTokenStruc, domSource) => {
                this.operations.expandDirectoryItem(index,doctoken, domSource)},
            collapseDirectoryItem:this.operations.collapseDirectoryItem,
            setBoxWidth:this.setBoxWidth,
            callDataDrawer:this.callDataDrawer,
        }
        let databox = <div 
            style = {haspeers?style:
                {
                width:'none',
                minWidth:'none',
                height: (containerHeight -2) + 'px',
                display:'block',
                }
            }><DataBox 
                key = { itemProxy.instanceid } 

                itemProxy = { itemProxy }
                collapseTargetProxy = {matchForTarget?activeTargetProxy:null}
                haspeers = { haspeers }
                index = { index }
                containerHeight = { containerHeight -1 }
                boxwidth = { this.state.boxwidth }

                callbacks = { boxcallbacks }
            /></div>

        return databox

    }

/********************************************************
------------------------[ render ]-----------------------
*********************************************************/

    render() {

        let { color, classes, systemdata, userdata } = this.props

        let datastack = this.datastack
        console.log('datastack in quadrant.controller render',datastack)

        let { stackpointer } = this.state

        let haspeers = datastack?(datastack[stackpointer].items.length > 1):false
        let isempty = datastack?!(datastack[stackpointer].items.length):true

        let quadcontentStyle = {
            backgroundColor: color,
        }
        let viewportStyle = {
            backgroundColor:haspeers?'#e8e8e8':'lightblue',
        }

        // Safari keeps scrollleft with content changes
        if (!haspeers && this.scrollboxelement.current && (this.scrollboxelement.current.scrollLeft != 0)) {
            this.scrollboxelement.current.scrollLeft = 0
        }

        return (
            <div
                className = {classes.quadcontent}
                style = {quadcontentStyle}
                ref = {this.quadcontentelement}
            >
                <div ref = {this.drillanimationblock} ></div>
                <div ref = {this.originanimationblock} ></div>
                <div ref = {this.maskanimationblock} ></div>

                <QuadContextBar
                    userdata = {userdata} 
                    quadidentifier={this.props.quadidentifier}
                    datastack = {datastack}
                    stackpointer = {this.state.stackpointer}
                    callbacks = {this.props.callbacks}
                    callDataDrawer = {this.callDataDrawer}
                />
                <QuadOrigin 
                    haspeers = {haspeers}
                    stackpointer = {this.state.stackpointer} 
                    stackdepth = {datastack?datastack.length:0}
                    itemdepth = {datastack?datastack[this.state.stackpointer].items.length:0}
                    incrementStackSelector = {this.operations.incrementStackSelector}
                    decrementStackSelector = {this.operations.decrementStackSelector}
                    ref = {this.originelement}
                />
                <div className = {classes.viewportFrame}>

                    <DataDrawer open = {this.state.draweropen}
                        handleClose = {this.closeDrawer}
                        containerelement = {this.quadcontentelement}
                    >
                        <DataPane
                            dataPaneContext = {this.drawerdatapackage}
                        />
                    </DataDrawer>
                
                    <div 
                        className = {classes.viewport}
                        style = {viewportStyle}
                        ref = {this.scrollboxelement}
                    >
                        {userdata?
                            (!isempty?(
                                haspeers
                                    ?<List 
                                        itemCount = { 
                                            datastack?datastack[this.state.stackpointer].items.length:0
                                        }
                                        layout = "horizontal"
                                        height = {this.scrollboxelement.current.offsetHeight}
                                        width = {this.scrollboxelement.current.offsetWidth}
                                        itemSize = {this.state.boxwidth + 56}
                                        ref = {this.listcomponent}
                                     >
                                        {this.Box}
                                    </List>
                                    :this.Box({index:0,style:null})
                                )
                                :
                                <div className = {classes.startscreen}
                                    onClick = {this.setDefault}
                                >
                                    <div>Tap to start</div>
                                </div>)
                            :<div className = {classes.startscreen}>Must be signed in to use this utility</div>
                            }
                        }}
                    </div>
                }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Quadrant)
