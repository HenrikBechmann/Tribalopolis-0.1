// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence
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

class Quadrant extends React.Component<any,any>  {

    constructor(props) {
        super(props)
        this.drillanimationblock = React.createRef()
        this.originanimationblock = React.createRef()
        this.quadelement = React.createRef()
        this.originelement = React.createRef()
    }

    state = {
        quadrant:this.props.quadrant,
        datastack:this.props.datastack,
        stackpointer:0,
        startquadrant:this.props.quadrant,
    }

    drillanimationblock
    originanimationblock
    originelement

    sessionid = this.props.sessionid

    componentWillMount() {
        this.calculatePosition(this.state.quadrant)
        this.getItem = this.props.getItem
        this.getListItem = this.props.getListItem
        this.getTypeItem = this.props.getTypeItem
    }

    getItem
    getListItem
    getTypeItem

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

    position = null

    quadelement = null

    expandCategory = (boxptr,listItemRef, domSource) => {

        // console.log('expandCategory',boxptr,listItemRef, domSource.current)
        this.animateToDatabox(domSource)

        let {datastack, stackpointer} = this.state

        let boxconfig = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[],settings:{}}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newboxconfig = JSON.parse(JSON.stringify(boxconfig))
        newboxconfig.instanceid = serializer.getid()

        newboxconfig.liststack.push(listItemRef)

        newstacklayer.items.push(newboxconfig)

        setTimeout(() => { // delay for animation
            this.setState({
                stackpointer,
                datastack,
            })
        },500)
    }

    collapseCategory = () => {
        this.decrementStackSelector()
    }

    splayBox = (boxptr, domSource) => {

        this.animateToDataboxList(domSource)

        let {datastack, stackpointer} = this.state

        let boxconfig = datastack[stackpointer].items[boxptr]

        let item = this.getItem(boxconfig.ref)

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
        let newstacklayer = {items:[],settings:{}}

        // console.log('new stack pointer',stackpointer)

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let template = JSON.stringify(boxconfig)

        for (let ref of linkitems) {
            let newboxconfig = JSON.parse(template)
            newboxconfig.instanceid = serializer.getid()
            newboxconfig.liststack.push(ref)
            newstacklayer.items.push(newboxconfig)
        }

        setTimeout(() => { // delay for animation
            this.setState({
                stackpointer,
                datastack,
            })
        },500)
    }

    selectFromSplay = (boxptr:number,domSource) => {

        // console.log('selectFromSplay boxptr,domSource',boxptr,domSource)

        this.animateToDatabox(domSource)

        let {datastack, stackpointer} = this.state

        let boxconfig = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[],settings:{}}

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
        },500)
    }

    animateToDatabox = (domSource) => {

        let targetReference = this._getDataboxListDomRefForAnimation(domSource)

        let {domSourcePack:drillSourcePack,domTargetPack:drillTargetPack} = 
            this._getAnimationSelectDrillVars(domSource.current,targetReference,'quadelement')

        let scrollBoxOffset = this._getScrollboxOffsetForAnimation(domSource.current)

        drillSourcePack.left -= scrollBoxOffset

        this._animateBlockDrill(drillSourcePack, drillTargetPack)

    }

    animateToDataboxList = (domSource) => {

        let targetElement = this._getDataboxListDomRefForAnimation(domSource)

        let {domSourcePack:drillSourcePack,domTargetPack:drillTargetPack} = 
            this._getAnimationDrillVars(domSource.current,targetElement,'quadelement')

        let scrollBoxOffset = this._getScrollboxOffsetForAnimation(domSource.current)

        drillSourcePack.left -= scrollBoxOffset

        this._animateBlockDrill(drillSourcePack, drillTargetPack)

    }

    _getDataboxListDomRefForAnimation = (domSource) => {

        let element = domSource.current
        while (element && (element.getAttribute('data-marker') != 'infinite-scrollbox')) {
            element = element.offsetParent as HTMLElement
        }
        return element
    }

    _getAnimationDrillVars = (domSource:HTMLElement,domTarget:HTMLElement,referenceMarker) => {
        let varpack = {
            domSourcePack:null,
            domTargetPack:null,
        }

        varpack.domSourcePack = this._getAnimationDrillElementVars(domSource,referenceMarker)
        varpack.domTargetPack = this._getAnimationDrillElementVars(domTarget,referenceMarker)

        return varpack
    }

    _getAnimationSelectDrillVars = (domSource:HTMLElement,domReference:HTMLElement,referenceMarker) => {
        let varpack = {
            domSourcePack:null,
            domTargetPack:null,
        }

        let targetPack = {
            top:domReference.offsetTop + (domReference.clientHeight * .1),
            left:(domReference.offsetWidth / 2) - 120,
            height:domReference.clientHeight,
            width:300,
        }

        varpack.domSourcePack = this._getAnimationDrillElementVars(domSource,referenceMarker)
        varpack.domTargetPack = targetPack

        return varpack
    }

    _getAnimationDrillElementVars = (domelement:HTMLElement, referenceMarker) => {

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

    _getScrollboxOffsetForAnimation = (domSourceElement:HTMLElement) => {
        let element = domSourceElement
        while (element && (element.getAttribute('data-marker') != 'infinite-scrollbox')) {
            element = element.offsetParent as HTMLElement
        }

        return element.scrollLeft
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
        },2100)
}

    // // selectbackward
    // animateBlockUnwind = (sourceStyle, targetStyle, adnimationBlock) => {

    // }

    // // selectforward
    // animateOriginDrill = () => {

    // }

    // // selectbackward
    // animateOriginUnwind = () => {

    // }
    decrementStackSelector = () => {
        let { stackpointer } = this.state
        if (stackpointer > 0) {
            stackpointer--
            this.setState({
                stackpointer,
            })
        }
    }

    incrementStackSelector = () => {
        let { stackpointer } = this.state
        let depth = this.state.datastack.length
        if (stackpointer < (depth - 1)) {
            stackpointer++
            this.setState({
                stackpointer,
            })
        }
    }

    getListItemType = (metatype) => {
        return (ref) => {
            return this.getTypeItem(metatype,ref)
        }
    }

    getBoxes = () => {
        let boxes = []
        // console.log('getBoxes quadrant state',this.state)
        let { datastack, stackpointer } = this.state
        if (datastack) {
            let haspeers = (datastack[stackpointer] && (datastack[stackpointer].items.length > 1))
            boxes = datastack[stackpointer].items.map((boxconfig,index) => {
                let item = this.getItem(boxconfig.ref)
                let itemType = this.getTypeItem(METATYPES.item,item.type)
                return (
                    <DataBox 
                        key = { boxconfig.instanceid } 
                        item = { item } 
                        itemType = { itemType }
                        getListItem = { this.getListItem }
                        getListItemType = { this.getListItemType(METATYPES.list) }
                        boxConfig = { boxconfig }
                        haspeers = { haspeers }
                        splayBox = {
                            (domSource) => {
                                this.splayBox(index,domSource)
                            }
                        }
                        selectFromSplay = {
                            (domSource) => {
                                this.selectFromSplay(index,domSource)
                            }
                        }
                        expandCategory = {
                            (ref, domSource) => {
                                this.expandCategory(index,ref, domSource)
                            }
                        }
                        collapseCategory = {
                            this.collapseCategory
                        }
                    />
                )
            })
        }

        // console.log('getBoxes box list',boxes)
        return boxes
    }

    // TODO: move style blocks out of render code
    render() {
        // console.log('quadrant state',this.state)
        let { color } = this.props
        let { quadrant } = this.state
        let {top, left, bottom, right} = this.position
        let boxlist = this.getBoxes()
        return (
            <div data-marker = 'quadelement'
                style = {
                    {
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

                }
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
                <div style = 
                    {{
                        boxSizing: 'border-box',
                        border: '3px outset gray',
                        position:'relative',
                        backgroundColor:color,
                        borderRadius:'8px',
                        width:'100%',
                        height:'100%',
                        overflow:'hidden',
                    }} 
                >
                    <SwapMenu quadrant = {this.state.quadrant} handleswap = {this.props.handleswap}/>
                    <QuadTitleBar title = {this.props.title} uid={this.state.startquadrant}/>
                    <QuadOrigin 
                        stackpointer = {this.state.stackpointer} 
                        stackdepth = {this.state.datastack.length}
                        incrementStackSelector = {this.incrementStackSelector}
                        decrementStackSelector = {this.decrementStackSelector}
                        ref = {this.originelement}
                    />
                    <InfiniteScroll items = {boxlist}/>
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