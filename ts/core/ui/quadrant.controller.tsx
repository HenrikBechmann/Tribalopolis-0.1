// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: keep scrollbox pos in settings when navigating stack levels
*/
'use strict'

import * as React from 'react'

import QuadOrigin from './views/quadspace/quadorigin.view'
import QuadTitleBar from './views/quadspace/quadtitlebar.view'
import QuadStatusBar from './views/quadspace/quadstatusbar.view'
import InfiniteScroll from './views/common/infinitescroll.view'
import SwapMenu from './views/quadspace/quadswapmenu.view'
import DataBox from './databox.controller'
import QuadSelector from './views/quadspace/quadselector.view'
import { METATYPES } from '../constants'
import {serializer} from '../../core/utilities/serializer'
import Lister from 'react-list'

class Quadrant extends React.Component<any,any>  {

/********************************************************
----------------------[ initialize ]---------------------
*********************************************************/

    constructor(props) {
        super(props)

        // animation dom elements
        this.drillanimationblock = React.createRef()
        this.originanimationblock = React.createRef()
        this.maskanimationblock = React.createRef()

        // structure dom elements
        this.quadelement = React.createRef()
        this.originelement = React.createRef()
        this.scrollboxelement = React.createRef()
        this.listcomponent = React.createRef()

    }

    state = {
        quadrant:this.props.quadrant,
        startquadrant:this.props.quadrant,
        datastack:null,
        stackpointer:0,
        collapseBoxConfigForTarget:null
    }

    // dom refs
    drillanimationblock
    originanimationblock
    maskanimationblock
    originelement
    scrollboxelement
    listcomponent
    quadelement

    // get records
    getDataItem
    getListItem
    getTypeItem

    // quad css position
    position = null

    // trigger for animation and reset
    collapseBoxConfigForTarget = null

/********************************************************
------------------[ lifecycle methods ]------------------
*********************************************************/

    componentWillMount() {
        this.calculatePosition(this.state.quadrant)
        this.getDataItem = this.props.getDataItem
        this.getListItem = this.props.getListItem
        this.getTypeItem = this.props.getTypeItem

        window.addEventListener('resize',this.onResize)

    }

    // for reset of containerHeight
    onResize = () => {
        this.forceUpdate()
    }

    componentWillUnmount() {

        window.removeEventListener('resize',this.onResize)

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.quadrant != this.state.quadrant) {

            let self = this
            this.calculateTransitionPosition(this.state.quadrant)

            this.forceUpdate(() => {
                setTimeout(()=>{// give time for styles to apply
                    self.calculateTransitionPosition(nextProps.quadrant)
                    self.setState({
                        quadrant:nextProps.quadrant
                    },

                        () => {
                            setTimeout(() => { // give time for animation
                                self.calculatePosition(this.state.quadrant)
                                self.forceUpdate()
                            },600)
                        }

                    )
                })
            })
        }
    }

    componentDidMount() {

        // setting of datastack delayed because
        // scrollbox height must be available to set height of content items
        this.setState({
            datastack: this.props.datastack,
        })

    }

    componentDidUpdate() {

        if (!this.collapseBoxConfigForTarget) return

        // keep; value will be purged
        let collapseBoxConfigForTarget = this.collapseBoxConfigForTarget
        this.collapseBoxConfigForTarget = null
        // get index for Lister
        let index = this.state.datastack[this.state.stackpointer].items.findIndex(this._findlinkIndex(collapseBoxConfigForTarget.sourceinstanceid))

        // update scroll display with selected highlight item
        collapseBoxConfigForTarget.index = index

        setTimeout(()=>{

            if (this.listcomponent && (this.state.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollAround(index)
            }

            setTimeout(()=>{
                this.setState({
                    collapseBoxConfigForTarget,
                },()=> {
                    setTimeout(()=>{
                        this.setState({
                            collapseBoxConfigForTarget:null
                        })                        
                    })
                })
            })

        })
    }

    _findlinkIndex = (instanceid) => {

        return (item) => {
            return item.instanceid == instanceid
        }

    }

/********************************************************
------------------[ position quadrant ]------------------
*********************************************************/

    calculateTransitionPosition = (quadrant) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        let quadelement = this.quadelement.current
        switch (quadrant) {
            case "topleft": {
                top = 0
                left = 0
                break;
            }
            case "topright": {
                top = 0
                left = (quadelement.parentElement.offsetWidth/2) + 'px' 
                break;
            }
            case "bottomleft": {
                top = (quadelement.parentElement.offsetHeight/2) + 'px' 
                left = 0
                break;
            }
            case "bottomright": {
                top = (quadelement.parentElement.offsetHeight /2) + 'px' 
                left = (quadelement.parentElement.offsetWidth /2) + 'px' 
                break;
            }
        }
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

    calculatePosition = (quadrant) => {
        let top:any = 'auto'
        let left:any = 'auto'
        let bottom:any = 'auto'
        let right:any = 'auto'
        switch (quadrant) {
            case "topleft": {
                top = 0
                left = 0
                break;
            }
            case "topright": {
                top = 0
                right = 0
                break;
            }
            case "bottomleft": {
                bottom = 0
                left = 0
                break;
            }
            case "bottomright": {
                bottom = 0
                right = 0
                break;
            }
        }
        this.position = {
            top,
            left,
            bottom,
            right,
        }       
    }

/********************************************************
----------------------[ operations ]---------------------
*********************************************************/

    //-------------------------------[ forward ]----------------------------

    expandCategory = (boxptr, dataref, domSource) => {

        this.animateToOrigin()

        this.animateToDatabox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let boxconfig = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:boxconfig.instanceid,
            dataref:boxconfig.dataref,
            action:'expand',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newboxconfig = JSON.parse(JSON.stringify(boxconfig))
        newboxconfig.instanceid = serializer.getid()

        newboxconfig.liststack.push(dataref)

        newstacklayer.items.push(newboxconfig)

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

        this.animateToDataboxList(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let boxconfig = datastack[stackpointer].items[boxptr]

        let item = this.getDataItem(boxconfig.dataref)

        let liststack = boxconfig.liststack

        let listref

        if (liststack.length) {
            listref = liststack[liststack.length-1]
        } else {
            listref = item.listref            
        }

        let listitem = this.getListItem(listref)

        let linkitems = listitem.links

        if (!linkitems || !linkitems.length) return

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:boxconfig.instanceid,
            dataref:boxconfig.dataref,
            action:'splay',
            visiblerange,
        }}

        // console.log('new stack pointer',stackpointer)

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let template = JSON.stringify(boxconfig)

        for (let dataref of linkitems) {
            let newboxconfig = JSON.parse(template)
            newboxconfig.instanceid = serializer.getid()
            newboxconfig.liststack.push(dataref)
            newstacklayer.items.push(newboxconfig)
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

        // console.log('selectFromSplay boxptr,domSource',boxptr,domSource)

        this.animateToOrigin()

        this.animateToDatabox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let boxconfig = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:boxconfig.instanceid,
            dataref:boxconfig.dataref,
            action:'select',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newboxconfig = JSON.parse(JSON.stringify(boxconfig))
        newboxconfig.instanceid = serializer.getid()
        
        newstacklayer.items.push(newboxconfig)

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

    collapseCategory = (boxConfig) => {

        this.collapseBoxConfigForTarget = Object.assign({},boxConfig)
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
        if (this.collapseBoxConfigForTarget) {
            let sourcelayer = datastack[this.state.stackpointer]
            if (sourcelayer) {
                stacksource = sourcelayer.source
                if (stacksource) {
                    this.collapseBoxConfigForTarget.action = stacksource.action
                    this.collapseBoxConfigForTarget.sourceinstanceid = stacksource.instanceid
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

        if ((items.length > 1) && (!this.collapseBoxConfigForTarget)) {
            if (stacklayer.settings.scrollOffset !== null) {
                setTimeout(() => { // give deference to formation of scroll object

                    this.scrollboxelement.current.scrollLeft = stacklayer.settings.scrollOffset

                })
            }
        }

    }

/********************************************************
----------------------[ animations ]---------------------
*********************************************************/

    highlightBox = (boxdomref) => {

        let boxelement:HTMLElement = boxdomref.current

        boxelement.classList.add('outlinehighlight')
        setTimeout(() => {
            boxelement.classList.remove('outlinehighlight')
        },1100)

    }

    animateToOrigin = () => {

        let sourceelement = this.scrollboxelement.current
        let targetelement = this.originelement.current

        let sourcePack = this._getAnimationElementVars(sourceelement)
        let targetPack = this._getAnimationElementVars(targetelement)

        this._animateMaskDrill(sourcePack)
        this._animateOriginDrill( sourcePack, targetPack )

    }

    _animateMaskDrill = (sourceStyle) => {
        let maskanimationBlock:HTMLElement = this.maskanimationblock.current

        for (let property in sourceStyle) {
            maskanimationBlock.style.setProperty('--'+property,sourceStyle[property] + 'px')
        }

        maskanimationBlock.classList.add('maskdrill')

        setTimeout(() => {
            maskanimationBlock.classList.remove('maskdrill')
        },1250)

    }

    animateToDatabox = (domSource) => {

        let targetReference = this.scrollboxelement.current

        let { domSourcePack:drillSourcePack, domTargetPack:drillTargetPack } = 
            this._getAnimationSelectDrillVars( domSource.current, targetReference )

        this._animateBlockDrill( drillSourcePack, drillTargetPack )

    }

    animateToDataboxList = (domSource) => {

        let targetElement = this.scrollboxelement.current

        let {domSourcePack:drillSourcePack,domTargetPack:drillTargetPack} = 
            this._getAnimationDrillVars(domSource.current,targetElement)

        this._animateBlockDrill(drillSourcePack, drillTargetPack)

    }

    _getAnimationDrillVars = (domSource:HTMLElement,domTarget:HTMLElement) => {
        let varpack = {
            domSourcePack:null,
            domTargetPack:null,
        }

        varpack.domSourcePack = this._getAnimationElementVars(domSource)
        varpack.domTargetPack = this._getAnimationElementVars(domTarget)

        return varpack
    }

    _getAnimationSelectDrillVars = (domSource:HTMLElement,domReference:HTMLElement) => {
        let varpack = {
            domSourcePack:null,
            domTargetPack:null,
        }

        let targetPack = {
            top:domReference.offsetTop + (domReference.clientHeight * .1),
            left:(domReference.offsetWidth / 2) - 130,
            height:domReference.clientHeight - (domReference.clientHeight * .06),
            width:300,
        }

        varpack.domSourcePack = this._getAnimationElementVars(domSource)
        varpack.domTargetPack = targetPack

        return varpack
    }

    _getAnimationElementVars = (domelement:HTMLElement) => {

        let containerelement = this.quadelement.current
        let containerRect = containerelement.getBoundingClientRect()
        let elementRect = domelement.getBoundingClientRect()

        let topOffset = elementRect.top - containerRect.top
        let leftOffset = elementRect.left - containerRect.left
        let height = domelement.clientHeight
        let width = domelement.clientWidth

        return {
            top:topOffset,
            left:leftOffset,
            height,
            width,
        }
    }

    // selectforward
    _animateBlockDrill = (sourceStyle, targetStyle) => {

        // console.log('sourceStyle,targetStyle',sourceStyle,targetStyle)

        let drillanimationBlock:HTMLElement = this.drillanimationblock.current

        for (let property in sourceStyle) {
            drillanimationBlock.style.setProperty('--source'+property,sourceStyle[property] + 'px')
        }
        for (let property in targetStyle) {
            drillanimationBlock.style.setProperty('--target'+property,targetStyle[property] + 'px')
        }

        drillanimationBlock.classList.add('elementdrill')

        setTimeout(() => {
            drillanimationBlock.classList.remove('elementdrill')
        },1100)
}

    _animateOriginDrill = (sourceStyle, targetStyle) => {

        // console.log('sourceStyle,targetStyle',sourceStyle,targetStyle)

        let originanimationBlock:HTMLElement = this.originanimationblock.current

        for (let property in sourceStyle) {
            originanimationBlock.style.setProperty('--source'+property,sourceStyle[property] + 'px')
        }
        for (let property in targetStyle) {
            originanimationBlock.style.setProperty('--target'+property,targetStyle[property] + 'px')
        }

        originanimationBlock.classList.add('origindrill')

        setTimeout(() => {
            originanimationBlock.classList.remove('origindrill')
        },600)
    }

/********************************************************
-------------------[ assembly support ]------------------
*********************************************************/

    getListItemType = (metatype) => {
        return (dataref) => {
            return this.getTypeItem(metatype,dataref)
        }
    }

    // Lister item renderer
    getBox = (index, key) => {

        let { datastack, stackpointer } = this.state

        if (!datastack) return null

        if (!this.scrollboxelement.current) return null

        let boxconfig = datastack[stackpointer].items[index]

        let stacklayer = datastack[stackpointer]
        let haspeers = (stacklayer && (stacklayer.items.length > 1))

        return this.getBoxComponent(boxconfig, index, haspeers, key)
    }

    getBoxComponent = (boxconfig, index, haspeers, key) => {

        // console.log('getBoxComponent', boxconfig, index, haspeers, key)

        let item = this.getDataItem(boxconfig.dataref)
        let itemType = this.getTypeItem(METATYPES.item,item.type)

        let containerHeight = this.scrollboxelement.current.offsetHeight

        let matchForTarget = false
        let { collapseBoxConfigForTarget } = this.state
        if (collapseBoxConfigForTarget) {
            matchForTarget = (collapseBoxConfigForTarget.index == index)
        }

        // console.log('match',matchForTarget,collapseBoxConfigForTarget,index)

        return (
            <DataBox 
                key = { boxconfig.instanceid } 
                item = { item } 
                itemType = { itemType }
                collapseBoxConfigForTarget = {matchForTarget?collapseBoxConfigForTarget:null}
                getListItem = { this.getListItem }
                getListItemType = { this.getListItemType(METATYPES.list) }
                boxConfig = { boxconfig }
                highlightBox = {this.highlightBox}
                haspeers = { haspeers }
                index = {index}
                containerHeight = {containerHeight}

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
                expandCategory = {
                    (dataref, domSource) => {
                        this.expandCategory(index,dataref, domSource)
                    }
                }
                collapseCategory = {
                    this.collapseCategory
                }
            />
        )

    }

/********************************************************
------------------------[ render ]-----------------------
*********************************************************/

    // TODO: move style blocks out of render code
    render() {
        
        // console.log('quadrant state',this.state)
        
        let { quadrant } = this.state
        let {top, left, bottom, right} = this.position
        // let boxlist = this.getBoxes()
        let { color } = this.props

        let { datastack } = this.state

        let haspeers = datastack?(this.state.datastack[this.state.stackpointer].items.length > 1):false

        // Safari keeps scrollleft with content changes
        if (!haspeers && this.scrollboxelement.current && (this.scrollboxelement.current.scrollLeft != 0)) {
            this.scrollboxelement.current.scrollLeft = 0
        }

        let quadstyle:React.CSSProperties = {
            position:'absolute',
            boxSizing:'border-box',
            width:'50%',
            height:'50%',
            padding:'3px',
            top,
            left,
            bottom,
            right,
            border:'1px solid transparent',
            transition:'all .5s ease'
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

        // console.log('quadrant.state, listcomponent',this.state, this.listcomponent)

        return (
            <div 
                style = {quadstyle}
                ref = {this.quadelement}
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
                <div style = {quadcontentstyle} 
                >
                    <SwapMenu 
                        quadrant = {this.state.quadrant} 
                        handleswap = {this.props.handleswap}
                    />
                    <QuadTitleBar 
                        title = {this.props.title} 
                        uid={this.state.startquadrant}
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
                    <QuadSelector 
                        quadrant = {this.state.quadrant} 
                        split = {this.props.split} 
                        quadselection = {this.props.quadselection}
                    />
                </div>
            </div>
        )
    }
}

export default Quadrant