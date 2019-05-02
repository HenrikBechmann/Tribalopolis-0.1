// quadoperations.class.tsx
// copyright (c) 2019 Henrik Bechmann, Toronto, Licence: GPL-3.0-or-later

'use strict'

import docproxy from '../../../core/utilities/docproxy'

class quadoperations {

    constructor({ quadrant, animations, listcomponent, scrollboxelement }) {
        this.quadrant = quadrant
        this.listcomponent = listcomponent
        this.scrollboxelement = scrollboxelement
        this.animations = animations
    }

    // imported
    quadrant
    animations
    listcomponent
    scrollboxelement

    // set from callback
    collapseTargetProxy = null
/********************************************************
----------------------[ operations ]---------------------
*********************************************************/

    // for calls from quadrant.controller component
    isTargetProxy = () => {
        return !!this.collapseTargetProxy
    }

    getTargetProxy = () => {
        return this.collapseTargetProxy
    }

    setTargetProxy = value => {
        this.collapseTargetProxy = value
    }

    //-------------------------------[ forward ]---------------------------
    expandDirectoryItem = (boxptr, listtoken, domSource) => {

        this.animations.animateToOrigin()

        this.animations.animateToDataBox(domSource,this.quadrant.state.boxwidth)

        let datastack = this.quadrant.datastack

        let { stackpointer } = this.quadrant.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]

        let newaccount = this.getNewAccount(itemProxy,datastack[stackpointer])

        stackpointer++
        let newstacklayer = {
            items:[], 
            settings:{}, 
            source:{
                instanceid:itemProxy.instanceid,
                itemProxy,
                doctoken:itemProxy.doctoken,
                action:'expand',
            },
            account:newaccount,
        }

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newliststack = itemProxy.liststack.splice()
        newliststack.push(listtoken)
        let newItemProxy = new docproxy({doctoken:itemProxy.doctoken,liststack:newliststack})

        newstacklayer.items.push(newItemProxy)

        setTimeout(() => { // delay for animation
            this.quadrant.datastack = datastack
            this.quadrant.setState({
                stackpointer,
            })
        },100)
    }

    getNewAccount = (itemProxy, oldstacklayer) => {

        let newaccount
        let oldaccount = oldstacklayer.account
        let newref = itemProxy.reference.split('/')

        if (newref[1] == 'accounts') {

            newaccount = itemProxy.reference

        } else {

            newaccount = oldaccount

        }

        return newaccount

    }

    getStartItem = (listcomponent) => {
        let itemheight = listcomponent.props.itemSize
        let offset = listcomponent.state.scrollOffset
        return Math.floor(offset/itemheight)
    }

    splayBox = (boxptr, domSource, sourcelistcomponent,listDocument) => {

        let startItem = this.getStartItem(sourcelistcomponent.current)

        this.animations.animateToOrigin()

        this.animations.animateToDataBoxList(domSource)

        let datastack = this.quadrant.datastack

        let { stackpointer } = this.quadrant.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]
        let itemToken = itemProxy.doctoken

        let newaccount = this.getNewAccount(itemProxy,datastack[stackpointer])

        let listtokens = listDocument.data.lists

        if (!listtokens || !listtokens.length) return

        stackpointer++
        let newstacklayer = {
            items:[], 
            settings:{}, 
            source:{
                instanceid:itemProxy.instanceid,
                itemProxy,
                doctoken:itemProxy.doctoken,
                action:'splay',
                startItem,
            },
            account:newaccount,
        }

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        for (let doctoken of listtokens) {
            let newliststack = itemProxy.liststack.slice() // copy
            newliststack.push(doctoken)
            let newItemProxy = new docproxy({doctoken:itemToken,liststack:newliststack})
            newstacklayer.items.push(newItemProxy)
        }

        setTimeout(() => { // delay for animation
            this.quadrant.datastack = datastack
            this.quadrant.setState({
                stackpointer,
            },() => {
                setTimeout(() =>{
                    this.listcomponent.current.scrollToItem(startItem,'start')
                },300) // avoid setstate no op in lead list items
            })
        },100)
    }

    expandFromSplay = (boxptr:number,domSource) => {

        this.animations.animateToOrigin()

        this.animations.animateToDataBox(domSource,this.quadrant.state.boxwidth)

        let datastack = this.quadrant.datastack

        let {stackpointer} = this.quadrant.state
        this._captureSettings(stackpointer,datastack)

        let itemProxy = datastack[stackpointer].items[boxptr]
        let itemToken = itemProxy.doctoken

        let newaccount = this.getNewAccount(itemProxy,datastack[stackpointer])

        stackpointer++
        let newstacklayer = {
            items:[], 
            settings:{}, 
            source:{
                instanceid:itemProxy.instanceid,
                itemProxy,
                doctoken:itemProxy.doctoken,
                action:'select',
            },
            account:newaccount,
        }

        // replace forward stack items
        datastack.splice(stackpointer,datastack.length,newstacklayer)

        let newItemProxy = new docproxy(
            {
                doctoken:itemToken, 
                liststack:itemProxy.liststack.slice(),
            }
        )
        
        newstacklayer.items.push(newItemProxy)

        setTimeout(() => { // delay for animation
            this.quadrant.datastack = datastack
            this.quadrant.setState({
                stackpointer,
            })
        },100)
    }

    //-------------------------------[ backward ]----------------------------

    collapseDirectoryItem = (itemProxy) => {

        if (!(this.quadrant.state.stackpointer > 0)) {
            return
        }
        // console.log('collapse item in collapseDirectoryItem of quadoperation',itemProxy)

        // decrement the stack
        setTimeout(()=>{
            // animate the collapse
            if (this.quadrant.state.stackpointer) {
                let targetStackLayer = this.quadrant.datastack[this.quadrant.state.stackpointer - 1]
                if (targetStackLayer.items.length > 1) {
                    this.animations.animateOriginToDataBoxList()
                } else {
                    this.animations.animateOriginToDatabox(this.quadrant.state.boxwidth)
                }
            }

            this.collapseTargetProxy = this.quadrant.activeTargetProxy= Object.assign({},itemProxy)
            let { stackpointer } = this.quadrant.state
            this._updateCollapseSettings(stackpointer,this.quadrant.datastack)
            let activeTargetProxy = this.collapseTargetProxy 
            let sourceinstanceid = activeTargetProxy.sourceinstanceid
            // console.log('sourceinstanceid in quadoperations',sourceinstanceid, activeTargetProxy.sourceinstanceid, activeTargetProxy)
            let scrollindex = this.quadrant.datastack[this.quadrant.state.stackpointer-1].items
                .findIndex(this.quadrant._findlinkIndex(sourceinstanceid))

            // console.log('target index quadrant componentDidUpdate',scrollindex, this.quadrant.datastack, this.quadrant.state.stackpointer-1, activeTargetProxy)
            // update scroll display with selected highlight item
            activeTargetProxy.index = scrollindex

            this.decrementStackSelector()
        },100)

    }

    decrementStackSelector = () => {
        let datastack = this.quadrant.datastack
        let { stackpointer } = this.quadrant.state
        this._captureSettings(stackpointer,datastack)
        // this._updateCollapseSettings(stackpointer,datastack)
        if (stackpointer > 0) {
            stackpointer--
            this.quadrant.datastack = datastack
            this.quadrant.setState({
                stackpointer,
            },() => {
                this._applySettings(stackpointer,datastack)
            })
        }
    }

    private _captureSettings = (stackpointer, datastack) => {
        let stacklayer = datastack[stackpointer]
        let { items } = stacklayer
        stacklayer.settings.scrollOffset = 
            (items.length > 1)?this.listcomponent.current.state.scrollOffset:0
    }

    private _updateCollapseSettings = (stackpointer, datastack) => {

        if (this.collapseTargetProxy) {
            let sourcelayer = datastack[this.quadrant.state.stackpointer]
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

    private _applySettings = (stackpointer, datastack) => {
        let stacklayer = datastack[stackpointer]
        let { items } = stacklayer

        if ((items.length > 1) && (!this.collapseTargetProxy)) {
            setTimeout(() => { // give deference to formation of scroll object

                let itemSize = this.listcomponent.current.props.itemSize
                let scrollOffset = stacklayer.settings.scrollOffset
                let itemNumber = Math.floor(scrollOffset/itemSize)
                setTimeout(()=>{
                    this.listcomponent.current.scrollToItem(itemNumber,"start")
                },300)

            })
        }
    }

}

export default quadoperations