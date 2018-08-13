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
        datastack:this.props.datastack,
        stackpointer:0,
        startquadrant:this.props.quadrant,
    }

    drillanimationblock
    originanimationblock
    maskanimationblock
    originelement
    scrollboxelement
    listcomponent
    quadelement

    getItem
    getListItem
    getTypeItem

    position = null

    collapseBoxConfigForTarget

/********************************************************
------------------[ lifecycle methods ]------------------
*********************************************************/

    componentWillMount() {
        this.calculatePosition(this.state.quadrant)
        this.getItem = this.props.getItem
        this.getListItem = this.props.getListItem
        this.getTypeItem = this.props.getTypeItem
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
        console.log('listcomponent after mount',this.listcomponent)
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

    splayBox = (boxptr, domSource) => {

        this.animateToOrigin()

        this.animateToDataboxList(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let boxconfig = datastack[stackpointer].items[boxptr]

        let item = this.getItem(boxconfig.dataref)

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
        // console.log('quadrant collapseCategory boxConfig, datastack',boxConfig, this.state.stackpointer, this.state.datastack)
        this.collapseBoxConfigForTarget = Object.assign({},boxConfig)
        this.decrementStackSelector()
    }

    decrementStackSelector = () => {
        let { stackpointer, datastack } = this.state
        this._captureSettings(stackpointer,datastack)
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

    _captureSettings = (stackpointer, datastack) => {
        let stacklayer = datastack[stackpointer]
        stacklayer.settings.scrollOffset = this.scrollboxelement.current.scrollLeft
    }

    _applySettings = (stackpointer, datastack) => {
        let stacklayer = datastack[stackpointer]
        this.scrollboxelement.current.scrollLeft = stacklayer.settings.scrollOffset
    }

/********************************************************
----------------------[ animations ]---------------------
*********************************************************/

    highlightBox = (boxdomref) => {

        let boxelement:HTMLElement = boxdomref.current
        let clientoffset = 0
        let element:HTMLElement = boxelement
        while (element && (element.getAttribute('data-marker') != 'boxlist-scrollbox')) {
            clientoffset += element.offsetLeft
            element = element.offsetParent as HTMLElement
        }
        let scrollelement:Element = element

        let diff = (clientoffset + boxelement.offsetWidth) - scrollelement.clientWidth + 16 // margin
        if (diff > 0) {
            scrollelement.scrollLeft = diff
        }

        boxelement.classList.add('outlinehighlight')
        setTimeout(() => {
            boxelement.classList.remove('outlinehighlight')
        },1100)

    }

    animateToOrigin = () => {

        let sourceelement = this.scrollboxelement.current
        let targetelement = this.originelement.current

        let sourcePack = this._getAnimationElementVars(sourceelement, 'quadelement')
        let targetPack = this._getAnimationElementVars(targetelement, 'quadelement')

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
            this._getAnimationSelectDrillVars( domSource.current, targetReference, 'quadelement' )

        let scrollBoxOffset = this.scrollboxelement.current.scrollLeft

        drillSourcePack.left -= scrollBoxOffset

        this._animateBlockDrill( drillSourcePack, drillTargetPack )

    }

    animateToDataboxList = (domSource) => {

        let targetElement = this.scrollboxelement.current

        let {domSourcePack:drillSourcePack,domTargetPack:drillTargetPack} = 
            this._getAnimationDrillVars(domSource.current,targetElement,'quadelement')

        let scrollBoxOffset = this.scrollboxelement.current.scrollLeft

        drillSourcePack.left -= scrollBoxOffset

        this._animateBlockDrill(drillSourcePack, drillTargetPack)

    }

    _getAnimationDrillVars = (domSource:HTMLElement,domTarget:HTMLElement,referenceMarker) => {
        let varpack = {
            domSourcePack:null,
            domTargetPack:null,
        }

        varpack.domSourcePack = this._getAnimationElementVars(domSource,referenceMarker)
        varpack.domTargetPack = this._getAnimationElementVars(domTarget,referenceMarker)

        return varpack
    }

    _getAnimationSelectDrillVars = (domSource:HTMLElement,domReference:HTMLElement,referenceMarker) => {
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

        varpack.domSourcePack = this._getAnimationElementVars(domSource,referenceMarker)
        varpack.domTargetPack = targetPack

        return varpack
    }

    _getAnimationElementVars = (domelement:HTMLElement, referenceMarker) => {

        let topOffset = 0
        let leftOffset = 0
        let height = domelement.clientHeight
        let width = domelement.clientWidth

        let searchelement:HTMLElement = domelement
        while (searchelement && (searchelement.getAttribute('data-marker') != referenceMarker)) {
            topOffset += searchelement.offsetTop
            leftOffset += searchelement.offsetLeft
            searchelement = searchelement.offsetParent as HTMLElement
        }

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

    getBoxes = () => {
        let boxes = []
        // console.log('getBoxes quadrant state',this.state)
        let { datastack, stackpointer } = this.state
        if (datastack) {

            let collapseBoxConfigForTarget = null
            let matchForTarget = false
            let stacksource = null

            if (this.collapseBoxConfigForTarget) { // collapseCategory action
                let stacklayer = datastack[stackpointer + 1]
                if (stacklayer) {
                    stacksource = stacklayer.source
                }
                collapseBoxConfigForTarget = this.collapseBoxConfigForTarget
                this.collapseBoxConfigForTarget = null // one time only
                if (stacksource) {
                    collapseBoxConfigForTarget.action = stacksource.action
                }
            }

            let haspeers = (datastack[stackpointer] && (datastack[stackpointer].items.length > 1))

            // boxes = datastack[stackpointer].items.map((boxconfig,index) => {
            //     let context = {collapseBoxConfigForTarget,stacksource,haspeers}
            //     return this.getBoxComponent(boxconfig, index, context)
            // })

            for (let index in datastack[stackpointer].items) {
                boxes.push(this.getBox(index, index))
            }
        }

        // console.log('getBoxes box list',boxes)
        return boxes
    }

    getBox = (index, key) => {

        let { datastack, stackpointer } = this.state

        let boxconfig = datastack[stackpointer].items[index]

        let haspeers = (datastack[stackpointer] && (datastack[stackpointer].items.length > 1))
        let stacksource = null
        let collapseConfigForTarget = null

        let context = {
            haspeers,
            collapseConfigForTarget,
            stacksource,
        }

        return this.getBoxComponent(boxconfig, index, context, key)
    }

    getBoxComponent = (boxconfig, index, context, key) => {

        console.log('getting box component', index, key)

        return <div
            style = {{width:'300px',height:'300px',backgroundColor:'red',border:'3px solid black',display:'inline-block'}}
            key = {key}
        >
            {index}
        </div>

        // if (!boxconfig) return null

        // let item = this.getItem(boxconfig.dataref)
        // let itemType = this.getTypeItem(METATYPES.item,item.type)

        // let matchForTarget
        // let { collapseBoxConfigForTarget, stacksource, haspeers } = context

        // if (collapseBoxConfigForTarget) {
        //     matchForTarget = (boxconfig.instanceid == stacksource.instanceid)
        // }

        // return (
        //     <DataBox 
        //         key = { key } 
        //         item = { item } 
        //         itemType = { itemType }
        //         collapseBoxConfigForTarget = {matchForTarget?collapseBoxConfigForTarget:null}
        //         getListItem = { this.getListItem }
        //         getListItemType = { this.getListItemType(METATYPES.list) }
        //         boxConfig = { boxconfig }
        //         highlightBox = {this.highlightBox}
        //         haspeers = { haspeers }

        //         splayBox = {
        //             (domSource) => {
        //                 this.splayBox(index,domSource)
        //             }
        //         }
        //         selectFromSplay = {
        //             (domSource) => {
        //                 this.selectFromSplay(index,domSource)
        //             }
        //         }
        //         expandCategory = {
        //             (dataref, domSource) => {
        //                 this.expandCategory(index,dataref, domSource)
        //             }
        //         }
        //         collapseCategory = {
        //             this.collapseCategory
        //         }
        //     />
        // )

    }

/********************************************************
------------------------[ render ]-----------------------
*********************************************************/

    // TODO: move style blocks out of render code
    render() {
        // console.log('quadrant state',this.state)
        let { quadrant } = this.state
        let {top, left, bottom, right} = this.position
        let boxlist = this.getBoxes()
        let { color } = this.props

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

        let viewportStyle:React.CSSProperties = { // borderRadius on scroller breaks scrollbar
            width:'600px', //100%',
            height:'300px',//100%',
            overflow:'auto',
            backgroundColor:'#e8e8e8',
            border: '1px solid gray',
            boxSizing: 'border-box',
            borderRadius: '8px',
            position:'relative',
        }

        console.log('quadrant.state, listcomponent',this.state, this.listcomponent)

        return (
            <div data-marker = 'quadelement'
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
                        stackdepth = {this.state.datastack.length}
                        incrementStackSelector = {this.incrementStackSelector}
                        decrementStackSelector = {this.decrementStackSelector}
                        ref = {this.originelement}
                    />
                    <div 
                        style = {{overflow:'auto',position:'relative'}}
                        data-marker = 'boxlist-scrollbox'
                        ref = {this.scrollboxelement}
                    >
                        <Lister 
                            axis = 'x'
                            itemRenderer = {this.getBox}
                            length = {17
                                //this.state.datastack[this.state.stackpointer].items.length
                            }
                            type = 'uniform'
                            ref = {this.listcomponent}
                        />
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