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
import UserDataContext from '../services/userdata.context'
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
        this.drillanimationblock = React.createRef()
        this.originanimationblock = React.createRef()
        this.maskanimationblock = React.createRef()
        // animation source elements
        this.quadcontentelement = React.createRef()
        this.scrollboxelement = React.createRef()
        this.originelement = React.createRef()

        // components
        this.listcomponent = React.createRef()
        this.datadrawerelement = React.createRef()

        // ----------[ callbacks ]----------
        this.setDocpackPairListener = this.props.callbacks.setDocpackPairListener
        this.removeDocpackPairListener = this.props.callbacks.removeDocpackPairListener

        // ------[ delegation classes ]------
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

        this.datastack = this.props.datastack,

        // -----------[ window listener ]-----------
        window.addEventListener('resize',this.onResize)

    }

    state = {
        // datastack:null,
        stackpointer:0,
        boxwidth:300,
        draweropen:false,
    }

    datastack
    activeTargetProxy = null

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

    drawerdatapackage:DataPaneContext

    startIndex
    stopIndex

    cycleForReferences = false

/********************************************************
------------------[ lifecycle methods ]------------------
*********************************************************/

    componentDidMount() {

        // setting of datastack delayed because
        // scrollbox height must be available to set height of content items
        // this.setState({
        //     datastack: this.props.datastack,
        // })
        if (this.cycleForReferences) this.forceUpdate()

    }

    componentDidUpdate() {

        console.log('quadrant componentDidUpdate isTargetProxy()', this.operations.isTargetProxy())
        // animation and visibilit based on return from descendant stack level
        if (!this.operations.isTargetProxy()) return

        // keep; value will be purged
        let activeTargetProxy = this.operations.getTargetProxy()

        this.operations.setTargetProxy(null)
        // get index for Lister
        let index = this.datastack[this.state.stackpointer].items
            .findIndex
                (this._findlinkIndex
                    (activeTargetProxy.sourceinstanceid))

        // update scroll display with selected highlight item
        activeTargetProxy.index = index

        setTimeout( () => { // defer to currently running code

            if (this.listcomponent && (this.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollToItem(index)
            }

            setTimeout(()=>{ // time for scroll to take place
                this.activeTargetProxy = activeTargetProxy
                this.forceUpdate(() => {
                    this.activeTargetProxy = null
                })
                // this.setState({ // trigger animation response
                //     activeTargetProxy,
                // },()=> {
                //     setTimeout(()=>{
                //         this.setState({ // cancel animation response
                //             activeTargetProxy:null
                //         })                        
                //     })
                // })
            },300)

        },300)
    }

    _findlinkIndex = (instanceid) => {

        return (itemDocumentProxy) => {
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
            toast.info('The data shelf is in use. Close the shelf and try again.')
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
        // this.setState({
        //     datastack, // set workspace
        // })
    }

    getBox = ({index,style}) => {

        return this.Box({index,style})

    }

    Box = ({index, style = null}) => {

        let datastack = this.datastack

        let { stackpointer } = this.state

        console.log('Box in quadrant, datastack, scrollboxelement',datastack, this.scrollboxelement)

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
        let { activeTargetProxy } = this
        if (activeTargetProxy) {
            matchForTarget = (activeTargetProxy.index == index)
        }
        console.log('getBoxComponent itemProxy, activeTargetProxy',itemProxy, activeTargetProxy)

        let boxcallbacks = {
            // data fulfillment
            setDocpackPairListener:this.setDocpackPairListener,
            removeDocpackPairListener:this.removeDocpackPairListener,

            // animations and operations
            highlightBox:this.animations.highlightBox,
            splayBox:(domSource, listcomponent,listdoctoken) => {
                this.operations.splayBox(index, domSource, listcomponent,listdoctoken)},
            selectFromSplay:(domSource) => {
                this.operations.selectFromSplay(index,domSource)},
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

        let { color, classes } = this.props

        let datastack = this.datastack

        let haspeers = datastack?(datastack[this.state.stackpointer].items.length > 1):false
        let isempty = datastack?!(datastack[this.state.stackpointer].items.length):true

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
        // console.log('rendering quadrant.controller')
        // useStaticSize Lister attribute below is required to avoid setState 
        // recursion overload and crash
        return ( 
        <div
            className = {classes.quadcontent}
            style = {quadcontentStyle}
            ref = {this.quadcontentelement}
        >
            <div ref = {this.drillanimationblock} ></div>
            <div ref = {this.originanimationblock} ></div>
            <div ref = {this.maskanimationblock} ></div>

                <UserDataContext.Consumer>
                { userdata => {

                    return <QuadContextBar
                        userdata = {userdata} 
                        quadidentifier={this.props.quadidentifier}
                        datastack = {datastack}
                        stackpointer = {this.state.stackpointer}
                        callbacks = {this.props.callbacks}
                        callDataDrawer = {this.callDataDrawer}
                    />
                }}
                </UserDataContext.Consumer>
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
                <UserDataContext.Consumer>
                { userdata => {
                    return (userdata?
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
                    )
                }}
                </UserDataContext.Consumer>
                </div>
            }
            </div>

        </div>)
    }
}

export default withStyles(styles)(Quadrant)