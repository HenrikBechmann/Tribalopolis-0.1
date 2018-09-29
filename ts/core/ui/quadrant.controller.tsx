// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: keep scrollbox pos in settings when navigating stack levels
*/
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

import QuadOrigin from './quadrant/quadorigin.view'
import QuadTitleBar from './quadrant/quadtitlebar.view'

import proxy from '../../core/utilities/proxy'
import DataBox from './databox.controller'
import Lister from 'react-list'

import animations from './quadrant/quadanimations.utilities'

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
        top:'calc(25px + 2%)',
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
        border: '1px solid gray',
        boxSizing: 'border-box',
        borderRadius: '8px',
        position:'relative',
    }
})

class Quadrant extends React.Component<any,any>  {

/********************************************************
----------------------[ initialize ]---------------------
*********************************************************/

    constructor(props) {
        super(props)

        this.quadcontentelement = React.createRef()

        // animation dom elements
        this.drillanimationblock = React.createRef()
        this.originanimationblock = React.createRef()
        this.maskanimationblock = React.createRef()

        // structure dom elements
        this.originelement = React.createRef()
        this.scrollboxelement = React.createRef()
        this.listcomponent = React.createRef()

        // callbacks
        this.setItemListener = this.props.callbacks.setItemListener
        this.setListListener = this.props.callbacks.setListListener
        this.removeItemListener = this.props.callbacks.removeItemListener
        this.removeListListener = this.props.callbacks.removeListListener

        window.addEventListener('resize',this.onResize)

    }

    state = {
        datastack:null,
        stackpointer:0,
        collapseTargetProxy:null,
        boxwidth:300
    }

    // dom refs
    quadcontentelement
    drillanimationblock
    originanimationblock
    maskanimationblock
    originelement
    scrollboxelement
    listcomponent

    // callbacks get records
    setItemListener
    setListListener
    removeItemListener
    removeListListener

    // trigger for animation and reset
    collapseTargetProxy = null

/********************************************************
------------------[ lifecycle methods ]------------------
*********************************************************/

    componentDidMount() {

        // setting of datastack delayed because
        // scrollbox height must be available to set height of content items
        this.setState({
            datastack: this.props.datastack,
        })

    }

    componentDidUpdate() {

        // animation and visibilit based on return from descendant stack level
        if (!this.collapseTargetProxy) return

        // keep; value will be purged
        let collapseTargetProxy = this.collapseTargetProxy
        this.collapseTargetProxy = null
        // get index for Lister
        let index = this.state.datastack
            [this.state.stackpointer].items
            .findIndex
                (this._findlinkIndex
                    (collapseTargetProxy.sourceinstanceid))

        // update scroll display with selected highlight item
        collapseTargetProxy.index = index

        setTimeout( () => { // defer to currently running code

            if (this.listcomponent && (this.state.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollAround(index)
            }

            setTimeout(()=>{ // time for scroll to take place
                this.setState({ // trigger animation response
                    collapseTargetProxy,
                },()=> {
                    setTimeout(()=>{
                        this.setState({ // cancel animation response
                            collapseTargetProxy:null
                        })                        
                    })
                })
            },300)

        })
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
----------------------[ animation ]---------------------
*********************************************************/

    // animation calls

    animateToOrigin = () => {
        animations.animateToOrigin({
            sourceElement:this.scrollboxelement.current, 
            originElement:this.originelement.current,  
            containerElement:this.quadcontentelement.current, 
            originAnimationElement:this.originanimationblock.current,
            maskAnimationElement:this.maskanimationblock.current,
        })        
    }

    animateToDataBox = (domSource) => {
        animations.animateToDatabox({
            sourceElement:domSource,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
            boxwidth:this.state.boxwidth,
        })        
    }

    animateToDataBoxList = (domSource) => {
        animations.animateToDataboxList({
            sourceElement:domSource,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,  
        })        
    }

    animateOriginToDatabox = () => {
        animations.animateMask({
            sourceElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            maskAnimationElement:this.maskanimationblock.current,
        })
        animations.animateOriginToDataBox({
            sourceElement:this.originelement.current,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
            boxwidth:this.state.boxwidth,
        })        
    }

    animateOriginToDataBoxList = () => {
        animations.animateMask({
            sourceElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            maskAnimationElement:this.maskanimationblock.current,
        })
        animations.animateOriginToDataBoxList({
            sourceElement:this.originelement.current,
            targetElement:this.scrollboxelement.current,
            containerElement:this.quadcontentelement.current,
            drillAnimationElement:this.drillanimationblock.current,
        })
    }


/********************************************************
----------------------[ operations ]---------------------
*********************************************************/

    //-------------------------------[ forward ]---------------------------
    expandDirectoryItem = (boxptr, listtoken, domSource) => {

        this.animateToOrigin()

        this.animateToDataBox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:itemProxy.instanceid,
            token:itemProxy.token,
            action:'expand',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newItemProxy = new proxy({token:itemProxy.token})

        newItemProxy.liststack.push(listtoken)

        newstacklayer.items.push(newItemProxy)

        setTimeout(() => { // delay for animation
            this.setState({
                stackpointer,
                datastack,
            })
        },100)
    }

    splayBox = (boxptr, domSource, sourcelistcomponent,listDocument) => {

        let visiblerange = sourcelistcomponent.current.getVisibleRange()

        this.animateToOrigin()

        this.animateToDataBoxList(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]
        let itemToken = itemProxy.token

        let listtokens = listDocument.data.lists

        if (!listtokens || !listtokens.length) return

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:itemProxy.instanceid,
            token:itemProxy.token,
            action:'splay',
            visiblerange,
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        for (let token of listtokens) {
            let newItemProxy = new proxy({token:itemToken})
            newItemProxy.liststack = itemProxy.liststack.slice() // copy
            newItemProxy.liststack.push(token)
            newstacklayer.items.push(newItemProxy)
        }

        setTimeout(() => { // delay for animation
            this.setState({
                stackpointer,
                datastack,
            },() => {
                setTimeout(() =>{
                    this.listcomponent.current.scrollTo(visiblerange[0])
                })
            })
        },100)
    }

    selectFromSplay = (boxptr:number,domSource) => {

        this.animateToOrigin()

        this.animateToDataBox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]
        let itemToken = itemProxy.token

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:itemProxy.instanceid,
            token:itemProxy.token,
            action:'select',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newItemProxy = new proxy({token:itemToken})
        newItemProxy.liststack = itemProxy.liststack.slice() // copy
        
        newstacklayer.items.push(newItemProxy)

        setTimeout(() => { // delay for animation
            this.setState({
                stackpointer,
                datastack,
            })
        },100)
    }

    incrementStackSelector = () => {
        let { stackpointer, datastack } = this.state
        this._captureSettings(stackpointer,datastack)
        let depth = this.state.datastack.length
        if (stackpointer < (depth - 1)) {
            stackpointer++
            this.setState({
                stackpointer,
                datastack,
            },() => {
                this._applySettings(stackpointer,datastack)
            })
        }
    }

    //-------------------------------[ backward ]----------------------------

    collapseDirectoryItem = (itemProxy) => {

        if (this.state.stackpointer) {
            let targetStackLayer = this.state.datastack[this.state.stackpointer - 1]
            if (targetStackLayer.items.length > 1) {
                this.animateOriginToDataBoxList()
            } else {
                this.animateOriginToDatabox()
            }
            // console.log('collapseDirectoryItem',itemProxy,this.state.datastack)
        }

        setTimeout(()=>{
            this.collapseTargetProxy = Object.assign({},itemProxy)

            this.decrementStackSelector()
        },100)

    }

    decrementStackSelector = () => {
        let { stackpointer, datastack } = this.state
        this._captureSettings(stackpointer,datastack)
        this._updateCollapseSettings(stackpointer,datastack)
        if (stackpointer > 0) {
            stackpointer--
            this.setState({
                stackpointer,
                datastack,
            },() => {
                this._applySettings(stackpointer,datastack)
            })
        }
    }

    _updateCollapseSettings = (stackpointer, datastack) => {

        if (this.collapseTargetProxy) {
            let sourcelayer = datastack[this.state.stackpointer]
            if (sourcelayer) {
                let stacksource = sourcelayer.source
                if (stacksource) {
                    this.collapseTargetProxy.action = stacksource.action
                    this.collapseTargetProxy.sourceinstanceid = stacksource.instanceid
                }
            }
            if (stackpointer > 0) {
                datastack[stackpointer - 1].settings.scrollOffset = null
            }
        }
    }

    _captureSettings = (stackpointer, datastack) => {
        let stacklayer = datastack[stackpointer]
        let { items } = stacklayer
        stacklayer.settings.scrollOffset = 
            (items.length > 1)?this.scrollboxelement.current.scrollLeft:0
    }

    _applySettings = (stackpointer, datastack) => {
        let stacklayer = datastack[stackpointer]
        let { items } = stacklayer

        if ((items.length > 1) && (!this.collapseTargetProxy)) {
            if (stacklayer.settings.scrollOffset !== null) {
                setTimeout(() => { // give deference to formation of scroll object

                    this.scrollboxelement.current.scrollLeft = stacklayer.settings.scrollOffset

                })
            }
        }
    }

/********************************************************
-------------------[ assembly support ]------------------
*********************************************************/

    // Lister item renderer
    getBox = (index, key) => {

        let { datastack, stackpointer } = this.state

        if (!datastack) return null

        if (!this.scrollboxelement.current) return null

        let itemProxy = datastack[stackpointer].items[index]

        if (!itemProxy) return null

        let stacklayer = datastack[stackpointer]
        let haspeers = (stacklayer && (stacklayer.items.length > 1))

        return this.getBoxComponent(itemProxy, index, haspeers, key)
    }

    getBoxComponent = (itemProxy, index, haspeers, key) => {

        // console.log('instanceid, index, key, path',itemProxy.instanceid,index,key, itemProxy.path)

        let containerHeight = this.scrollboxelement.current.offsetHeight

        let matchForTarget = false
        let { collapseTargetProxy } = this.state
        if (collapseTargetProxy) {
            matchForTarget = (collapseTargetProxy.index == index)
        }
        let boxcallbacks = {
            // data fulfillment
            setListListener:this.setListListener,
            setItemListener:this.setItemListener,
            removeItemListener:this.removeItemListener,
            removeListListener:this.removeListListener,

            // animations and operations
            highlightBox:animations.highlightBox,
            splayBox:(domSource, listcomponent,listdoctoken) => {
                this.splayBox(index, domSource, listcomponent,listdoctoken)},
            selectFromSplay:(domSource) => {
                this.selectFromSplay(index,domSource)},
            expandDirectoryItem:(token, domSource) => {
                this.expandDirectoryItem(index,token, domSource)},
            collapseDirectoryItem:this.collapseDirectoryItem,
            setBoxWidth:this.setBoxWidth,
        }
        return (
            <DataBox 
                key = { itemProxy.instanceid } 

                itemProxy = { itemProxy }
                collapseTargetProxy = {matchForTarget?collapseTargetProxy:null}
                haspeers = { haspeers }
                index = { index }
                containerHeight = { containerHeight }
                boxwidth = { this.state.boxwidth }

                callbacks = { boxcallbacks }
            />
        )
    }

    setBoxWidth = (width) => {

        this.setState({
            boxwidth:width,
        })
    }

/********************************************************
------------------------[ render ]-----------------------
*********************************************************/

    render() {
        
        let { color, classes } = this.props

        let { datastack } = this.state

        let haspeers = datastack?(this.state.datastack[this.state.stackpointer].items.length > 1):false

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

                <QuadTitleBar 
                    title = {'Account:'} 
                    quadidentifier={this.props.quadidentifier}
                />
                <QuadOrigin 
                    stackpointer = {this.state.stackpointer} 
                    stackdepth = {datastack?datastack.length:0}
                    incrementStackSelector = {this.incrementStackSelector}
                    decrementStackSelector = {this.decrementStackSelector}
                    ref = {this.originelement}
                />
                <div className = {classes.viewportFrame}>
                    <div 
                        className = {classes.viewport}
                        style = {viewportStyle}
                        ref = {this.scrollboxelement}
                    >
                        {haspeers
                            ?<Lister 
                                axis = 'x'
                                itemRenderer = {this.getBox}
                                length = { 
                                    datastack?datastack[this.state.stackpointer].items.length:0
                                }
                                type = 'uniform'
                                ref = {this.listcomponent}
                                useStaticSize
                             />
                            :this.getBox(0,'singleton')
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Quadrant)