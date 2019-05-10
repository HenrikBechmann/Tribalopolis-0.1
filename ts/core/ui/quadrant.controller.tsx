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
import application from '../services/application'
import { 
    GetDocumentMessage, 
    SetListenerMessage, 
    ReturnDocPairMessage,
    ReturnDocPackMessage, 
} from '../services/interfaces'

import docProxy from '../utilities/docproxy'

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
        accountreference:null,
        generation:0,
    }

    datastack = null
    activeTargetProxy = null

    activeaccountreference
    controldata = {
        systemdata:null,
        userdata:null,
        activememberdata:null,
        activeaccountdata:null,
    }

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

        // if (!this.controlStatus() && this.props.userdata && this.props.systemdata) {

        this._updateControlData()
        // return

        // } 

        // let layer = this.datastack[this.state.stackpointer]

        // if ((layer.account != this.state.accountreference)  && this.props.userdata && this.props.systemdata) {

        //     this._updateControlData()
        //     return

        // }

        // if (this.cycleForReferences) {
        //     this.setState((state)=>{
        //         return {generation:++state.generation}
        //     })
        // }

    }

    componentDidUpdate() {

        // let controlstatus = this.controlStatus()

        // if (controlstatus !== 'full') {

        this._updateControlData()

        // } else {

        //     let layer = this.datastack[this.state.stackpointer]

        //     if ((layer.account != this.state.accountreference)  && this.props.userdata && this.props.systemdata) {

        //         this._updateControlData()
        //         return

        //     }

        // }

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

                this.setState((state)=>{
                    return {generation:++state.generation}
                },() => {
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

        if (this.contextMemberProxy) {
            let {doctoken,instanceid} = this.contextMemberProxy
            application.removeDocpackPairListener({doctoken, instanceid})
            this.contextMemberProxy = null
        }

        if (this.contextAccountProxy) {
            let {doctoken, instanceid} = this.contextAccountProxy
            application.removeDocpackPairListener({doctoken,instanceid})
            this.contextAccountProxy = null
        }

        window.removeEventListener('resize',this.onResize)

    }

    // for reset of containerHeight
    onResize = () => {
        this.forceUpdate()
    }

/********************************************************
-----------------[ controldata assembly ]----------------
*********************************************************/

    _updateControlData = () => {

        let accountreference = this.datastack?this.datastack[this.state.stackpointer].account:null

        // console.log('in _updateControlData:accountreference, state.accountreference, props', 
        //     accountreference, 
        //     this.state.accountreference, 
        //     this.props
        // )

        this.controldata.systemdata = this.props.systemdata
        this.controldata.userdata = this.props.userdata

        if (accountreference == this.state.accountreference) return

        this.controldata.activeaccountdata = null
        this.controldata.activememberdata = null

        if (accountreference) {

            this.fetchContextAccount(accountreference)

        }

        this.setState(() => ({
            accountreference,
        }))

    }

    contextAccountProxy = null

    fetchContextAccount = (accountreference) => {

        if (this.contextAccountProxy) {
            let {doctoken, instanceid} = this.contextAccountProxy
            application.removeDocpackPairListener({doctoken,instanceid})
            this.contextAccountProxy = null
        }

        this.controldata.activeaccountdata = null
        this.controldata.activememberdata = null

        let proxy = this.contextAccountProxy = new docProxy({doctoken:{reference:accountreference}})
        let parms:SetListenerMessage = {
            doctoken:proxy.doctoken,
            instanceid:proxy.instanceid,
            success:this.contextAccountSuccess,
            failure:this.contextAccountFailure,
        }
        // console.log('setting contextAccountListener',parms)
        application.setDocpackPairListener(parms)

    }

    contextAccountSuccess = ({docpack,typepack,reason}) => {

        // console.log('successful context account fetch',docpack, typepack)

        let update = (
            this.controldata.activeaccountdata && 
            (this.controldata.activeaccountdata.docpack.reference == docpack.reference))

        this.controldata.activeaccountdata = {
            docpack,
            typepack,
        }

        if (!update) {
            this.fetchMemberRecord()
        }

    }

    contextAccountFailure = (error) => {

        toast.error('could not get context account record',error)

    }

    fetchMemberRecord = () => {

        let parms:GetDocumentMessage = {
            reference:'members',
            whereclauses:[
                ['properties.useraccount','==',this.controldata.userdata.accountpack.reference],
                ['properties.account','==',this.controldata.activeaccountdata.docpack.reference],
            ],
            success:this.fetchMemberSuccess, 
            failure:this.fetchMemberFailure,
        }

        // console.log('fetchMemberRecord:controldata',this.controldata, parms)

        application.queryForDocument(parms)

    }

    contextMemberProxy

    fetchMemberSuccess = ({docpack, reason}) => {

        // console.log('fetchMemberSuccess:docpack',docpack)

        let update = (
            this.controldata.activememberdata && 
            (this.controldata.activememberdata.docpack.reference == docpack.reference))

        if (this.contextMemberProxy) {
            let {doctoken,instanceid} = this.contextMemberProxy
            application.removeDocpackPairListener({doctoken, instanceid})
            this.contextMemberProxy = null
        }

        if (update) return
            
        let proxy = this.contextMemberProxy = new docProxy({doctoken:{reference:docpack.reference}})
        let parms:SetListenerMessage = {
            doctoken:proxy.doctoken,
            instanceid:proxy.instanceid,
            success:this.contextMemberSuccess,
            failure:this.contextMemberFailure,
        }
        application.setDocpackPairListener(parms)

    }

    fetchMemberFailure = (error) => {

        toast.warn('could not get context account member: ' + error)

    }

    contextMemberSuccess = ({docpack,typepack,reason}) => {


        this.controldata.activememberdata = {
            docpack,
            typepack,
        }        

        // console.log('contextMemberSuccess', this.controldata, )

        this.setState((state) => {
            return {
                generation:++state.generation
            }
        })

    }

    contextMemberFailure = (error) => {

        toast.error('could not get context account member: ' + error)

    }

    controlStatus = () => {

        let controlstatus:boolean | string = false

        // console.log('controlStatus controldata, props', this.controldata, this.props)
        if (this.controldata.systemdata && this.controldata.userdata) {
            controlstatus = 'base'
        }
        if ((controlstatus == 'base') && this.controldata.activememberdata && this.controldata.activeaccountdata) {
            controlstatus = 'full'
        }
        return controlstatus
    }

    userChangeStatus = () => {



    }

/********************************************************
-------------------[ databox assembly ]------------------
*********************************************************/

    setBoxWidth = (width) => {

        this.setState(() => ({
            boxwidth:width,
        }))
    }

    closeDrawer = () => {
        this.drawerdatapackage = null
        this.setState(() => ({
            draweropen:false,
        }))
    }

    callDataDrawer = ({docproxy,options}:DataPaneContext) => {
        if (this.state.draweropen) {
            this.setState(() => ({
                draweropen:false
            }),() => {
                this.drawerdatapackage = {docproxy,options, callbacks:{}}
                this.setState(() => ({
                    draweropen:true
                }))
            })
            // toast.info('The data shelf is in use. Close the shelf and try again.')
            return
        }
        this.drawerdatapackage = {docproxy, options, callbacks:{}}
        this.setState(() => ({
            draweropen:true,
        }))
    }

    setDefault = () => {

        let datastack = this.datastack
        datastack[this.state.stackpointer].items = datastack[this.state.stackpointer].defaultitems

        this.setState((state)=>{
            return {generation:++state.generation}
        })

        // this.forceUpdate()

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
        // console.log('datastack in quadrant.controller render',datastack)
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

        let controlstatus = this.controlStatus()
        // console.log('controlstatus', controlstatus, this.controldata)

        let quadmessage
        switch (controlstatus) {
            case false: {
                quadmessage = "Must be signed in to use this utility"
                break;
            }
            case 'base': {
                quadmessage = "Assembling permissions"
                break;
            }
            default: {
                quadmessage = ''
            }
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
                        {(controlstatus == 'full')?
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
                            :<div className = {classes.startscreen}>{quadmessage}</div>
                        }
                    </div>
                }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Quadrant)
