// quadrant.view.tsx
// copyright (c) 2018 Henrik Bechmann, Toronto, MIT Licence

/*
    TODO: keep scrollbox pos in settings when navigating stack levels
    TODO: rationalize render hierarchy
*/
'use strict'

import React from 'react'

import { withStyles, createStyles } from '@material-ui/core/styles'

import QuadOrigin from './quadrant/quadorigin.view'
import QuadTitleBar from './quadrant/quadtitlebar.view'

import DataBox from './databox.controller'
import Lister from 'react-list'

import animations from './quadrant/quadanimations.utilities'

import AnimationWrapper from './quadrant/quadamimation.wrapper'

import quadoperations from './quadrant/quadoperations.class'

let styles = createStyles({
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

        // structure dom elements
        this.originelement = React.createRef()
        this.scrollboxelement = React.createRef()

        // components
        this.listcomponent = React.createRef()
        this.animationwrapper = React.createRef()

        // callbacks
        this.setItemListener = this.props.callbacks.setItemListener
        this.setListListener = this.props.callbacks.setListListener
        this.removeItemListener = this.props.callbacks.removeItemListener
        this.removeListListener = this.props.callbacks.removeListListener

        // delegate methods to a class
        this.operations = new quadoperations({
            quadrant:this, 
            animationwrapper:this.animationwrapper, 
            listcomponent:this.listcomponent, 
            scrollboxelement:this.scrollboxelement,
        })

        window.addEventListener('resize',this.onResize)

    }

    state = {
        datastack:null,
        stackpointer:0,
        activeTargetProxy:null,
        boxwidth:300
    }

    // dom refs
    originelement
    scrollboxelement

    // component ref
    listcomponent
    animationwrapper

    // callbacks get database records
    setItemListener
    setListListener
    removeItemListener
    removeListListener

    operations

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
        if (!this.operations.getTargetProxy()) return

        // keep; value will be purged
        let activeTargetProxy = this.operations.getTargetProxy()
        this.operations.setTargetProxy(null)
        // get index for Lister
        let index = this.state.datastack
            [this.state.stackpointer].items
            .findIndex
                (this._findlinkIndex
                    (activeTargetProxy.sourceinstanceid))

        // update scroll display with selected highlight item
        activeTargetProxy.index = index

        setTimeout( () => { // defer to currently running code

            if (this.listcomponent && (this.state.datastack[this.state.stackpointer].items.length > 1)) {
                this.listcomponent.current.scrollAround(index)
            }

            setTimeout(()=>{ // time for scroll to take place
                this.setState({ // trigger animation response
                    activeTargetProxy,
                },()=> {
                    setTimeout(()=>{
                        this.setState({ // cancel animation response
                            activeTargetProxy:null
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
        let { activeTargetProxy } = this.state
        if (activeTargetProxy) {
            matchForTarget = (activeTargetProxy.index == index)
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
                this.operations.splayBox(index, domSource, listcomponent,listdoctoken)},
            selectFromSplay:(domSource) => {
                this.operations.selectFromSplay(index,domSource)},
            expandDirectoryItem:(token, domSource) => {
                this.operations.expandDirectoryItem(index,token, domSource)},
            collapseDirectoryItem:this.operations.collapseDirectoryItem,
            setBoxWidth:this.setBoxWidth,
        }
        return (
            <DataBox 
                key = { itemProxy.instanceid } 

                itemProxy = { itemProxy }
                collapseTargetProxy = {matchForTarget?activeTargetProxy:null}
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
        <AnimationWrapper 

            ref = {this.animationwrapper}

            quadcontentStyle = {quadcontentStyle}
            scrollboxelement = {this.scrollboxelement}
            originelement = {this.originelement}
            boxwidth = {this.state.boxwidth}
            
        >

            <QuadTitleBar 
                title = {'Account:'} 
                quadidentifier={this.props.quadidentifier}
            />
            <QuadOrigin 
                stackpointer = {this.state.stackpointer} 
                stackdepth = {datastack?datastack.length:0}
                incrementStackSelector = {this.operations.incrementStackSelector}
                decrementStackSelector = {this.operations.decrementStackSelector}
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

        </AnimationWrapper>)
    }
}

export default withStyles(styles)(Quadrant)