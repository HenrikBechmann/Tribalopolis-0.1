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

        this.setItemListener = this.props.callbacks.setItemListener
        this.setListListener = this.props.callbacks.setListListener
        this.setTypeListener = this.props.callbacks.setTypeListener

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
    setItemListener
    setListListener
    setTypeListener

    // trigger for animation and reset
    collapseTargetData = null

    boxdatacache = {}

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

/********************************************************
----------------------[ operations ]---------------------
*********************************************************/

    //-------------------------------[ forward ]---------------------------
    expandDirectoryItem = (boxptr, doctoken, domSource) => {

        this.animateToOrigin()

        this.animateToDataBox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:itemProxy.instanceid,
            doctoken:itemProxy.doctoken,
            action:'expand',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newItemProxy = JSON.parse(JSON.stringify(itemProxy))
        newItemProxy.instanceid = serializer.getid()

        newItemProxy.liststack.push(doctoken)

        newstacklayer.items.push(newItemProxy)

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

        let itemProxy = datastack[stackpointer].items[boxptr]

        let {item:itemObject} = this.getCacheItemData(itemProxy.instanceid,itemProxy.doctoken)

        let listdoctoken
        if (itemProxy.liststack.length > 0) {
            listdoctoken = itemProxy.liststack[itemProxy.liststack.length - 1]
        } else {
            listdoctoken = itemObject.list
        }

        let { list:listObject } =  this.getCacheListData(itemProxy.instanceid,listdoctoken) 

        // console.log('getting list data for splay', itemProxy.instanceid, listdoctoken, listObject)

        let listtokens = listObject.list

        if (!listtokens || !listtokens.length) return

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:itemProxy.instanceid,
            doctoken:itemProxy.doctoken,
            action:'splay',
            visiblerange,
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let template = JSON.stringify(itemProxy)

        for (let token of listtokens) {
            let newItemProxy = JSON.parse(template)
            newItemProxy.instanceid = serializer.getid()
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
        },250)
    }

    selectFromSplay = (boxptr:number,domSource) => {

        this.animateToOrigin()

        this.animateToDataBox(domSource)

        let {datastack, stackpointer} = this.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]

        stackpointer++
        let newstacklayer = {items:[], settings:{}, source:{
            instanceid:itemProxy.instanceid,
            doctoken:itemProxy.doctoken,
            action:'select',
        }}

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newItemProxy = JSON.parse(JSON.stringify(itemProxy))
        newItemProxy.instanceid = serializer.getid()
        
        newstacklayer.items.push(newItemProxy)

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

    collapseDirectoryItem = (itemProxy) => {

        this.collapseTargetData = Object.assign({},itemProxy)

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
----------------------[ cache management ]---------------------
*********************************************************/

    isBoxDataCache = (instanceid) => {
        return !!this.boxdatacache[instanceid]
    }

    cacheItemData = (instanceid,data,type) => {
        let wascache = !!this.boxdatacache[instanceid]
        this.boxdatacache[instanceid] = {
            item:{
                data,
                type,
            }
        }
    }

    isCacheItemData = (instanceid) => {
        return !!(this.boxdatacache[instanceid] && this.boxdatacache[instanceid].item)
    }

    getCacheItemData = (instanceid, doctoken) => {
        
        let item
        let type

        if (!this.isBoxDataCache(instanceid)) {

            // console.log('fetching new item data')
            this.setItemListener(doctoken,instanceid,this.cacheItemData)

            return {}

            // this.cacheItemData(instanceid,item,type)

        } else {

            // console.log('fetching cached item data')
            item = this.boxdatacache[instanceid].item.data
            type = this.boxdatacache[instanceid].item.type

        }

        return {item,type,}

    }

    // TODO create callback for setListeners
    cacheListData = (instanceid, data, type) => {
        this.boxdatacache[instanceid].list = {
            data,
            type,
        }
    }

    isCacheListData = (instanceid) => {
        return !!(this.boxdatacache[instanceid] && this.boxdatacache[instanceid].list)
    }

    getCacheListData = (instanceid,doctoken = null) => {
        let list
        let type

        if (!(this.isBoxDataCache(instanceid) && this.boxdatacache[instanceid].list)) {

            list = this.setListListener(doctoken)
            type = this.setTypeListener(list.type)

            this.cacheListData(instanceid,list,type)

        } else {

            list = this.boxdatacache[instanceid].list.data
            type = this.boxdatacache[instanceid].list.type

        }

        return {list,type,}
    }

   unmountBoxdatacache = (instanceid) => {
        delete this.boxdatacache[instanceid]
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

        let { item, type:itemType } = this.getCacheItemData(itemProxy.instanceid,itemProxy.doctoken)

        let containerHeight = this.scrollboxelement.current.offsetHeight

        let matchForTarget = false
        let { collapseTargetData } = this.state
        if (collapseTargetData) {
            matchForTarget = (collapseTargetData.index == index)
        }
        return (
            <DataBox 
                key = { itemProxy.instanceid } 
                item = { item } 
                itemType = { itemType }
                collapseTargetData = {matchForTarget?collapseTargetData:null}
                setListListener = { this.setListListener }
                setTypeListener = { this.setTypeListener }
                itemProxy = { itemProxy }
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
                    (doctoken, domSource) => {
                        this.expandDirectoryItem(index,doctoken, domSource)
                    }
                }
                collapseDirectoryItem = {
                    this.collapseDirectoryItem
                }
                unmount = {
                    () => {
                        this.unmountBoxdatacache(itemProxy.instanceid)
                    }
                }
                cacheListData = {
                    (list,type) => {
                        this.cacheListData(itemProxy.instanceid,list,type)
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