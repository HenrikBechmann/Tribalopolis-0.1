// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: keep scrollbox pos in settings when navigating stack levels
*/
'use strict'

import React from 'react'

import QuadOrigin from './quadrant/quadorigin.view'
import QuadTitleBar from './quadrant/quadtitlebar.view'

import DataBox from './databox.controller'
import {serializer} from '../../core/utilities/serializer'
import Lister from 'react-list'

import animations from './quadrant/quadanimations.utilities'

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

        this.getItem = this.props.callbacks.getItem
        this.getList = this.props.callbacks.getList
        this.getType = this.props.callbacks.getType

        window.addEventListener('resize',this.onResize)

    }

    state = {
        datastack:null,
        stackpointer:0,
        collapseTargetData:null,
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

    // get records
    getItem
    getList
    getType

    // trigger for animation and reset
    collapseTargetData = null

    boxdatacache = {}

/********************************************************
------------------[ lifecycle methods ]------------------
*********************************************************/

    componentWillUnmount() {

        window.removeEventListener('resize',this.onResize)

    }

    componentDidMount() {

        // setting of datastack delayed because
        // scrollbox height must be available to set height of content items
        this.setState({
            datastack: this.props.datastack,
        })

    }

    componentDidUpdate() {

        if (!this.collapseTargetData) return

        // keep; value will be purged
        let collapseTargetData = this.collapseTargetData
        this.collapseTargetData = null
        // get index for Lister
        let index = this.state.datastack[this.state.stackpointer].items.findIndex(this._findlinkIndex(collapseTargetData.sourceinstanceid))

        // update scroll display with selected highlight item
        collapseTargetData.index = index

        setTimeout(()=>{

            if (this.listcomponent && (this.state.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollAround(index)
            }

            setTimeout(()=>{
                this.setState({
                    collapseTargetData,
                },()=> {
                    setTimeout(()=>{
                        this.setState({
                            collapseTargetData:null
                        })                        
                    })
                })
            },300)

        })
    }

    _findlinkIndex = (instanceid) => {

        return (item) => {
            return item.instanceid == instanceid
        }

    }

    // for reset of containerHeight
    onResize = () => {
        this.forceUpdate()
    }

/********************************************************
----------------------[ operations ]---------------------
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

    //-------------------------------[ forward ]---------------------------
    expandDirectoryItem = (boxptr, datatoken, domSource) => {

        this.animateToOrigin()

        this.animateToDataBox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let boxProxy = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:boxProxy.instanceid,
            datatoken:boxProxy.datatoken,
            action:'expand',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newBoxProxy = JSON.parse(JSON.stringify(boxProxy))
        newBoxProxy.instanceid = serializer.getid()

        newBoxProxy.liststack.push(datatoken)

        newstacklayer.items.push(newBoxProxy)

        setTimeout(() => { // delay for animation
            this.setState({
                stackpointer,
                datastack,
            })
        })
    }

    splayBox = (boxptr, domSource, sourcelistcomponent) => {

        let visiblerange = sourcelistcomponent.current.getVisibleRange()

        this.animateToOrigin()

        this.animateToDataBoxList(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let boxProxy = datastack[stackpointer].items[boxptr]

        // TODO item should be available in memory -- it is visible
        let item = this.boxdatacache[boxptr].item

        let liststack = boxProxy.liststack

        let listtoken

        if (liststack.length) {
            listtoken = liststack[liststack.length-1]
        } else {
            listtoken = item.list
        }

        // TODO list item should be in memory -- it is visible
        let listitem = this.boxdatacache[boxptr].list.list

        let listitems = listitem.list

        if (!listitems || !listitems.length) return

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:boxProxy.instanceid,
            datatoken:boxProxy.datatoken,
            action:'splay',
            visiblerange,
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let template = JSON.stringify(boxProxy)

        for (let token of listitems) {
            let newBoxProxy = JSON.parse(template)
            newBoxProxy.instanceid = serializer.getid()
            newBoxProxy.liststack.push(token)
            newstacklayer.items.push(newBoxProxy)
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
        },250)
    }

    selectFromSplay = (boxptr:number,domSource) => {

        this.animateToOrigin()

        this.animateToDataBox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let boxProxy = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:boxProxy.instanceid,
            datatoken:boxProxy.datatoken,
            action:'select',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newBoxProxy = JSON.parse(JSON.stringify(boxProxy))
        newBoxProxy.instanceid = serializer.getid()
        
        newstacklayer.items.push(newBoxProxy)

        setTimeout(() => { // delay for animation
            this.setState({
                stackpointer,
                datastack,
            })
        })
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

    collapseDirectoryItem = (boxProxy) => {

        this.collapseTargetData = Object.assign({},boxProxy)

        this.decrementStackSelector()

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

        let stacksource = null
        if (this.collapseTargetData) {
            let sourcelayer = datastack[this.state.stackpointer]
            if (sourcelayer) {
                stacksource = sourcelayer.source
                if (stacksource) {
                    this.collapseTargetData.action = stacksource.action
                    this.collapseTargetData.sourceinstanceid = stacksource.instanceid
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

        if ((items.length > 1) && (!this.collapseTargetData)) {
            if (stacklayer.settings.scrollOffset !== null) {
                setTimeout(() => { // give deference to formation of scroll object

                    this.scrollboxelement.current.scrollLeft = stacklayer.settings.scrollOffset

                })
            }
        }
    }

/********************************************************
----------------------[ cache data ]---------------------
*********************************************************/

    cacheBoxData = (instanceid,item,type) => {
        this.boxdatacache[instanceid] = {
            item,
            type,
        }
        console.log('create boxdatacache',this.boxdatacache)
    }

    cacheListData = (instanceid, list, type) => {
        this.boxdatacache[instanceid].list = {
            list,
            type,
        }
        console.log('save listdatacache',this.boxdatacache)
    }

   unmountBoxdatacache = (instanceid) => {
        delete this.boxdatacache[instanceid]
        console.log('unmount boxdatacache',this.boxdatacache)
    }

/********************************************************
-------------------[ assembly support ]------------------
*********************************************************/

    // Lister item renderer
    getBox = (index, key) => {

        let { datastack, stackpointer } = this.state

        if (!datastack) return null

        if (!this.scrollboxelement.current) return null

        let boxProxy = datastack[stackpointer].items[index]

        let stacklayer = datastack[stackpointer]
        let haspeers = (stacklayer && (stacklayer.items.length > 1))

        return this.getBoxComponent(boxProxy, index, haspeers, key)
    }

    getBoxComponent = (boxProxy, index, haspeers, key) => {

        let item = this.getItem(boxProxy.datatoken)
        let itemType = this.getType(item.type)

        this.cacheBoxData(boxProxy.instanceid,item,itemType)

        let containerHeight = this.scrollboxelement.current.offsetHeight

        let matchForTarget = false
        let { collapseTargetData } = this.state
        if (collapseTargetData) {
            matchForTarget = (collapseTargetData.index == index)
        }
        // TODO replace getList and getType with promise resolvers
        return (
            <DataBox 
                key = { boxProxy.instanceid } 
                item = { item } 
                itemType = { itemType }
                collapseTargetData = {matchForTarget?collapseTargetData:null}
                getList = { this.getList }
                getType = { this.getType }
                boxProxy = { boxProxy }
                highlightBox = {animations.highlightBox}
                haspeers = { haspeers }
                index = {index}
                containerHeight = {containerHeight}
                boxwidth = {haspeers?300:this.state.boxwidth}

                splayBox = {
                    (domSource, listcomponent) => {
                        this.splayBox(index, domSource, listcomponent)
                    }
                }
                selectFromSplay = {
                    (domSource) => {
                        this.selectFromSplay(index,domSource)
                    }
                }
                expandDirectoryItem = {
                    (datatoken, domSource) => {
                        this.expandDirectoryItem(index,datatoken, domSource)
                    }
                }
                collapseDirectoryItem = {
                    this.collapseDirectoryItem
                }
                unmount = {
                    () => {
                        this.unmountBoxdatacache(boxProxy.instanceid)
                    }
                }
                cacheListData = {
                    (list,type) => {
                        this.cacheListData(boxProxy.instanceid,list,type)
                    }
                }
            />
        )
    }

/********************************************************
------------------------[ render ]-----------------------
*********************************************************/

    // TODO: move style blocks out of render code
    render() {
        
        let { color } = this.props

        let { datastack } = this.state

        let haspeers = datastack?(this.state.datastack[this.state.stackpointer].items.length > 1):false

        // Safari keeps scrollleft with content changes
        if (!haspeers && this.scrollboxelement.current && (this.scrollboxelement.current.scrollLeft != 0)) {
            this.scrollboxelement.current.scrollLeft = 0
        }

        let quadcontentstyle:React.CSSProperties = {
            boxSizing: 'border-box',
            border: '3px outset gray',
            position:'relative',
            backgroundColor:color,
            borderRadius:'8px',
            width:'100%',
            height:'100%',
            overflow:'hidden',
        }

        let viewportFrameStyle:React.CSSProperties = {
            position:'absolute',
            top:'calc(25px + 2%)',
            left:'2%',
            bottom:'2%',
            right:'2%',
            borderRadius:'8px',
            overflow:'hidden',
        }

        let viewportStyle:React.CSSProperties = { // borderRadius on scroller breaks scrollbar
            width: '100%',
            height:'100%',
            overflow:'auto',
            backgroundColor:haspeers?'#e8e8e8':'lightblue',
            border: '1px solid gray',
            boxSizing: 'border-box',
            borderRadius: '8px',
            position:'relative',
        }

        return (
            <div style = {quadcontentstyle} 
                ref = {this.quadcontentelement}
            >
                <div
                    ref = {this.drillanimationblock}
                >
                </div>
                <div
                    ref = {this.originanimationblock}
                >
                </div>
                <div
                    ref = {this.maskanimationblock}
                >
                </div>
                <QuadTitleBar 
                    title = {'path'} 
                    quadidentifier={this.props.quadidentifier}
                />
                <QuadOrigin 
                    stackpointer = {this.state.stackpointer} 
                    stackdepth = {datastack?datastack.length:0}
                    incrementStackSelector = {this.incrementStackSelector}
                    decrementStackSelector = {this.decrementStackSelector}
                    ref = {this.originelement}
                />
                <div style = {viewportFrameStyle}>
                    <div 
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
                            />
                            :this.getBox(0,'singleton')
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Quadrant