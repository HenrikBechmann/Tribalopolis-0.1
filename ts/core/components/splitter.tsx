// splitter.tsx

/*
    TODO: 
    - add min and max props (in pixels) for splitter
    - find way for tabs and handles to stay out of way of nested splitters
    - provide cue for being inside or outside threshold
    - identify and resolve remaining nested splitter issues
    - drag handle should be invisible when total scope of move (ie height) is below threshold
*/

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FontIcon from 'material-ui/FontIcon'

import { styles as globalstyles } from '../utilities/styles'
import DragHandle from './draghandle'

import MoveDraghandleLayer from './movedraghandlelayer'

interface SplitterProps {
    primaryPane:JSX.Element,
    secondaryPane:JSX.Element,
    division?:number, // 0-100
    collapse?:1 | -1 | 0,
    orientation?: "horizontal" | "vertical",
    threshold?:number, // pixels
    fadeThreshold?:number, //pixes for when controls fade
    showTabs?:boolean,
    showHandle?:boolean,
    minLengthTriggers?:{
        tabs?:number,
        handle?:number,
    },
    getTriggers?:Function,
    triggers?:string[],
    paneid?:string,
    name?:string,
}
class Splitter extends React.Component<SplitterProps,any> {

    constructor(props:SplitterProps) {
        super(props)

        let { 
            division, 
            collapse, 
            orientation, 
            threshold, 
            fadeThreshold,
            showHandle, 
            showTabs, 
            minLengthTriggers
        } = this.props

        if (division < 0) division = 0
        if (division > 100) division = 100
        orientation = orientation || 'horizontal'
        division = division || 50
        collapse = collapse || 0
        threshold = threshold || 100
        fadeThreshold = fadeThreshold || 100
        showHandle = (showHandle == undefined)?true:showHandle
        showTabs = (showTabs == undefined)?false:showTabs

        if (minLengthTriggers) {
            if (minLengthTriggers.handle) {
                this.minLengthTriggers.handle = minLengthTriggers.handle
            }
            if (minLengthTriggers.tabs) {
                this.minLengthTriggers.tabs = minLengthTriggers.tabs
            }
        }
        this.showHandle = showHandle
        this.showTabs = showTabs
        this.threshold = threshold
        this.fadeThreshold = fadeThreshold
        this.orientation = orientation
        this.state = {
            division,
            collapse,
        }
        this.initStyles()
        this.setCollapseStyles(collapse,division)
        this.primaryPane = React.cloneElement(
            props.primaryPane,
            {
                paneid:'primaryPane',
                triggers:this.triggerlist,
                getTriggers:this.getTriggers,
            }
        )
        this.secondaryPane = React.cloneElement(
            props.secondaryPane,
            {
                paneid:'secondaryPane',
                triggers:this.triggerlist,
                getTriggers:this.getTriggers,
            }
        )
    }

    getTriggers = (paneid,triggers) => {
        this.triggers[paneid] = triggers
        // console.log('paneid,triggers',paneid,triggers)
    }

    isPrimaryBelowThreshold = null
    isSecondaryBelowThreshold = null

    onSplitterResize = (offset,height) => {
        let {primaryTabNode, secondaryTabNode} = this

        if (!(primaryTabNode||secondaryTabNode)) return

        let {threshold} = this

        let isPrimaryBelowThreshold = (offset) < threshold
        let isSecondaryBelowThreshold = (height - offset) < threshold
        if (isPrimaryBelowThreshold !== this.isPrimaryBelowThreshold) {

            this.isPrimaryBelowThreshold = isPrimaryBelowThreshold
            if (isPrimaryBelowThreshold) {
                this.onTabHide('primary')
            } else {
                this.onTabShow('primary')
            }

        }

        if (isSecondaryBelowThreshold !== this.isSecondaryBelowThreshold) {

            this.isSecondaryBelowThreshold = isSecondaryBelowThreshold
            if (isSecondaryBelowThreshold) {
                this.onTabHide('secondary')
            } else {
                this.onTabShow('secondary')
            }

        }
    }

    onTabShow = (tabid) => {
        if (this.primaryTabNode && this.secondaryTabNode) {
            let {primaryTabNode,secondaryTabNode} = this

            if (tabid == 'primary') {

                if (primaryTabNode.style.visibility == 'hidden') {

                    primaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s 0s',
                    primaryTabNode.style.visibility = 'visible'
                    primaryTabNode.style.opacity = '1'

                }

            } else {

                if (secondaryTabNode.style.visibility == 'hidden') {

                    secondaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s 0s',
                    secondaryTabNode.style.visibility = 'visible'
                    secondaryTabNode.style.opacity = '1'

                }
            }

         }

    }

    onTabHide = (tabid) => {

        if (this.primaryTabNode && this.secondaryTabNode) {

            let {primaryTabNode,secondaryTabNode} = this

            if (tabid == 'primary') {

                if (primaryTabNode.style.visibility == 'visible') {

                    primaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s .5s',
                    primaryTabNode.style.visibility = 'hidden'
                    primaryTabNode.style.opacity = '0'

                } 

            }

            if (tabid == 'secondary') {

                if (secondaryTabNode.style.visibility == 'visible') {

                    secondaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s .5s',
                    secondaryTabNode.style.visibility = 'hidden'
                    secondaryTabNode.style.opacity = '0'

                }

            }
        }
    }

    isContainingBelowTreshold = null

    onContainingSplitterResize = () => {
        let {primaryTabNode, secondaryTabNode, splitterHandleNode} = this
        if (!(primaryTabNode||secondaryTabNode||splitterHandleNode)) return

        let length
        if (this.isHorizontal()) {
            length = this.splitterElement.clientWidth
        } else {
            length = this.splitterElement.clientHeight
        }

        // console.log('inside onContainingSplitterResize for', this.props.name, length)

        let {fadeThreshold} = this

        let isBelowThreshold = length < fadeThreshold

        if (isBelowThreshold !== this.isContainingBelowTreshold) {

            this.isContainingBelowTreshold = isBelowThreshold
            if (isBelowThreshold) {
                this.onHide()
            } else {
                this.onShow()
            }

        }
        let self = this
        setTimeout(() =>{
            let frameDimensions = this.getFrameDimensions()
            let height = this.isHorizontal()?frameDimensions.height:frameDimensions.width
            let position = frameDimensions.reference
            this.onSplitterResize(position,height)
            // console.log(self.props.name + 'calling triggers', self.triggers)
            for (let trigger in self.triggers) {
                if (self.triggers[trigger]['onContainingSplitterResize']) {
                    self.triggers[trigger]['onContainingSplitterResize']()
                }
            }
        })

    }

    styles = JSON.parse(JSON.stringify(globalstyles.splitter))

    triggerlist = ['onStartSplitterDrag','onEndSplitterDrag','onContainingSplitterResize','onHide','onShow']

    triggers = {
        primaryPane:Object,
        secondaryPane:Object,
    }

    minLengthTriggers = {
        tabs:130,
        handle: 60,
    }

    primaryPane:JSX.Element
    secondaryPane:JSX.Element

    primaryTabNode: HTMLDivElement
    secondaryTabNode: HTMLDivElement
    splitterHandleNode:any
    splitterframe:HTMLElement
    splitterElement:HTMLElement

    orientation:string
    threshold:number
    fadeThreshold:number
    showTabs:boolean
    showHandle:boolean

    isHorizontal = () => {
        return (this.orientation == 'horizontal')?true:false
    }

    componentWillMount() {
        if (this.props.getTriggers) {
            let triggers = {}
            for (let trigger of this.props.triggers) {
                if (this[trigger]) {
                    triggers[trigger] = this[trigger]
                }
            }
            this.props.getTriggers(this.props.paneid,triggers)
            // console.log(this.props.name + ' got triggers',triggers)
        }
    }


    componentDidMount() {
        let el = this.splitterframe
        let primarylength = this.isHorizontal()?el.clientHeight:el.clientWidth
        // let primarylength = el.clientHeight
        if ((this.threshold / primarylength) > .25)
            this.threshold = primarylength * .25   
    }

    updatecount = 0 // TODO: THIS IS A HACK to pass loaded data file to spacegraph
    componentWillUpdate(newProps) {
        if (this.updatecount == 0) {
            this.updatecount++
            this.primaryPane = React.cloneElement(
                newProps.primaryPane,
                {
                    paneid:'primaryPane',
                    triggers:this.triggerlist,
                    getTriggers:this.getTriggers,
                }
            )
            console.log('splitter componentWillUpdate: this.updatecount, newProps.primaryPane, this.PrimaryPane', this.updatecount,newProps.primaryPane, this.primaryPane)
        }
    }

    // update state if division or collapse changes
    componentWillReceiveProps(nextProps) {
        if ((nextProps.division !== this.props.division) ||
            (nextProps.collapse !== this.props.collapse)) {
            let { division, collapse } = nextProps
            this.setState({
                division,
                collapse,
            })
            this.setCollapseStyles(collapse,division)
        }

    }

    stylememo:any = null

    dragStart = () => {
        let styles = this.styles
        let stylememo = {
            transitions:{
                topframe:styles.topframe.transition,
                splitter:styles.splitter.transition,
                bottomframe:styles.bottomframe.transition,
            },
        }
        this.stylememo = stylememo
        styles.topframe.transition = 'unset'
        styles.splitter.transition = 'unset'
        styles.bottomframe.transition = 'unset'
        for (let trigger in this.triggers) {
            if (this.triggers[trigger]['onStartSplitterDrag']) {
                this.triggers[trigger]['onStartSplitterDrag']()
            }
        }
    }

    dragEnd = () => {
        let stylememo = this.stylememo
        this.stylememo = null
        let styles = this.styles
        styles.topframe.transition = stylememo.transitions.topframe
        styles.splitter.transition = stylememo.transitions.splitter
        styles.bottomframe.transition = stylememo.transitions.bottomframe
        for (let trigger in this.triggers) {
            if (this.triggers[trigger]['onEndSplitterDrag']) {
                this.triggers[trigger]['onEndSplitterDrag']()
            }
        }
    }

    dragUpdate = (args) => {
        let offset = this.isHorizontal()? args.diffOffset.y: args.diffOffset.x
        let height = this.isHorizontal()?args.frameDimensions.height:args.frameDimensions.width
        let position = args.frameDimensions.reference + offset
        this.onSplitterResize(position,height)
        let newdivision = ((position / height) * 100)
        if (newdivision > 100) newdivision = 100
        if (newdivision < 0) newdivision = 0
        this.setCollapseStyles(0,newdivision)
        this.setState({
            division:newdivision,
            collapse:0
        })
        let self = this
        // wait for redraw to finish
        setTimeout(() => {
            for (let trigger in self.triggers) {
                if (self.triggers[trigger]['onContainingSplitterResize']) {
                    self.triggers[trigger]['onContainingSplitterResize']()
                }
            }
        })
    }

    afterDrag = (props,monitor) => {
        let item = monitor.getItem()
        let lastDifferences = monitor.getDifferenceFromInitialOffset()
        let lastOffset = this.isHorizontal()?lastDifferences.y:lastDifferences.x
        let newreference = item.frameDimensions.reference + lastOffset

        let height = this.isHorizontal()? item.frameDimensions.height:item.frameDimensions.width
        let bottomdiff = height - newreference
        let topdiff = newreference
        let threshold = this.threshold
        let collapse = this.state.collapse
        let newcollapse
        if (topdiff < threshold) {
            newcollapse = -1
        } else if (bottomdiff < threshold){
            newcollapse = 1
        } else {
            newcollapse = 0
        }
        if (newcollapse || (newcollapse != collapse)) {
            this.setCollapseStyles(newcollapse, this.state.division)
            this.setState({
                collapse:newcollapse
            })
        } 
    }

    getFrameDimensions = () => {
        let el = this.splitterframe
        let { collapse } = this.state
        let reference 
        let offset = this.isHorizontal()?el.clientHeight:el.clientWidth
        if (collapse) {
            reference = (collapse == -1)? 0:offset
        } else {
            reference = (offset * (this.state.division/100))
        }
        let frameDimensions = 
            {
                height:el.clientHeight,
                width:el.clientWidth,
                reference,
            }
        return frameDimensions
    }

    onCollapseToggle = (selection) => {
        let collapse = this.state.collapse
        let newcollapse = null
        if (!collapse) {
            if (selection == 'primary') { // collapse secondary
                newcollapse = 1
                for (let trigger in this.triggers) {
                    if (this.triggers['secondaryPane']['onHide']) {
                        this.triggers['secondaryPane']['onHide']()
                    }
                }
                let {secondaryTabNode} = this
                if (secondaryTabNode) {
                    secondaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s .5s',
                    secondaryTabNode.style.visibility = 'hidden'
                    secondaryTabNode.style.opacity = '0'
                }
            } else { // collapse primary
                newcollapse = -1
                for (let trigger in this.triggers) {
                    if (this.triggers['primaryPane']['onHide']) {
                        this.triggers['primaryPane']['onHide']()
                    }
                }
                let {primaryTabNode} = this
                if (primaryTabNode) {
                    primaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s .5s',
                    primaryTabNode.style.visibility = 'hidden'
                    primaryTabNode.style.opacity = '0'
                }
            } 
        } else { // restore collapsed
            if (selection == 'primary') { // restore secondary
                let {secondaryTabNode} = this
                if (secondaryTabNode) {
                    secondaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s 0s',
                    secondaryTabNode.style.visibility = 'visible'
                    secondaryTabNode.style.opacity = '1'
                }
            } else { // restore primary
                let {primaryTabNode} = this
                if (primaryTabNode) {
                    primaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s 0s',
                    primaryTabNode.style.visibility = 'visible'
                    primaryTabNode.style.opacity = '1'
                }
            }
            for (let trigger in this.triggers) {
                if (this.triggers['primaryPane']['onShow']) {
                    this.triggers['primaryPane']['onShow']()
                }
            }
            for (let trigger in this.triggers) {
                if (this.triggers['secondaryPane']['onShow']) {
                    this.triggers['secondaryPane']['onShow']()
                }
            }
            newcollapse = 0
        }
        this.setCollapseStyles(newcollapse, this.state.division)
        this.setState({
            collapse:newcollapse
        })
    }

    initStyles = () => {
        let styles = this.styles
        if (this.isHorizontal()) {
            styles.topframe = Object.assign(styles.topframe,{
                left: '0px',
                right: '0px',
                top:'0px',
                transition: 'bottom .5s ease-out',
            })
            styles.splitter = Object.assign(styles.splitter,{
                width: '100%',
                height: '0px',
                borderTop: '2px solid gray',
                transition: 'bottom .5s ease-out',
            })
            styles.bottomframe = Object.assign(styles.bottomframe,{
                left: '0px',
                right:'0px',
                transition: 'top .5s ease-out',
                bottom:'0px',
            })
            styles.collapsetabtop = Object.assign(styles.collapsetabtop, {
                bottom:'1px',
                right:'10px',
                transform:'none',
            })
            styles.collapsetabbottom = Object.assign(styles.collapsetabbottom, {
                top:'-1px',  
                right:'10px',
                transform:'none',
            })
        } else { // vertical
            styles.topframe = Object.assign(styles.topframe,{
                left: '0px',
                transition: 'right .5s ease-out',
                top: '0px',
                bottom: '0px',
            })
            styles.splitter = Object.assign(styles.splitter,{
                height: '100%',
                width: '0px',
                borderLeft: '2px solid gray',
                transition: 'right .5s ease-out',
            })
            styles.bottomframe = Object.assign(styles.bottomframe,{
                transition: 'left .5s ease-out',
                right:'0px',
                top:'0px',
                bottom: '0px',
            })
            styles.collapsetabtop = Object.assign(styles.collapsetabtop, {
                right:'1px',
                top:'10px',
                transform:'rotate(-90deg)',
            })
            styles.collapsetabbottom = Object.assign(styles.collapsetabbottom, {
                left:'-1px',  
                top:'10px',
                transform:'rotate(-90deg)',
            })
        }
    }

    setCollapseStyles = (collapse, division) => {
        let styles = this.styles
        if (this.isHorizontal()) {
            if (collapse) {
                if (collapse == 1) { // collapse top pane
                    styles.topframe.bottom = '2px'
                    styles.bottomframe.top = '100%'
                    styles.splitter.bottom = '0px'
                } else { // collapse bottom frame
                    styles.topframe.bottom = '100%'
                    styles.bottomframe.top = '2px'
                    styles.splitter.bottom = 'calc(100% - 2px)'
                } 
            } else { // restore collapsed frame
                styles.topframe.bottom = `calc(${100-division}% + 1px)`
                styles.bottomframe.top = `calc(${division}% + 1px)`
                styles.splitter.bottom = `calc(${100-division}% - 1px)`
            }
        } else { // vertical
            if (collapse) { // collapse left frame
                if (collapse == 1) {
                    styles.topframe.right = '2px'
                    styles.bottomframe.left = '100%'
                    styles.splitter.right = '0px'
                } else { // collapse right frame
                    styles.topframe.right = '100%'
                    styles.bottomframe.left = '2px'
                    styles.splitter.right = 'calc(100% - 2px)'
                } 
            } else { // restore collapsed frame
                styles.topframe.right = `calc(${100-division}% + 1px)`
                styles.bottomframe.left = `calc(${division}% + 1px)`
                styles.splitter.right = `calc(${100-division}% - 1px)`
            }
        }
    }

    onShow = () => {
        if (this.primaryTabNode && this.secondaryTabNode) {
            if (this.primaryTabNode.style.visibility == 'hidden') {

                let {primaryTabNode,secondaryTabNode} = this

                primaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s 0s',
                primaryTabNode.style.visibility = 'visible'
                primaryTabNode.style.opacity = '1'

                secondaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s 0s',
                secondaryTabNode.style.visibility = 'visible'
                secondaryTabNode.style.opacity = '1'

            }

        }
        if (this.splitterHandleNode) {
            let {splitterHandleNode} = this // this is a wrapped DragSource object
            splitterHandleNode = ReactDOM.findDOMNode(splitterHandleNode)

            if (splitterHandleNode.style.visibility == 'hidden') {

                splitterHandleNode.style.transition = 'opacity .5s ease-out,visibility 0s 0s',
                splitterHandleNode.style.visibility = 'visible'
                splitterHandleNode.style.opacity = '1'

            }
        }
    }

    onHide = () => {
        if (this.primaryTabNode && this.secondaryTabNode) {
            if (this.primaryTabNode.style.visibility == 'visible') {

                let {primaryTabNode,secondaryTabNode} = this

                primaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s .5s',
                primaryTabNode.style.visibility = 'hidden'
                primaryTabNode.style.opacity = '0'

                secondaryTabNode.style.transition = 'opacity .5s ease-out,visibility 0s .5s',
                secondaryTabNode.style.visibility = 'hidden'
                secondaryTabNode.style.opacity = '0'

            }
        }
        if (this.splitterHandleNode) {
            let {splitterHandleNode} = this
            splitterHandleNode = ReactDOM.findDOMNode(splitterHandleNode)

            if (splitterHandleNode.style.visibility == 'visible') {

                splitterHandleNode.style.transition = 'opacity .5s ease-out,visibility 0s .5s',
                splitterHandleNode.style.visibility = 'hidden'
                splitterHandleNode.style.opacity = '0'

            }
        }
    }

    render() {
        let collapse = this.state.collapse
        let styles = this.styles
        // styles.collapsetabtop.display = (collapse == -1)?'none':'flex'
        // styles.collapsetabbottom.display = (collapse == 1)?'none':'flex'
        // mutated values not allowed (deprectated by React); make fresh clones
        const topframe = Object.assign({},styles.topframe)
        const splitter = Object.assign({},styles.splitter)
        const collapsetabtop = Object.assign({},styles.collapsetabtop)
        const collapsetabbottom = Object.assign({},styles.collapsetabbottom)
        const bottomframe = Object.assign({},styles.bottomframe)
        const draghandle = Object.assign({},styles.draghandle)
        return <div ref = {(node) => {this.splitterframe = node}} style = {styles.splitterframe}>
            <div 
                style = {topframe}
            >
                {this.primaryPane}
            </div>
            <div ref = {node => {
                this.splitterElement = node
            }}
                style = {splitter}>
                {this.showHandle?<DragHandle 
                    ref = {node => {
                        this.splitterHandleNode = node
                    }}
                    dragStart = {this.dragStart}
                    dragEnd = {this.dragEnd}
                    dragUpdate = {this.dragUpdate}
                    afterDrag = {this.afterDrag}
                    getFrameDimensions = {this.getFrameDimensions}
                    orientation = {this.props.orientation}
                />:null}
                {this.showHandle?<MoveDraghandleLayer />:null}
                {this.showTabs?<div 
                    onClick = { e => {
                        this.onCollapseToggle('primary')
                    }}
                    ref = {node => {
                        this.primaryTabNode = node
                    }}
                    style={collapsetabtop}
                >
                    <FontIcon className="material-icons">
                        {
                            !collapse?'arrow_drop_down':
                            (collapse == 1)?'arrow_drop_up':
                            'arrow_drop_down'
                        }
                    </FontIcon>
                </div>:null}
                {this.showTabs?<div 
                    onClick = { e => {
                        this.onCollapseToggle('secondary')
                    }}
                    ref = {node => {
                        this.secondaryTabNode = node
                    }}
                    style={collapsetabbottom}
                >
                    <FontIcon className="material-icons">
                        {
                            !collapse?'arrow_drop_up':
                            (collapse == -1)?'arrow_drop_down':
                            'arrow_drop_up'
                        }
                    </FontIcon>
                </div>:null}
            </div>
            <div 
                style={bottomframe}>
                {this.secondaryPane}
            </div>
        </div>
    }
}

export default Splitter